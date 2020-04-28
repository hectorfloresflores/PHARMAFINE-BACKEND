'use strict';

/**
 * Imports
 */

if(process.env.NPM_CONFIG_PRODUCTION == undefined)
require('dotenv').config({path: __dirname + '/config.env'})
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

/**
 * Documented api routes.
 */
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            titile: 'CustomerApi',
            description: 'Customer api',
            contact: {
                name: "Amazinf dev"
            },
            servers: ["http://localhost:5000"]
        }
    },
    apis: ["server.js","./routes/users.route.js","./routes/products.route.js"]
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/*To connect to the database, not use connect*/
require('./db/mongodb-connect');
/** To load passport config*/
require('./config/passport')
/**Cookie for passport google users */
// const cookieSession = require('cookie-session');
// const passport = require('passport');
// app.use(cookieSession({
// maxAge: 20*1000,
// keys: ['clave'] //clave para encriptar
// }))
/** To use passport */
// app.use(passport.initialize());
// app.use(passport.session());
/********** */
const port = process.env.PORT || 5000;


/**
 * App uses
 */
// To parse json data and string
app.use(express.json())
// To access data from one file to another
app.use(cors())
// Routing
app.use('/',require('./routes/users.route'));
app.use('/',require('./routes/products.route'));
app.use('/',require('./routes/checkout.route'));
app.use('/',require('./routes/email.route'));
app.use('/',require('./routes/openpay.route'));
app.use('/',require('./routes/emailConfirmation.route').router);
app.use('/auth',require('./routes/authGoogle.route'));
// Static routing
// app.use(express.static(path.join(__dirname, '/public')));
// To use handlebars
app.engine('hbs', exphbs({ 
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, './views/layouts/') 
}));
app.set('view engine', 'hbs');
/***********/

/**
 * @swagger
 * /home:
 *  get:
 *      tags:
 *        - All things related to user
 *      summary: Creates a new message.
 *      description: use
 *      responses:
 *          '200': suuccesful response
 */
app.get('/home', (req,res)=>{
    
    res.render('home.hbs',{
        xauth:req.app.get('xauth'),
        email:req.app.get('email')
    })
    req.app.set('xauth', null)
    req.app.set('email', null)
})

/**Port of app to listen */
app.listen(port, ()=> console.log(`http://localhost:${port}`))



