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
    .patch(tokenValidation,(req, res) => {



        let numberOfProducts = parseInt(req.body.quantity);
        let productID = req.body.product;
        let modified = false;
        let newCheckout = req.user.checkout.map((item, index, theArray) => {
            if (item.split('-')[0] == productID) {
                modified = true;
                let id = item.split('-')[0];
                let quantity = parseInt(item.split('-')[1]);
                let newItem;
                //Set 0 when the number of objects is minor
                if (numberOfProducts < 0 && quantity < Math.abs(numberOfProducts)) {
                    newItem = id + '-' + '0';
                } else {
                    newItem = id + '-' + (quantity+numberOfProducts);
                }
                return newItem;
            } else {
                return item;
            }

        });

        if (modified == false) {

            let newItem = productID + '-' + Math.abs(numberOfProducts);
            newCheckout.push(newItem);
        }

        updateUser({
            email: req.user.email
        }, {
            checkout: newCheckout
        }).then(response =>{

                res.status(200).send(`Checkout updated`);

        })


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