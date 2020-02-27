'use strict';
const jwt = require('jsonwebtoken');
const expiresIn = 60*5  //1 hour
const {
    encryptPassword,
    isPassword
} = require('../encryption/bcrypt')
const {
    User,
    findUsersBy,
    updateUser,
    existUser,
    createUser
} = require('../../db/users')

/**Please read this, when is a google user will not use email, will use profile id, but this profile id is on email header */
function tokenValidation(req, res, next) {
    if (req.header("x-auth") == undefined || req.header("email") == undefined) {
        res.status(400).send("x-auth or email missing..")
        return
    }

    /**rEGULAR EXPRESSION TO CHECK IF IT IS N MEIAL OR NOT */
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    /**Check if param email is a google id or a real email */
    let userIndentifier
    if (re.test(String(req.header("email")).toLowerCase())) {
        userIndentifier = 'email';
    }else{
        userIndentifier = 'id'
    }
    
    existUser(userIndentifier, req.header("email")).then(result => {
        
        if (result == false) {
            res.status(400).send("User not found")
            return
        }

        req.user = result
       
        jwt.verify(req.header("x-auth"), result.password, (err, decoded) => {
            if (err) {
                res.status(400).send("Not authenticated")
                return
            } else {
                next()
            }
        })
      
    })
    
}

function tokenSign(user) {
    let pass;
    if (user.password == undefined) {
        pass = user.id;
    }else{
        pass = user.password;
    }
    try {
        return jwt.sign({
            email: user.email
        },
        pass, {
            expiresIn: expiresIn
        })
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = {
    tokenValidation,
    tokenSign
};
