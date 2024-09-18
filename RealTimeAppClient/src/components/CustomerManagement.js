import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatWindow from "./ChatWindow";
import "../styles/CustomerManagement.css";
import { fetchData, postData } from "../api/api";

const CustomerManagement = () => {
	const [customers, setCustomers] = useState([]);
	const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });
	const [activeChat, setActiveChat] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchCustomers();
	}, []);

	const fetchCustomers = async () => {
		try {
			const response = await fetchData("/api/Customers");
			setCustomers(response);
		} catch (error) {
			console.error("Error fetching customers: ", error);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setNewCustomer({ ...newCustomer, [name]: value });
	};

	const handleAddCustomer = async (e) => {
		e.preventDefault();
		try {
			await postData("/api/Customers", newCustomer);
			fetchCustomers();
			setNewCustomer({ name: "", email: "", phone: "" });
		} catch (error) {
			console.error("Error adding customer: ", error);
		}
	};

	const handleCustomerClick = (customerId) => {
		navigate(`/customer-orders/${customerId}`);
	};

	const handleChatInitiation = (customerId, event) => {
		event.stopPropagation(); // Prevent the click event from propagating to the parent div
		setActiveChat(customerId);
	};

	const handleCloseChat = () => {
		setActiveChat(null);
	};

	return (
		<div className={`customer-management-container ${activeChat ? "chat-open" : ""}`}>
			<div className="customer-management">
				<h2>Customer Management</h2>
				<form onSubmit={handleAddCustomer} className="customer-form">
					<input
						type="text"
						name="name"
						value={newCustomer.name}
						onChange={handleInputChange}
						placeholder="Name"
					/>
					<input
						type="email"
						name="email"
						value={newCustomer.email}
						onChange={handleInputChange}
						placeholder="Email"
					/>
					<input
						type="tel"
						name="phone"
						value={newCustomer.phone}
						onChange={handleInputChange}
						placeholder="Phone"
					/>
					<button type="submit">Add Customer</button>
				</form>
				<div className="customer-list">
					{customers.map((customer) => (
						<div
							key={customer.id}
							className="customer-item"
							onClick={() => handleCustomerClick(customer.id)}
						>
							<strong>ID: </strong> {customer.id} <br />
							<strong>Name: </strong>
							{customer.name}
							<br />
							<strong>Email: </strong>
							{customer.email}
							<br />
							<strong>Phone: </strong>
							{customer.phone}
							<br />
							<button onClick={(event) => handleChatInitiation(customer.id, event)}>
								Chat
							</button>
						</div>
					))}
				</div>
			</div>
			<div className={`chat-window-container ${activeChat ? "open" : ""}`}>
				{activeChat && (
					<div className="chat-window">
						<button className="close-button" onClick={handleCloseChat}>
							✖
						</button>
						<h3>Chat with Customer {activeChat}</h3>
						<ChatWindow customerId={activeChat} sender="Employee" />
					</div>
				)}
			</div>
		</div>
	);
};

export default CustomerManagement;
