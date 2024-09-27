import React, { useState, useEffect, useRef } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { fetchData } from "../api/api";
import config from "../config";
import "../styles/ChatWindow.css";

const ChatWindow = ({ customerId, sender }) => {
	const [messagesHistory, setMessagesHistory] = useState([]);
	const [message, setMessage] = useState("");
	const [connection, setConnection] = useState(null);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		const newConnection = new HubConnectionBuilder()
			.withUrl(`${config.apiBaseUrl}/chatHub?customerId=${customerId}`)
			.withAutomaticReconnect()
			.build();

		setConnection(newConnection);
	}, [customerId]);

	useEffect(() => {
		if (connection) {
			connection
				.start()
				.then((result) => {
					console.log("Connected!");

					connection.on("ReceiveMessage", (m) => {
						setMessagesHistory((prevMessages) => [...prevMessages, m]);
					});

					fetchData(`/api/Chat/${customerId}`).then((data) => setMessagesHistory(data));
				})
				.catch((e) => console.log("Connection failed:", e));
		}
	}, [connection, customerId]);

	useEffect(() => {
		// Scroll to the bottom when messagesHistory changes
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messagesHistory]);

	const sendMessage = async () => {
		if (connection._connectionStarted) {
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
