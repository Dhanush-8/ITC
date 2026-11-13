using FinanceService as service from './finance-service';

annotate service.PaymentAdjustments with @(

    UI.SelectionFields : [
        refNo,
        paymentType,
        instrumentType,
        paymentDate,
        status
    ],

    UI.LineItem : [
        { Value : refNo,           Label : 'Payment/ Adjustment Ref No' },
        { Value : submittedOn,     Label : 'Submitted On' },
        { Value : paymentType,     Label : 'Payment Type' },
        { Value : instrumentType,  Label : 'Instrument Type' },
        { Value : instrumentUtrNo, Label : 'Instrument UTR No' },
        { Value : paymentDate,     Label : 'Payment Date' },
        { Value : amount,          Label : 'Amount' },
        { Value : fileName,        Label : 'Documents' },
        { Value : status,          Label : 'Status' },
        { Value : modifiedAt,      Label : 'Last Updated' },
        { $Type : 'UI.DataFieldForAction', Action : 'FinanceService.downloadDocument',
          Label : 'Action', IconUrl : 'sap-icon://download', Inline : true }
    ],

    UI.HeaderInfo : {
        TypeName       : 'Payment / Adjustment',
        TypeNamePlural : 'Payments / Adjustments',
        Title          : { Value : refNo },
        Description    : { Value : status }
    },

    UI.Facets : [
        { $Type : 'UI.ReferenceFacet', Label : 'General', Target : '@UI.FieldGroup#General' }
    ],

    UI.FieldGroup #General : {
        Data : [
            { Value : refNo,           Label : 'Payment/ Adjustment Ref No' },
            { Value : submittedOn,     Label : 'Submitted On' },
            { Value : paymentType,     Label : 'Payment Type' },
            { Value : instrumentType,  Label : 'Instrument Type' },
            { Value : instrumentUtrNo, Label : 'Instrument UTR No' },
            { Value : paymentDate,     Label : 'Payment Date' },
            { Value : amount,          Label : 'Amount' },
            { Value : currency,        Label : 'Currency' },
            { Value : status,          Label : 'Status' },
            { Value : modifiedAt,      Label : 'Last Updated' }
        ]
    }
);

annotate service.PaymentAdjustments with {
    refNo           @Common.Label : 'Payment/ Adjustment Ref No';
    submittedOn     @Common.Label : 'Submitted On';
    paymentType     @Common.Label : 'Payment Type';
    instrumentType  @Common.Label : 'Instrument Type';
    instrumentUtrNo @Common.Label : 'Instrument UTR No';
    paymentDate     @Common.Label : 'Payment Date';
    amount          @Common.Label : 'Amount'
                    @Measures.ISOCurrency : currency;
    fileName        @Common.Label : 'Documents';
    status          @Common.Label : 'Status';
    modifiedAt      @Common.Label : 'Last Updated';

    paymentType    @assert.range;
    instrumentType @assert.range;
    status         @assert.range;
};
