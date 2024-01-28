const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email: {
		require: true,
		type: mongoose.SchemaTypes.String,
		unique: true,
	},
	password: {
		require: true,
		type: mongoose.SchemaTypes.String,
	},
	username: {
		require: true,
		type: mongoose.SchemaTypes.String,
		unique: true,
	},
	createdAt: {
		require: true,
		type: mongoose.SchemaTypes.Date,
		default: new Date(),
	},
});

module.exports = mongoose.model('usersDB', UserSchema);
