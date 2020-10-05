const axios = require('axios');
const request = require("request");
const querystring = require('querystring');
const {totp ,authenticator }  = require('otplib');
const { insertLogSMS } =  require('../function/log');
const { sendSMSMoneyTranfer } = require('./smsController');
const { pool } = require("../dbConfig");

// const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';



const api_key_sms = process.env.API_KEY_SMS ;
const api_secret_sms = process.env.API_SECRET_SMS ;
const api_key_sms_otp = process.env.API_KEY_OTP;

// sendSMSMoneyTranfer = (req , res , next) =>{
//     let dataBody = req.body ;
//     //  
//     const data = { 
//         to: dataBody.phoneNumber,
//         text: dataBody.massage,
//         api_key: api_key_sms,
//         api_secret: api_secret_sms,
//         from: 'Chill Talk LIMITED.' 
//     };
//     const options = {
//         method: 'POST',
//         headers: { 'content-type': 'application/x-www-form-urlencoded' },
//         data: querystring.stringify(data),
//         url: 'https://api.movider.co/v1/sms',
//     };

//     axios( options )
//     .then(function (response) {
//         //handle success
//         //console.log(response);
//         res.status(200).json({
//             status : "success",
//             data : "" 
//         });
//     })
//     .catch(function (error) {
//         // handle error
//         // console.log(error);
//         res.status(200).json({
//             status : "error",
//             data : "" 
//         });
//     })
//     .finally(function () {
//         // always executed
//     });
    
// }

sendSmsOtp = (req , res , next) =>{ 
    let dataBody = req.body ;

    let otp = totp.generate(api_key_sms_otp);
    const data = { 
        to: dataBody.phoneNumber,
        text: dataBody.massage,
        api_key: api_key_sms,
        api_secret: api_secret_sms,
        from: 'Chill Talk LIMITED.' ,
        date : new Date
    };

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: querystring.stringify(data),
        url: 'https://api.movider.co/v1/sms',
    };

    let sql = `INSERT INTO tb_otp(phone , otp , senddate ,status) 
                VALUES ( ${data.to}, ${otp},${data.date} ,'0')`;

    // pool.query(
    //     sql, 
    //     (err, result) => {

    //         if (err) {
    //             console.log(err);  
    //             let data = {
    //                 status : "error",
    //                 data : ""
    //             }   
    //             res.status(400).json(data)
    //         }
    //         else
    //         {
    //             console.log(result);
    //             // axios( options )
    //             // .then(function (response) {
    //             //     //handle success
    //             //     //console.log(response);
    //             //     res.status(200).json({
    //             //         status : "success",
    //             //         data : "" 
    //             //     });
    //             // })
    //             // .catch(function (error) {
    //             //     // handle error
    //             //     // console.log(error);
    //             //     res.status(200).json({
    //             //         status : "error",
    //             //         data : "" 
    //             //     });
    //             // })
    //             // .finally(function () {
    //             //     // always executed
    //             // });
    //             res.status(200).json(data);
    //         }
    //     }
    // );
    
   

 
}

checkOtp = (req , res , next) =>{

}




test = (req, res ,next)=>{
    res.status(200).json({
        status : "success",
        data : "" 
    });
}


module.exports ={
    sendSmsOtp,
    checkOtp,
    test
}