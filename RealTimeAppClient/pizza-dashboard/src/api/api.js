import axios from "axios";
import config from "../config";

const apiClient = axios.create({
	baseURL: config.apiBaseUrl,
});

export const fetchData = async (endpoint) => {
	try {
		const response = await apiClient.get(endpoint);
		return response.data;
	} catch (error) {
		console.error("Error fetching data:", error);
		throw error;
	}
};

export const postData = async (endpoint, data) => {
	try {
		const response = await apiClient.post(endpoint, data);
		return response.data;
	} catch (error) {
		console.error("Error posting data:", error);
		throw error;
	}
};

export const putData = async (endpoint, data) => {
	try {
		const response = await apiClient.put(endpoint, data);
		return response.data;
	} catch (error) {
		console.error("Error putting data:", error);
		throw error;
	}
};
