const express = require('express')
const router = express.Router()

/*For encrypt passwords */
const {
    getProducts
} = require('../db/products')
const {
    User,
    findUsersBy,
    updateUser,
    existUser,
    createUser
} = require('../db/users')

router.route('/checkout')
    .post((req, res) => {
        
                
       
        // getProducts()
        res.status(202).send(`User successfully saved!`)
    })
    .get((req, res) => {
        existUser("email", req.headers.email).then(result => {
            
            var productsId = result.checkout.map(e =>{
                return e.split("-")[0]
            })
            getProducts(productsId).then(products=>{
                
                res.status(200).send(JSON.stringify(products))
                return
            })
            
        })
       
        // res.status(400).send("Error")
    })

module.exports = router;