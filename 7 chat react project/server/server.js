const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

require('./src/mongo/connectDB');

app.use(express.json());
app.use(cookieParser());

const cors = require('cors');
app.use(cors());

const session = require('express-session');
const MongoStore = require('connect-mongo');
app.use(
	session({
		secret: 'KJAHSDKJHAWKJDHAWHDKJAWD',
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({
			mongoUrl:
				'mongodb+srv://admin:admin@mycontacts.1slr8rv.mongodb.net/mycontacts?retryWrites=true&w=majority',
		}),
	})
);

const PORT = 5001;
app.listen(PORT);

const userRoute = require('./src/routes/users');
app.use('/users', userRoute);
