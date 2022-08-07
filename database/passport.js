const passport = require("passport");
var LocalStrategy = require('passport-local').Strategy
const pool = require("./database")
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

module.exports = function(){

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'}, (req, email, password, done) => {
    login()

async function login(){
    results = await pool.query('SELECT passhash, email, firstname, user_id FROM users WHERE email = $1', [req.body.email], function(error, results){
        if (error) {
            throw error
          }
        if (results.rows[0] == null){
            req.flash('error', "No account found with that email")
            return done(null, false)
        }
        const passhash = results.rows[0].passhash.replace(/ /g,'')
        const password = req.body.password

        match = bcrypt.compare(password, passhash, function(error, match){ // Use Bcrypt to compare the hashed password stored on the database with the plaintext password
            if (error) {
                console.log(error)
              }else{
            if (match){
                let userid = results.rows[0].user_id
                req.flash('success', 'Logged in successfully!')
                return done(null, userid)
            }else{
                req.flash('error', "Error while logging in")
                return done(null, false)
            }
        }
        })
    })
}
}))

passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'}, (req, email, password, done) => {
    register()

async function register(){
    
    const results = await pool.query('SELECT email FROM users WHERE email = $1', [req.body.email], function(error, results){
        if(error){
            req.flash('error', 'Email check attempt failed')
            return done(null, false)
        }
        if(results.rows[0]){
            req.flash('error', 'An account with that email address already exists')
            return done(null, false)
        }else{
            const hash = bcrypt.hash(req.body.password, 10, function(err, hash){
                const firstname = req.body.firstname
                const lastname = req.body.lastname
                const email = req.body.email
                const passhash = hash
                const userid = uuidv4()
                pool.query('INSERT INTO users (user_id, firstname, lastname, email, passhash) VALUES ($1, $2, $3, $4, $5)', [userid, firstname, lastname, email, passhash], (error, results) => {
                    if (error) {
                      console.log(error)
                      req.flash(error)
                      return done(null, false)
                    }else{
                      req.flash('success', 'Successfully registered')
                      return done(null, userid)
                    }
                  })

            })
        }
    })
}

}))

}

passport.serializeUser(function(user, done) {
    done(null, user);
   });
   passport.deserializeUser(function(user, done) {
    done(null, user);
   });