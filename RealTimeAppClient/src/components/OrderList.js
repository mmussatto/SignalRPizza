import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import "../styles/OrderList.css";
import { fetchData, putData } from "../api/api";
import config from "../config";

const OrderList = () => {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		//Fetch initial orders
		fetchData("/api/Orders").then((data) => setOrders(data));

		//Set up SignalR connection
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${config.apiBaseUrl}/dataHub`)
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

	const handleAdvanceOrder = async (orderId) => {
		try {
			await putData(`/api/Orders/advance/${orderId}`);
		} catch (error) {
			console.error("Error advancing order:", error);
		}
	};

	return (
		<div className="kanban-board">
			{statuses.map((status) => (
				<div key={status} className="kanban-column">
					<h2>{status}</h2>
					<ul>
						{orders
							.filter((order) => order.status === status)
							.map((order) => (
								<li
									key={order.id}
									className={`orderList__order-item ${
										order.status !== "Completed" ? "withButton" : ""
									}`}
								>
									<strong>ID:</strong> {order.id} <br />
									<strong>Pizza:</strong> {order.pizzaName} <br />
									<strong>Customer:</strong> {order.customer.name} <br />
									<strong>Created At:</strong>{" "}
									{new Date(order.createdAt).toLocaleString()} <br />
									{order.status === "Completed" && (
										<>
											<strong>Finished At:</strong>{" "}
											{new Date(order.finishedAt).toLocaleString()}
										</>
									)}
									{order.status !== "Completed" && (
										<button
											className="advance-button"
											onClick={() => handleAdvanceOrder(order.id)}
										>
											Advance
										</button>
									)}
								</li>
							))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default OrderList;
