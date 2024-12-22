import axios from "axios";
import { API_URL } from "../App";

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    const { success, message, data: responseData } = response.data;
    return { success, message, data: responseData };
  } catch (error) {
    throw new Error(String(error));
  }
};

export const register = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    const { success, message, data: responseData } = response.data;
    return { success, message, data: responseData };
  } catch (error) {
    throw new Error(String(error));
  }
};
