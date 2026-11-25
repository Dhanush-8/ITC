const cds = require("@sap/cds");
const { SELECT } = require("@sap/cds/lib/ql/cds-ql");
const erp = require("./lib/erp-context");
const SapCfMailer = require("sap-cf-mailer").default;
const ExcelJS = require("exceljs");
const  { getLogger } = require('./utils/logger');
const { message } = require("@sap/cds/lib/log/cds-error");
const LOG = getLogger('itc.sales');

class SalesService extends cds.ApplicationService {
  async init() {
    this.before("*", async (req) => {
      try {
        req.erp = await erp.resolveErp(req); // { code: 'PSPD', destination: 'ERP_PSPD' }
        LOG.info("Initializing the constructor")
      } catch (e) {
        LOG.error("Sales handler initialzation is failed " , {code: e.code, message: e.message})
        return req.reject(e.code || 500, e.message);
      }
    });

    //************************************ importan ****************************//
    this.on("READ", "SalesOrders", async (req) => {
      const backend = await cds.connect.to(req.erp.destination);
      // return backend.run(req.query);

      const rows = await backend.run(
        SELECT.from(A_SalesOrder)
          .columns(
            "SalesOrder",
            "SoldToParty",
            "TotalNetAmount",
            "OverallSDProcessStatus",
          )
          .limit(req.query.SELECT.limit?.rows?.val ?? 50),
      );
    });

    const db = cds.entities("itc.dealer");

    const {
      StockLogFiles,
      StockBatches,
      Materials,
      PaperMachines,
      PackingTypes,
    } = db;

    // =====================================
    // IMPORT EXCEL
    // =====================================

    this.on("importExcel", "StockLogFiles", async (req) => {
      const { ID } = req.params[0];

      try {
        // 1. Fetch uploaded Excel file
        const uploaded = await SELECT.one.from(StockLogFiles).where({ ID });

        if (!uploaded || !uploaded.content) {
          return "Uploaded Excel file not found";
        }

        if (uploaded.importStatus === "Imported") {
          return "This file has already been imported";
        }

        // 2. Load Excel workbook
        const workbook = new ExcelJS.Workbook();

        const buffer = Buffer.isBuffer(uploaded.content)
          ? uploaded.content
          : Buffer.from(uploaded.content);

        await workbook.xlsx.load(buffer);

        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
          return "Excel worksheet not found";
        }

        // 3. Read Excel headers
        const headers = {};

        worksheet.getRow(1).eachCell((cell, colNumber) => {
          headers[
            String(cell.value || "")
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "")
          ] = colNumber;
        });

        const getValue = (row, ...names) => {
          for (const name of names) {
            const column =
              headers[name.toLowerCase().replace(/[^a-z0-9]/g, "")];

            if (column) {
              const value = row.getCell(column).value;

              if (value && typeof value === "object") {
                return value.result ?? value.text ?? null;
              }

              return value;
            }
          }

          return null;
        };

        // 4. Load master data
        const [materials, machines, packingTypes] = await Promise.all([
          SELECT.from(Materials),

          SELECT.from(PaperMachines),

          SELECT.from(PackingTypes),
        ]);

        const materialMap = new Map(
          materials.map((x) => [String(x.materialCode).toLowerCase(), x.ID]),
        );

        const machineMap = new Map(
          machines.map((x) => [String(x.machineCode).toLowerCase(), x.ID]),
        );

        const packingMap = new Map(
          packingTypes.map((x) => [String(x.code).toLowerCase(), x.ID]),
        );

        // 5. Extract Excel rows
        const stockRows = [];

        const errors = [];

        for (let i = 2; i <= worksheet.rowCount; i++) {
          const row = worksheet.getRow(i);

          if (!row.hasValues) continue;

          const materialCode = getValue(row, "Material Code");
          const machineCode = getValue(row, "Paper Machining", "Paper Machine");
          const packingCode = getValue(row, "Packing Type");

          const materialID = materialMap.get(
            String(materialCode || "")
              .trim()
              .toLowerCase(),
          );

          const machineID = machineMap.get(
            String(machineCode || "")
              .trim()
              .toLowerCase(),
          );

          const packingID = packingMap.get(
            String(packingCode || "")
              .trim()
              .toLowerCase(),
          );

          if (!materialID || !machineID || !packingID) {
            errors.push(
              `Row ${i}: Invalid Material, Paper Machine or Packing Type`,
            );

            continue;
          }

          const number = (value) => {
            if (value === null || value === undefined || value === "") {
              return null;
            }

            const result = Number(value);

            return Number.isFinite(result) ? result : null;
          };

          stockRows.push({
            stockLogRef: getValue(row, "Stock Log Ref") || uploaded.stockLogRef,

            material_ID: materialID,

            paperMachine_ID: machineID,

            packingType_ID: packingID,

            upload_ID: ID,

            gsm: number(getValue(row, "GSM")),

            width: number(getValue(row, "Width (CM)", "Width")),

            length: number(getValue(row, "Length (CM)", "Length")),

            outerDiameter: number(getValue(row, "Roll OD (cm)", "Roll OD")),

            innerDiameter: number(getValue(row, "Core")),

            age: number(getValue(row, "Age")),

            netWeight: number(getValue(row, "Net", "Net Weight")),
          });
        }

        // 6. Validate before inserting
        if (errors.length > 0) {
          await UPDATE(StockLogFiles)
            .set({
              importStatus: "Failed",
              errorText: errors.join("; ").slice(0, 1000),
            })
            .where({ ID });

          return `Import failed: ${errors.join("; ")}`;
        }

        if (stockRows.length === 0) {
          return "No valid stock records found in Excel";
        }

        // 7. Insert all records into StockBatches
        await INSERT.into(StockBatches).entries(stockRows);

        // 8. Update import status
        await UPDATE(StockLogFiles)
          .set({
            importStatus: "Imported",
            rowsImported: stockRows.length,
            errorText: null,
          })
          .where({ ID });

        return `${stockRows.length} stock records imported successfully`;
      } catch (error) {
        console.error("Excel Import Error:", error);

        await UPDATE(StockLogFiles)
          .set({
            importStatus: "Failed",
            errorText: String(error.message).slice(0, 1000),
          })
          .where({ ID });

        return `Import failed: ${error.message}`;
      }
    });

    this.on("exportStocks", async (req) => {
      try {
        const { stockLogRef } = req.data;

        if (!stockLogRef) {
          return req.reject(400, "Reference number is required");
        }

        // Fetch stocks matching the reference number
        const stocks = await SELECT.from(StockBatches)
          .columns(
            "stockLogRef",
            "gsm",
            "width",
            "length",
            "outerDiameter",
            "innerDiameter",
            "age",
            "netWeight",
            { ref: ["paperMachine", "machineCode"], as: "paperMachine" },
            { ref: ["material", "materialCode"], as: "materialCode" },
            { ref: ["material", "description"], as: "materialDescription" },
            { ref: ["packingType", "code"], as: "packingType" },
          )
          .where({
            upload: {
              stockLogRef: stockLogRef,
            },
          });

        if (!stocks.length) {
          return req.reject(404, "No stock records found");
        }

        // Create Excel workbook
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet("Stocks");

        worksheet.columns = [
          { header: "Stock Log Ref", key: "stockLogRef", width: 20 },
          { header: "Paper Machining", key: "paperMachine", width: 20 },
          { header: "Material Code", key: "materialCode", width: 20 },
          {
            header: "Material Description",
            key: "materialDescription",
            width: 30,
          },
          { header: "Packing Type", key: "packingType", width: 15 },
          { header: "GSM", key: "gsm", width: 12 },
          { header: "Width (CM)", key: "width", width: 15 },
          { header: "Length (CM)", key: "length", width: 15 },
          { header: "Roll OD (cm)", key: "outerDiameter", width: 15 },
          { header: "Core", key: "innerDiameter", width: 12 },
          { header: "Age", key: "age", width: 12 },
          { header: "Net", key: "netWeight", width: 15 },
        ];

        worksheet.addRows(stocks);

        worksheet.getRow(1).font = { bold: true };

        const buffer = await workbook.xlsx.writeBuffer();

        const res = req.http.res;

        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );

        res.setHeader(
          "Content-Disposition",
          `attachment; filename="Stocks_${referenceNo}.xlsx"`,
        );

        return res.status(200).send(Buffer.from(buffer));
      } catch (error) {
        console.error(error);

        return req.reject(500, "Stock Excel export failed");
      }
    });

    this.on("scheduleEmail", async () => {
      const mailer = new SapCfMailer("sap_process_automation_mail");
      await mailer.sendMail({
        to: "mohammed.misbhah@incture.com",
        subject: "Test Email from CAP",
        html: "Test Mail from BTP Syetem",
      });
      return "email send successfully";
    });

    return super.init();
  }
}

module.exports = SalesService;
