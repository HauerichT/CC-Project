import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getUserFiles, download, deleteFile } from "../apis/file";
import useSnackbar from "../components/snackbar/UseSnackbarComponent";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUserIdFromToken } from "../utils/authUtils";
import { socket } from "../utils/socket";
import axios from "axios";
import { API_URL } from "../App";

interface File {
  id: number;
  originalName: string;
  uniqueName: string;
  filePath: string;
  uploadedAt: string;
}

export default function FileStoragePage() {
  const [files, setFiles] = useState<File[] | null>(null);
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const fetchFiles = async () => {
    try {
      const result = await getUserFiles();
      setFiles(result.files);
    } catch (error) {
      showSnackbar(String(error), "error");
    }
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    console.log("User ID for room:", userId);

    socket.emit("joinRoom", userId);

    fetchFiles();

    const handleFileUploaded = async ({
      originalName,
      sessionId,
      clientStartTimestamp,
    }: {
      originalName: string;
      sessionId: string;
      clientStartTimestamp: number;
    }) => {
      const endTimestamp = Date.now();
      const latency = endTimestamp - clientStartTimestamp;

      const response = await axios.post(`${API_URL}/metrics/report-latency`, {
        latency: latency,
        operation: "upload",
      });
      console.log("Response from report-latency:", response);

      if (sessionId === localStorage.getItem("token")) {
        showSnackbar(
          "Datei wurde erfolgreich hochgeladen: " + originalName,
          "success"
        );
      } else {
        showSnackbar(
          "Datei wurde auf einem anderen Client erfolgreich hochgeladen: " +
            originalName,
          "success"
        );
      }
      fetchFiles();
    };

    const handleFileDeleted = async ({
      originalName,
      sessionId,
      clientStartTimestamp,
    }: {
      originalName: string;
      sessionId: string;
      clientStartTimestamp: number;
    }) => {
      const endTimestamp = Date.now();
      const latency = endTimestamp - clientStartTimestamp;

      const response = await axios.post(`${API_URL}/metrics/report-latency`, {
        latency: latency,
        operation: "delete",
      });
      console.log("Response from report-latency:", response);

      if (sessionId === localStorage.getItem("token")) {
        showSnackbar(
          "Datei wurde erfolgreich gelöscht: " + originalName,
          "success"
        );
      } else {
        showSnackbar(
          "Datei wurde auf einem anderen Client erfolgreich gelöscht: " +
            originalName,
          "success"
        );
      }
      fetchFiles();
    };

    socket.on("fileUploaded", handleFileUploaded);
    socket.on("fileDeleted", handleFileDeleted);

    // Cleanup-Funktion: Listener entfernen und Raum verlassen
    return () => {
      socket.off("fileUploaded", handleFileUploaded);
      socket.off("fileDeleted", handleFileDeleted);
      socket.emit("leaveRoom", userId);
    };
  }, []);

  const handleDownload = async (fileId: number, fileName: string) => {
    try {
      await download(fileId, fileName);
    } catch (error) {
      showSnackbar(String(error), "error");
    }
  };

  const handleDelete = async (fileId: number) => {
    try {
      await deleteFile(fileId);
      fetchFiles();
    } catch (error) {
      showSnackbar(String(error), "error");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "originalName", headerName: "Dateiname", width: 400 },
    { field: "uploadedAt", headerName: "Hochgeladen am", width: 400 },
    {
      field: "download",
      headerName: "Download",
      width: 120,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleDownload(params.row.id, params.row.originalName)}
        >
          <DownloadIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Löschen",
      width: 120,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <>
      <SnackbarComponent />
      <Box sx={{ height: "100vh", width: "100%", marginTop: "20px" }}>
        <DataGrid
          rows={files || []}
          getRowId={(row) => row.id}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
}
