const mongoose = require('./mongodb-connect')

let usersSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
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

async function existUserIDandEmail(id, email) {
    try {
        let docs = await User.findOne({$or:[
            {'id':id},
            {'email':email}]});
            return docs
        
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

/*Usage */
// deleteItemsCheckout("fernanda@gmail.com",["abc","123"])
async function deleteItemsCheckout(email,productsIDs){
    let result = await existUser("email",email)
        if (result != false) {
            
            let newCheckout = []
            result.checkout.forEach(element => {
                
                if (productsIDs.includes(element.split("-")[0]) == false) {
                    newCheckout.push(element)
                }
            });
            try {
                let updated =  await User.updateOne({"email":email}, {"checkout":newCheckout})
                
                    if (updated.nModified != 0) {
                        console.log("Items Deleted")
                        return true
                    }else{
                        return false;
                    }
                
            } catch (error) {
                console.log(`Error ON DATABASE`);
                return false
            }
        }else{
            console.log("User dosent exist")
        }
        
    
    
  
    
   

}

async function updateUser(paramSearch, paramSet) {
    
     try {
        return await User.updateOne(paramSearch, paramSet)
    } catch (error) {
        console.log(`Error ON DATABASE`);
        return false
    }

}



// deleteItemsCheckout({
//     "email":"fernana@gmail.com"
// },{genre:"WOMAN",checkout:["123","456"]}).then(result =>{
//     console.log(result.nModified)
//  })
// User.updateOne({name:"carlos"},{name:"carlitos"})
// existUser("name","carlos","email name").then(result =>{
//     console.log(result);
// })
// getUsersA()
// datos = {nombre:"carlos",rol:"USER"}
// updateUser('c2@t',datos)
// getUserCheckout("carlos@gmail.com").then(result =>{
//     console.log(result);
// })

User.find({}).then(result =>{
    console.log(result);
})

// User.findOne({$or:[{'name':"carlos"}]},
// function (err,docs) {
//     console.log(docs == undefined,err)
// });

   
module.exports = {
    User,
    findUsersBy,
    updateUser,
    existUser,
    createUser,
    deleteItemsCheckout,
    existUserIDandEmail
};