'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema } from "@slates/common/schemas";
import { Button } from "@slates/ui/Button";
import { FormField } from "@slates/ui/Formfield";
import { Input } from "@slates/ui/Input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BACKEND_URL } from "../../configs/ServerUrls";
import { ErrorHandler } from "../../lib/ErrorHandler";
import { useEffect } from "react";


export default function RoomHero() {
  const router = useRouter();
  const form = useForm< z.infer<typeof roomSchema>>({
    resolver : zodResolver(roomSchema),
    defaultValues : {
      name : ""
    }
  })
  useEffect(() => {
    const userRooms = "TODO: Find User Rooms here to display on rooms page"
  }, [])
  const onSubmit = async (data : z.infer<typeof roomSchema>) => {
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
        <Button type="submit" variant="primary-blue">Join Room</Button>
      </form>
      <div className="my-10">
        <h3 className="text-4xl font-semibold">Previously Joined Rooms</h3>
      </div>

    </div>
  )
}