const mongoose = require('./mongodb-connect')

let productsSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        require: true,
    },
    image: {
        type: String,
    },
    stock: {
        type: Number
    },
    id: {
        type: String
    }
   
})

let Product = mongoose.model('products', productsSchema)

//Usage:
// getProducts(["0001"]).then(result =>{
//     console.log(result)
// })

let newProduct = {
    name: "proteina de fresa",
    description: "proteina natural de fresa",
    precio: 700,
    image: "https://picsum.photos/id/10/300/300",
    id: "0004",
    stock: 10
}


async function createProduct(product) {
    try {
        let nUsr = Product(product)
        let doc = await nUsr.save()
        console.log("User Created");
        return true
    } catch (error) {
        console.log(error)
        return false
    }

}

async function getProducts(name) {
    
    try {
        let products = await Product.find({
         "name": { "$regex": name, "$options": "i" }
        })
        return products
    } catch (error) {
        
    }   
}

async function getAll() {
    try {
        let products = await Product.find()
        return products
    } catch (error) {

    }
}

async function getPriceRange(min, max) {
    try {
        let products = await Product.find(
            {price: {$gte: parseInt(min), $lte: parseInt(max)}}

        )
        return products
    } catch (error) {

    }
}

async function getExistanceGreaterThan(min) {
    try {
        let products = await Product.find(
            {stock: {$gte: parseInt(min)}}

        )
        return products
    } catch (error) {

    }
}

async function findByIds(productIds) {
    try {
        let products = await Product.find(
            { 'id': { $in: productIds}}
        )
        return products
    } catch (error) {
        return false;
    }
}

createProduct(newProduct).then(r =>{
    console.log(r);
})

// getProducts('o').then(r =>{
//     console.log(r);
// })

// getPriceGreaterThan('355').then(r =>{
//     console.log(r);
// })

// findByIds(['0003']).then(r =>{
//     console.log(r)
// })
module.exports = {
    getProducts,
    getAll,
    getPriceRange,
    getExistanceGreaterThan,
    findByIds
};