/*To connect with mongo database easy */
const mongoose = require("mongoose")

const password = process.env.mongodb_password;
const dbname = process.env.mongodb_name;
const username = process.env.mongodb_username;
let mongoDB = `mongodb+srv://${username}:${password}@cluster-vs1if.mongodb.net/${dbname}?retryWrites=true&w=majority`

/*Try connection with mongo*/
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{
    /**Succes connection */
    console.log("Connected to database");
}).catch((err)=>{
    /**Fail connetion */
    console.log("Not connected to database", err);
});
/**Export mongo connection */
module.exports = mongoose