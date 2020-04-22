const express = require('express')
//For email verification


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
        let params = ["name", "lastname", "email", "password"]
        var params_missed = []
        for (const key in params) {
            if (user[params[key]] == undefined || user[params[key]] == "") {
                params_missed.push(params[key])
            }
        }


        if (params_missed.length > 0) {
            res.status(400).send(`Te faltan estos parametros ${JSON.stringify(params_missed)}`)
            return
        }

        existUser("email", req.body.email).then(result => {
           
            if (result != false) {
                res.status(401).send(`User is already created`)
                return
            } else {

                // //Add token to user
                
                let theToken = tokenSign(req.body)
                req.body.token = theToken;

                createUser(req.body).then(result => {
                    if (result == false) {
                        res.status(400).send(`Database error, user not saved`)
                        return
                    } else {
                        res.status(200).send({
                            token: theToken
                        })
                        return 
                    }
                })
            }
        })

    })
    .get(tokenValidation, (req, res) => {
       
        res.status(200).send(req.user)
    })


router.route('/login')
    .post((req, res) => {

        if (req.body.email == undefined || req.body.password == undefined) {
            res.status(400).send("Email or Password missing")
            return
        }

        existUser("email", req.body.email).then(result => {
            if (result == false) {
                res.status(400).send("User not found or Bad password.")
                return
            }
            if (isPassword(req.body.password, result.password) == false) {
                res.status(400).send("User not found or Bad password")
                return
            }

            if (result.isVerified == false) {
                res.status(401).send("User not verified, verify first")
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


   


/*Middleware to check correct users */
module.exports = router;