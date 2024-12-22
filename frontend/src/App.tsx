import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { isLoggedIn } from "./utils/authUtils";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import FileStoragePage from "./pages/FileStoragePage";

export const API_URL = "http://localhost:8000";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn() ? <DashboardPage /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={!isLoggedIn() ? <LoginPage /> : <Navigate to="/" />}
        />

        <Route
          path="/file-storage"
          element={
            !isLoggedIn() ? <Navigate to="/login" /> : <FileStoragePage />
          }
        />
      </Routes>
    </Router>
  );
}
