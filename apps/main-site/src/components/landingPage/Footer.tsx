import Image from "next/image";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="text-white py-10">
        <div className="w-full bg-black h-1" ></div>
      <div className="container mx-auto p-20 flex lg:flex-row justify-between items-start">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-start max-w-xs">
          <div className=" bg-white flex items-center justify-center rounded-md">
            {/* Replace with your actual logo */}
            <Image src="LogoFav.svg" height={80} width={80} alt="logo" />
          </div>
          <p className="mt-4 text-gray-400">
          Unleash Your Creativity Without Limits. Our infinite canvas with real-time collaboration empower your ideas to take shape effortlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-8 lg:mt-0">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-1 text-gray-400">
            <li><a href="#" className="hover:text-pink-400">Get Started</a></li>
            <li><a href="/#features" className="hover:text-pink-400">Features</a></li>
            <li><a href="/#faqs" className="hover:text-pink-400">FAQs</a></li>
          </ul>
        </div>

        {/* Connect Links */}
        <div className="mt-8 lg:mt-0">
          <h3 className="text-lg font-semibold">Connect Us</h3>
          <ul className="mt-2 space-y-1 text-gray-400">
            <li><a href="https://x.com/nasa_kunal" className="hover:text-blue-400 flex items-center gap-2"><FaTwitter /> Twitter</a></li>
            <li><a href="https://github.com/KunalNasa/slates" className="hover:text-blue-400 flex items-center gap-2"><FaGithub /> GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/kunalnasa/" className="hover:text-blue-400 flex items-center gap-2"><FaLinkedin /> LinkedIn</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-black  mt-8 pt-4 text-center text-gray-500">
        © 2024 Slates. All rights reserved.
      </div>
    </footer>
  );
}
