import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CustomerOrderPage from "./components/CustomerOrderPage";
import CustomerManagement from "./components/CustomerManagement";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/customer-orders/:customerId" element={<CustomerOrderPage />} />
				<Route path="/customers" Component={CustomerManagement} />
			</Routes>
		</Router>
	);
}

export default App;

