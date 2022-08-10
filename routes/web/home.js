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
        res.render("home/home", {message: req.flash()})
        console.log(req.user)
        console.log(req.session)
    }else{
        req.flash('error', "You need to log in")
        res.redirect('/login')
    }
})

router.get("/about", function(req,res){
    res.render("home/about", {message: req.flash()})
})

router.get("/login", function(req,res){
    res.render("home/login", {message: req.flash()})
    console.log("hi")
    console.log(res.locals.message)
})

router.post("/login", passport.authenticate('login', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/login',
    failureFlash: true
}), function(req,res){

})

router.get("/loginSuccess", function(req,res){
if (req.isAuthenticated){
    req.flash('success', 'Successfully logged in!')
    res.redirect("/home")
}
})

router.post("/logout", function(req,res){
    req.logout(function(err){
        if(err){
            return next(err)
        }
        req.flash('success', 'Successfully logged out')
        res.redirect('/login')
    })

})

router.get("/signup", function(req,res){
    res.render("home/signup", {message: req.flash()})
})

// Registration route for when a user registers on the site
router.post("/signup", passport.authenticate('register', {
    successRedirect: '/signupSuccess',
    failureRedirect: '/signup',
    failureFlash: true
}), async function(req,res){

})

router.get("/signupSuccess", function(req,res){
    if (req.isAuthenticated){
        req.flash('success', 'Successfully registered!')
        res.redirect("/home")
    }
    })

module.exports = router