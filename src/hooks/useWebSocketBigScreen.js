"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useWebSocketBigScreen() {
  const [socket, setSocket] = useState(null);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const WS_HOST = process.env.NEXT_PUBLIC_WEBSOCKET_HOST;

  useEffect(() => {
    if (!WS_HOST) {
      console.error("❌ WebSocket Host is not defined.");
      return;
    }

    const socketInstance = io(WS_HOST, { transports: ["websocket"] });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to WebSocket Server (Big Screen)", socketInstance.id);
      socketInstance.emit("register", "big-screen");
      setIsLoading(false);
    });

    // Show loading when a category is selected
    socketInstance.on("categorySelected", () => {
      console.log("⏳ Category selected – show loading");
      setIsLoading(true);
      setCurrentMedia(null);
    });

    // Media arrives
    socketInstance.on("displayMedia", (mediaData) => {
      console.log("🖥️ Display media:", mediaData);
      setCurrentMedia(mediaData);
      setIsLoading(false);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ WebSocket disconnected");
    });

    setSocket(socketInstance);

    return () => socketInstance.disconnect();
  }, [WS_HOST]);

  return { currentMedia, isLoading };
}
