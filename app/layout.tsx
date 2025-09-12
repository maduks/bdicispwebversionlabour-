"use client";
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "./components/theme-provider"
import Header from "./components/Header"
import Footer from "./components/Footer"
import type React from "react"
import { AuthProvider } from "./context/AuthContext"
import { ApiProvider } from "./context/ApiContext"
import { usePathname } from "next/navigation"
//import ProtectedRoute from "@/components/auth/ProtectedRoute"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) { 
  const pathname = usePathname();
  // Define route prefixes where Footer should be hidden
  const hideFooterRoutes = [
    "/dashboard",
    "/login",
    "/signup",
    "/verify-email"
  ];
  const shouldHideFooter = hideFooterRoutes.some(route => pathname.startsWith(route));
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
          <Header />
          <ApiProvider>
          <main>{children}</main>
          </ApiProvider>
       
          

         
          {!shouldHideFooter && <Footer />}
          </AuthProvider>
         
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'

