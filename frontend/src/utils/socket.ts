import { io } from "socket.io-client";

export const socket = io("ws://74.234.199.69:8000", {
  transports: ["websocket"],
});
