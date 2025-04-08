'use client'
import { Button } from "@slates/ui/Button";
import { useRouter } from "next/navigation";

export default function DisplayRoomCards({roomId, createdAt, createdBy, roomName}: {
    roomId : number,
    createdAt : string,
    createdBy : string,
    roomName : string
}) {
    const router = useRouter();
  return (
    <div className="w-[30%] rounded-sm p-5 border border-black shadow-custom flex flex-col gap-1">     
    <p className="text-xl font-semibold text-gray-700">{roomName}</p>
    <p className="text-gray-700"><span className="text-sm text-gray-500">Room admin: </span>{createdBy}</p>
    <p className="text-gray-700"><span className="text-sm text-gray-500">Created On: </span>{createdAt}</p>
    <p className="text-gray-700"><span className="text-sm text-gray-500">Room ID: </span>{roomId}</p>
    <Button onClick={() => {router.replace(`/room/${roomId}`)}} variant="primary-pink">Join Room</Button>

    </div>
  );
}