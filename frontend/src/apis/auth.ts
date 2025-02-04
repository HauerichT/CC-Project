import axios from "axios";
import { API_URL } from "../App";

/**
 * Login user.
 */
export const login = async (data: { email: string; password: string }) => {
  try {
    // Measure latency
    const startTimestamp = Date.now();

    // Send request
    const response = await axios.post(`${API_URL}/auth/login`, data);
    const { success, message, data: responseData } = response.data;

    // Measure latency
    const endTimestamp = Date.now();
    const latency = endTimestamp - startTimestamp;
    await axios.post(`${API_URL}/metrics/report-latency`, {
      latency: latency,
      operation: "login",
    });
    return { success, message, data: responseData };
  } catch (error) {
    throw new Error(String(error));
  }
};

/**
 * Register user.
 */
export const register = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    // Measure latency
    const startTimestamp = Date.now();

    // Send request
    const response = await axios.post(`${API_URL}/auth/register`, data);
    const { success, message, data: responseData } = response.data;

    // Measure latency
    const endTimestamp = Date.now();
    const latency = endTimestamp - startTimestamp;
    await axios.post(`${API_URL}/metrics/report-latency`, {
      latency: latency,
      operation: "register",
    });
    return { success, message, data: responseData };
  } catch (error) {
    throw new Error(String(error));
  }
};
