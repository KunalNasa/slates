import { useEffect, useState } from "react";
import { WS_URL } from "../config/baseUrls";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}`);

        ws.onopen = () => {
            console.log("✅ WebSocket Connected!");
            console.log(ws);
            setLoading(false);
            setSocket(ws);
        };

        ws.onmessage = (event) => {
            console.log("🔵 Incoming Message:", event.data);
        };

        ws.onerror = (error) => {
            console.error("❌ WebSocket Error:", error);
        };

        ws.onclose = () => {
            console.warn("⚠️ WebSocket Closed!");
        };

        // Cleanup function to close the socket on unmount
        return () => {
            ws.close();
        };
    }, []);

    return { socket, loading };
}
