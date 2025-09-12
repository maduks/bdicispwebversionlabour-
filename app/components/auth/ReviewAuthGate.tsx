"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Lock, MessageSquare } from "lucide-react"
import Link from "next/link"

interface ReviewAuthGateProps {
  artisanName: string
  onAuthenticated?: () => void
}

export default function ReviewAuthGate({ artisanName, onAuthenticated }: ReviewAuthGateProps) {
  const { currentUser } = useAuth()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleSignIn = () => {
    // Store the current page to redirect back after login
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
    router.push('/login')
  }

  const handleSignUp = () => {
    // Store the current page to redirect back after signup
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname)
    router.push('/signup')
  }

  // If user is authenticated, show the review form
  if (currentUser && isAuthenticated) {
    return null // This will be replaced by the actual review form
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
          <Lock className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-lg text-gray-900">
          Sign in to leave a review
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Share your experience with {artisanName} and help others make informed decisions
        </p>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span>Rate their service</span>
          <MessageSquare className="h-4 w-4 text-blue-400" />
          <span>Write a review</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleSignIn}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign In
          </Button>
          <Button 
            onClick={handleSignUp}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            Create Account
          </Button>
        </div>
        
        <p className="text-xs text-gray-500">
          Your review will help other customers find reliable artisans
        </p>
      </CardContent>
    </Card>
  )
} 