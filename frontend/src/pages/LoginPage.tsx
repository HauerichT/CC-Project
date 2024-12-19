import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { register } from "../apis/auth";

export default function LoginPage() {
  const handleRegister = () => {
    register({ email: "test2@mail.de", password: "123456", name: "TestUser2" });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          mt: 8,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Registrieren</Typography>
        <Box
          sx={{ mt: 1, width: "100%" }}
        >
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mb: 2 }}
            onClick={handleRegister}
          >
            Registrieren
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
