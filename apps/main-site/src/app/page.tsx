'use client'

import { useEffect, useRef } from "react";

export default function Page() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {

    const canvas = canvasRef.current;
    let clicked = false;
    const ctx = canvas?.getContext('2d');
    let initialX = 0;
    let initialY = 0;
    canvas?.addEventListener('mousedown', (e) => {
      clicked = true;
      initialX = e.clientX;
      initialY = e.clientY;
    })
    canvas?.addEventListener('mouseup', (e) => {
      clicked = false;

    })
    canvas?.addEventListener('mousemove', (e) => {
      if(clicked){
        const width = e.clientX - initialX;
        const height = e.clientY - initialY;
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.strokeRect(initialX, initialY, width, height);
        ctx!.strokeStyle = 'white';
        ctx!.fillStyle = 'white'
      }
      
    })
  }, [canvasRef])
  
  return (
    <main className="h-screen w-screen bg-black">
      Hello world
      <button> Click me </button>
      <canvas className="h-full w-full" ref = {canvasRef}></canvas>
    </main>
  )
}