'use client'

import Link from 'next/link';

export default function Page() {
  return (
    <main className="h-screen flex flex-col items-center justify-center w-screen bg-black">
      <header className="w-full p-4 bg-gray-800 flex justify-between items-center">
        <h1 className="text-white text-2xl">Slates</h1>
        <nav>
          <Link href="/signup">
            <p className="text-white mx-2">Sign Up</p>
          </Link>
          <Link href="/signin">
            <p className="text-white mx-2">Sign In</p>
          </Link>
        </nav>
      </header>
    </main>
  )
}
