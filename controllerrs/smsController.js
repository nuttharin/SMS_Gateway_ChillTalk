const axios = require('axios');
const request = require("request");
const querystring = require('querystring');


const nameTable = {
    moneyTranfer : "sms_log_moneyTranfer" ,
    gasMachine : "sms_log_gasMachine"
}

const statusMoneyTranfer = {
    otp : "otp",
    error : "error status"
}

const statusGasMachine = {
    otp : "otp",
    error : "error status"
    
}



const api_key_sms = process.env.API_KEY_SMS ;
const api_secret_sms = process.env.API_SECRET_SMS ;

sendSMSMoneyTranfer = (req , res , next) =>{
    let data = {
        to : "",
        text : "",
        api_key : "",
        api_secret : ""
        
    }
    axios.post('', data )
    .then(res => {
        //console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
    })
    .catch(error => {
        console.error(error)
    })
    
}

sendSMSGasMachine = (req , res , next) =>{
    let data = {
        to : "",
        text : "",
        api_key : "",
        api_secret : ""
        
    }


}

sendSMSInvitation = (req, res ,next) =>{

    let dataBody = req.body ;
    //  
    const data = { 
        to: dataBody.phoneNumber,
        text: dataBody.massage,
        api_key: api_key_sms,
        api_secret: api_secret_sms,
        from: 'Chill Talk LIMITED.' 
    };
    //Chill Talk LIMITED.
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
            data : "" 
        });
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .finally(function () {
        // always executed
    });


}



module.exports ={
    sendSMSInvitation,

}