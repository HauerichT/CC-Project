import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import { isLoggedIn, logout } from "../../utils/authUtils";
import FileUploadComponent from "../file/FileUploadComponent";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LogoutIcon from "@mui/icons-material/Logout";

export default function ResponsiveNavbar() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              display: { xs: "block", sm: "block" },
              textAlign: "left",
            }}
          >
            FileStorage
          </Typography>

          {isLoggedIn() && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                color="inherit"
                onClick={() => setOpenDialog(true)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CloudUploadIcon />
                <Typography variant="caption">Upload</Typography>
              </IconButton>

              <IconButton
                color="inherit"
                onClick={() => logout()}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <LogoutIcon />
                <Typography variant="caption">Logout</Typography>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* File Upload Dialog */}
      <FileUploadComponent
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </>
  );
}
