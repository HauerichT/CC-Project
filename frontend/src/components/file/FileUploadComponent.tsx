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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showSnackbar("Bitte Datei auswählen!", "error");
      return;
    }

    setLoading(true);

    try {
      await upload(file);
    } catch (error) {
      showSnackbar(String(error), "error");
    } finally {
      setLoading(false);
      onClose();
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
