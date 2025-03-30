import {Button} from "@slates/ui/Button"
import Link from "next/link"
import { FaGithub } from "react-icons/fa";
export default function Navbar() {
  return (
    <nav className="w-full p-5 flex items-center gap-10 justify-center">
        <Link href='/signup'>
            <Button variant="primary-pink">Signup</Button>
        </Link>
        <Link href='/signin'>
            <Button variant="primary-blue">Signin</Button>
        </Link>
        <Link href='https://github.com/KunalNasa/slates'>
            <Button className="flex items-center gap-2" variant="primary-green">
                <span><FaGithub/></span>
                Github
            </Button>
        </Link>
    </nav>
  );
}