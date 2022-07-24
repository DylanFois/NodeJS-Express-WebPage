var express = require("express")
var path = require("path")
var ejs = require("ejs")
var pg = require("pg")
var cookieParser = require("cookie-parser")
var passport = require("passport")
var session = require("express-session")
const db = require('./queries')
const bodyParser = require('body-parser')
const { initialize } = require("passport")
const flash = require('connect-flash')

var app = express()

app.set("port", process.env.PORT || 3000)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use("/", require("./routes/web"))
app.use("/api", require("./routes/api"))

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cookieParser())
app.use(session({
    secret: "ashdja$%&mjn129hmjasd^(",
    resave: false,
    saveUninitialized:false
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.listen(app.get("port"),function(){
    console.log("Server started on port "+ app.get("port"))
})