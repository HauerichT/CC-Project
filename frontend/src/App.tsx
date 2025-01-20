import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { isLoggedIn } from "./utils/authUtils";
import LoginPage from "./pages/LoginPage";
import FileStoragePage from "./pages/FileStoragePage";
import ResponsiveNavbar from "./components/navigation/ResponsiveNavbar";

export const API_URL = "http://192.168.2.131:8000";

export default function App() {
  return (
    <Router>
      <ResponsiveNavbar />
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn() ? <FileStoragePage /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/login"
          element={!isLoggedIn() ? <LoginPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}
