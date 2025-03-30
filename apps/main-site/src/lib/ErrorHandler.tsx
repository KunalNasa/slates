// utils/errorHandler.ts
import { AxiosError } from "axios";
import { toast } from "sonner";


export function ErrorHandler(error: any) {
    if (error instanceof AxiosError) {
        toast.error("Error", {
            description: error.response?.data?.message || "An error occurred",
            duration: 3000,
        });  
    } else if (error instanceof Error) {
        toast.error("Error", {
            description: error.message || "An error occurred",
            duration: 3000,
        }); 
    } else {
        toast.error("Error", {
            description: "An unknown error occurred",
            duration: 3000,
        }); 
    }
    return null;
}
