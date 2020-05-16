const express = require('express')
const router = express.Router()

/*For encrypt passwords */
const {
    getProducts,
    findByIds
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
    .delete(tokenValidation,(req,res) =>{
        let newCheckout = req.user.checkout.filter(product =>{
            if (req.headers.product != product.split('-')[0]) {
                return product;
            }
        });

        updateUser({
            email: req.user.email
        }, {
            checkout: newCheckout
        }).then(response =>{

            res.status(200).send(`Checkout updated`);

        })
    })
    .get(tokenValidation,(req, res) => {

            
            // Get just the product ids

            var productsId = req.user.checkout.map(e =>{

                return e.split("-")[0]
            })

        findByIds(productsId).then(result => {
            if (result) {
                res.status(200).send(JSON.stringify(result))
                return
            } else {
                res.status(400).send('error finding products ids')
                return
            }

        })


    })


module.exports = router;