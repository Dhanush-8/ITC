namespace itc.dealer;
using { cuid, managed } from '@sap/cds/common';

entity Customers : cuid, managed {

    customerCode : String(10);
    customerName : String(100);
    orders: Association to many SalesOrders on orders.customer = $self;

}

entity Consignees: cuid {
    consigneeCode : String(10);
    name : String(100);
    city : String(100);
    address : String(100);
}

entity Plants : cuid {
    plantCode : String(10);
    plantName : String(100);
}

entity Materials : cuid {
    materialCode : String(40);
    description  : String(150);
    baseUOM      : String(5);
}


entity PackingTypes : cuid {
    code        : String(20);
    description : String(100);
    subPacking  : String(50);
    secPacking  : String(50);
}


entity EndUseSegments : cuid {
    code : String(20);
    name : String(100);
}

entity OrderTypes : cuid {
    code        : String(10);
    description : String(100);
}

entity SalesOrders : cuid, managed {

    portalRefNo     : String(20);
    orderType       : Association to OrderTypes;

    customer        : Association to Customers not null;
    consignee       : Association to Consignees not null;

    poNumber        : String(40) not null;
    poDate          : Date not null;
    documentDate    : Date;

    endUseSegment   : Association to EndUseSegments;
    convertingPartner : String(30);

    orderMethod     : String(30);

    fullTruck       : Boolean;
    loadingPattern  : String(30);
    vehiclePreference : String(50);

    paymentTerms    : String(30);
    creditStatus    : String(30);

    commission      : Decimal(15,2);
    incoterms       : String(10);
    freight         : String(100);

    status          : String(30);

    fileName: String;
    fileType: String @Core.IsMediaType;
    content: LargeBinary @Core.MediaType: fileType
                         @Core.ContentDisposition.FileName: fileName;
                         
    items : Composition of many SalesOrderItems
        on items.salesOrder = $self;
}


entity SalesOrderItems : cuid, managed {

    salesOrder : Association to SalesOrders not null;

    itemNumber  : String(6) not null;

    material    : Association to Materials not null;
    billingPlant : Association to Plants not null;
    paperMachine : Association to PaperMachines;

    orderQty    : Decimal(15,3) not null;
    uom         : String(5);

    reqDeliveryDate : Date;

    deliveryAddress : String(255);

    endUse      : String(100);
    endUseSegment : Association to EndUseSegments;

    convertingPartner : String(30);

    packingType : Association to PackingTypes;

    price       : Decimal(15,2);
    currency    : String(5);
    paymentTerms : String(30);

    itemStatus  : String(30);

    specification : Composition of one ItemSpecifications
        on specification.salesOrderItem = $self;

    pricingConditions : Composition of many PricingConditions
        on pricingConditions.salesOrderItem = $self;
}


entity ItemSpecifications : cuid {

    salesOrderItem : Association to SalesOrderItems not null;

    width       : Decimal(10,2);
    length      : Decimal(10,2);

    reelInnerDiameter : Decimal(10,2);
    reelOuterDiameter : Decimal(10,2);

    grainAnyWay : Boolean;

    vehiclePreference : String(30);

    subPacking  : String(50);
    secPacking  : String(50);

    rollOD      : Decimal(10,2);
}


entity PricingConditions : cuid {
    salesOrderItem : Association to SalesOrderItems;

    conditionType  : String(10);
    amount         : Decimal(15,2);
    currency       : String(5);
    conditionUnit  : String(20);
    conditionValue : Decimal(15,2);
}

entity PaperMachines : cuid {
    machineCode : String(20);
    machineName : String(100);
    plant       : Association to Plants;
}


entity StockBatches : cuid, managed {

    batchNumber : String(40);
    bundleNumber : String(40);

    material : Association to Materials;
    plant    : Association to Plants;

    paperMachine : Association to PaperMachines;

    packingType : Association to PackingTypes;

    batchQty : Decimal(15,3);
    availableQty : Decimal(15,3);
    uom : String(5);

    width : Decimal(10,2);
    length : Decimal(10,2);

    innerDiameter : Decimal(10,2);
    outerDiameter : Decimal(10,2);

    stockType : String(30);

    stockLogRef : String(30);          
    gsm         : Decimal(10,2);     
    age         : Integer;             
    netWeight   : Decimal(15,3);     
    upload      : Association to StockLogFiles; 
}

entity StockLogFiles : cuid, managed {

    stockLogRef  : String(30);
    fileName     : String(255);
    @Core.IsMediaType
    mediaType    : String(100);
    @Core.MediaType                   : mediaType
    @Core.ContentDisposition.Filename : fileName
    @Core.ContentDisposition.Type     : 'attachment'
    content      : LargeBinary;

    importStatus : String(30);     // Uploaded / Imported / Failed
    rowsImported : Integer;
    errorText    : String(1000);
}


entity Dispatches : cuid {

    invoiceNumber : String(30);
    invoiceDate   : Date;

    customer      : Association to Customers;
    plant         : Association to Plants;

    machineId     : String(20);
    millId        : String(20);

    shippingLocation : String(150);

    salesOrderItem : Association to SalesOrderItems;

    quantity      : Decimal(15,3);
    uom           : String(5);

    materialDescription : String(150);

    width         : Decimal(10,2);
    length        : Decimal(10,2);
    gsm           : Decimal(10,2);

    reamWeight    : Decimal(10,3);
    packingType   : String(30);

    noOfReams     : Integer;
    noOfBobbins   : Integer;
}

entity DeliveryConfirmations : cuid, managed {

    dispatch : Association to Dispatches not null;

    customer : Association to Customers;

    receiptDate : Date not null;
    receiptTime : Time not null;

    damageQty   : Decimal(15,3);
    remarks     : String(500);

    podDocument : Association to DeliveryAttachments;

    confirmationStatus : String(30);
}


entity DeliveryAttachments : cuid, managed {

    fileName : String(255);
    mediaType : String(100);
    size : Integer;
    content : LargeBinary;
}


entity StockLots : cuid, managed {

    lotNumber : String(30);

    material : Association to Materials;
    plant    : Association to Plants;

    stockType : String(30);

    gsm       : Decimal(10,2);
    width     : Decimal(10,2);
    length    : Decimal(10,2);

    packingType : Association to PackingTypes;

    availableQty : Decimal(15,3);
    uom : String(5);

    bidStartDateTime : Timestamp;
    bidEndDateTime   : Timestamp;

    status : String(30);

    bids : Composition of many StockLotBids
        on bids.stockLot = $self;
}


entity StockLotBids : cuid, managed {

    stockLot : Association to StockLots not null;
    customer : Association to Customers not null;

    bidQty   : Decimal(15,3);
    bidPrice : Decimal(15,2);
    currency : String(5);

    bidStatus : String(30);
}


entity OrderStatusUpdates : cuid, managed {

    salesOrderItem : Association to SalesOrderItems;

    committedDeliveryDate : Date;
    promisedDeliveryDate  : Date;
    actualDeliveryDate    : Date;

    deliveryQty : Decimal(15,3);
    pgiQty      : Decimal(15,3);

    invoiceQty    : Decimal(15,3);
    invoiceAmount : Decimal(15,2);
    currency      : String(5);

    status        : String(30);
    statusDate    : Timestamp;
    remarks       : String(500);
}