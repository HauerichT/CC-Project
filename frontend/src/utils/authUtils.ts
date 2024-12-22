import { JwtPayload, jwtDecode } from "jwt-decode";

interface UserIdJwtPayload extends JwtPayload {
  userId: string;
}

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");

  if (token) {
    const decoded = jwtDecode<UserIdJwtPayload>(token);
    return decoded.userId;
  }
};

export const logout = async () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};
