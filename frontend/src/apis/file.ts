import axios from "axios";
import { API_URL } from "../App";
import { getUserIdFromToken } from "../utils/authUtils";

export const upload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", String(getUserIdFromToken()));

    const response = await axios.post(`${API_URL}/file/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "user-id": String(getUserIdFromToken()),
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const getUserFiles = async () => {
  try {
    const userId = getUserIdFromToken();
    const response = await axios.get(`${API_URL}/file/get-all-files/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
};
