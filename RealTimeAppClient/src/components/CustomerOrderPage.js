import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "../styles/CustomerOrderPage.css";
import { useParams } from "react-router-dom";
import { fetchData, postData } from "../api/api";
import config from "../config";
import ChatWindow from "./ChatWindow";

const CustomerOrderPage = () => {
	const { customerId: customerIdString } = useParams();
	const customerId = parseInt(customerIdString, 10);
	const [orders, setOrders] = useState([]);
	const [pizzaName, setPizzaName] = useState("");
	const [showCompleted, setShowCompleted] = useState(false);
	const [isChatOpen, setIsChatOpen] = useState(false);

	useEffect(() => {
		if (isNaN(customerId)) return;

		fetchData(`/api/Orders?customerId=${customerId}`).then((data) => setOrders(data));

		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${config.apiBaseUrl}/dataHub`)
			.build();

		connection.on("ReceiveOrder", (order) => {
			if (order.customerId === customerId) {
				setOrders((prevOrders) => [...prevOrders, order]);
			}
		});

		connection.on("UpdateOrder", (updatedOrder) => {
			if (updatedOrder.customerId === customerId) {
				setOrders((prevOrders) =>
					prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
				);
			}
		});

		connection.start().catch((err) => console.error(err.toString()));

		return () => {
			connection.stop();
		};
	}, [customerId]);

	const handleCreateOrder = async () => {
		try {
			await postData("/api/Orders", {
				pizzaName,
				customerId,
				status: "Received",
			});
			alert("Order created successfully");
		} catch (error) {
			console.error("Error creating order:", error);
			alert("Failed to create order");
		}
	};

	const sortedOrders = orders.sort((a, b) => {
		const statusOrder = ["Received", "Preparing", "Baking", "ReadyForPickup", "Completed"];
		return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
	});
	const inProgressOrders = sortedOrders.filter((order) => order.status !== "Completed");
	const doneOrders = orders.filter((order) => order.status === "Completed");

	const toggleChatWindow = () => {
		setIsChatOpen(!isChatOpen);
	};

	return (
		<div className={`customer-order-page ${isChatOpen ? "chat-open" : ""}`}>
			<h2>Order Pizza</h2>

			<div className="order-input-container">
				<input
					type="text"
					placeholder="Pizza Name"
					value={pizzaName}
					onChange={(e) => setPizzaName(e.target.value)}
				/>
				<button onClick={handleCreateOrder}>Create Order</button>
			</div>

			<button className="toggle-chat-button" onClick={toggleChatWindow}>
				{isChatOpen ? "Close Chat" : "Open Chat"}
			</button>

			<div className="content-container">
				<div className="order-list-container">
					<div className="order-list">
						<h2>Orders</h2>
						<ul>
							{inProgressOrders.map((order) => (
								<li key={order.id} className="order-item">
									<strong>ID:</strong> {order.id} <br />
									<strong>Pizza:</strong> {order.pizzaName} <br />
									<strong>Customer:</strong> {order.customer.customerName} <br />
									<strong>Status:</strong> {order.status} <br />
									<strong>Created At:</strong>
									{new Date(order.createdAt).toLocaleString()}
								</li>
							))}
						</ul>
						<div className="completed-orders">
							<button onClick={() => setShowCompleted(!showCompleted)}>
								{showCompleted ? "Hide" : "Show"} Completed Orders
							</button>
							{showCompleted && (
								<ul>
									{doneOrders.map((order) => (
										<li key={order.id} className="order-item">
											<strong>ID:</strong> {order.id} <br />
											<strong>Pizza:</strong> {order.pizzaName} <br />
											<strong>Customer:</strong> {order.customer.customerName}{" "}
											<br />
											<strong>Status:</strong> {order.status} <br />
											<strong>Created At:</strong>
											{new Date(order.createdAt).toLocaleString()} <br />
											<strong>Finished At:</strong>
											{new Date(order.finishedAt).toLocaleString()}
										</li>
									))}
								</ul>
							)}
						</div>
					</div>
				</div>

				<div className={`chat-window-container ${isChatOpen ? "open" : ""}`}>
					{isChatOpen && (
						<div>
							<ChatWindow customerId={customerId} sender="Customer" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CustomerOrderPage;
