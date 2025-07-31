"use client";
import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";
import { start } from "repl";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      initDraw(canvasRef.current);
    }
  }, [canvasRef]);

  return (
    <div>
      <canvas ref={canvasRef} width={1920} height={1080}></canvas>
    </div>
  );
}
