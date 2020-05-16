const express = require('express');
const router = express.Router();

const {getProducts, getAll,getPriceRange,
    getExistanceGreaterThan} = require('../db/products')

router.route('/products')

    /**
     * @swagger
     *   /products:
     *     get:
     *       tags:
     *         - All things related to product
     *       summary: Create a new user with
     *       responses:
     *        201:
     *          description: New message created!
     */
    .get((req, res) => {

        if (req.query.name != undefined) {
            getProducts(req.query.name).then(products =>{
                res.status(200).send(products);
                return;
            })
        } else if (req.query.priceLow != undefined && req.query.priceHigh != undefined) {
            getPriceRange(req.query.priceLow,req.query.priceHigh).then(products =>{
                res.status(200).send(products);
                return;
            })
        } else if (req.query.priceLow != undefined) {

            getExistanceGreaterThan(req.query.priceLow).then(products => {

                res.status(200).send(products);
                return;
            })
        }


})

module.exports = router;