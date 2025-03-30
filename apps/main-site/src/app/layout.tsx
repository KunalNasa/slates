import "./globals.css"
import "@slates/design-system/styles.css"
import "@slates/ui/styles.css"
import type { Metadata } from "next"
import { Atma } from "next/font/google"
import { Toaster, toast } from "sonner";

export const metadata: Metadata = {
  title: "Turborepo with Tailwind Version 4",
  description: "Updated Turborepo with Tailwind Version 4",
}
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
  return (
    <html lang="en">
      <body className={`${atma.variable}`}>
        {children}
        <Toaster toastOptions={{
          style: {
            border: 'solid 2px black',
            padding : "25px",
            fontSize: "16px",
            boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)"
          },
  }} position="top-right" richColors />
      </body>
      
    </html>
  )
}