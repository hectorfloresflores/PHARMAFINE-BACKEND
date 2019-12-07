const express = require('express')
const router = express.Router()

/*For encrypt passwords */
const {
    encryptPassword,
    isPassword
} = require('../middlewares/encryption/bcrypt')
const {
    User,
    findUsersBy,
    updateUser,
    existUser,
    createUser
} = require('../db/users')
const {
    tokenValidation,
    tokenSign
} = require('../middlewares/authentication/jsonwebtoken')

router.route('/users')
    .post(encryptPassword, (req, res) => {
        
        let user = req.body
        let params = ["name", "lastname", "email", "password", "genre", "date"]
        var params_missed = []
        for (const key in params) {
            if (user[params[key]] == undefined) {
                params_missed.push(params[key])
            }
        }
        if (params_missed.length > 0) {
            res.status(400).send(`Te faltan estos parametros ${JSON.stringify(params_missed)}`)
            return
        }
        if (existUser("email", req.body.email) == false) {
            res.status(400).send(`User is already created`)
            return
        }
        if (createUser(req.body) == false) {
            res.status(400).send(`Database error, user not saved`)
            return
        }
        res.status(200).send(`User successfully saved!`)
    })


router.route('/login')
    .post((req, res) => {
        
        if (req.body.email == undefined || req.body.password == undefined) {
            res.status(400).send("Email or Password missing")
            return
        }

        existUser("email", req.body.email).then(result => {
            if (result == false) {
                res.status(400).send("User not found")
                return
            }
            if (isPassword(req.body.password, result.password) == false) {
                res.status(400).send("Bad password")
                return
            }
            
            let theToken = tokenSign(result)
            updateUser({
                email: result.email
            }, {
                token: theToken
            })
            res.status(200).send({
                token: theToken
            })
        })


    })

router.route('/users/:email')
    .get(tokenValidation,(req, res) => {
        existUser("email", req.params.email).then(result => {
            console.log(result);
        })
       res.status(200).send("ok")        
    })


            /*Middleware to check correct users */
            module.exports = router;