'use client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


const useAxiosInterceptors = () => {
const router = useRouter();

useEffect(() => {
    // Add a response interceptor
    const interceptorId = axios.interceptors.response.use(
        (response) => {
            // If the response is successful, just return it
            // console.log(response);
            return response;
        },
        (error) => {
            // console.log("Interceptordata", error);
            // Check if the error response status is 401
            if (error.response?.status === 401) {
                console.error('Unauthorized! Logging out the user.');

                // Clear tokens or user data from local storage
                localStorage.removeItem('jwt');
                localStorage.removeItem('user');

                // Optionally, redirect the user to the login page
                router.replace('/signin');
            }

            // Reject the error so the calling code knows it failed
            return Promise.reject(error);
        }
    );

    // Cleanup interceptor when the component unmounts
    return () => {
        axios.interceptors.response.eject(interceptorId);
    };
}, [router]);
};

export default useAxiosInterceptors;
