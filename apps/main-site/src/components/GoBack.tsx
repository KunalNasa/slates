import { Button } from "@slates/ui/Button";
import { IoMdArrowBack } from "react-icons/io";

export default function GoBack() {
    return (
        <div className="my-2">
            <Button onClick={() => history.back()} variant="secondary" className="bg-none flex items-center text-sm gap-1 group">
                <span className="transform text-lg transition-transform duration-300 group-hover:-translate-x-1">
                    <IoMdArrowBack />
                </span>
                Back
            </Button>

        </div>
    );
}