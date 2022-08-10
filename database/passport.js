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
    results = await pool.query('SELECT passhash, email, firstname, lastname, user_id FROM users WHERE email = $1', [req.body.email], function(error, results){ // Get the hash value from the database using the email provided
        if (error) {
            throw error
          }
        if (results.rows[0] == null){ // If nothing is returned in results, the email does not exist on the database
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
                return done(null, {userid: userid, firstname: results.rows[0].firstname, lastname: results.rows[0].lastname})
            }else{
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
    
    const results = await pool.query('SELECT email FROM users WHERE email = $1', [req.body.email], function(error, results){ // Attempt to retrieve an email from the database that matches the one provided
        if(error){
            req.flash('error', 'Email check attempt failed')
            return done(null, false)
        }
        if(results.rows[0]){ // If there is a match, then registration will not proceed due to an account already having that email
            req.flash('error', 'An account with that email address already exists')
            return done(null, false)
        }else{
            const hash = bcrypt.hash(req.body.password, 10, function(err, hash){
                const firstname = req.body.firstname
                const lastname = req.body.lastname
                const email = req.body.email
                const passhash = hash
                const userid = uuidv4()
                pool.query('INSERT INTO users (user_id, firstname, lastname, email, passhash) VALUES ($1, $2, $3, $4, $5)', [userid, firstname, lastname, email, passhash], (error, results) => { // Insert the users information into the database
                    if (error) {
                      console.log(error)
                      return done(null, false)
                    }else{
                      return done(null, {userid: userid, firstname: firstname, lastname: lastname})
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