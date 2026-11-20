using itc.dealer as db from '../db/schema';

service SalesService @(requires: 'authenticated-user') {

    @readonly
    entity SalesOrderList  as
        select from db.SalesOrderItems {
            key ID,
                salesOrder.ID                      as salesOrder_ID,
                salesOrder.portalRefNo             as salesOrderNo,
                salesOrder.orderType.description   as orderType,
                billingPlant.ID                    as plant_ID,
                billingPlant.plantCode             as plant,
                paperMachine.machineCode           as paperMachine,
                itemNumber,
                salesOrder.documentDate            as documentDate,
                salesOrder.poNumber                as poNumber,
                salesOrder.poDate                  as poDate,
                salesOrder.customer.ID             as customer_ID,
                salesOrder.customer.customerName   as customerName,
                salesOrder.consignee.ID            as consignee_ID,
                salesOrder.consignee.consigneeCode as consigneeCode,
                salesOrder.consignee.name          as consigneeName,
                itemStatus,
                endUseSegment.code                 as End_Use_Code,
                endUseSegment.name                 as End_Use_Name,
                specification.width                as width,
                specification.length               as length,
                specification.rollOD               as roll_OD,
                orderQty                           as order_Qty,

        }
        actions {
            action viewDetails() returns String;
            action downloadDoc() returns String;
        };

    @requires: 'JobScheduler'
    action scheduleEmail();


    @readonly
    entity Customers       as projection on db.Customers;

    @readonly
    entity Consignees      as projection on db.Consignees;

    @readonly
    entity Plants          as projection on db.Plants;

    entity SalesOrders     as projection on db.SalesOrders;

    @cds.redirection.target: true
    entity SalesOrderItems as projection on db.SalesOrderItems;

    entity StockLogFiles   as projection on db.StockLogFiles
        actions {
            action importExcel() returns String;
        };

    action exportStocks() returns LargeBinary;


    @readonly
    entity StockList       as
        select from db.StockBatches {
            key ID,
                stockLogRef,
                paperMachine.machineCode as paperMachine,
                material.materialCode    as materialCode,
                material.description     as materialDescription,
                packingType.code         as packingType,
                gsm,
                width,
                length,
                outerDiameter            as rollOD,
                age,
                netWeight
        };

    @readonly
    entity PaperMachines   as projection on db.PaperMachines;

    @readonly
    entity PackingTypes    as projection on db.PackingTypes;

    entity OrderDocuments  as
        projection on db.OrderDocuments {
            *,
            @Core.MediaType         : mimeType
            @Core.ContentDisposition: {
                Filename: fileName,
                Type    : 'inline'
            }
            virtual null as content : LargeBinary
        };

}
