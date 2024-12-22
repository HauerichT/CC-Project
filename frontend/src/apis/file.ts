import axios from "axios";
import { API_URL } from "../App";
import { getUserIdFromToken } from "../utils/authUtils";

export const upload = async ({ file }: { file: File }) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", String(getUserIdFromToken()));

    console.log(formData);

    const response = await axios.post(`${API_URL}/file/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response);
    return response;
  } catch (error) {
    throw new Error(String(error));
  }
};
