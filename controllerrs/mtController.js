const axios = require('axios');
const request = require("request");
const querystring = require('querystring');
const {totp ,authenticator }  = require('otplib');
const moment = require('moment');
const { insertLogSMS } =  require('../function/log');
const { sendSMSMoneyTranfer } = require('./smsController');
const { pool , client} = require("../dbConfig");

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
        date : moment(new Date).format('YYYY-MM-D h:mm:ss')
    };
    console.log(data)
    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: querystring.stringify(data),
        url: 'https://api.movider.co/v1/sms',
    };

    let sql = `INSERT INTO "public"."tb_otp"(phone , otp , senddate ,status) 
                VALUES ( ${data.to}, ${otp.toString()},${data.date} ,'0');`;
    //INSERT INTO "public"."tb_otp"("id", "phone", "otp", "senddate", "status") VALUES (1, '0812318897', '111111', '2011-01-01 00:00:00', '0');
    //
    //let sql = `SELECT * FROM "public"."tb_otp"`;
    pool.query(
        sql, 
        (err, result) => {

            if (err) {
                console.log(err);  
                let data = {
                    status : "error",
                    data : ""
                }   
                res.status(400).json(data)
            }
            else
            {
                console.log(result);
                // axios( options )
                // .then(function (response) {
                //     //handle success
                //     //console.log(response);
                //     res.status(200).json({
                //         status : "success",
                //         data : "" 
                //     });
                // })
                // .catch(function (error) {
                //     // handle error
                //     // console.log(error);
                //     res.status(200).json({
                //         status : "error",
                //         data : "" 
                //     });
                // })
                // .finally(function () {
                //     // always executed
                // });
                res.status(200).json(data);
            }
        }
    );
    
   

 
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