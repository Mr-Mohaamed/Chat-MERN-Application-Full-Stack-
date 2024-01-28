const mongoose = require('mongoose');

const chatUsersSchema = new mongoose.Schema({
	user1: 
		{
			username: {
				require: true,
				type: mongoose.SchemaTypes.String,
			},
			email: {
				require: true,
				type: mongoose.SchemaTypes.String,
			},
			_id: {
				require: true,
				type: mongoose.SchemaTypes.String,
			},
		},
	
	user2: 
		{
			username: {
				require: true,
				type: mongoose.SchemaTypes.String,
			},
			email: {
				require: true,
				type: mongoose.SchemaTypes.String,
			},
			_id: {
				require: true,
				type: mongoose.SchemaTypes.String,
			},
		},
	
	chat: [
		{
			sender: {
				type: mongoose.SchemaTypes.String,
				require: true,
			},
			receiver: {
				type: mongoose.SchemaTypes.String,
				require: true,
			},
			message: {
				type: mongoose.SchemaTypes.String,
				require: true,
			},
		},
	],
});

module.exports = mongoose.model('chatUsersDB', chatUsersSchema);
