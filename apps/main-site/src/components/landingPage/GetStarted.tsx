import { Button } from "@slates/ui/Button";
import Link from "next/link";

export default function GetStarted() {
  return (
    <div className="flex flex-col my-20 p-5 items-center justify-center">
        <h4 className="text-7xl font-semibold">Ready to create?</h4>
        <div className="flex gap-10 my-10">
            <Link href='/signup'>
                <Button variant="primary-pink">Create an Account</Button>
            </Link>
            <Link href='/signin'>
                <Button variant="primary-blue">Login to Your Account</Button>
            </Link>
        </div>
    </div>
  );
}