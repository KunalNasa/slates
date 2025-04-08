'use client'

import { useState } from "react";
import { BACKEND_URL } from "../../configs/ServerUrls";
import axios from "axios";
import { ErrorHandler } from "../../lib/ErrorHandler";
import { FormField } from "@slates/ui/Formfield";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema } from "@slates/common/schemas";
import { LuLoaderCircle } from "react-icons/lu";
import { Input } from "@slates/ui/Input";
import { Button } from "@slates/ui/Button";

export default function CreateRoomHero() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const form = useForm< z.infer<typeof roomSchema>>({
        resolver : zodResolver(roomSchema),
        defaultValues : {
          name : ""
        }
      })
    const onSubmit = async (data : z.infer<typeof roomSchema>) => {
        setLoading(true);
        try {
          const { name } = data;
          const response = await axios.post(`${BACKEND_URL}/user/room`, {
                name
          }, {
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
              {loading ? <LuLoaderCircle className="animate-spin" /> : "Create Room"}
            </Button>
          </form>
          <div className="my-10">
            <h3 className="text-4xl font-semibold">Previously Created Rooms</h3>
        </div>
        </div>
  );
}