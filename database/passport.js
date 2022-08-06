const passport = require("passport");
var LocalStrategy = require('passport-local').Strategy
const pool = require("./database")
const bcrypt = require('bcrypt')

module.exports = function(){

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'}, (req, email, password, done) => {
    login()

async function login(){
    results = await pool.query('SELECT passhash, email, firstname FROM users WHERE email = $1', [req.body.email], function(error, results){
        if (error) {
            throw error
          }
        if (results.rows[0] == null){
            req.flash('danger', "email not found")
            return done(null, false)
        }
        const passhash = results.rows[0].passhash.replace(/ /g,'')
        const password = req.body.password

        match = bcrypt.compare(password, passhash, function(error, match){ // Use Bcrypt to compare the hashed password stored on the database with the plaintext password
            if (error) {
                console.log(error)
              }else{
            if (match){
                req.flash('success')
                return done(null, true)
            }else{
                req.flash('danger', "Error while logging in")
                return done(null, false)
            }
        }
        })
    })
}
}))

passport.serializeUser(function(user, done) {
    done(null, user);
   });
   passport.deserializeUser(function(user, done) {
    done(null, user);
   });
}