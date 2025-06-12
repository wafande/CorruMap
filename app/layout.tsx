import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import { Header } from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CorruMap - Fighting Corruption in Kenya",
  description: "Anonymous corruption reporting and tracking platform for Kenya",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-kenya-black to-slate-800">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-700 py-4 bg-slate-900/80">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                &copy; {new Date().getFullYear()} CorruMap - Fighting Corruption in Kenya
              </p>
              <div className="flex items-center gap-4"></div>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
