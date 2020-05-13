'use strict';

/**
 * Imports
 */

if(process.env.NPM_CONFIG_PRODUCTION == undefined)
require('dotenv').config({path: __dirname + '/config.env'});
// For create server
const express = require('express');
// For access data from one file to another
const cors = require('cors');
// For render hbs files
const exphbs  = require('express-handlebars');
// For get the path
const path = require('path');

const port = process.env.PORT || 5000;
/**
 * Uses of imports
 */
const app = express();

/**
 * Socektoit
 * @type {module:http}
 */
const http = require('http');
const server = http.Server(app);
const io = require('socket.io').listen(server);
io.on('connection', (socket) => { //nueva conexión
                                  //config interna (no archivo)
    console.log('new connection made.');

    socket.on('join', function (data) {
        socket.join(data.room);
        console.log(data.user + ' joined the room: ' + data.room);
        socket.broadcast.to(data.room).emit('new user joined', {
            user: data.user,
            message: 'has joined this room.'
        });
    });


    socket.on('leave', function (data) {
        console.log(data.user + ' left the room: ' + data.room);
        socket.broadcast.to(data.room).emit('left room', {
            user: data.user,
            message: 'has left this room.'
        });
        socket.leave(data.room);
    });

    socket.on('message', function (data) { //envío de data (user y msj) dentro del evento
        io.in(data.room).emit('new message', {
            user: data.user,
            message: data.message
        }); //mandarlo dentro del room (que será un user)
    })

    socket.on('user', function (data) {
        io.in('conection').emit('new user', {
            user: data.user
        }); //intento de enviar users creados
        //io.in(data.room).emit('new user', {user:data.user});
    })
});

server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    //debug('Listening on ' + bind);
}
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
// app.use(express.static(path.join(__dirname, '/dist/')));
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
server.listen(port, ()=> console.log(`http://localhost:${port}`))



