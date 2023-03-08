//#################### InitiatePayment ########################
// import { RequestInfo, RequestInit } from 'node-fetch';
import axios from 'axios';
import { Request, Response } from "express";
let token = 'mytokenvalue' //token value to be placed here;
let baseURL = 'https://apitest.myfatoorah.com';
import request from 'request';





let paymentIntiationOptions = {
    method: 'POST',
    url: "https://apitest.myfatoorah.com/v2/InitiatePayment",
    headers:
    {
        Accept: 'application/json',
        Authorization: 'Bearer ' +
            "rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL",
        'Content-Type': 'application/json'
    },
    json: true
};



export async function initiatePayment(req: Request, res: Response) {
    try {
        // 👇️ const data: CreateUserResponse
        const { data } = await axios.post(
            'https://apitest.myfatoorah.com/v2/InitiatePayment',
            {
                body: req.body,
                paymentIntiationOptions
            }
        );

        console.log(JSON.stringify(data, null, 4));

        res.json({ data });
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            res.json({ error: error.message });
        } else {
            console.log('unexpected error: ', error);
            res.json({ error: error.message });
        }
    }
}



//#################### ExecutePayment ########################

let paymentExcutionOptions = {
    method: 'POST',
    url: "https://apitest.myfatoorah.com/v2/ExecutePayment",
    headers:
    {
        Accept: 'application/json',
        Authorization: 'Bearer ' +
            "rLtt6JWvbUHDDhsZnfpAhpYk4dxYDQkbcPTyGaKp2TYqQgG7FGZ5Th_WD53Oq8Ebz6A53njUoo1w3pjU1D4vs_ZMqFiz_j0urb_BH9Oq9VZoKFoJEDAbRZepGcQanImyYrry7Kt6MnMdgfG5jn4HngWoRdKduNNyP4kzcp3mRv7x00ahkm9LAK7ZRieg7k1PDAnBIOG3EyVSJ5kK4WLMvYr7sCwHbHcu4A5WwelxYK0GMJy37bNAarSJDFQsJ2ZvJjvMDmfWwDVFEVe_5tOomfVNt6bOg9mexbGjMrnHBnKnZR1vQbBtQieDlQepzTZMuQrSuKn-t5XZM7V6fCW7oP-uXGX-sMOajeX65JOf6XVpk29DP6ro8WTAflCDANC193yof8-f5_EYY-3hXhJj7RBXmizDpneEQDSaSz5sFk0sV5qPcARJ9zGG73vuGFyenjPPmtDtXtpx35A-BVcOSBYVIWe9kndG3nclfefjKEuZ3m4jL9Gg1h2JBvmXSMYiZtp9MR5I6pvbvylU_PP5xJFSjVTIz7IQSjcVGO41npnwIxRXNRxFOdIUHn0tjQ-7LwvEcTXyPsHXcMD8WtgBh-wxR8aKX7WPSsT1O8d8reb2aR7K3rkV3K82K_0OgawImEpwSvp9MNKynEAJQS6ZHe_J_l77652xwPNxMRTMASk1ZsJL",
        'Content-Type': 'application/json'
    },
    body:
    {
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
        CustomerAddress:
        {
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

export async function excutePayment(req: Request, res: Response) {

    try {
        // 👇️ const data: CreateUserResponse
        const { data } = await axios.post(
            'https://apitest.myfatoorah.com/v2/ExecutePayment',
            {
                body: req.body,
                paymentExcutionOptions
            }
        );

        console.log(JSON.stringify(data, null, 4));

        res.json({ data });
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            res.json({ error: error.message });
        } else {
            console.log('unexpected error: ', error);
            res.json({ error: error.message });
        }
    }
}




