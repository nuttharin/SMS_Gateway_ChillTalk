const { pool } = require('../dbConfig');

exports.insertLogSMS = (data) =>{
    let sql = ` INSERT INTO public.sms_log(
        system, phonenumber, status, senddate)
        VALUES ( ${data.system}, ${data.phonenumber}, ${data.status}, ${data.senddate} ); `;
    pool.query(
        sql, 
        (err, result) => {
            //console.log(err)
            if (err) {
                //console.log(err);                      
                resData.status = "error";
                resData.data = "query command error";
                res.status(400).json(resData);
            }
            else
            {
                resData.status = "success";
                resData.data = "insert complete";
                res.status(200).json(resData);
            }
        }
    );
}

