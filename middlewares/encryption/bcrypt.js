const bcrypt = require('bcrypt')
const saltRounds = 10;


function encryptPassword(req,res,next) {
    if(req.body.password == undefined ){
        return false;
    }else{
        req.body.password = bcrypt.hashSync(req.body.password,saltRounds)
        next()
        return 
    }
   
}

function isPassword(password,hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = {encryptPassword,isPassword};