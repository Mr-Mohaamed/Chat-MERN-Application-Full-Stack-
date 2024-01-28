const mongoose = require('mongoose');

mongoose
	.connect(
		'mongodb+srv://admin:admin@mycontacts.1slr8rv.mongodb.net/mycontacts?retryWrites=true&w=majority'
	)
	.then(() => {
		console.log('connected to DB');
	})
	.catch((err) => {
		console.log(err);
	});

