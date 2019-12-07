const jwt = require('jsonwebtoken');
const expiresIn = 60 * 60 //1 hour
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
    if (req.header("x-auth") == undefined || req.params.email == undefined) {
        res.status(400).send("x-auth or email missing..")
        return
    }
    
    existUser("email", req.params.email).then(result => {
        
        if (result == false) {
            res.status(400).send("User not found")
            return
        }
       
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
    return jwt.sign({
            email: user.email
        },
        user.password, {
            expiresIn: expiresIn
        })
}

module.exports = {
    tokenValidation,
    tokenSign
};