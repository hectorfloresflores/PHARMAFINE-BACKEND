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
    createUser,
    deleteItemsCheckout
} = require('../db/users')
const {
    tokenValidation,
    tokenSign
} = require('../middlewares/authentication/jsonwebtoken')

router.route('/checkout')
    .post((req, res) => {
        
                
       
        // getProducts()
        res.status(202).send(`User successfully saved!`)
    })
    .get(tokenValidation,(req, res) => {
        existUser("email", req.headers.email).then(result => {
            
            // Get just the product ids
            var productsQuantity = []
            var productsId = result.checkout.map(e =>{
                productsQuantity.push(e.split("-")[1])
                return e.split("-")[0]
            })
            
            getProducts(productsId).then(products=>{
                
                products.forEach((product,index) =>{
                    product.quantity = productsQuantity[index]
                })
                
                console.log(products)
                res.status(200).send(JSON.stringify(products))
                return
            })
           
            
        })
       
        // res.status(400).send("Error")
    })
    .delete(tokenValidation,(req,res) =>{

        deleteItemsCheckout(req.headers.email,req.body.products).then(result => {
            if (result == true) {
                res.status(200).send("Deleted")
            }else{
                res.status(400).send("Error")
            }
        })
    })

module.exports = router;