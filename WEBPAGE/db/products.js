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


async function getProducts(objects) {
    let objectIdArray = objects.map(e =>{
       return mongoose.Types.ObjectId(e)
    })
    
    try {
        let products = await Product.find({
            '_id': { $in: objectIdArray}
        })
        return products
    } catch (error) {
        
    }
   
        
}



// async function getUsersA(nombre){
//     try{
//         let docs = await User.find(
//             {'nombre': new RegExp(nombre,'i'), 'rol':"ADMIN"},
//             {_id: 0, nombre:1})
//         console.log(docs);
//         return docs;
//     } catch(e){
//         console.log("error de conexión");
//         return []
//     }

// }




//console.log(createUser(newUser))

//  updateUser({
//     "email":"carlos@gmail.com",
//     "password":"1234"
// },{genre:"HOMBRE"}).then(result =>{
//     console.log(result.nModified)
//  })
// User.updateOne({name:"carlos"},{name:"carlitos"})
// existUser("email","carlos@gmail.com","email name").then(result =>{
//     console.log(result);
// })
// getUsersA()
// datos = {nombre:"carlos",rol:"USER"}
// updateUser('c2@t',datos)
// getProducts(["5de838341c9d440000d33e3c","5de81b231c9d440000cdefc3"]).then(res=>{
//     console.log(res);
// })
module.exports = {
    getProducts
};