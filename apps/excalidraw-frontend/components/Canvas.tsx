import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "../draw/Game";

type Shape = "circle" | "rect" | "pencil";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Shape>("circle");

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef]);

  return (
    <div className="h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>

      <TopBar selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>
  );
}

function TopBar({
  selectedTool,
  setSelectedTool,
}: {
  selectedTool: Shape;
  setSelectedTool: (s: Shape) => void;
}) {
  return (
    <div className="text-white fixed left-2.5 top-2.5 flex gap-6">
      <IconButton
        activated={selectedTool === "pencil"}
        icon={<Pencil />}
        onClick={() => {
          setSelectedTool("pencil");
        }}
      ></IconButton>
      <IconButton
        activated={selectedTool === "rect"}
        icon={<RectangleHorizontalIcon />}
        onClick={() => {
          setSelectedTool("rect");
        }}
      ></IconButton>
      <IconButton
        activated={selectedTool === "circle"}
        icon={<Circle />}
        onClick={() => {
          setSelectedTool("circle");
        }}
      ></IconButton>
    </div>
  );
}
