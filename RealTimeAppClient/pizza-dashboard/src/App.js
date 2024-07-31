import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import OrderManagement from "./components/OrderManagement";
import CustomerOrderPage from "./components/CustomerOrderPage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/manage-orders" element={<OrderManagement />} />
				<Route path="/customer-orders/:customerId" element={<CustomerOrderPage />} />
			</Routes>
		</Router>
	);
}

export default App;

