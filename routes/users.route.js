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

const {
    route,
    sendMailConfirmation
} = require('./emailConfirmation.route')

router.route('/users')
    /**
     * @swagger
     * /users:
     *   post:
     *     tags:
     *        - All things related to user
     *     summary: Create a new user with
     *     consumes:
     *       - application/json
     *     parameters:
     *        - in: body
     *          name: user
     *          description: The user to create.
     *          schema:
     *            type: object
     *            required:
     *              - name
     *              - email
     *              - paswword
     *              - lastname
     *              - genre
     *              - date
     *              - url
     *            properties:
     *              name:
     *                type: string
     *              email:
     *                type: string
     *              password:
     *                type: string
     *              lastname:
     *                type: string
     *              genre:
     *                type: string
     *              date:
     *                type: string
     *              url:
     *                type: string
     *     responses:
     *      201:
     *        description: New message created!
     *
     */
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
                        /*To send email link for confirmation*/
                        sendMailConfirmation(req.get("host"), theToken, req.body.email);
                        res.status(200).send({
                            token: theToken
                        })
                        return 
                    }
                })
            }
        })

    })

    .patch(tokenValidation,(req,res) => {

        let params = {
            "name":'',
            "lastname":'',
            "password":'',
            'url':'',
            'date':'',
            'genre':'',
            'checkout':'',
            'role':''}

        for (let [key, value] of Object.entries(req.body)) {
            console.log(key)
            if (params[key] == undefined) {
                res.status(400).send(key + ' dosent exist')
                return
            }
        }

        updateUser({
            email:req.user.email
        },req.body).then(r =>{
            if (r.ok) {
                res.status(200).send(' updated')
                return
            } else {
                res.status(400).send('Not updated')
                return
            }
        })
    })
    /**
     * @swagger
     * /users:
     *  get:
     *   tags:
     *        - All things related to user
     *   summary: Get users by typing email and xauth
     *   description: To get user info
     *   produces:
     *    - application/json
     *   parameters:
     *     - in: header
     *       name: email
     *       schema:
     *         type: string
     *       required: true
     *     - in: header
     *       name: x-auth
     *       schema:
     *         type: string
     *       required: true
     *   responses:
     *    '200': suuccesful response
     */
    .get(tokenValidation, (req, res) => {
       
        res.status(200).send(req.user)
    })


router.route('/login')
    /**
     * @swagger
     *  /login:
     *    post:
     *      tags:
     *        - All things related to user
     *      summary: Login with email and password
     *      consumes:
     *        - application/json
     *      parameters:
     *        - in: body
     *          name: user
     *          description: The user to create.
     *          schema:
     *            type: object
     *            required:
     *              - email
     *              - paswword
     *            properties:
     *              name:
     *                type: string
     *              email:
     *                type: string
     *      responses:
     *        201:
     *          description: New message created!
     */
    .post((req, res) => {

        if (req.body.email == undefined || req.body.password == undefined) {
            res.status(400).send("Email or Password missing")
            return
        }

        existUser("email", req.body.email).then(result => {
            if (result == false) {
                res.status(400).send("User not found or Bad password...,")
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
