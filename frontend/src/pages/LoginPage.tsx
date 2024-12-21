import {
  Container,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { login, register } from "../apis/auth";
import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleRegister = () => {
    register({ email: "test2@mail.de", password: "123456", name: "TestUser2" });
  };

  const handleLogin = () => {
    login({ email: "test2@mail.de", password: "123456", name: "TestUser2" });
  };

  return (
    <Container component="main" maxWidth="lg">
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        sx={{ width: 1, height: "100vh" }}
      >
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
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <TextField
                required
                id="outlined-required"
                label="Email"
                sx={{ marginTop: 2, marginBottom: 2 }}
              />
              <TextField
                required
                id="outlined-required"
                type="password"
                label="Passwort"
                sx={{ marginBottom: 2 }}
              />
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ mb: 2 }}
                onClick={handleLogin}
              >
                Senden
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setIsLogin((isLogin) => !isLogin)}
              >
                Registrieren
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h5">Registrieren</Typography>
              <TextField
                required
                id="outlined-required"
                label="Nutzername"
                sx={{ marginTop: 2 }}
              />
              <TextField
                required
                id="outlined-required"
                label="Email"
                sx={{ marginTop: 2, marginBottom: 2 }}
              />
              <TextField
                required
                id="outlined-required"
                type="password"
                label="Passwort"
                sx={{ marginBottom: 2 }}
              />
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ mb: 2 }}
                onClick={handleRegister}
              >
                Senden
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setIsLogin((isLogin) => !isLogin)}
              >
                Login
              </Button>
            </>
          )}
        </Paper>
      </Stack>
    </Container>
  );
}
