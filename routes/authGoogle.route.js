'use strict';

const router = require('express').Router();
const passport = require('passport');

router.get('/google/login',passport.authenticate('google',{
        scope:['profile', 'email'],
        session: false
    })).get('/google/redirect',passport.authenticate('google',{
        session: false
    }),(req,res)=>{
    
        req.app.set('xauth', req.user.token)
        req.app.set('email', req.user.id)
        res.redirect(`http://pharmafine-frontend.herokuapp.com/home`)
    }).get('/logout',(req,res)=>{
        req.logOut()
        res.send('Logout')
    })

module.exports= router;