"use client";

import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

const bgClass = ["bg-pink-500/60", "bg-red-500/60", "bg-purple-500/60"];

const faqs = [
  {
    title: "What is Slates?",
    content:
      "Slates is an infinite collaborative canvas where you can sketch, brainstorm, and visualize ideas in real time with others. No limits, no constraints—just pure creativity."
  },
  {
    title: "How does Slates work?",
    content:
      "Slates lets you zoom, pan, and draw freely, offering an unrestricted space for creativity. It supports real-time collaboration, allowing multiple users to contribute simultaneously."
  },
  {
    title: "Is Slates free to use?",
    content:
      "Yes! Slates offers a free version packed with powerful features. Advanced tools and additional functionalities are available in the premium version for professional teams."
  },
  {
    title: "Can I access my work from any device?",
    content:
      "Absolutely! Slates syncs your work across devices, so you can pick up where you left off, whether on desktop, tablet, or mobile."
  },
  {
    title: "Does Slates support real-time collaboration?",
    content:
      "Yes! You can invite teammates to collaborate instantly. Changes are reflected in real time, making remote teamwork seamless."
  }
];

const Accordion = ({ title, content }: { title: string; content: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0)] mb-5 w-full mx-auto rounded-sm overflow-hidden">
      {/* Accordion Header */}
      <button
        className="w-full text-xl flex justify-between items-center p-10 text-left font-semibold bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <FaAngleDown
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Accordion Content with Smooth Expansion */}
      <div
        className={`transition-[max-height] duration-500 ${bgClass[Math.floor(Math.random()*3)]} ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4">{content}</div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div id="faqs" className="p-6 w-11/12 mx-auto">
      <h1 className="text-7xl py-5 font-semibold">FAQs...</h1>
      {faqs.map((faq, index) => (
        <Accordion key={index} title={faq.title} content={faq.content} />
      ))}
    </div>
  );
}
