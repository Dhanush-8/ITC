using SalesService as service from './sales-service';

annotate service.SalesOrderList with @(

    UI.SelectionFields : [ customer_ID, consignee_ID, poDate, plant_ID ],

    UI.LineItem : [
        { Value : salesOrderNo,   Label : 'Sales Order' },
        { Value : orderType,      Label : 'Type' },
        { Value : plant,          Label : 'Plant' },
        { Value : paperMachine,   Label : 'Paper Machine' },
        { Value : documentNo,     Label : 'Document' },
        { Value : itemNumber,     Label : 'Item' },
        { Value : documentDate,   Label : 'Document Date' },
        { Value : poNumber,       Label : 'PO Number' },
        { Value : poDate,         Label : 'PO Date' },
        { Value : consigneeCode,  Label : 'Consignee Code' },
        { Value : consigneeName,  Label : 'Consignee Name' },
        { $Type : 'UI.DataFieldForAction', Action : 'SalesService.viewDetails',
          Label : 'Details', IconUrl : 'sap-icon://clipboard', Inline : true },
        { $Type : 'UI.DataFieldForAction', Action : 'SalesService.downloadDoc',
          Label : 'Download', IconUrl : 'sap-icon://download', Inline : true }
    ]
);

annotate service.SalesOrderList with @(
    UI.HeaderInfo : {
        TypeName       : 'Sales Order Item',
        TypeNamePlural : 'Sales Order Items',
        Title          : { Value : salesOrderNo },
        Description    : { Value : itemNumber }
    },
    UI.Facets : [
        { $Type : 'UI.ReferenceFacet', Label : 'General', Target : '@UI.FieldGroup#General' }
    ],
    UI.FieldGroup #General : {
        Data : [
            { Value : documentNo },
            { Value : orderType },
            { Value : customerName },
            { Value : consigneeName },
            { Value : poNumber },
            { Value : poDate },
            { Value : plant },
            { Value : paperMachine },
            { Value : itemStatus }
        ]
    }
);

annotate service.SalesOrderList with {
    customer_ID @( Common.Label : 'Customer',
        Common.Text : customerName, Common.TextArrangement : #TextOnly,
        Common.ValueListWithFixedValues : true,
        Common.ValueList : { CollectionPath : 'Customers', Parameters : [
            { $Type : 'Common.ValueListParameterInOut',
              LocalDataProperty : customer_ID, ValueListProperty : 'ID' },
            { $Type : 'Common.ValueListParameterDisplayOnly',
              ValueListProperty : 'customerName' } ] });

    consignee_ID @( Common.Label : 'Consignee',
        Common.Text : consigneeName, Common.TextArrangement : #TextOnly,
        Common.ValueListWithFixedValues : true,
        Common.ValueList : { CollectionPath : 'Consignees', Parameters : [
            { $Type : 'Common.ValueListParameterInOut',
              LocalDataProperty : consignee_ID, ValueListProperty : 'ID' },
            { $Type : 'Common.ValueListParameterDisplayOnly',
              ValueListProperty : 'name' } ] });

    plant_ID @( Common.Label : 'Plant',
        Common.Text : plant, Common.TextArrangement : #TextOnly,
        Common.ValueListWithFixedValues : true,
        Common.ValueList : { CollectionPath : 'Plants', Parameters : [
            { $Type : 'Common.ValueListParameterInOut',
              LocalDataProperty : plant_ID, ValueListProperty : 'ID' },
            { $Type : 'Common.ValueListParameterDisplayOnly',
              ValueListProperty : 'plantCode' } ] });

    poDate @( Common.Label : 'Order Date' );   // shows as a date range filter
};