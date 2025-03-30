import "./globals.css"
import "@slates/design-system/styles.css"
import "@slates/ui/styles.css"
import type { Metadata } from "next"
import { Atma } from "next/font/google"

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
      <body className={`${atma.variable}`}>{children}</body>
    </html>
  )
}