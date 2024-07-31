import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "../styles/OrderList.css";

const OrderList = () => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		//Fetch initial orders
		fetch("https://localhost:7018/api/Orders")
			.then((response) => response.json())
			.then((data) => setOrders(data));

		//Set up SignalR connection
		const connection = new signalR.HubConnectionBuilder()
			.withUrl("https://localhost:7018/dataHub")
			.build();

		connection.on("ReceiveOrder", (order) => {
			setOrders((prevOrders) => [...prevOrders, order]);
		});

		connection.on("UpdateOrder", (updateOrder) => {
			setOrders((prevOrders) =>
				prevOrders.map((order) => (order.id === updateOrder.id ? updateOrder : order))
			);
		});

		connection.start().catch((err) => console.error(err.toString()));

		return () => {
			connection.stop();
		};
	}, []);

	const statuses = ["Received", "Preparing", "Baking", "ReadyForPickup", "Completed"];

	return (
		<div className="kanban-board">
			{statuses.map((status) => (
				<div key={status} className="kanban-column">
					<h2>{status}</h2>
					<ul>
						{orders
							.filter((order) => order.status === status)
							.map((order) => (
								<li key={order.id} className="order-item">
									<strong>ID:</strong> {order.id} <br />
									<strong>Pizza:</strong> {order.pizzaName} <br />
									<strong>Customer:</strong> {order.customer.name} <br />
									<strong>Created At:</strong>{" "}
									{new Date(order.createdAt).toLocaleString()} <br />
									{order.status === "Completed" && (
										<>
											<strong>Finished At:</strong>
											{new Date(order.finishedAt).toLocaleString()}
										</>
									)}
								</li>
							))}
					</ul>
				</div>
			))}
		</div>
		// <div className="order-list-container">
		// 	<div className="order-list">
		// 		<h2>In Progress</h2>
		// 		<ul>
		// 			{inProgressOrders.map((order) => (
		// 				<li key={order.id} className="order-item">
		// 					<strong>ID:</strong> {order.id} <br />
		// 					<strong>Pizza:</strong> {order.pizzaName} <br />
		// 					<strong>Customer:</strong> {order.customerName} <br />
		// 					<strong>Created At:</strong>{" "}
		// 					{new Date(order.createdAt).toLocaleString()}
		// 				</li>
		// 			))}
		// 		</ul>
		// 	</div>
		// 	<div className="order-list">
		// 		<h2>Done</h2>
		// 		<ul>
		// 			{doneOrders.map((order) => (
		// 				<li key={order.id} className="order-item">
		// 					<strong>ID:</strong> {order.id} <br />
		// 					<strong>Pizza:</strong> {order.pizzaName} <br />
		// 					<strong>Customer:</strong> {order.customerName} <br />
		// 					<strong>Created At:</strong>{" "}
		// 					{new Date(order.createdAt).toLocaleString()} <br />
		// 					<strong>Finished At:</strong>{" "}
		// 					{new Date(order.finishedAt).toLocaleString()}
		// 				</li>
		// 			))}
		// 		</ul>
		// 	</div>
		// </div>
	);
};

export default OrderList;
