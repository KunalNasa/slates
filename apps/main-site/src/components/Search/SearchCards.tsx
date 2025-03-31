'use client'
import { FaUser } from "react-icons/fa";
import { searchResultInterface } from "./Searchbar";
import Image from "next/image";
import { toast } from "sonner";
import { ErrorHandler } from "../../lib/ErrorHandler";
import { Button } from "@slates/ui/Button";
import { useParams } from "next/navigation";

interface props extends searchResultInterface {
    socket : WebSocket
}
export function SearchCards({name, email, username, avatar, socket} : props) {
    const params = useParams();
    const roomId = params.roomId;
    const handleInvite = async () => {
        try {
            socket.send(JSON.stringify({
                type : "notification",
                username,
                email,
                roomId 
            }))
            // toast.success("Success", {
            //     description: "User invited",
            //     duration: 3000,
            // });  
        } catch (error : any) {
            ErrorHandler(error);
            
        }
    }
  return (
    <div className="w-full flex gap-5 items-center overflow-auto rounded-md my-1 p-2 text-gray-400 bg-gray-600">
        <div className="flex break-all items-center w-2/3 gap-2">
            <div>
                {avatar === "" ? <FaUser/> : <Image height={20} width={20} alt="avatar" src={`${avatar}`}/>}
            </div>
            <div>
                <p className="text-sm">{username}</p>
                <p className="text-xs">{email}</p>
                <p className="text-xs">{name}</p>
            </div>
        </div>
        <div className="w-1/3 flex items-center justify-center">
        <Button variant="tertiary" onClick={handleInvite}> invite </Button>
        </div>
    </div>
  );
}


export  function SkeletonSearchCard() {
  return (
    <div className="w-full flex gap-5 items-center overflow-auto rounded-md my-1 p-2 bg-gray-400 animate-pulse">
        <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-300 rounded-full" /> {/* Skeleton for avatar */}
            <div>
                <div className="w-24 h-4 bg-gray-300 mb-1" /> {/* Skeleton for username */}
                <div className="w-20 h-3 bg-gray-300" /> {/* Skeleton for email */}
            </div>
        </div>
        <div>
            <div className="w-20 h-3 bg-gray-300" /> {/* Skeleton for name */}
        </div>
    </div>
  );
}