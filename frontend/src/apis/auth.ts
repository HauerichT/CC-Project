import axios from "axios";
import { API_URL } from "../App";

export interface UserLoginRegisterData {
  email: string;
  password: string;
  name: string;
}

export const login = async (data: UserLoginRegisterData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    const { success, message, data: responseData } = response.data;

    if (success) {
      console.log("Login erfolgreich:", responseData.token);
      localStorage.setItem("token", responseData.token);
    } else {
      console.error("Login fehlgeschlagen:", message);
    }
  } catch (error) {
    console.error("Ein Fehler ist aufgetreten:", error);
  }
};

export const register = async (data: UserLoginRegisterData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    const { success, message, data: responseData } = response.data;

    if (success) {
      console.log("Registrierung erfolgreich:", responseData);
    } else {
      console.error("Registrierung fehlgeschlagen:", message);
    }
  } catch (error) {
    console.error("Ein Fehler ist aufgetreten:", error);
  }
};
