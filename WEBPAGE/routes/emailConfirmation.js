const express = require("express");
//For email verification
const nodemailer = require("nodemailer");

const jwt = require('jsonwebtoken')

var app = express();
const router = express.Router();

const {
  User,
  findUsersBy,
  updateUser,
  existUser,
  createUser
} = require('../db/users')



/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "minoxidil21",
    pass: "gatofeliz12"
  }
});
var rand, mailOptions, host, link;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/
router.route("/sendEmailConfirmation").get((req, res) => {
  
  host = req.get("host");
  link = "http://" + req.get("host") + "/verifyEmailConfirmation?token=" + req.query.token;
  mailOptions = {
    to: req.query.email,
    subject: "Please confirm your Email account",
    html:
      "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
      link +
      ">Click here to verify</a>"
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      res.end("error");
    } else {
      console.log("Message sent: " + response.message);
      res.end("sent");
    }
  });
});
router.route("/verifyEmailConfirmation").get((req, res) => {
  
    //Check the matching token if exist a user
    existUser("token",req.query.token).then(result => {

        if (result == false){
          res.end("<h1 style='color: green;'>Bad Request</h1>");
        }
        
        if (result.isVerified == true) {
          res.end("<h1 style='{color:red;}'>User has been verified.(Usuario ya esta verificado)</h1>");
        }

        jwt.verify(req.query.token, result.password, (err, decoded) => {
          if (err) {
            res.end("<h1 style='{color:green;}'>Token may have be expired.(Codigo pudo haber expirado)</h1>");
              return
          } else {
            updateUser({email: result.email}, {isVerified: true}).then(updated =>{
              if (updated == false) {
                res.end("<h1>Server error");
              }else{
                res.end(`<h1 style="color: green;">User verified.(Usuario verificado con exito)</h1>`);
              }
            })
          }
      })
        

        
    })
 
});


/*--------------------Routing Over----------------------------*/

/*Middleware to check correct users */
module.exports = router;
