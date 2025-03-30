import { Button } from "@slates/ui/Button";
import Link from "next/link";
import { FaAngleLeft, FaAngleRight, FaHome, FaPlus, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <div className={`h-screen bg-gray-100 shadow-lg transition-all duration-500 flex flex-col items-end`}>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="tertiary"
        className="m-4"
      >
        {isOpen ? <FaAngleLeft size={24} /> : <FaAngleRight size={24} />}
        </Button>

      {/* Sidebar Content */}
      {isOpen ? <OpenSidebar /> : <ClosedSidebar />}
    </div>
  );
}

function OpenSidebar() {
  return (
    <div className="flex flex-col p-2 space-y-4 w-full text-left mt-10">
      <SidebarLink href="/room" icon={<FaHome />} label="Dashboard" />
      <SidebarLink href="/create-room" icon={<FaPlus />} label="Create Room" />
      <SidebarLink href="/logout" icon={<FaSignOutAlt />} label="Logout" />
    </div>
  );
}

function ClosedSidebar() {
  return (
    <div className="flex flex-col space-y-6 w-full mt-10 items-center">
        <Button variant="tertiary"><FaHome size={24} /></Button>
        <Button variant="tertiary"><FaPlus size={24} /></Button>
        <Button variant="tertiary"><FaSignOutAlt size={24} /></Button>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center space-x-4 p-2 hover:bg-gray-200 rounded-md w-full transition-all duration-300">
      {icon}
      <span className="text-lg">{label}</span>
    </Link>
  );
}
