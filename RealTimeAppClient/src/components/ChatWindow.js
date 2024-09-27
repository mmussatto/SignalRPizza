import React, { useState, useEffect, useRef } from "react";
import { getChatHubConnection, waitForConnection } from "../api/chatHubConnection";
import { fetchData } from "../api/api";
import "../styles/ChatWindow.css";

const ChatWindow = ({ customerId, sender }) => {
	const [messagesHistory, setMessagesHistory] = useState([]);
	const [message, setMessage] = useState("");
	const [previousCustomerId, setPreviousCustomerId] = useState(null);
	const connection = useRef(null);
	const messagesEndRef = useRef(null);

	useEffect(() => {
		connection.current = getChatHubConnection();

		if (connection.current.state === "Disconnected") {
			connection.current
				.start()
				.then(() => {
					console.log("Connected to SignalR Chat Hub!");

					connection.current.on("ReceiveMessage", (m) => {
						setMessagesHistory((prevMessages) => [...prevMessages, m]);
						console.log("Message received: ", m);
					});
				})
				.catch((e) => console.log("Connection failed: ", e));
		}

		connection.current.onreconnected(() => {
			console.log("Reconnected to SignalR Chat Hub!");
		});

		return () => {
			connection.current.off("ReceiveMessage");
		};
	}, []);

	useEffect(() => {
		const switchGroup = async () => {
			if (previousCustomerId !== customerId) {
				try {
					await waitForConnection(connection.current);
					if (previousCustomerId && connection.current) {
						await connection.current
							.invoke("LeaveGroup", previousCustomerId)
							.then(() => {
								console.log("Left group for cusomer: ", previousCustomerId);
							})
							.catch((e) => console.log("Failed to leave group:", e));
					}

					if (customerId && connection.current) {
						await connection.current
							.invoke("JoinGroup", customerId)
							.then(() => {
								console.log("Joined group for customer: ", customerId);
								setPreviousCustomerId(customerId);
							})
							.catch((e) => console.log("Failed to join group:", e));
					}
				} catch (error) {
					console.error("Error switching groups: ", error);
				}
			}
		};

		switchGroup();
	}, [customerId, previousCustomerId]);

	useEffect(() => {
		if (customerId) {
			// Fetch chat history
			fetchData(`/api/Chat/${customerId}`).then((data) => setMessagesHistory(data));
		}
	}, [customerId]);

	useEffect(() => {
		// Scroll to the bottom when messagesHistory changes
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messagesHistory]);

	const sendMessage = async () => {
		if (connection.current && connection.current.state === "Connected") {
			await connection.current.send("SendMessage", customerId, sender, message);
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
