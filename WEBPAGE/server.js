'use strict';

/*To use routes and server mode */
const express = require('express');
const usersRouter = require('./users');
const cors = require('cors');
const app = express();
const {User, getUsersA} = require('./db/User');
const port = 3000;

function myMiddleware(req,res, next){
    let id = req.get('x-id');
    req.id = id;
    next();
}

app.use(express.static(__dirname +"/public"))
app.use(cors())
app.use(express.json())
app.use('/users',usersRouter);

app.get('/', myMiddleware, (req,res)=>{
    res.send('Hello DASWorld!')
})

app.get('/home', (req,res)=>{
    
    res.send('Home!') 
})

app.get('/us', async (req,res)=>{
    let users = await getUsersA()
    res.send(users)
})

app.route('/productos')
    .get((req,res)=>{
        let id = req.query.id
        let marca = req.query.marca
        console.log(id, marca);
        
        let rs ="Params: "
        rs += (id)? "id "+id: rs;
        rs += (marca)? "marca "+marca: rs;

        console.log("get products");
        res.send(rs)
    })
    .post((req,res)=>{
        console.log("post products ")
        console.log(req.body);
        res.status(418).send("error")
    })
    .delete((req,res)=>{
        console.log("delete products")
        res.status(400).send("borrado")
    });

app.route('/productos/:uid')
    .get((req,res)=>{
        if(req.get('x-auth')!=undefined){
            let id = req.params.uid;
            res.set('x-id',id)
            res.send({nombre:"mouse",marca:"MS"}) 
        }else{
            res.status(400).send({error: 'falta x-auth'})
        }
       
    })

app.listen(port, ()=> console.log(`http://localhost:${port}`))