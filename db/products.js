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
getProducts(["0001"]).then(result =>{
    console.log(result)
})
async function getProducts(productsIDs) {
    
    try {
        let products = await Product.find({
            'id': { $in: productsIDs}
        }).lean()
        return products
    } catch (error) {
        
    }   
}

module.exports = {
    getProducts
};