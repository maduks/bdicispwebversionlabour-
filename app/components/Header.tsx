"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { MoonIcon, SunIcon, MenuIcon,User } from "lucide-react"
import { Button } from "@/components/ui/button"
import FullScreenMenu from "./FullScreenMenu"
import { useAuth } from "@/context/AuthContext"

export default function Header() {
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
const {currentUser,emailVerified} = useAuth()
  useEffect(() => setMounted(true), [])

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="mx-auto flex max-w-7xl items-center p-3 justify-between lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="">
              <div className="flex items-center">
                <img style={{height:"30%",width:"30%"}} src="https://ik.imagekit.io/bdic/ministry-labour.png?updatedAt=1757610747399" />
              </div>
            </Link>
          </div>
          <div className="hidden md:flex gap-x-8">
            <Link
              href="/search"
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              Search Professionals
            </Link>

            <Link
              href="/signup"
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              Register For Trade Test
            </Link>
            {/* <Link
              href="/listings?category=properties"
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              Properties
            </Link> */}
            {/* <Link
              href="/listings?category=businesses"
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              Businesses
            </Link>
            <Link
              href="/listings?category=services"
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              href="/listings?category=products"
              className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
            >
              Products
            </Link> */}
          </div>
          <div className="flex flex-1 justify-end items-center gap-4">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full p-2  bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
              </button>
            )}
            {/* <div className="hidden md:block">
              <Button className="rounded-full text-white gradient-primary hover:opacity-90">Add Listing</Button>
            </div> */}
            <button
              className="md:hidden rounded-full p-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>

          {currentUser  ? (
              <Link href={currentUser?.data?.newUser?.role === "seeker" ? "/user-profile" : "/dashboard"} className="hidden md:block">
                <Button className="rounded-full ml-5 text-white gradient-primary hover:opacity-90">
                  <User className="h-4 w-4 mr-2" />
                  {currentUser?.data?.newUser?.role === "seeker" ? "My Profile" : "Dashboard"}
                </Button>
              </Link>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/login" >
                  <Button variant="ghost" className="hover:text-primary">
                    Log In{emailVerified}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full text-white gradient-primary hover:opacity-90">Sign Up</Button>
                </Link>
              </div>
            )}
        </nav>
      </motion.header>
      <FullScreenMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
