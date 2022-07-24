var express = require("express")
var passport = require("passport")

var router = express.Router()

router.get("/", function(req,res){
    console.log("Start page")
    res.render("home/index")
})

router.get("/home", function(req,res){
    console.log("Home page")
    res.render("home/home")
})

router.get("/about", function(req,res){
    console.log("about")
    res.render("home/about")
})

router.get("/login", function(req,res){
    console.log("login")
    res.render("home/login")
})

router.get("/signup", function(req,res){
    console.log("sign up")
    res.render("home/signup")
})

router.post("/signup", function(req,res,next){
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password


})

module.exports = router