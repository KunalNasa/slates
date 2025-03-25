'use client'
import { useEffect, useRef, useState } from "react";
import { Game, Tool } from "../lib/draw";

export default function CanvasRoom({ socket, roomId }: { socket: WebSocket; roomId: string; }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>('pan');

  useEffect(() => {
    game?.setTool(selectedTool);
    console.log("Set tool to: ", selectedTool);
  }, [selectedTool, setSelectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set a large canvas size
     

      const g = new Game(canvas, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
      <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
  );
}

function Topbar({ selectedTool, setSelectedTool }: { selectedTool: Tool; setSelectedTool: (s: Tool) => void }) {
  return (
    <div style={{ position: "fixed", top: 10, left: 10 }}>
      <div className="flex gap-2 bg-white p-2 rounded shadow-md">
        {["line", "rect", "circle", "pencil", "pan", "ellipse", "rhombus"].map((tool) => (
          <button
            key={tool}
            onClick={() => setSelectedTool(tool as Tool)}
            style={{ backgroundColor: selectedTool === tool ? 'gray' : 'white', padding: "5px 10px", borderRadius: "5px" }}
          >
            {tool.charAt(0).toUpperCase() + tool.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
