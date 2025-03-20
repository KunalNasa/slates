'use client'

import { useEffect, useRef, useState } from "react";
import { Game } from "../lib/draw";
import { Socket } from "dgram";

export default function Page() {
  const [game, setGame] = useState<Game>();
  const [socket, setSocket] = useState<WebSocket>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // useEffect(() => {

  //   const canvas = canvasRef.current;
  //   let clicked = false;
  //   const ctx = canvas?.getContext('2d');

  //   canvas!.width = window.innerWidth;
  //   canvas!.height = window.innerHeight;

  //   let initialX = 0;
  //   let initialY = 0;
  //   canvas?.addEventListener('mousedown', (e) => {
  //     clicked = true;
  //     initialX = e.clientX;
  //     initialY = e.clientY;
  //   })
  //   canvas?.addEventListener('mouseup', (e) => {
  //     clicked = false;

  //   })
  //   canvas?.addEventListener('mousemove', (e) => {
  //     if(clicked){
  //       const width = e.clientX - initialX;
  //       const height = e.clientY - initialY;
  //       ctx?.strokeRect(initialX, initialY, width, height);
  //       ctx?.clearRect(0, 0, canvas.width, canvas.height);
  //       ctx!.strokeStyle = 'white';
  //       ctx!.fillStyle = 'white'
  //     }
      
  //   })
  // }, [canvasRef])
  useEffect(() => {
    
  }, [])
  return (
    <main className="h-screen w-screen bg-black">
      <canvas ref = {canvasRef}></canvas>
    </main>
  )
}