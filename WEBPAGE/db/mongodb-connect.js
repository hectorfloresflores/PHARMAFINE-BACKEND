/*To connect with mongo database easy */
const mongoose = require("mongoose")
/*To load configuration of mongo db, dont forget to added it to .gitignore */
const config  =require("./config.json")
/**Load mongo url to connect */
let mongoDB = `mongodb+srv://${config.username}:${config.password}@cluster0-elqer.mongodb.net/${config.dbname}?retryWrites=true&w=majority`

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