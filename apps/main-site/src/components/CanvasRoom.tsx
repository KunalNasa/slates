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
    console.log("Set tool to: ", selectedTool);
  }, [selectedTool, setSelectedTool, game]);

  useEffect(() => {
    if(canvasRef.current){
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      }
    }
  }, [])

  return <div style={{
    height: "100vh",
    overflow: "hidden"
}}>
    <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
  </div>
}


function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
            position: "fixed",
            top: 10,
            left: 10
        }}>
            <div className="flex gap-t">
              <button 
                onClick={() => {
                  setSelectedTool("line")
                }}
                style={{ backgroundColor: selectedTool === "line" ? 'gray' : 'white' }}
              >
                Line
              </button>
              <button 
                onClick={() => {
                  setSelectedTool("rect")
                }} 
                style={{ backgroundColor: selectedTool === "rect" ? 'gray' : 'white' }}
              >
                Rectangle
              </button>
              <button 
                onClick={() => {
                  setSelectedTool("circle");
                }} 
                style={{ backgroundColor: selectedTool === "circle" ? 'gray' : 'white' }}
              >
                Circle
              </button>
              <button 
                onClick={() => {
                  setSelectedTool("pencil");
                }} 
                style={{ backgroundColor: selectedTool === "pencil" ? 'gray' : 'white' }}
              >
                Pencil
              </button>
            </div>
        </div>
}