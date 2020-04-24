const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

const session = require('express-session');

// Configuring the database
const dbConfig = require('./config/database.js');
const mongoose = require('mongoose');

const flash    = require('connect-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
var ssn;

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


app.all('/notes/*', async function (req, res) {
    const user = require('./app/models/user');
    const usertoken = require('./app/models/usertoken');
    const userprofile = require('./app/models/userprofile');
    var tokenResult;

    if (req.headers.authorization.substring(0, 6) === 'Bearer'){
		var token = req.headers.authorization.substring(7);

        tokenResult = await usertoken.find({token: token});
        if (tokenResult && tokenResult.length === 0) { res.json({'Message': 'Authentication failed'}); return;}
        tokenResult = tokenResult[0];
        var dt = new Date();
        if (dt > tokenResult.expiry) {
            res.json({'Message': 'Please login.'})
            return;
        }
	} else {
        res.json({'Message': 'No token found'});
        return;
    }

    var data = JSON.stringify(req.body);
    var options = {
      host: 'localhost',
      path: req.path,
      port: '3002',
      method: req.method,
      json: true,
      headers: {
        'Content-Type' : 'application/json',
        'Content-Length' : data.length,
        'Authorization' : req.headers.authorization,
        'userdata' : tokenResult.user,
        'userprofile': ''
      }
    };
      
    callback = function(response) {
    var str = '';
    response.on('data', function (chunk) {
        str += chunk;
    });
    
    response.on('end', function () {
        var ins = JSON.parse(str);
        res.json(ins);
    });
    }
    
    var req = http.request(options, callback);    
    req.write(data);
    req.end();
});

require('./app/routes/routes.js')(app, passport);

app.listen(3001, () => {
    console.log("Server 2 => is listening on port 3001");
});
