var express = require("express")
var passport = require("passport")
const bcrypt = require('bcrypt')
const pool = require("../../database/database")

var router = express.Router()

router.get("/", function(req,res){
    res.render("home/index")
})

router.get("/home", function(req,res){
    res.render("home/home")
})

router.get("/about", function(req,res){
    res.render("home/about")
})

router.get("/login", function(req,res){
    res.render("home/login")
})

router.post("/login", async function(req,res){

    results = await pool.query('SELECT passhash FROM users WHERE email = $1', [req.body.email], function(error, results){
        if (error) {
            throw error
          }
        const passhash = results.rows[0].passhash
        const password = req.body.password

        match = bcrypt.compare(password, passhash, function(error, match){
            if (error) {
                console.log(error)
                res.status(401).send('error')
              }else{

            if (match){
                res.status(201).send('user logged in')
            }else{
                res.status(401).send('error')
            }
        }
        })
    })
})

router.get("/signup", function(req,res){
    res.render("home/signup")
})


router.post("/signup", async function(req,res){
    const hash = await bcrypt.hash(req.body.password, 10, function(err, hash){
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const passhash = hash

        pool.query('INSERT INTO users (firstname, lastname, email, passhash) VALUES ($1, $2, $3, $4)', [firstname, lastname, email, passhash], (error, results) => {
          if (error) {
            res.status(401).send('Registration error')
          }else{
          res.status(201).send(`Added new user`)
          }
        })
    })

})

module.exports = router