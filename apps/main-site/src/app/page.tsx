'use client'

import Features from '../components/landingPage/Features';
import Footer from '../components/landingPage/Footer';
import GetStarted from '../components/landingPage/GetStarted';
import Hero from '../components/landingPage/Hero';

export default function Page() {
  return (
    <main className="w-full bg-white">
      <Hero/>
      <Features />
      <GetStarted/>
      <Footer />
    </main>
  )
}
