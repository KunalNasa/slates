'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { DisplayRoomType, formatDateTime, roomSchema } from "@slates/common/schemas";
import { Button } from "@slates/ui/Button";
import { FormField } from "@slates/ui/Formfield";
import { Input } from "@slates/ui/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BACKEND_URL } from "../../configs/ServerUrls";
import { ErrorHandler } from "../../lib/ErrorHandler";
import { useEffect, useState } from "react";
import { LuLoaderCircle } from "react-icons/lu";
import DisplayRoomCards from "../Cards/DisplayRoomCards";


export default function RoomHero() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<DisplayRoomType[] | []>([]);
  const form = useForm< z.infer<typeof roomSchema>>({
    resolver : zodResolver(roomSchema),
    defaultValues : {
      name : ""
    }
  })
  const fetchAllRooms = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/getAllRooms`, {
        withCredentials : true
      });
      setRooms(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      ErrorHandler(error);
    }
  }
  useEffect(() => {
    fetchAllRooms();
  }, [])
  const onSubmit = async (data : z.infer<typeof roomSchema>) => {
    setLoading(true);
    try {
      const {name} = data;
      const response = await axios.get(`${BACKEND_URL}/user/room/${name}`, {
        withCredentials : true
      });
      const payload = response.data;
      const roomId = payload.data.id;
      if(roomId){
        router.replace(`/room/${roomId}`);
      }
    } catch (error : any) {
        ErrorHandler(error); 
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className="p-5 w-full">
      <h2 className="my-2 text-4xl font-semibold">Join a Room</h2>
      <form className="border bg-white shadow-custom p-5 rounded-sm" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
        name="name"
        label="Room Name"
        errors={form.formState.errors}
        >
          <Input placeholder="Search Room" {...form.register("name")}/>
        </FormField>
        <Button type="submit" variant="primary-blue">
          {loading ? <LuLoaderCircle className="animate-spin" /> : "Join Room"}
        </Button>
      </form>
      <div className="my-10">
        <h3 className="text-4xl font-semibold">Previously Joined Rooms</h3>
        <div className="flex gap-5 my-4 flex-wrap">
          {rooms.map((item, idx) => (
            <DisplayRoomCards 
            key={idx}
            createdBy = {item.username}
            roomId = {item.id}
            roomName ={item.slug}
            createdAt={formatDateTime(item.createdAt)}
            />
          ))}
        </div>
      </div>

    </div>
  )
}