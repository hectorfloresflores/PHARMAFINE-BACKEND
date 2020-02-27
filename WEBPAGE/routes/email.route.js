const express = require('express')
const router = express.Router()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendmail = require('sendmail')

router.route('/email')
  .post((req, res) => {
    console.log(req.body.email)
   console.log(req.body.message)
      sgMail.send({
        to: 'info@pharmafine.com.mx',
        from: req.body.email,
        subject: "Cliente",
        text: req.body.message,
      },false,(err,result)=>{
        if (err == null) {
          res.status(200).send(`Message successfully sent!`)
          console.log(err)
          return
        }else{
          res.status(400).send("Email or message missing")
          console.log(err)
          return
        }
        
      });
  
    
  
  
    


  })


module.exports = router;