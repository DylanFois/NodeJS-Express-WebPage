var express = require("express")
var passport = require("passport")
const bcrypt = require('bcrypt')
const pool = require("../../database/database")
const User = require("../../models/user")

var router = express.Router()

router.get("/", function(req,res){
    res.render("home/index")
})

router.get("/home", function(req,res){
    if (req.isAuthenticated()) {
        res.render("home/home")
        console.log(req.user)
    }else{
        req.flash('message', "You need to log in")
        res.render('home/login', {message: req.flash('message')})
    }
})

router.get("/about", function(req,res){
    res.render("home/about")
})

router.get("/login", function(req,res){
    res.render("home/login", {message: req.flash()})
    console.log(message)
})

router.post("/login", passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}), function(req,res){
    
})

router.post("/logout", function(req,res){
    req.logout(function(err){
        if(err){
            return next(err)
        }
        res.redirect('/login')
    })

})

router.get("/signup", function(req,res){
    res.render("home/signup")
})

// Registration route for when a user registers on the site
router.post("/signup", passport.authenticate('register', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash: true
}), async function(req,res){

})

module.exports = router