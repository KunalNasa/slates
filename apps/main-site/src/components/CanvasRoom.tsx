'use client'
import { useEffect, useRef, useState } from "react";
import { Game, Tool } from "../lib/draw";
import { GoDash } from "react-icons/go";
import { MdOutlineRectangle } from "react-icons/md";
import { FaPencilAlt, FaRegCircle } from "react-icons/fa";
import { LuGrab } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CanvasRoom({ socket, roomId }: { socket: WebSocket; roomId: string; }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<Game>();
  const [selectedTool, setSelectedTool] = useState<Tool>('pan');
  const [scale, setScale] = useState<number>(100);
  const router = useRouter();

  socket.onmessage = (event) => {
      console.log("Raw WebSocket message received:", event);
      const response = JSON.parse(event.data);
      console.log("Received from server:", response);
      if (!response.success) {
        router.replace("/room");
        toast.error("Error", {
          description: "You are not allowed to join this room",
          duration: 3000,
      });  
      }
  };
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
     
      const g = new Game(canvas, roomId, socket, setScale);
      setGame(g);
    

      return () => {
        g.destroy();
      };
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
      <div className="bg-gray-800 text-sm left-5 rounded-md p-2 text-white fixed bottom-10">{scale.toString()}%</div>
      <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
  );
}

const tools = [
  { id: "line", icon: <GoDash /> },
  { id: "rect", icon: <MdOutlineRectangle /> },
  { id: "circle", icon: <FaRegCircle /> },
  { id: "pencil", icon: <FaPencilAlt /> },
  { id: "pan", icon: <LuGrab /> }
];

function Topbar({ selectedTool, setSelectedTool }: { selectedTool: Tool; setSelectedTool: (s: Tool) => void }) {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2">
      <div className="flex gap-2 bg-gray-900/90 p-2 rounded shadow-md">
      {tools.map((tool, idx) => (
        <button
        key={idx}
        onClick={() => setSelectedTool(tool.id as Tool)}
        className={`px-4 py-2 text-white rounded ${selectedTool === tool.id ? 'bg-gray-600' : 'bg-none'}`}
        >
          {tool.icon}
        </button>
      ))}
      </div>
    </div>
  );
}
