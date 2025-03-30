'use client'
import axios from 'axios';
import z from "zod"
import { zodResolver } from '@hookform/resolvers/zod'; // Import zodResolver
import { FormField } from "@slates/ui/Formfield"
import { Input } from "@slates/ui/Input"

import {signinSchema, signupSchema} from "@slates/common/schemas"
import { BACKEND_URL } from '../../../configs/ServerUrls';
import { useForm } from "react-hook-form"
import { Button } from '@slates/ui/Button';
import GoBack from '../../../components/GoBack';
import Link from 'next/link';
import Image from 'next/image';
export default function SignUpPage() {
    const form = useForm<z.infer<typeof signupSchema>> ({
        resolver : zodResolver(signupSchema),
        defaultValues : {
            email: "",
            username: "",
            password : ""

        }
    })

    const onFormSubmit = async (data : z.infer<typeof signupSchema>) => {
        try {
            const {email, username, password} = data;
            const response = await axios.post(`${BACKEND_URL}/auth/signup`, {
                email,
                username,
                password
            },{
                withCredentials : true
            });
            const responseData = response.data;
            console.log("Data", responseData);
            if(responseData.success){
                const token = responseData.data.token;
                localStorage.setItem('jwt', token);
            }
        } catch (error : any) {
            console.log(error)
            alert(error.message);
        }
    }

    return (
        <div className="flex items-center bg-white justify-center h-screen">
            <div className='w-[40%] h-screen p-10'>
                <GoBack/>
                    <h3 className='text-2xl mt-5 font-semibold'>Singin to slates</h3>
                <form className='border my-5 p-5 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] rounded-sm' onSubmit={form.handleSubmit(onFormSubmit)}>
                    <FormField
                        name='email'
                        label='Email'
                        errors={form.formState.errors}>
                        <Input placeholder='Enter Email' {...form.register("email")} />
                    </FormField>
                    <FormField
                        name='username'
                        label='Username'
                        errors={form.formState.errors}>
                        <Input placeholder='Enter Username' {...form.register("username")} />
                    </FormField>
                    <FormField
                        name='password'
                        label='Password'
                        errors={form.formState.errors}>
                        <Input type='password' placeholder='Enter password' {...form.register("password")} />
                    </FormField>
                    
                    <Button type='submit' variant='primary-blue' className='w-full'>Submit</Button>
                </form>
                <p className='my-5'>Already have an account? <Link className='hover:text-purple-500/60' href="/signin">Signin</Link></p>
            </div>
            <div className='w-[60%] p-5 flex flex-col items-center justify-center h-screen bg-blue-500'>
                <h3 className='text-5xl font-semibold'><span className='bg-green-500 p-1 rounded-lg px-2'>Join.</span> <span className='bg-purple-500 p-1 rounded-lg px-2'>Create.</span> <span className='bg-yellow-500 p-1 rounded-lg px-2'>Collaborate.</span>  Unleash your ideas on an infinite canvas!</h3>
                <Image src="/SignUpPageImage.svg" height={800} width={800} className='my-auto mx-auto' alt="" />
            </div>

        </div>
    );
}