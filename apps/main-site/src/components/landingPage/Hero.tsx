'use client'
import Image from "next/image";
import Navbar from "./Navbar";

export default function Hero() {
  return (
    <div className="w-full mb-24 flex flex-row">
        <HeroLeft/>
        <HeroRight/>
    </div>
  );
}

function HeroLeft () {
    return (
        <div className=" w-1/2 p-5 rounded-r-3xl bg-pink-500/20">
            <div className="p-3 w-full">
                <div className="mb-5">
                    <Image width={120} height={120} src="/SlatesLogo.svg" alt="Logo" />
                </div>
                <div className="py-20">

                <div className="py-10">
                    <h1 className="z-10 text-7xl">
                        The Ultimate <div className="font-atma rounded-2xl bg-pink-400 p-1">Collaborative Slate</div> for Creative Minds!</h1>
                    <p className="text-gray-500 my-2 text-lg font-semibold">Draw, sketch, brainstorm, and collaborate in real time with your team.</p>
                </div>
                <div className="flex flex-row gap-4 w-full justify-center">
                    <div className="Square flex items-center justify-center rounded-sm border w-1/3 bg-blue-500/80 border-black p-5">
                        <p className="p-10 mx-auto my-auto border-2"></p>
                    </div>
                    <div className="Circle flex items-center justify-center border rounded-sm text-center w-1/3 bg-pink-500/80  border-black p-5">
                        <p className="p-10 rounded-full h-20 w-20 border-2"></p>
                    </div>
                    <div className="Line flex items-center justify-center w-1/3 rounded-sm bg-green-500/80  border border-black p-5">
                        <p className="w-24 border-2"></p>
                    </div>
                </div>

                </div>
            </div>
        </div>
    )
}

function HeroRight () {
    return (
        <div className="w-1/2">
            <Navbar/>
            <div className="w-full my-20">
                <Image className="mx-auto my-auto" width={850} height={850} src="/LandingImage.svg" alt="Landing page image" />
            </div>
        </div>
    )
}