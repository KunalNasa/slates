'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [roomName, setRoomName] = useState<string>("");
  const router = useRouter();
  return (
   <div>
    <input value={roomName} onChange={(e) => {
      setRoomName(e.target.value);
    }} placeholder="Enter room name" type="text" />
    <button onClick={() => {router.replace(`/room/${roomName}`)}}>Go to room</button>
   </div>
  );
}
