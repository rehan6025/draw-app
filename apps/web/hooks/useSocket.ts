import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZDY4ZTA0MC00MDQ4LTQ3ZjktYjNiNS0xYzQ2ZDU2NzI4YWEiLCJpYXQiOjE3NTMwMjU1NDB9.P3GXypNOwbVxa_OeALdZJztZW96xBGjgp3A5LLgodJM`
    );
    ws.onopen = () => {
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return {
    socket,
    loading,
  };
}
