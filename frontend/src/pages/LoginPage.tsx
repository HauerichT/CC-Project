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
import * as EmailValidator from "email-validator";
import useSnackbar from "../components/snackbar/UseSnackbarComponent";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const validateForm = () => {
    if (email.length === 0 || password.length === 0) {
      showSnackbar("Bitte Email und Passwort eingeben!", "error");
      return false;
    }

    if (!isLogin && name.length === 0) {
      showSnackbar("Bitte Email, Passwort und Nutzername eingeben!", "error");
      return false;
    }

    if (!isLogin && password.length < 6) {
      showSnackbar("Passwort muss mindestens 6 Zeichen lang sein!", "error");
      return false;
    }

    if (!EmailValidator.validate(email)) {
      showSnackbar("Bitte eine valide Email eingeben!", "error");
      return false;
    }

    return true;
  };

  const handleLoginRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = isLogin
        ? await login({ email, password })
        : await register({
            email,
            password,
            name,
          });

      if (response?.success) {
        showSnackbar(response.message, "success");
        if (response.data) {
          localStorage.setItem("token", response.data);
          window.location.href = "/";
        } else {
          setIsLogin(true);
          setEmail("");
          setPassword("");
          setName("");
        }
      } else {
        showSnackbar(response?.message, "error");
      }
    } catch (error) {
      showSnackbar(String(error), "error");
    }
  };

  return (
    <>
      <SnackbarComponent />
      <Container component="main" maxWidth="lg">
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ width: 1, height: "50vh" }}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ marginTop: 2, marginBottom: 2 }}
                />
                <TextField
                  required
                  id="outlined-required"
                  type="password"
                  label="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  sx={{ mb: 2 }}
                  onClick={handleLoginRegister}
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ marginTop: 2 }}
                />
                <TextField
                  required
                  id="outlined-required"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ marginTop: 2, marginBottom: 2 }}
                />
                <TextField
                  required
                  id="outlined-required"
                  type="password"
                  label="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{ marginBottom: 2 }}
                />
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  sx={{ mb: 2 }}
                  onClick={handleLoginRegister}
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
    </>
  );
}
