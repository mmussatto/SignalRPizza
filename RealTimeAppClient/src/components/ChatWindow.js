import React, { useState, useEffect, useRef } from "react";
import { getChatHubConnection } from "../api/chatHubConnection";
import { fetchData } from "../api/api";
import "../styles/ChatWindow.css";

const ChatWindow = ({ customerId, sender }) => {
	const [messagesHistory, setMessagesHistory] = useState([]);
	const [message, setMessage] = useState("");
	const [connection, setConnection] = useState(null);
	const [previousCustomerId, setPreviousCustomerId] = useState(null);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		const connection = getChatHubConnection();
		setConnection(connection);

		if (connection.state === "Disconnected") {
			connection
				.start()
				.then(() => {
					console.log("Connected to SignalR Chat Hub!");

					connection.on("ReceiveMessage", (m) => {
						setMessagesHistory((prevMessages) => [...prevMessages, m]);
						console.log("Message received: ", m);
					});

					joinGroup(connection, customerId);
				})
				.catch((e) => console.log("Connection failed: ", e));
		}

		connection.onreconnected(() => {
			console.log("Reconnected to SignalR Chat Hub!");
			joinGroup(connection, customerId);
		});

		// Fetch chat history
		fetchData(`/api/Chat/${customerId}`).then((data) => setMessagesHistory(data));

		return () => {
			connection.off("ReceiveMessage");
		};
	}, [customerId]);

	useEffect(() => {
		// Scroll to the bottom when messagesHistory changes
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messagesHistory]);

	const joinGroup = (connection, customerId) => {
		if (previousCustomerId) {
			connection
				.invoke("LeaveGroup", previousCustomerId)
				.then(() => {
					console.log("Left group for cusomer: ", previousCustomerId);
				})
				.catch((e) => console.log("Failed to leave group:", e));
		}

		connection
			.invoke("JoinGroup", customerId)
			.then(() => {
				console.log("Joined group for customer: ", customerId);
				setPreviousCustomerId(customerId);
			})
			.catch((e) => console.log("Failed to join group:", e));
	};

	const sendMessage = async () => {
		if (connection && connection.state === "Connected") {
			await connection.send("SendMessage", customerId, sender, message);
			setMessage("");
		} else {
			alert("No connection to server yet.");
		}
	};

	return (
		<div className="chat-window">
			<div className="messages-container">
				{messagesHistory.map((msg, index) => (
					<div key={index}>
						<strong>{msg.sender}: </strong> {msg.message}
					</div>
				))}
				<div ref={messagesEndRef} /> {/* Add this div to mark the end of messages */}
			</div>
			<div className="input-container">
				<input
					type="text"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Type a message..."
				/>
				<button onClick={sendMessage}>Send</button>
			</div>
		</div>
	);
};

export default ChatWindow;
