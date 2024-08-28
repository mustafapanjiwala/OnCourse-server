import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

socket.on("connect", () => {
    console.log("Connected to server");

    // Send a message to the server
    socket.emit("message", "hellos");

    // Listen for the response
    socket.on("response", (data) => {
        console.log("AI Response:", data);
        socket.disconnect(); // Disconnect after receiving the response
    });
});