'use client'
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Page() {
  const router = useRouter();
  const [roomId, setRommId] = useState<string>("");
  return (
    <main className="h-screen flex flex-col items-center justify-center w-screen bg-black">
      <input 
        className="bg-gray-300 p-2 m-2 rounded-md"
        type="text"
        value={roomId} 
        onChange={(e) =>{
          setRommId(e.target.value);
        }} 
        placeholder="enter roomID"
        />
      <button
        className="bg-green-400 p-2 rounded-md"
        onClick={() => {
        router.replace(`/room/${roomId}`)
      }}>
          Enter Room
      </button>
    </main>
  )
}