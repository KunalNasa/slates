'use client'
import { useEffect, useRef, useState } from "react";
import { Game, Tool } from "../lib/draw";

export default function CanvasRoom({socket, roomId} : {
  socket : WebSocket,
  roomId : string;
}) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>('rect');
  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if(canvasRef.current){
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      }
    }
  }, [])

  return (
    <div>
      <canvas ref = {canvasRef}></canvas>
    </div>
  );
}