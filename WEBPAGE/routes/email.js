const express = require('express')
const router = express.Router()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const sendmail = require('sendmail')

router.route('/email')
  .post((req, res) => {
    
    if (req.body.email == undefined || req.body.message == undefined) {
      res.status(400).send("Email or message missing")
      return
    }

    
      sgMail.send({
        to: 'info@pharmafine.com.mx',
        from: req.body.email,
        subject: "Cliente",
        text: req.body.message,
      });
  
    
  
  
    res.status(200).send(`Message successfully sent!`)
    return


  })


module.exports = router;