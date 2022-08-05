var express = require("express")
var path = require("path")
var ejs = require("ejs")
var pg = require("pg")
var passport = require("passport")
var session = require("express-session")
const db = require('./queries')
const bodyParser = require('body-parser')
const { initialize } = require("passport")
const flash = require('connect-flash')
const multiparty = require('multiparty')
const bcrypt = require('bcrypt')

var app = express()

app.set("port", process.env.PORT || 3000)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(flash())

// require("./database/passport")(passport)

app.use("/", require("./routes/web"))
app.use("/api", require("./routes/api"))

app.listen(app.get("port"),function(){
    console.log("Server started on port "+ app.get("port"))
})