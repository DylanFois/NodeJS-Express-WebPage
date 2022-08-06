var express = require("express")
var passport = require("passport")
const bcrypt = require('bcrypt')
const pool = require("../../database/database")
const User = require("../../models/user")
const { v4: uuidv4 } = require('uuid')

var router = express.Router()

router.get("/", function(req,res){
    res.render("home/index")
})

router.get("/home", function(req,res){
    res.render("home/home")
    console.log(req.session.passport.user)
})

router.get("/about", function(req,res){
    res.render("home/about")
})

router.get("/login", function(req,res){
    res.render("home/login")
})

router.post("/login", passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}), function(req,res){

})

router.get("/logout", passport.authenticate('logout', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}), function(req,res){

})

router.get("/signup", function(req,res){
    res.render("home/signup")
})

// Registration route for when a user registers on the site
router.post("/signup", async function(req,res){
    const hash = await bcrypt.hash(req.body.password, 10, function(err, hash){ // Hash the users password to safely store on the database
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const passhash = hash

        // Add the user into the database
        pool.query('INSERT INTO users (user_id, firstname, lastname, email, passhash) VALUES ($1, $2, $3, $4, $5)', [uuidv4(), firstname, lastname, email, passhash], (error, results) => {
          if (error) {
            console.log(error)
            res.status(401).send('Registration error')
          }else{
          res.status(201).json({
            timestamp: Date.now(),
            msg: 'User registered',
            code: 200
          })
          }
        })
    })

})

module.exports = router