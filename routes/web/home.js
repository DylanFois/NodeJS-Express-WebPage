var express = require("express")
var passport = require("passport")
const bcrypt = require('bcrypt')
const pool = require("../../database/database")

var router = express.Router()

router.get("/", function(req,res){
    console.log("Start page")
    res.render("home/index")
})

// router.get("/home", function(req,res){
//     console.log("Home page")
//     res.render("home/home")
// })

router.get("/home", (req, res) => res.render("home/home"))

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


router.post("/signup", async function(req,res){
    console.log(req.body)

    const hash = await bcrypt.hash(req.body.password, 10, function(err, hash){
        console.log(hash)
        const id = 11
        const firstname = req.body.firstname
        const lastname = req.body.lastname
        const email = req.body.email
        const passhash = hash
        const salt = "UNDEFINED"

        pool.query('INSERT INTO users (id, firstname, lastname, email, passhash, salt) VALUES ($1, $2, $3, $4, $5, $6)', [id, firstname, lastname, email, passhash, salt], (error, results) => {
          if (error) {
            throw error
          }
          console.log("Added user with ID: " + id)
          res.status(201).send(`User added with ID: ${results.insertId}`)
        })
    })

})

module.exports = router