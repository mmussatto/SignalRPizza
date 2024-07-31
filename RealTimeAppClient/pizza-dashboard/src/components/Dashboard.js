import { Link } from "react-router-dom";
import OrderList from "./OrderList";
import PizzaChart from "./PizzaChart";

const Dashboard = () => {
	return (
		<div>
			<OrderList />
			<PizzaChart />
			<Link to="/manage-orders">Manage Orders</Link> <br />
			<Link to="/customer-orders/1">Customer Orders</Link>
		</div>
	);
};

export default Dashboard;
