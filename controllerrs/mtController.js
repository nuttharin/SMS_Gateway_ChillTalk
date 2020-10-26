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

    let sql = `INSERT INTO "public"."tb_otp"(phone , otp , senddate ,status) 
                VALUES ( '${data.to}', '${otp.toString()}','${newDate}' ,'0');`;
    //console.log(sql);
    //INSERT INTO "public"."tb_otp"("id", "phone", "otp", "senddate", "status") VALUES (1, '0812318897', '111111', '2011-01-01 00:00:00', '0');
    pool.query(
        sql, 
        (err, result) => {

            if (err) {
                
                res.status(400).json({
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
                    sql = `INSERT INTO "public"."tb_log_sms"("phone", "senddate", "from") VALUES ('${data.to}', '${newDate}', 'mt');`;
                    pool.query(sql , (err, result) =>{
                        if (err) {
                            //console.log(err);  
                          
                            res.status(400).json({
                                status : "error",
                                data : "error insert log sms"
                            })
                        }
                        else
                        {
                            res.status(200).json({
                                status : "success",
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
    let sql = `SELECT * FROM "public"."tb_otp" 
                WHERE tb_otp.phone = '66812318897'
                ORDER BY tb_otp.senddate DESC
                LIMIT 1;`;
    pool.query(sql , (err, result) =>{
        if (err) {
            //console.log(err);  
            let data = {
                status : "error",
                data : "error get otp"
            }   
            res.status(400).json(data)
        }
        else
        {
            let dataOtp = result.rows[0] ;
            if(dataOtp.otp == data.otp)
            {
                 res.status(200).json({
                    status : "success",
                    data : true
                });
            }
            else{
                res.status(200).json({
                    status : "success",
                    data : false
                });
            }
           

        }
    })
}

sendSMSMt = (req , res , next) =>{
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
        
        sql = `INSERT INTO "public"."tb_log_sms"("phone", "senddate", "from") VALUES ('${data.to}', '${newDate}', 'mt');`;
        pool.query(sql , (err, result) =>{
            if (err) {
                //console.log(err);  
              
                res.status(400).json({
                    status : "error",
                    data : "error insert log sms"
                })
            }
            else
            {
                res.status(200).json({
                    status : "success",
                    data : "send complete" 
                });
            }
        })
    })
    .catch(function (error) {
        // handle error
        // console.log(error);
        res.status(200).json({
            status : "error",
            data : "send not complete" 
        });
    })
    .finally(function () {
        // always executed
    });

}

insertLogSMS = () =>{
    let sql = `INSERT INTO "public"."tb_log_sms"("phone", "senddate", "from") VALUES ('${data.to}', '${newDate}', 'mt');`;
    pool.query(sql , (err, result) =>{
        if (err) {
            console.log(err);  
            let data = {
                status : "error",
                data : "error insert log sms"
            }   
            res.status(400).json(data)
        }
        else
        {
            res.status(200).json({
                status : "success",
                data : "send OTP complete"
            });
        }
    })
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
    sendSMSMt,
    test
}