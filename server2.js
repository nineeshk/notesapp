const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const passport = require('passport');

// create express app
const app = express();
const session = require('express-session');

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

require('./config/passport')(passport);
app.use(session({ secret: 'businessappforvigileyes' ,resave: true,saveUninitialized: true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//const session = require('express-session');

// Configuring the database
const dbConfig = require('./config/database.js');
const mongoose = require('mongoose');

const flash    = require('connect-flash');
const cookieParser = require('cookie-parser');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.set('useCreateIndex', true);
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

require('./config/passport')(passport);
app.use(session({ secret: 'notesapplication' ,resave: true,saveUninitialized: true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


require('./app/routes/routes.js')(app, passport);

// listen for requests
app.listen(3002, () => {
    console.log("Server 3 => is listening on port 3002");
});
