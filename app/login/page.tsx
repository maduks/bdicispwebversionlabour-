"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import LoginForm from "@/components/auth/LoginForm"

export default function LoginPage() {
  const [error, setError] = useState("")
  const [loading,setLoading] =useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (email: string, password: string) => {
 const data={email:email,password:password}
    try {
      setLoading(true)
      setError("")
      const users =await login(data)
      if(users.data?.role==="agent"){
        setError("We detected that this is an AGENT account. Agent login is not allowed here, please use the agent's login page")
        setLoading(false)
       return
      }

      if(users.message==="Login Successful"){
        setLoading(false)
        
        // Check if there's a redirect URL stored
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin')
        if (redirectUrl) {
          sessionStorage.removeItem('redirectAfterLogin')
          router.push(redirectUrl)
        } else {
          // Default redirect based on user role
          if (users.data?.role === "seeker") {
            router.push("/user-profile")
          } else {
            router.push("/dashboard")
          }
        }
      }
    } catch (err: any) {
      
      setLoading(false)
      setError(err.message)
    }
  }

  return (
    <div    style={{
      backgroundImage: `
      linear-gradient(rgba(28, 162, 96, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(28, 162, 96, 0.05) 1px, transparent 1px)
    `,
      backgroundSize: "20px 20px",
    }} className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6">
      <div className="mx-auto w-24 h-24 bg-white-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <img src="https://ik.imagekit.io/bdic/ministry-labour.png?updatedAt=1757610747399" alt="labour-logo" style={{minWidth:150,minHeight:100}} className="" />
            </div>
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome Back!
          </motion.h1>
          <motion.p
            className="text-muted-foreground mt-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Log in to manage your listings and account
          </motion.p>
        </div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6">{error}</div>}

          <LoginForm loading={loading} onSubmit={handleLogin} />

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}