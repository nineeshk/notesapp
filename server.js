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

// Post all requests to Server 2 for processing
app.all('/*', (req, res) => {
  var data = JSON.stringify(req.body);
  var options = {
    host: 'localhost',
    path: req.path,
    port: '3001',
    method: req.method,
    json: true,
      headers: {
      'Content-Type' : 'application/json',
      'Content-Length' : data.length
    }
  };

  if (req.path === "/user/signup" || req.path === "/user/login") {
    options['headers']['Authorization'] = 'mystaticauthheader';
  } else {
    if (!req.headers.authorization || req.headers.authorization.substring(0, 6) != 'Bearer') {
      res.json({'Message': 'Please send Bearer Token along with the request'});
      return;
    }
    options['headers']['Authorization'] = req.headers.authorization;
  }
      
  callback = function(response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });
  
    response.on('end', function () {;
      var ins = JSON.parse(str);
      res.json(ins);
    });
  }
  
  var req = http.request(options, callback);
  req.write(data);
  req.end();
    
});
// listen for requests
app.listen(3000, () => {
    console.log("Server 1 => is listening on port 3000");
});