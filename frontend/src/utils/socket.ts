import { io } from "socket.io-client";

export const socket = io("http://192.168.2.131:8000", {
  transports: ["websocket"],
});
