const user = require('../models/user');
const userprofile = require('../models/userprofile');
const usertoken = require('../models/usertoken');
const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const randtoken = require('rand-token');
const emailValidator = require('email-validator');

router.post('/signup', function(req,res,next) {

    if(req.body._id == null){
        
        var validArr =[];

        // Validations
        // Email validation
        if (!emailValidator.validate(req.body.email))
            validArr.push({'Email': 'Invalid E-Mail address.'});

        // Password minimum length 4 characters
        if (req.body.password.length < 4)
            validArr.push({'Password':'Password must contain minimum 4 characters.'});
        
        // Firstname is Mandatory
        if (req.body.firstname.length < 1)
            validArr.push({'Firstname':'Firstname is mandatory.'});

        // Lastname is Mandatory
        if (req.body.lastname.length < 1)
            validArr.push({'Lastname': 'Lastname is mandatory.'});
        
        // Address is mandatory
        if (req.body.address.length < 5)
            validArr.push({'Address':'Address must contain minimum 5 characters.'});

        if (validArr.length > 0) {
            console.log(validArr);
            res.json(validArr);
            return;
        }

        passport.authenticate('local-signup', function(err,user){
            if(err)
                res.send(err);
            if(user) {
                // Create a user profile entry                           
                var userprofileArr = [];
                userprofileArr.push({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    address: req.body.address,
                    user: user._id
                })
                userprofile.create(userprofileArr, function (err, userprofileData) {
                    if (err)
                        res.json({'Error' : 'Failed to create userprofile'});
                    //getUsers(res);
                });

                // Generate a random token
                var token = randtoken.generate(32);

                var tokenArr = {
                    token: token,
                    user: user._id
                }
                
                // Add token to usertoken collection
                usertoken.create(tokenArr, function (err, todos) {
                    if (err)
                       res.json({'Error' : 'Failed to create token'});
                });
                res.json({'Message': 'Successfully completed sign-up.'});
            } 
            else
                res.json({'Error': 'This Email is already taken'});
        })(req, res,next);        
    } 
    else {
        var newUser            = new user();

            var dataset = {
            email: req.body.email,
            password :newUser.generateHash(req.body.password)
        }
    }
});

router.post('/login', function (req, res, next){

    passport.authenticate('local-login', function (err, user, info) {

        if (!user) {
            res.json({'LoginMessage': 'No matching user found'});
            return;
        } else {
            req.login(user, function (error) {
                if (error) return next(error);
            });
        }

        // Check a token exist for the userid
        usertoken
        .find({user: user._id})
        .exec(function (err, todos) {
            if (err) { res.send(err); }
            
            // Generate a random token
            var token = randtoken.generate(32);
            // No usertoken found for this user. Lets create one
            if (todos && todos.length === 0){
                var tokenArr = {
                    token: token,
                    user: user._id
                }
                
                // Add token to usertoken collection
                usertoken.create(tokenArr, function (err, todos) {
                    if (err)
                       res.json({'Error' : 'Failed to create token'});
                    res.json({'Bearer token': token});
                });
            } else {
                // Generate expiry date - one month from now
                var d = new Date();
                var targetMonth = d.getMonth() + 1;
                d.setMonth(targetMonth);
                if(d.getMonth() !== targetMonth % 12) {
                    d.setDate(0); // last day of previous month
                }   

                var tokenArr = {
                    token: token,
                    created: new Date(),
                    expiry: d
                }
                // Update usertoken with a newly generated token with new created date and expiry date
                usertoken.updateOne({_id: todos[0]._id}, tokenArr, {upsert: true},function (err, ret) {
                    if (err)
                        res.send(err);
                    res.json({'Bearer token': token});
                });
            }
        });
    })(req, res,next);
});

router.get('/logout', function(req, res) {    
    req.logout();
    usertoken.deleteOne({
        token: req.headers.authorization
    },  function (err, todo) {
            if (err)
              res.send(err);
            res.json({'Message': 'Successfully logged out.'});
        }
    );
});

const awaitHandlerFactory = (middleware) => {
    return async (req, res, next) => {
        try {
            await middleware(req, res, next);
        }catch (err) {
            next(err)
        }
    }
}

router.get('/all', awaitHandlerFactory(async (request, response) => {
    const result = await getUsers();
    response.send(result);
}));


function getUserprofile(userid) {
    let query = userprofile
                .find({ user: user._id})
                .limit(1);
    return query;
}

async function getUsers() {
    var result = await userprofile.find().populate('user', 'email -_id').select('firstname lastname address users');
    return result;
}

module.exports = router;