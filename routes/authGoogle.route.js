'use strict';

const router = require('express').Router();
const passport = require('passport');

router.get('/google/login',passport.authenticate('google',{
        scope:['profile', 'email'],
        session: false
    })).get('/google/redirect',passport.authenticate('google',{
        session: false
    }),(req,res)=>{
        
         res.status(200).redirect(`https://pharmafine-frontend.herokuapp.com/home?user=${JSON.stringify(req.user)}`)
    // res.status(200).send('jaja')
    }).get('/logout',(req,res)=>{
        req.logOut()
        res.send('Logout')
    })

module.exports= router;