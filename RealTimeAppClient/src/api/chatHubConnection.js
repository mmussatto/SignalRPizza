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
