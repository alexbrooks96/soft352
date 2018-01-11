//Dependencies
var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require('../models/user');

//renders the view for index/homepage
router.get('/', function(req, res){
	res.render('index');
});

//renders signup page - Also allows message to flash if user email already exists.
router.get('/signup', function (req, res){
	msgError = req.flash('msgError')
	res.render('signup', {message: msgError });
});

//when user tries to sign up, if successful they get redirected to profile page, if not they stay on the signup page.
router.post('/signup', passport.authenticate('local.signup', {
	successRedirect: '/profile',
	failureRedirect: '/signup',
	failureFlash: true
}));

//renders login page, flash messages if user email or password doesn't match.
router.get('/login', function (req, res){
	login_error = req.flash('loginError')
	password_error = req.flash('passwordError')
	res.render('login', {loginError: login_error, passwordError: password_error});
});

//If user account exists, username and passwords match they redirect to profile page, if not stay on login.
router.post('/login', passport.authenticate('local.login', {
	successRedirect: '/profile',
	failureRedirect: '/login',
	failureFlash: true
}));

//renders profile page, checks to see if the user is logged in function, sends the user object to the view.
router.get('/profile', isLoggedIn, function (req, res){
	console.log(req.user);
	res.render('profile', {user: req.user});
});

//logs user out, redirects to homepage., sessions is cleared
router.get('/logout', function (req, res){
	req.logout();
	res.redirect('/');
});

//redirects url to signup page
router.get('/newuser', function (req, res){
	res.redirect('/signup');
});

//redirects url to login page
router.get('/exisitingUser', function (req, res){
	res.redirect('/login');
});

//renders increase balance page
router.get('/increase', isLoggedIn, function (req, res, next){
	console.log(req.user);
	res.render('increase', {user: req.user});
});

//post to the server when user increases the balance. variables declared and objects to push to the relevant arrays.
router.post('/increaseBal', function (req, res, next){
	var _id = req.body._id;
	var newBal = parseFloat(req.body.value2);
	var incAmount = newBal;
	var incDesc = req.body.incDesc;

	newBal = newBal + req.user.balance;


	var historyEntry = {
		currBal : newBal,
		timestamp : new Date(),
	}

	var incArrEntry = {
		amountInc : incAmount,
		description : incDesc,
		timestamp : new Date(),
	}

//sets the new balance with how much the user defined it should increase by, also pushes the objects to the correct arrays.
	User.updateOne(
		{
			"_id": _id 
		}, 
		{
			$set: {'balance': newBal},
			$push: {'history': historyEntry, 'increaseArray': incArrEntry},
			//$push: {'incArr': incArrEntry},
		},
		function(err, result){
		console.log('balance updated');
		res.redirect('/profile');

		if(err) {
			console.error(err);
		}
	});
});

//renders decrease balance page
router.get('/decrease', isLoggedIn, function (req, res, next){
	console.log(req.user);
	res.render('decrease', {user: req.user});
});

//post to the server when user decreases the balance. variables declared and objects to push to the relevant arrays.
router.post('/decreaseBal', function (req, res, next){
	var _id = req.body._id;
	//var oldBal;
	var newBal = parseFloat(req.body.value2);
	var decAmount = newBal;
	var decDesc = req.body.decDesc;

	newBal = req.user.balance - newBal;


	var historyEntry = {
		currBal : newBal,
		timestamp : new Date(),
	}

	var decArrEntry = {
		amountDec : decAmount,
		description : decDesc,
		timestamp : new Date(),
	}

	//sets the new balance with how much the user defined it should increase by, also pushes the objects to the correct arrays.
	User.updateOne(
		{
			"_id": _id 
		}, 
		{
			$set: {'balance': newBal},
			$push: {'history': historyEntry, 'decreaseArray': decArrEntry},
		},
/*		{
			$push: {<'history'>: 'currBal': newBal, 'timestamp': currDate},
			//$push:{'history': newBal, currDate},
		},
*/
		function(err, result){
		console.log('balance updated');
		res.redirect('/profile');

		if(err) {
			console.error(err);
		}
	});
});

//renders edit user page, checks user logged in
router.get('/edit', isLoggedIn, function (req, res, next){
	console.log(req.user);
	res.render('edit', {user: req.user});
});

router.post('/editUser', function (req, res, next){
	var _id = req.body._id;

	var newTarget = parseFloat(req.body.target);
	var newFullName = String(req.body.fullname);
	var newEmail = String(req.body.email);

	//Changes the values for each of the below to what is in the edit input boxes. Updates and saves user details.
	User.updateOne(
		{
			"_id": _id 
		}, 
		{
			$set: {'target': newTarget, 'fullname': newFullName, 'email': newEmail}
		},

		function(err, result){
		console.log('profile updated');
		res.redirect('/profile');

		if(err) {
			console.error(err);
		}
	});
});

//renders history page, checks to see if user logged in
router.get('/history', isLoggedIn, function (req, res, next){
	console.log(req.user);
	res.render('history', {user: req.user});
});

//Renders chart page
router.get('/charts', isLoggedIn, function (req, res, next){
	console.log(req.user);
	res.render('charts', {user: req.user});
});

//renders income/outcome report page
router.get('/inoutcome', isLoggedIn, function (req, res, next){
	console.log(req.user);
	res.render('inoutcome', {user: req.user});
});



module.exports = router;

//Function to see if user is logged in using the isAuthenticated method, if they aren't they get redirected to login page.
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
};