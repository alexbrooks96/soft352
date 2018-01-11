var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');


//For storing the user data in the session
passport.serializeUser(function(user, done){
	done(null, user.id);
});


//For removing user data in the session
passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});


//Using passport to sign a user up for an account. Firstly checks to see if the user already exists (by email)
//If it is a unique email address, the other fields on the form are used to populate the userSchema, then save.

passport.use('local.signup', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){

	User.findOne({'email': email}, function(err, user){
		if (err) {
			return done(err);
		}
		if (user) {
			req.flash('msgError', 'User already exists')
			return done(null, false);
		}

		var newUser = new User();
		newUser.fullname = req.body.name;
		newUser.email = req.body.email;
		newUser.password = newUser.encryptPassword(req.body.password);
		newUser.balance = req.body.balance;
		newUser.target = req.body.target;

		newUser.save(function(err){
			if (err) {
				return done(err);
			}

			return done(null, newUser);
		})
	})
}));


//Using passport to log a user into the system. Checks whether the username, in this case the email address exists.
//Followed by checking that the password matches the password assigned to the user account based on the username/email address.

passport.use('local.login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){

	User.findOne({'email': email}, function(err, user){
		if (err) {
			return done(err);
		}
		if (!user) {
			req.flash('loginError', 'User email does not exist.')
			return done(null, false);
		}

		if (!user.validPassword(req.body.password)){
			req.flash('passwordError', 'User password is not correct.')
			return done(null, false);
		};

		return done(null, user); 
	})
}));