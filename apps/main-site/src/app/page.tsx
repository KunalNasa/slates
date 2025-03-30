'use client'

import { toast } from 'sonner';
import Faqs from '../components/landingPage/Faqs';
import Features from '../components/landingPage/Features';
import Footer from '../components/landingPage/Footer';
import GetStarted from '../components/landingPage/GetStarted';
import Hero from '../components/landingPage/Hero';

export default function Page() {
  return (
    <main className="w-full bg-white">
      <Hero/>
      <Features />
      <Faqs/>
      <GetStarted/>
      <Footer />
    </main>
  )
}
