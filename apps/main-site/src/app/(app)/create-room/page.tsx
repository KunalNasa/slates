'use client'

import { useState } from "react";
import { ErrorHandler } from "../../../lib/ErrorHandler";
import axios from "axios";
import { BACKEND_URL } from "../../../configs/ServerUrls";

export default function page() {
    const [room, setRoom] = useState<string>("");
    const handleSubmit = async (e : any) => {
        try {
            await axios.post(`${BACKEND_URL}/user/room`, {
                name : room
            }, {
                withCredentials : true
            })
        } catch (error : any) {
            ErrorHandler(error);
            
        }
    }
  return (
    <div>
        <input value={room} onChange={(e) => {setRoom(e.target.value)}} placeholder="Enter Room Name" type="text" />
        <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}