var userroutes = require('./user.routes.js');
var notesroutes = require('./notes.routes.js');
const userprofile = require('../models/userprofile');
const usertoken = require('../models/usertoken');
const mongoose = require('mongoose');

var router = require('express').Router();

// apply the routes to our application  
module.exports = function(app,passport){	

 	app.use("/",router);
	router.use('/user', isAuthenticated, userroutes);
	// router.use('/notes', async function (req,res,next) {
	// 	if (req.headers.userdata === '') {
	// 		res.json({'Message': 'Authentication failed'});
	// 		return;
	// 	}
	// 	var userprofileResult = await userprofile.find({user: req.headers.userdata});
	// 	if (userprofileResult && userprofileResult.length === 0) { res.json({'Message': 'Authentication failed'}); return;}
	// 	userprofileResult = userprofileResult[0];
	// 	req.headers.userprofile = userprofileResult._id;
	// 	return next();
	// }, 
	// notesroutes);
	router.use('/notes', isLoggedIn, notesroutes);
	router.get('/*', function(req, res) {
	    res.json({ 'msg': 'message'});
	});
	router.post('/*', function(req, res) {
	});

}
// route middleware to inject userprofile
async function isLoggedIn(req, res, next) {

	if (req.headers.authorization === 'mystaticauthheader')
		return next();

	if (req.headers.userdata === '') {
		res.json({'Message': 'Authentication failed'});
		return;
	}
	var userprofileResult = await userprofile.find({user: req.headers.userdata});
	if (userprofileResult && userprofileResult.length === 0) { res.json({'Message': 'Authentication failed'}); return;}
	userprofileResult = userprofileResult[0];
	req.headers.userprofile = userprofileResult._id;
	return next();
}
// Route middleware to authenticate and inject user
async function isAuthenticated(req, res, next) {
	if (req.headers.authorization === 'mystaticauthheader')
		return next();
	if (req.headers.authorization.substring(0, 6) === 'Bearer')
		req.headers.authorization = req.headers.authorization.substring(7);
	const tokenResult = await usertoken.find({token: req.headers.authorization});
	if (tokenResult && tokenResult.length === 0) { res.json({'Message': 'Authentication failed11'}); return;}
	req.headers['user'] = tokenResult[0].user;
	return next();
}