import { HubConnectionBuilder } from "@microsoft/signalr";
import config from "../config";

let connection = null;

export const getChatHubConnection = () => {
	if (!connection) {
		connection = new HubConnectionBuilder()
			.withUrl(`${config.apiBaseUrl}/chatHub`)
			.withAutomaticReconnect()
			.build();

		console.log("Create new connection");
	}
	console.log("Returned connection: ", connection.toString());
	return connection;
};

export const waitForConnection = (connection) => {
	return new Promise((resolve, reject) => {
		const checkConnection = () => {
			if (connection.state === "Connected") {
				resolve();
			} else if (connection.state === "Disconnected") {
				reject(new Error("Connection is disconnected"));
			} else {
				setTimeout(checkConnection, 100);
			}
		};
		checkConnection();
	});
};
