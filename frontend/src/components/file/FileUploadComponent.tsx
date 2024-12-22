import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useState } from "react";
import useSnackbar from "../snackbar/UseSnackbarComponent";
import { upload } from "../../apis/file";

export default function FileUploadComponent({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  // Handle file change when a file is selected
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      showSnackbar("Bitte Datei auswählen!", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await upload({ file });
      console.log(response);
    } catch (error) {
      console.error("Fehler beim Hochladen:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SnackbarComponent />

      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Datei hochladen</DialogTitle>
        <DialogContent>
          <Button variant="contained" component="label">
            Datei auswählen
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {/* Anzeigen des Dateinamens */}
          {file && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Ausgewählte Datei: {file.name}
            </Typography>
          )}

          {loading && <CircularProgress size={24} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Abbrechen
          </Button>
          <Button onClick={handleUpload} color="primary" disabled={loading}>
            {loading ? "Hochladen..." : "Hochladen"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
