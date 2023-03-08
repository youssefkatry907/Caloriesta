//#################### InitiatePayment ########################
let request = require("request");
let token = 'mytokenvalue'; //token value to be placed here;
let baseURL = 'https://apitest.myfatoorah.com';
let paymentIntiationOptions = {
    method: 'POST',
    url: baseURL + '/v2/InitiatePayment',
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    },
    body: { InvoiceAmount: 100, CurrencyIso: 'KWD' },
    json: true
};
let intiatePayment = request(paymentIntiationOptions, function (error, response, body) {
    if (error)
        throw new Error(error);
    console.log(body);
});
//#################### ExecutePayment ########################'
let paymentExcutionOptions = {
    method: 'POST',
    url: baseURL + '/v2/ExecutePayment',
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
    },
    body: {
        PaymentMethodId: '2',
        CustomerName: 'Ahmed',
        DisplayCurrencyIso: 'KWD',
        MobileCountryCode: '+965',
        CustomerMobile: '12345678',
        CustomerEmail: 'xx@yy.com',
        InvoiceValue: 100,
        CallBackUrl: 'https://google.com',
        ErrorUrl: 'https://google.com',
        Language: 'en',
        CustomerReference: 'ref 1',
        CustomerCivilId: 12345678,
        UserDefinedField: 'Custom field',
        ExpireDate: '',
        CustomerAddress: {
            Block: '',
            Street: '',
            HouseBuildingNo: '',
            Address: '',
            AddressInstructions: ''
        },
        InvoiceItems: [{ ItemName: 'Product 01', Quantity: 1, UnitPrice: 100 }]
    },
    json: true
};
let excutePayment = request(paymentExcutionOptions, function (error, response, body) {
    if (error)
        throw new Error(error);
    console.log(body);
});
module.exports = {
    intiatePayment,
    excutePayment
};
