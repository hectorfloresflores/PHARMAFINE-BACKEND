const jwt = require('jsonwebtoken');
const expiresIn = 30  //1 hour
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

function tokenValidation(req, res, next) {
    if (req.header("x-auth") == undefined || req.header("email") == undefined) {
        res.status(400).send("x-auth or email missing..")
        return
    }
    
    existUser("email", req.header("email")).then(result => {
        
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
    try {
        return jwt.sign({
            email: user.email
        },
        user.password, {
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

