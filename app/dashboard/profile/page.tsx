"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { getCookie, setCookie } from "cookies-next"
import axios from "axios"
import { Toaster, toast } from "sonner"

interface UserData {
  fullName: string
  email: string
  phoneNumber: string
  address?: string
  password?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<UserData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  })

  useEffect(() => {
    const userCookie = getCookie("user")
    if (!userCookie) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(userCookie as string)
      setFormData({
        fullName: userData?.data?.fullName || "",
        email: userData?.data?.email || "",
        phoneNumber: userData?.data?.phoneNumber || "",
        address: userData?.data?.address || "",
      })
    } catch (error) {
      console.error("Error parsing user data:", error)
      toast.error("Failed to load user data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const handleUpdateUser = async () => {
    setIsSaving(true)
    try {
      const userCookie = getCookie("user")
      if (!userCookie) {
        router.push("/login")
        return
      }

      const userData = JSON.parse(userCookie as string)
      const token = userData?.token

      // Create request body without password first
      const requestBody: any = {
        updateData:{
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address
        }
      }

      // Only add password if it's filled
      if (formData.password) {
        requestBody.updateData.password = formData.password
      }

      const { data: updatedUser } = await axios.post(`https://ministryoflabourbackend.vercel.app/api/v1/profile/${userData.data._id}`, requestBody, {
        headers: {
          "x-access-token": `${token}`,
        },
      })
      
      // Update the cookie with new user data
      setCookie("user", JSON.stringify({
        ...userData,
        data: {
          ...updatedUser.updatedUser
        }
      }))


      let msg = formData.password ? "You'll be directed to login page to login after 5 secs, because your password have changed":""

      toast.success("Profile updated successfully."+msg)

      if (formData.password) {
        setTimeout(()=>{
          router.push("/login")
        },5000)
       
      }


    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleUpdateUser()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  return (
    <>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#10B981',
            color: 'white',
          },
          className: 'my-toast',
        }} 
        closeButton={true} 
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password (optional)"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}