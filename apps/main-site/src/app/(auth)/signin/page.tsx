'use client'
import axios from 'axios';
import z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import { FormField } from "@slates/ui/Formfield"
import { Input } from "@slates/ui/Input"

import {signinSchema} from "@slates/common/schemas"
import { BACKEND_URL } from '../../../configs/ServerUrls';
import { useForm } from "react-hook-form"
import { Button } from '@slates/ui/Button';
import GoBack from '../../../components/GoBack';
import Link from 'next/link';
import Image from 'next/image';
import { ErrorHandler } from '../../../lib/ErrorHandler';
import { useRouter } from 'next/navigation';
export default function SignInPage() {
    const router = useRouter();
    const form = useForm<z.infer<typeof signinSchema>> ({
        resolver : zodResolver(signinSchema),
        defaultValues : {
            identifier : "",
            password : ""
        }
    })

    const onFormSubmit = async (data : z.infer<typeof signinSchema>) => {
        try {
            const {identifier, password} = data;
            const response = await axios.post(`${BACKEND_URL}/auth/signin`, {
                identifier,
                password
            },{
                withCredentials : true
            });
            const responseData = response.data;
            if(responseData.success){
                const token = responseData.data.token;
                localStorage.setItem('jwt', token);
                router.replace('/room')
            }
        } catch (error : any) {
            ErrorHandler(error);
        }
    }

    return (
        <div className="flex items-center bg-white justify-center h-screen">
            <div className='w-[40%] h-screen p-10'>
                <GoBack/>
                    <h3 className='text-2xl mt-5 font-semibold'>Singin to slates</h3>
                <form className='border my-5 p-5 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] rounded-sm' onSubmit={form.handleSubmit(onFormSubmit)}>
                    <FormField
                        name='identifier'
                        label='Username/Email'
                        errors={form.formState.errors}>
                        <Input placeholder='Enter email/password' {...form.register("identifier")} />
                    </FormField>
                    <FormField
                        name='password'
                        label='Password'
                        errors={form.formState.errors}>
                        <Input type='password' placeholder='Enter password' {...form.register("password")} />
                    </FormField>
                    
                    <Button type='submit' variant='primary-pink' className='w-full'>Submit</Button>
                </form>
                <p className='my-5'>Don't have an account? <Link className='hover:text-purple-500/60' href="/signup">Signup</Link></p>
            </div>
            <div className='w-[60%] p-5 flex flex-col items-center justify-center h-screen bg-pink-500'>
                <h3 className='text-5xl font-semibold'><span className='bg-green-500 p-1 rounded-lg px-2'>Join.</span> <span className='bg-purple-500 p-1 rounded-lg px-2'>Create.</span> <span className='bg-yellow-500 p-1 rounded-lg px-2'>Collaborate.</span>  Unleash your ideas on an infinite canvas!</h3>
                <Image src="/AuthPageImage.svg" height={800} width={800} className='my-auto mx-auto' alt="" />
            </div>

        </div>
    );
}