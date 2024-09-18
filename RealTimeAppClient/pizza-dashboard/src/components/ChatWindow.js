import React, { useState, useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { fetchData } from "../api/api";
import config from "../config";

const ChatWindow = ({ customerId, sender }) => {
	const [messagesHistory, setMessagesHistory] = useState([]);
	const [message, setMessage] = useState("");
	const [connection, setConnection] = useState(null);

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

	const sendMessage = async () => {
		if (connection._connectionStarted) {
			await connection.send("SendMessage", customerId, sender, message);
			setMessage("");
		} else {
			alert("No connection to server yet.");
		}
	};

	return (
		<div>
			<div>
				{messagesHistory.map((msg, index) => (
					<div key={index}>
						<strong>{msg.sender}: </strong> {msg.message}
					</div>
				))}
			</div>
			<input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
			<button onClick={sendMessage}>Send</button>
		</div>
	);
};

export default ChatWindow;
