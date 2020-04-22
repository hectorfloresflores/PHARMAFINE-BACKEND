/*To connect with mongo database easy */
const mongoose = require("mongoose")
/*To load configuration of mongo db, dont forget to added it to .gitignore */
const config  =require("../config.json")
/**Load mongo url to connect */

const password = process.env.mongodb.password || config.password;
const dbname = process.env.mongodb.name || config.dbname;
const username = process.env.mongodb.username || config.username;
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