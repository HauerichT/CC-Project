import { useState } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export default function useSnackbar() {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message: string, severity: AlertColor = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const SnackbarUI = () => (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={2000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={closeSnackbar}
        severity={snackbar.severity}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );

  return { showSnackbar, SnackbarComponent: SnackbarUI };
}
