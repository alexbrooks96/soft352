var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

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

userSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);