//models/user.js
'use strict';

//import dependency
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var encrypt = require('./helperfunctions');

//create new instance of the mongoose.schema
var userSchema = new Schema({
  lastName: {
  	type: String,
  	required: true
  },
  firstName: {
  	type: String,
  	required: true
  },
  email: {
  	type: String,
  	required: true
  },
  password: {
  	type: String,
  	required: true
  }
});

//Compiling the Schema into Models and make this accessible from other scripts
const User = module.exports = mongoose.model('User', userSchema);

// Get all Users
// Get user with email
module.exports.getUsers = (query, callback) => {
	let email = {"email": query.email};
	let limit = parseInt(query.limit); //zero and negative values also work in mongoose
	let orderBy = query.sort;
	let orderchrono = 1;
	if (query.asc === 'yes') { orderchrono = 1; }
	if(query.desc === 'yes') { orderchrono = -1; }
	let order = {};
	order[orderBy] = orderchrono;
	if (email["email"]) { User.find(email, callback); }
	else User
		.find()
		.sort(order)
		.limit(limit)
		.exec(callback);
}

// Get User by Id
module.exports.getUserById = (id, callback) => {
	User.findById(id, callback);
}

// Add User
module.exports.addUser = (user, callback) => {
	var newUser = {
		lastName: user.lastName,
		firstName: user.firstName,
		email: user.email,
		password: encrypt.saltHashPassword(user.password)
	}
	User.create(newUser, callback);
}

// Update User
module.exports.updateUser = (id, user, options, callback) => {
	var query = {_id: id};
	var update = {
		lastName: user.lastName,
		firstName: user.firstName,
		email: user.email,
		password: encrypt.saltHashPassword(user.password)
	}
	User.findOneAndUpdate(query, update, options, callback);
}

// Delete User
module.exports.removeUser = (id, callback) => {
	var query = {_id: id};
	User.remove(query, callback);
}
