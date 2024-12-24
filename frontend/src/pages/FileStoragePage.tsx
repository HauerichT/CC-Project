import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FileUploadComponent from "../components/file/FileUploadComponent";
import { getUserFiles } from "../apis/file";
import useSnackbar from "../components/snackbar/UseSnackbarComponent";

interface File {
  id: number;
  originalName: string;
  uniqueName: string;
  filePath: string;
  uploadedAt: string;
}

export default function FileStoragePage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  useEffect(() => {
    const _getUserFiles = async () => {
      try {
        const result = await getUserFiles();
        setFiles(result.files);
      } catch (error) {
        showSnackbar(String(error), "error");
      }
    };
    _getUserFiles();
  }, []);

  return (
    <>
      <SnackbarComponent />

      <Box sx={{ height: "100vh", width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 2 }}
        >
          Datei Hochladen
        </Button>

        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={files || []}
            getRowId={(row) => row.id}
            columns={[
              { field: "id", headerName: "ID", width: 90 },
              {
                field: "originalName",
                headerName: "Original Name",
                width: 150,
              },
              { field: "uniqueName", headerName: "Unique Name", width: 150 },
              { field: "filePath", headerName: "File Path", width: 250 },
              { field: "uploadedAt", headerName: "Uploaded At", width: 180 },
            ]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>

        <FileUploadComponent
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        />
      </Box>
    </>
  );
}
