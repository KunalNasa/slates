import { Button } from "@slates/ui/Button";
import { Input } from "@slates/ui/Input";
import { useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import useDebounce from "../../hooks/useDebounceHook";
import axios from "axios";
import { BACKEND_URL } from "../../configs/ServerUrls";
import { ErrorHandler } from "../../lib/ErrorHandler";
import {SearchCards, SkeletonSearchCard} from "./SearchCards";

export default function Searchbar({socket} : {
    socket : WebSocket
}) {
    const [open, setOpen] = useState<boolean>(false);
    return (
      <div className={`fixed top-5 p-2 shadow-lg transition-all duration-500 rounded-md flex flex-col items-start right-10 ${open ? "w-64 bg-gray-900" : "w-16 bg-none"}`}>
        <Button 
            onClick={() => setOpen(!open)}
            variant="tertiary"
            className="m-4"
        >
            {open ? <FaAngleRight size={24} /> : <FaAngleLeft size={24} />}
        </Button>
        {open && <SearchInput socket={socket}/>}
      </div>
  );
}

export interface searchResultInterface {
    username : string,
    email : string,
    name : string, 
    avatar : string 
}
function SearchInput({socket} : {
    socket : WebSocket
}) {
    const [search, setSearch] = useState<string>("");
    const [result, setResult] = useState<searchResultInterface[] | []>( []);
    const [loading, setLoading] = useState<boolean>(false);
    const handleChange = async (value : string) => {
        setLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/user/search?query=${value}`, {
                withCredentials : true
            })
            setResult(response.data.data);
        } catch (error : any) {
            ErrorHandler(error);
        }finally{
            setLoading(false);
        }
    }
    useDebounce({
        value: search,
        callback : (val) => {
            if (val.trim() !== "") { // Only make a request if input is not empty
                handleChange(val);
            } else {
                setResult([]); // Clear results when input is empty
            }
        },
        interval : 200
    })

    return (
        <div className="w-full max-h-96 overflow-y-auto ">
            <Input value={search} onChange={(e) => {setSearch(e.target.value)}} className="text-gray-200 my-2" placeholder="Search by username or email" />
            <div className="flex flex-col w-full">
                {loading ? Array(3).fill(0).map((item, index) => (
                    <SkeletonSearchCard key={index}/>
                )) : result.map((item) => (
                    <SearchCards
                    socket = {socket}
                    key={item.email}
                    name={item.name}
                    email={item.email}
                    avatar={item.avatar}
                    username={item.username}
                     />
                ))}
            </div>
        </div>
    )
}