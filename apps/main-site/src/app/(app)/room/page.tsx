'use client'
import "@slates/design-system/styles.css";
import "@slates/ui/styles.css";
import { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import RoomHero from "../../../components/Dashboard/Hero";

export default function page() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  return (
      <div className="flex bg-gray-100 flex-row w-full h-screen">
        <div className={`${isOpen ? "w-[20%]" : "w-[5%]" } transition-all duration-500` }>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
        <div
          className={`h-screen scroll-smooth overflow-y-scroll transition-all duration-500 ${
            isOpen ? "w-[80%]" : "w-[95%]"
          }`}
        >
          <RoomHero/>
        </div>
      </div>
  );
}
