import axios from "axios";
import { API_URL } from "../App";
import { getUserIdFromToken } from "../utils/authUtils";

/**
 * Upload file.
 */
export const upload = async (file: File) => {
  try {
    // Measure latency
    const startTimestamp = Date.now();

    // Send request
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", String(getUserIdFromToken()));
    formData.append("startTimestamp", startTimestamp.toString());

    const response = await axios.post(`${API_URL}/file/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "user-id": String(getUserIdFromToken()),
        "token-auth": String(localStorage.getItem("token")),
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
};

/**
 * Get all files of the user.
 */
export const getUserFiles = async () => {
  try {
    const userId = getUserIdFromToken();
    const response = await axios.get(`${API_URL}/file/get-all-files/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
};

/**
 * Download file.
 */
export const download = async (fileId: number, fileName: string) => {
  try {
    // Measure latency
    const startTimestamp = Date.now();

    // Send request
    const userId = getUserIdFromToken();
    const response = await axios.get(`${API_URL}/file/download/${fileId}`, {
      headers: {
        "user-id": String(userId),
      },
      responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Measure latency
    const endTimestamp = Date.now();
    const latency = endTimestamp - startTimestamp;

    await axios.post(`${API_URL}/metrics/report-latency`, {
      latency: latency,
      operation: "download",
    });
    return response.data;
  } catch (error) {
    throw new Error(`Fehler beim Herunterladen der Datei: ${error}`);
  }
};

/**
 * Delete file.
 */
export const deleteFile = async (fileId: number) => {
  try {
    const userId = getUserIdFromToken();
    const startTimestamp = Date.now();
    const response = await axios.delete(
      `${API_URL}/file/delete/${fileId}/${localStorage.getItem(
        "token"
      )}/${startTimestamp}`,
      {
        headers: {
          "user-id": String(userId),
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(`Fehler beim Löschen der Datei: ${error}`);
  }
};
