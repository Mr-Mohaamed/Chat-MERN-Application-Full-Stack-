import { useState } from 'react';
import './App.css';

const API_BASE = 'http://localhost:5001/users';

function App() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');

	const [loginUserData, setLoginUserData] = useState({});
	const [user2, setUser2] = useState({});

	const [currentChatData, setCurrentChatData] = useState({});
	const [currentChatMessages, setCurrentChatMessages] = useState([]);

	const [allRegistedData, setAllRegistedData] = useState([]);

	const [allChats, setAllChats] = useState([]);

	const [chatId, setChatId] = useState('');
	const [chat, setChat] = useState('');
	const [allMessages, setAllMessages] = useState([]);
	const [message, setMessage] = useState('');

	const getAllUsers = async () => {
		const fetchData = await fetch(API_BASE + '/auth').then((res) => res.json());
		setAllRegistedData(fetchData);
		console.log(fetchData);
	};

	// GET ALL USERS COMPLETED

	const postUser = async () => {
		const newUser = JSON.stringify({ username, password, email });
		console.log(newUser);
		const fetchData = await fetch(API_BASE + '/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: newUser,
		})
			.then((res) => res.json())
			.then((data) => {
				setLoginUserData(data);
				console.log(data);
			})
			.catch((err) => console.log(err));
	};

	// Completed Registed User

	const loginUser = async () => {
		const newUser = JSON.stringify({ password, email });
		// console.log(newUser);
		const fetchData = await fetch(API_BASE + '/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: newUser,
		})
			.then((res) => res.json())
			.then((data) => {
				setLoginUserData(data);
				console.log(data);
				setAllChats([]);
			})
			.catch((err) => console.log(err));
	};

	// Completed Login User

	const deleteUser = async (id) => {
		const fetchData = await fetch(API_BASE + '/auth/delete/', {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id }),
		})
			.then((res) => res.json())
			.then((e) => console.log('deleted'));
		setAllRegistedData((prev) =>
			prev.filter((e) => {
				return e._id !== id;
			})
		);
	};

	// Completed Delete User

	// ######################## EMAIL REGION END ###############################

	const createChat = async (userData) => {
		setUser2(userData);
		const chatData = await fetch(API_BASE + '/chatusers', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				user1: loginUserData,
				user2: userData,
			}),
		})
			.then((res) => res.json())
			.then((chatData) => {
				setCurrentChatData(chatData);
				console.log(chatData);
			});
	};
	const getAllChats = async () => {
		// const data = await fetch(API_BASE + '/chatusers/' + id)
		const data = await fetch(API_BASE + '/chatusers/' + loginUserData._id)
			.then((res) => res.json())
			.then((e) => {
				setAllChats(e);
				console.log(e);
			});
	};
	const getTargetChat = async (id) => {
		// const data = await fetch(API_BASE + '/chatusers/' + id)
		const data = await fetch(API_BASE + '/chatmessages/' + id)
			.then((res) => res.json())
			.then((chatData) => {
				setCurrentChatData(chatData);
				setCurrentChatMessages(chatData.chat);
				console.log(chatData);

				// setUser2()
				if (chatData.user1._id === loginUserData._id) {
					setUser2(chatData.user2);
				} else {
					setUser2(chatData.user1);
				}
			})
			.then(() => {
				// console.log(user2);
			});
	};
	const sendMessage = async () => {
		const data = await fetch(
			API_BASE + '/chatmessages/' + currentChatData._id + '/message',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message,
					sender: loginUserData._id,
					receiver: user2._id,
				}),
			}
		)
			.then((e) => e.json())
			.then((e) => {
				if (e === 'you should put a message') {
				} else {
					setCurrentChatMessages((prev) => [...prev, e]);
					console.log(e);
				}
			});
	};

	return (
		<div className="page">
			<nav>
				<ul>
					<li>
						<a href="/home">Home</a>
					</li>
					<li>
						<a href="/login">Login</a>
					</li>
					<li>
						<a href="/register">Register</a>
					</li>
				</ul>
			</nav>

			<div className="container">
				<div className="form sign-up">
					<h2>Sign Up</h2>
					<input
						type="text"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Put Email Here"
					/>
					<input
						type="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Put Password Here"
					/>
					<input
						type="text"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Put Username Here"
					/>
					<span onClick={() => postUser()} className="submit-btn">
						Create
					</span>
				</div>

				{/* ///////////////////////////////////////////// End of Register ///////////////////////////////////////////// */}

				<div className="form login">
					<h2>Login</h2>
					<input
						type="text"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Put Email Here"
					/>
					<input
						type="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Put Password Here"
					/>
					<span onClick={() => loginUser()} className="submit-btn">
						Login
					</span>
				</div>

				{/* ///////////////////////////////////////////// End of Login ///////////////////////////////////////////// */}
				{/* ///////////////////////////////////////////// Start of Get All Users Registed ///////////////////////////////////////////// */}
				<span onClick={() => getAllUsers()} className="submit-btn">
					Get All Users
				</span>
				<div className="data">
					{allRegistedData && (
						<div className="mydata">
							{allRegistedData
								.filter((e) => {
									return e._id !== loginUserData._id;
								})
								.map((userData) => (
									<div className="registed-users">
										<div
											onClick={() => {
												setUser2(userData);
											}}>
											{userData.username}
										</div>
										<div onClick={() => createChat(userData)}>create</div>
										<div onClick={() => deleteUser(userData._id)}>Delete</div>
									</div>
								))}
							{user2.username}
							{loginUserData.username}
						</div>
					)}
				</div>
				{/* ///////////////////////////////////////////// END of Get All Users Registed ///////////////////////////////////////////// */}
				{/* ///////////////////////////////////////////// Start of Get All Chats ///////////////////////////////////////////// */}

				<div className="chat">
					<div className="users">
						<p onClick={() => getAllChats(loginUserData._id)}>get all chats </p>
					</div>
					<div className="chat-box">
						{allChats &&
							allChats.map((singleChat) => (
								<div
									className="chat-user"
									onClick={() => {
										// setCurrentChatData(singleChat);
										// setCurrentChatMessages(singleChat.chat);
										getTargetChat(singleChat._id);
									}}>
									{singleChat.user1._id === loginUserData._id ? (
										<div>{singleChat.user2.username} </div>
									) : (
										<div>{singleChat.user1.username} </div>
									)}
								</div>
							))}
						{chatId}
					</div>
				</div>
				{/* ///////////////////////////////////////////// End of Get All Chats ///////////////////////////////////////////// */}
				{/* ///////////////////////////////////////////// Start of Get All Messages ///////////////////////////////////////////// */}

				{currentChatMessages && (
					<div>
						<h2>Chat</h2>
						<div className="messages">
							{currentChatMessages.map((messageData) => (
								<div
									className={
										messageData.sender === loginUserData._id
											? 'sender message'
											: 'receiver message'
									}>
									{messageData.message}
								</div>
							))}
							<div className="write-message">
								<input
									type="text"
									name="message"
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									placeholder="write your message"
								/>
								<span
									onClick={() => sendMessage()}
									className="submit-btn btn-flex">
									Send
								</span>
							</div>
						</div>
					</div>
				)}

				{/* ///////////////////////////////////////////// End of Get All Messages ///////////////////////////////////////////// */}
				{/* ///////////////////////////////////////////// Start of Put New Message ///////////////////////////////////////////// */}
			</div>
		</div>
	);
}

export default App;
