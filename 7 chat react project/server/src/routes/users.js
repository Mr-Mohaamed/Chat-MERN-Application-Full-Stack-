const Router = require('express');
const router = Router();
const asyncHandler = require('express-async-handler');

const { hashPassword, comparePassword } = require('../helpers/bcrypt');

const allUsers = require('../mongo/schemas/User');
const chatSchema = require('../mongo/schemas/chatUsers');

// ................................................ (Get) All Users ................................................
const getUsers = router.get(
	'/auth/',
	asyncHandler(async (req, res) => {
		const users = await allUsers.find();
		res.status(200).json(users);
	})
);

// ................................................ (Post) Register User ................................................

const postUsers = router.post(
	'/auth/register',
	asyncHandler(async (req, res) => {
		const { email, password, username } = req.body;
		if (!email || !password || !username) res.status(400).json('fill inputs');
		const newUser = { email, password: hashPassword(password), username };
		const userDB = await allUsers.findOne({ email });
		if (userDB) res.status(401).json('user already registed');
		const userCreated = await allUsers.create(newUser);
		res.status(201).json(userCreated); // send user created ....... zy el login belzbt w zy el deleted
	})
);

// ................................................ (Post) Login User ................................................

const loginUser = router.post(
	'/auth/login',
	asyncHandler(async (req, res) => {
		const { email, password } = req.body;
		if (!email || !password) res.status(400).send('fill inputs');
		const userDB = await allUsers.findOne({ email });
		if (!userDB) res.status(401).send('user not found');
		const isValid = comparePassword(password, userDB.password);
		if (!isValid) res.status(401).send('wrong password');
		res.status(201).json(userDB); // send user login ....... zy el created bel zbt w zy el deleted
	})
);

// ................................................ (Delete) Delete User ................................................

const deleteUser = router.delete(
	'/auth/delete',
	asyncHandler(async (req, res) => {
		const { id } = req.body;
		const userDB = await allUsers.findByIdAndDelete(id);
		res.status(201).json(userDB); // send user deleted ........ zy el login wel created
	})
);

module.exports = router;

//  *************************************************** THE END (EMAIL LOGIN DELETE ALL USERS)*******************************************************************
//  *************************************************** THE START *******************************************************************

const getAllChats = router.get(
	'/chatusers',
	asyncHandler(async (req, res) => {
		const users = await chatSchema.find();
		res.status(200).json(users);
	})
);

const createNewChat = router.post(
	'/chatusers',
	asyncHandler(async (req, res) => {
		const { user1, user2 } = req.body;
		const chatDB = await chatSchema.findOne({
			$or: [
				{ 'user1._id': user1._id, 'user2._id': user2._id },
				{ 'user1._id': user2._id, 'user2._id': user1._id },
			],
		});
		if (chatDB) {
			res.status(401).json('already registed');
		} else {
			const newUser = await chatSchema.create({ user1, user2 });
			res.status(200).json(newUser);
		}
	})
);

const getAllChatsById = router.get(
	'/chatusers/:id',
	asyncHandler(async (req, res) => {
		const loginUserDataID = req.params.id;
		const allChatsById = await chatSchema.find({
			$or: [{ 'user1._id': loginUserDataID }, { 'user2._id': loginUserDataID }],
		});
		res.status(200).json(allChatsById);
	})
);

const getAllMessagesFromTargetChat = router.get(
	// da el chat lw7do id
	'/chatmessages/:id',
	asyncHandler(async (req, res) => {
		const id = req.params.id;
		const targetChat = await chatSchema.findById(id);
		res.status(200).json(targetChat);
	})
);

const putMessage = router.post(
	// el message ely hnb3tha fel chat
	'/chatmessages/:id/message',
	asyncHandler(async (req, res) => {
		const { message, sender, receiver } = req.body;
		const newMessage = { message, sender, receiver }; // el sender wel receiver hna hyb2o el users kamlen bel _id
		const id = req.params.id;
		const targetChat = await chatSchema.findById(id);
		let valid;
		if (targetChat.user1._id === sender._id) {
			valid = targetChat.user1._id;
		} else {
			valid = targetChat.user2._id;
		}
		if (message !== '') {
			const chatUpdated = await chatSchema.findByIdAndUpdate(id, {
				$push: { chat: newMessage },
			});
			res.status(200).json(newMessage);
		} else {
			res.status(400).json('you should put a message');
		}
	})
);
