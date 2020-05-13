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

// getProducts('o').then(r =>{
//     console.log(r);
// })
module.exports = {
    getProducts,
    getAll
};