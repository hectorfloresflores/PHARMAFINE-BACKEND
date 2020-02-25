'use strict';

/**
 * Imports
 */
// For create server
const express = require('express');
// For access data from one file to another
const cors = require('cors');
// For render hbs files
const exphbs  = require('express-handlebars');
// For get the path
const path = require('path');

/**
 * Uses of imports
 */
const app = express();
/*Users Mongo DB functions Schema */
const {User, findUsersBy,updateUser} = require('./db/users');

const port = 3002;


/**
 * App uses
 */
// To parse json data and string
app.use(express.json())
// To access data from one file to another
app.use(cors())
// Routing
app.use('/',require('./routes/users'));
app.use('/',require('./routes/checkout'));
app.use('/',require('./routes/email'));
app.use('/',require('./routes/openpay'));
app.use('/',require('./routes/emailConfirmation'));
// Static routing
app.use(express.static(path.join(__dirname, '/public')));
// To use handlebars
app.engine('hbs', exphbs({ 
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, './views/layouts/') 
}));
app.set('view engine', 'hbs');
/***********/


function myMiddleware(req,res, next){
    let id = req.get('x-id');
    req.id = id;
    next();
}



app.get('/home1', (req,res)=>{
    res.render('home.hbs')
})

/**Port of app to listen */
app.listen(port, ()=> console.log(`http://localhost:${port}`))

