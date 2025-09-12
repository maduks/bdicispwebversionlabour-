"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import SignupForm from "@/components/auth/SignupForm"
import axios from "axios"
import {toast, Toaster} from "sonner"
export default function SignupPage() {
  const [error, setError] = useState("")
  const [fieldErrors,setFieldErrors] =useState("")
  const [loading,setLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const handleSignup = async (userData: any) => {
      setLoading(true)
      setError("")
      await signup(userData).then(res=>{
        console.log("new user: "+JSON.stringify(res.data.data.newUser))
        console.log("new user2: "+JSON.stringify(res.data.message))
        if(res?.data?.message==
        "User registration successful. Check email for verification Code."){
          setLoading(false)
          
          // Check if there's a redirect URL stored
          const redirectUrl = sessionStorage.getItem('redirectAfterLogin')
          if (redirectUrl) {
            sessionStorage.removeItem('redirectAfterLogin')
            // Store the redirect URL to use after email verification
            sessionStorage.setItem('redirectAfterVerification', redirectUrl)
          }
          
          router.push(`/verify-email?email=${encodeURIComponent(res.data.data.newUser.email)}&userID=${res.data.data.newUser._id}`)
        }
      }).catch(err=>{
        setLoading(false)
        console.log('errors: ',err)
        toast.success(err.message)
        setError(err.message)
      })
   
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-0">
      <Toaster position="top-right"/>
      <div className=" mx-auto px-4 sm:px-6">
       
        <SignupForm loading={loading} onSubmit={handleSignup} />
      </div>
    </div>
  )
}