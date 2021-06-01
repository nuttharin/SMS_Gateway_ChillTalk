const axios = require('axios');
const request = require("request");
const querystring = require('querystring');
const {totp ,authenticator }  = require('otplib');
const moment = require('moment');
const { pool , client} = require("../dbConfig");

// const secret = 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';



const api_key_sms = process.env.API_KEY_SMS ;
const api_secret_sms = process.env.API_SECRET_SMS ;
const api_key_sms_otp = process.env.API_KEY_OTP;


sendSmsOtp = (req , res , next) =>{ 
    let dataBody = req.body ;

    let otp = totp.generate(api_key_sms_otp);
    let newDate  =  moment(new Date).format('YYYY-MM-DD h:mm:ss') ;
    const data = { 
        to: dataBody.phoneNumber,
        text: "OTP ของคุณคือ "+otp+" อย่าเปิดเผยรหัสนี้กับผู้อื่น",
        api_key: api_key_sms,
        api_secret: api_secret_sms,
        from: 'CHILLTALK' ,
    };
    //console.log(data)

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: querystring.stringify(data),
        url: 'https://api.movider.co/v1/sms',
    };

    let sql = `INSERT INTO "public"."tb_otp_gas"(phonenumber , otp , senddate ,status) 
                VALUES ( '${data.to}', '${otp.toString()}','${newDate}' ,'0');`;
    //console.log(sql);
    //INSERT INTO "public"."tb_otp"("id", "phone", "otp", "senddate", "status") VALUES (1, '0812318897', '111111', '2011-01-01 00:00:00', '0');
    pool.query(
        sql, 
        (err, result) => {

            if (err) {
                
                res.status(200).json({
                    status : "error",
                    data : "error insert OTP"
                })
            }
            else
            {
                axios( options )
                .then(function (response) {
                    //handle success
                    console.log(response);
                    //  INSERT INTO "public"."tb_log_sms"("phone", "senddate", "from") VALUES ('0811111111', '2020-10-06', 'mt')
                    sql = `INSERT INTO "public"."tb_log_sms"("phonenumber", "senddate", "fromphone") VALUES ('${data.to}', '${newDate}', 'appGas');`;
                    pool.query(sql , (err, result) =>{
                        if (err) {
                            //console.log(err);  
                          
                            res.status(200).json({
                                status : "error",
                                statusCode : 200 ,
                                data : "error insert log sms :"+err
                            })
                        }
                        else
                        {
                            res.status(201).json({
                                status : "success",
                                statusCode : 201 ,
                                data : "send OTP complete"
                            });
                        }
                    })
                })
                .catch(function (error) {
                    // handle error
                    //console.log(error);
                    res.status(400).json({
                        status : "error",
                        statusCode : 400,
                        data : "error send sms OTP" 
                    });
                })
                .finally(function () {
                    // always executed
                });
               
            }
        }
    );
    
   

 
}

checkOtp = (req , res , next) =>{
    let dataBody = req.body ;
    let data = 
    {
        phoneNumber : dataBody.phoneNumber,
        otp : dataBody.otp
    }
    let sql = `SELECT * FROM "public"."tb_otp_gas" 
                WHERE tb_otp_gas.phoneNumber = '${data.phoneNumber}'
                ORDER BY tb_otp_gas.senddate DESC
                LIMIT 1;`;
    pool.query(sql , (err, result) =>{
        if (err) {
            //console.log(err);  
            let data = {
                status : "error",
                statusCode : 200 ,
                data : "error check otp"
            }   
            res.status(200).json(data)
        }
        else
        {
            let dataOtp = result.rows[0] ;
            if(dataOtp.otp == data.otp)
            {
                 res.status(201).json({
                    status : "success",
                    statusCode : 201 ,
                    data : true
                });
            }
            else{
                res.status(201).json({
                    status : "success",
                    statusCode : 201 ,
                    data : false
                });
            }
           

        }
    })
}

sendSMSMessage = (req , res , next) =>{
    let dataBody = req.body ;
    let newDate  =  moment(new Date).format('YYYY-MM-DD h:mm:ss') ;

    let otp = totp.generate(api_key_sms_otp);
    const data = { 
        to: dataBody.phoneNumber,
        text: dataBody.message,
        api_key: api_key_sms,
        api_secret: api_secret_sms,
        from: 'CHILLTALK' ,
    };

    const options = {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: querystring.stringify(data),
        url: 'https://api.movider.co/v1/sms',
    };

    axios( options )
    .then(function (response) {
        //handle success
        //console.log(response);
        res.status(200).json({
            status : "success",
            statusCode : 201 ,
            data : "send complete" 
        });
        
    })
    .catch(function (error) {
        // handle error
        // console.log(error);
        res.status(200).json({
            status : "error",
            statusCode : 200 ,
            data : "send not complete" 
        });
    })
    .finally(function () {
        // always executed
    });

}

module.exports ={
    sendSmsOtp,
    checkOtp,
    sendSMSMessage
}