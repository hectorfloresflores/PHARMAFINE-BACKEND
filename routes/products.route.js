const express = require('express');
const router = express.Router();

const {getProducts, getAll} = require('../db/products')

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
        getProducts(req.query.name).then(products =>{
            res.status(200).send(products);
        })

})

module.exports = router;