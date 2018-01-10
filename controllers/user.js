var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require('../models/user');

router.get('/', function(req, res){
	res.render('index');
});

router.get('/signup', function (req, res){
	msgError = req.flash('msgError')
	res.render('signup', {message: msgError });
});

router.post('/signup', passport.authenticate('local.signup', {
	successRedirect: '/profile',
	failureRedirect: '/signup',
	failureFlash: true
}));

router.get('/login', function (req, res){
	login_error = req.flash('loginError')
	password_error = req.flash('passwordError')
	res.render('login', {loginError: login_error, passwordError: password_error});
});

router.post('/login', passport.authenticate('local.login', {
	successRedirect: '/profile',
	failureRedirect: '/login',
	failureFlash: true
}));


router.get('/profile', isLoggedIn, function (req, res){
	console.log(req.user);
	res.render('profile', {user: req.user});
});

router.get('/logout', function (req, res){
	req.logout();
	res.redirect('/');
});

router.get('/newuser', function (req, res){
	res.redirect('/signup');
});

router.get('/exisitingUser', function (req, res){
	res.redirect('/login');
});

router.get('/increase', isLoggedIn, function (req, res, next){
	console.log(req.user);
	res.render('increase', {user: req.user});
});

router.post('/increaseBal', function (req, res, next){
	var _id = req.body._id;
	//var oldBal;
	var newBal = parseFloat(req.body.value2);

	newBal = newBal + req.user.balance;


	var historyEntry = {
		currBal : newBal,
		timestamp : new Date(),
	}

	User.updateOne(
		{
			"_id": _id 
		}, 
		{
			$set: {'balance': newBal},
			$push: {'history': historyEntry}
		},
		function(err, result){
		console.log('balance updated');

		if(err) {
			console.error(err);
		}
	});
});


router.get('/decrease', isLoggedIn, function (req, res, next){
	console.log(req.user);
	res.render('decrease', {user: req.user});
});

router.post('/decreaseBal', function (req, res, next){
	var _id = req.body._id;
	//var oldBal;
	var newBal = parseFloat(req.body.value2);


	newBal = req.user.balance - newBal;


	var historyEntry = {
		currBal : newBal,
		timestamp : new Date(),
	}

	User.updateOne(
		{
			"_id": _id 
		}, 
		{
			$set: {'balance': newBal},
			$push: {'history': historyEntry}
		},
/*		{
			$push: {<'history'>: 'currBal': newBal, 'timestamp': currDate},
			//$push:{'history': newBal, currDate},
		},
*/
		function(err, result){
		console.log('balance updated');

		if(err) {
			console.error(err);
		}
	});
});

router.get('/edit', isLoggedIn, function (req, res, next){
	console.log(req.user);
	res.render('edit', {user: req.user});
});

router.post('/editUser', function (req, res, next){
	var _id = req.body._id;
	//var oldBal;
	//var newBal = parseFloat(req.body.value2);

	var newTarget = parseFloat(req.body.target);
	var newFullName = String(req.body.fullname);
	var newEmail = String(req.body.email);

	//newBal = req.user.balance - newBal;


	User.updateOne(
		{
			"_id": _id 
		}, 
		{
			$set: {'target': newTarget, 'fullname': newFullName, 'email': newEmail}
		},
/*		{
			$push: {'history': newBal, timestamp}
		},*/

		function(err, result){
		console.log('profile updated');

		if(err) {
			console.error(err);
		}
	});
});

router.get('/history', isLoggedIn, function (req, res, next){
	console.log(req.user);
	res.render('history', {user: req.user});
});

router.get('/charts', isLoggedIn, function (req, res, next){
	console.log(req.user);
	res.render('charts', {user: req.user});
});


module.exports = router;

function isLoggedIn(req, res, next){
	if (req.isAuthenticated()) {
		return next();
	}

	res.redirect('/login');
};