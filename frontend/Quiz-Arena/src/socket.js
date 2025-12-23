import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", {
  withCredentials: true,
  autoConnect: true,
  transports: ["websocket", "polling"],
});


export default socket;
