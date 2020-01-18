const mongoose = require('./mongodb-connect')

let usersSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true

    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
    },
    url: {
        type: String,
    },
    date: {
        type: Date,
    },
    token: {
        type: String,
    },
    genre: {
        type: String,
        enum: ["MAN", "WOMAN", "OTHER"]
    },
    checkout:{
        type: [String]
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER", "GUEST"]
    },
    isVerified: {
        type:Boolean,
        default:false
    }
})

let User = mongoose.model('users', usersSchema)

let newUser = {
    name: "roberto",
    lastname: "gutierrez",
    email: "roberto@gmail.com",
    password: "1234",
    url: "",
    role: "USER"
}


async function createUser(user) {
    try {
        let nUsr = User(user)
        let doc = await nUsr.save()
        console.log("User Created");
        return true
    } catch (error) {
        console.log(error)
        return false
    }

}


async function existUser(parameter, id,properties) {
    try {
        let docs = await User.findOne({
            [parameter]: id
        },properties)
        if (docs != undefined) {
            return docs
        } else {
            return false;
        }
    } catch (error) {
        console.log(`Error, Cant find user on server`);
        return false
    }
}

async function findUsersBy(parameter, id) {
    try {
        let docs = await User.find({
            [parameter]: new RegExp(id, 'i')
        })
        return docs
    } catch (error) {
        console.log(`Error, Cant find user on server`);
        return false
    }
}


/*To do: */
async function getUserCheckout(email){
    
        await User.find({"email":email},function (err,res) {
            console.log(res);
        })
       

}

async function updateUser(paramSearch, paramSet) {
    
     try {
        return await User.updateOne(paramSearch, paramSet)
    } catch (error) {
        console.log(`Error ON DATABASE`);
        return false
    }

}

 
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
// getUserCheckout("carlos@gmail.com").then(result =>{
//     console.log(result);
// })

module.exports = {
    User,
    findUsersBy,
    updateUser,
    existUser,
    createUser
};