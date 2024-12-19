import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";

export const API_URL = "http://localhost:8000";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}
