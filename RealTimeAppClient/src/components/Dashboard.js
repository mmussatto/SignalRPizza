import { Link } from "react-router-dom";
import OrderList from "./OrderList";
import PizzaChart from "./PizzaChart";

const Dashboard = () => {
	return (
		<div>
			<OrderList />
			<PizzaChart />
			<Link to="/manage-orders">
				<h2>Manage Orders</h2>
			</Link>
			<Link to="/customers">
				<h2>Manage Customers</h2>
			</Link>
		</div>
	);
};

export default Dashboard;
