var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//User schema
var userSchema = mongoose.Schema({
	fullname: {type: String},
	email: {type:String},
	password: {type:String},
	balance: {type:Number},
	target: {type:Number},
	history: [
		{
			currBal: Number,
			timestamp: Date,
		}
	],
	increaseArray: [
		{
			amountInc: Number,
			description: String,
			timestamp: Date,

		}
	],

	decreaseArray: [
		{
			amountDec: Number,
			description: String,
			timestamp: Date,

		}
	],

});


//uses passport to hash password for security. 
userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

//Checks for valid password, against what is stored for the user in the db
userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

//exports the user schema
module.exports = mongoose.model('User', userSchema);