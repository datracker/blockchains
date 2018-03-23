const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

User = require('./models/user');

//connect to mongoose
mongoose.connect('mongodb://blockchains:blockchains@ds121589.mlab.com:21589/blockchainsdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//Index page or landing page
app.get('/', function(req, res) {
	res.send("Please use /api/users");
});

//Show all users or
//Show users queried by email
app.get('/api/users', function(req, res) {
	let query = req.query;
	User.getUsers(query, (err, users) => { 
		if(err) {
			throw err;
		}
		res.json(users);
	});
});

//Get a user by their id
app.get('/api/users/:_id', function(req, res) {
	User.getUserById(req.params._id, (err, user) => {
		if(err) {
			throw err;
		}
		res.json(user);
	})
});

app.post('/api/users', [
	check('lastName')
	    .isLength({ min: 1 }).trim().withMessage('Lastname empty.')
	    .isAlpha().withMessage('lastname must be alphabet letters.'),

    check('firstName')
	    .isLength({ min: 1 }).trim().withMessage('Firstname empty.')
	    .isAlpha().withMessage('firstname must be alphabet letters.'),

  	check('password', 'passwords must be at least 5 chars long and contain one number')
    	.isLength({ min: 5 })
    	.matches(/\d/),

    check('email')
    	.isEmail().withMessage('Email is required')
    ],
    (req, res) => {
    	const errors = validationResult(req);
  		if (!errors.isEmpty()) {
    		return res.status(422).json({ errors: errors.mapped() });
  		}

	  	// matchedData creates and returns an object using the validated request
	  	var user = matchedData(req);
	  	User.addUser(user, (err, user) => {
	  		res.json(user);
		});
	}
);

//Update an old user
app.put('/api/users/:_id', [
	check('lastName')
	    .isLength({ min: 1 }).trim().withMessage('Lastname empty.')
	    .isAlpha().withMessage('lastname must be alphabet letters.'),

    check('firstName')
	    .isLength({ min: 1 }).trim().withMessage('Firstname empty.')
	    .isAlpha().withMessage('firstname must be alphabet letters.'),

  	check('password', 'passwords must be at least 5 chars long and contain one number')
    	.isLength({ min: 5 })
    	.matches(/\d/),

    check('email')
    	.isEmail().withMessage('Email is required')

    ], (req, res) => {
		var id = req.params._id;
		const errors = validationResult(req);
  		if (!errors.isEmpty()) {
    		return res.status(422).json({ errors: errors.mapped() });
  		}
		var user = matchedData(req);
		User.updateUser(id, user, {}, (err, user) => { 
			res.json(user);
		});
});

//Delete a user
app.delete('/api/users/:_id', function (req, res) {
	var id = req.params._id;
	User.removeUser(id, (err, user) => {
		if(err) {
			throw err;
		}
		res.json(user);
	});
});

app.listen(3000);
console.log("App is running on port: 3000");



