'use client'
import "@slates/design-system/styles.css"
import "@slates/ui/styles.css"
import { Atma } from "next/font/google"
import useAxiosInterceptors from "../../hooks/useAxiosInterceptor"


const atma = Atma({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-atma",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    useAxiosInterceptors();
  return (
    <html lang="en">
      <body className={`${atma.variable}`}>
        {children}
      </body>
    </html>
  )
}