using { itc.dealer as db } from './schema';
using { cuid, managed } from '@sap/cds/common';

entity salesLot : managed {
    key referenceNo : String(50);
    plant           : Association to db.Plants;
    stockType       : Association to stockTypes;
    startDate       : DateTime;
    validity        : DateTime;
    salesOffice     : String(100);
    stoNo           : String(20);
    rejReason       : String(100);

    // Child tables owned by this lot
    dealers         : Composition of many stockLotDealer on dealers.lot = $self;
    items           : Composition of many stockLotItem on items.lot = $self;
}

entity stockLotItem : cuid {
    lot          : Association to salesLot; // Foreign key: lot_referenceNo
    item         : String(50);
    orderId      : String(50);
    matNo        : String(50);
    description  : String(100);
    prodCode     : String(50);
    typeCode     : String(50);
    paperMachine : String(50);
    sloc         : String(50);
    packing      : String(50);
    gsm          : String(50);
    width        : String(50);
    length       : String(50);
    rollOd       : String(50);
    coreType     : String(50);
    rollsPerId   : String(50);
    age          : Integer;
    noOfBatch    : Integer;
    avalQty      : Decimal(13,3);
    netWt        : Decimal(13,3);
    grossWt      : Decimal(13,3);
}

entity stockLotDealer : cuid {
    lot: Association to salesLot;
    dealer: Association to db.Customers;
}

entity stockTypes: cuid,managed {
    type: String(50);
    description: String(100);
}