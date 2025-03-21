'use client'
// token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiY204ajM0eTZmMDAwMHI2YmNhbDVxank2ZyIsImVtYWlsIjoia3VuYWxAZ21haWwuY29tIiwidXNlcm5hbWUiOiJNZU15c2VsZiJ9LCJpYXQiOjE3NDI1ODAwMTAsImV4cCI6MTc0Mzg3NjAxMH0.GDxDmlOv2o8nctpbzkdI7nntTbBPJ3_loWSn6XvoWqY
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