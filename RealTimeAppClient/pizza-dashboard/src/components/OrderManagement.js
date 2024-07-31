import React, { useState } from "react";
import axios from "axios";

const OrderManagement = () => {
	const [pizzaName, setPizzaName] = useState("");
	const [customerName, setCustomerName] = useState("");
	const [orderId, setOrderId] = useState("");

	const handleCreateOrder = async () => {
		try {
			const response = await axios.post("https://localhost:7018/api/Orders", {
				pizzaName,
				customerName,
			});
			alert(`Order created with ID: ${response.data.id}`);
		} catch (error) {
			console.error("Error creating order:", error);
			alert("Failed to create order");
		}
	};

	const handleMarkAsDone = async () => {
		try {
			await axios.put(`https://localhost:7018/api/Orders/advance/${orderId}`);
			alert(`Order ${orderId} marked as done`);
		} catch (error) {
			console.error("Error marking order as done:", error);
			alert("Failed to mark order as done");
		}
	};

	return (
		<div>
			<h2>Create Order</h2>
			<input
				type="text"
				placeholder="Pizza Name"
				value={pizzaName}
				onChange={(e) => setPizzaName(e.target.value)}
			/>
			<input
				type="text"
				placeholder="Customer Name"
				value={customerName}
				onChange={(e) => setCustomerName(e.target.value)}
			/>
			<button onClick={handleCreateOrder}>Create Order</button>

			<h2>Mark Order as Done</h2>
			<input
				type="text"
				placeholder="Order ID"
				value={orderId}
				onChange={(e) => setOrderId(e.target.value)}
			/>
			<button onClick={handleMarkAsDone}>Advance</button>
		</div>
	);
};

export default OrderManagement;
