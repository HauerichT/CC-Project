import { useEffect, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getUserFiles, download, deleteFile } from "../apis/file";
import useSnackbar from "../components/snackbar/UseSnackbarComponent";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { socket } from "../utils/socket";
import { getUserIdFromToken } from "../utils/authUtils";

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

  socket.on(
    "fileUploaded",
    ({
      originalName,
      sessionId,
    }: {
      originalName: string;
      sessionId: string;
    }) => {
      if (sessionId === localStorage.getItem("token")) {
        console.log("Upload File vom gleichen Token", originalName, sessionId);
      } else {
        console.log("Upload File vom anderen Token", originalName, sessionId);
      }
      fetchFiles();
    }
  );

  socket.on(
    "fileDeleted",
    ({
      originalName,
      sessionId,
    }: {
      originalName: string;
      sessionId: string;
    }) => {
      if (sessionId === localStorage.getItem("token")) {
        console.log("Delete File vom gleichen Token", originalName, sessionId);
      } else {
        console.log("Delete File vom anderen Token", originalName, sessionId);
      }
      fetchFiles();
    }
  );

  useEffect(() => {
    socket.emit("joinRoom", getUserIdFromToken());
    fetchFiles();
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
