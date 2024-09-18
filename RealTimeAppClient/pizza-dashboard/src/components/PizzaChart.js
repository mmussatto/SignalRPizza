import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import * as signalR from "@microsoft/signalr";
import "../styles/PizzaChart.css";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { fetchData } from "../api/api";
import config from "../config";

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PizzaChart = () => {
	const [pizzaData, setPizzaData] = useState({});

	useEffect(() => {
		//Fetch intial orders
		fetchData("/api/Orders").then((data) => {
			const pizzaCounts = data.reduce((acc, order) => {
				acc[order.pizzaName] = (acc[order.pizzaName] || 0) + 1;
				return acc;
			}, {});
			setPizzaData(pizzaCounts);
		});

		//Setup SignalR connection
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${config.apiBaseUrl}/dataHub`)
			.build();

		connection.on("ReceiveOrder", (order) => {
			setPizzaData((prevData) => ({
				...prevData,
				[order.pizzaName]: (prevData[order.pizzaName] || 0) + 1,
			}));
		});

		connection.start().catch((err) => console.error(err));

		return () => {
			connection.stop();
		};
	}, []);

	const chartData = {
		labels: Object.keys(pizzaData),
		datasets: [
			{
				label: "Number of Orders",
				data: Object.values(pizzaData),
				backgroudColor: "rgba(75,192,192,0.6)",
				borderColor: "rgba(75,192,192,1)",
				borderWidth: 1,
			},
		],
	};

	const options = {
		indexAxis: "y",
		scales: {
			x: { beginAtZero: true },
		},
	};

	return (
		<div className="chart-container">
			<h2>Pizza Orders</h2>
			<Bar data={chartData} options={options} />
		</div>
	);
};

export default PizzaChart;
