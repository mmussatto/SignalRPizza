import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CustomerManagement.css";

const CustomerManagement = () => {
	const [customers, setCustomers] = useState([]);
	const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });
	const navigate = useNavigate();

	useEffect(() => {
		fetchCustomers();
	}, []);

	const fetchCustomers = async () => {
		try {
			const response = await axios.get("https://localhost:7018/api/Customers");
			setCustomers(response.data);
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
			await axios.post("https://localhost:7018/api/Customers", newCustomer);
			fetchCustomers();
			setNewCustomer({ name: "", email: "", phone: "" });
		} catch (error) {
			console.error("Error adding customer: ", error);
		}
	};

	const handleCustomerClick = (customerId) => {
		navigate(`/customer-orders/${customerId}`);
	};

	return (
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
					</div>
				))}
			</div>
		</div>
	);
};

export default CustomerManagement;
