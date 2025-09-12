"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { User, Mail, Phone, MapPin, Settings } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(11, "Phone number must be 11 digits"),
  location: z.string().min(2, "Location must be at least 2 characters"),
})

export default function EditProfileForm({ onProfileUpdated }: { onProfileUpdated?: () => void }) {
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  // Helper function to safely extract user data
  const getUserData = () => {
    if (!currentUser) return null
    
    // Handle different data structures
    const userData = currentUser?.data?.newUser || currentUser?.data || currentUser
    return {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      phoneNumber: userData?.phoneNumber || "",
      address: (userData as any)?.address || "Benue State, Nigeria"
    }
  }

  const userData = getUserData()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      phoneNumber: userData?.phoneNumber || "",
      location: userData?.address || "Benue State, Nigeria",
    },
  })

  // Reset form when dialog opens to show current user data
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen) {
      form.reset({
        fullName: userData?.fullName || "",
        email: userData?.email || "",
        phoneNumber: userData?.phoneNumber || "",
        location: userData?.address || "Benue State, Nigeria",
      })
    }
  }

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      
      // Get user ID from current user - handle different data structures
      const userId = currentUser?.data?.newUser?._id || currentUser?.data?._id || (currentUser as any)?._id
      if (!userId) {
        throw new Error("User ID not found")
      }

      // Get token for authentication
      const token = currentUser?.token

      // Update profile via API using the correct endpoint
      const response = await axios.post(`https://ministryoflabourbackend.vercel.app/api/v1/profile/${userId}`, {
        updateData: {
          fullName: values.fullName,
          email: values.email,
          phoneNumber: values.phoneNumber,
          address: values.location, // Map location to address field
        }
      }, {
        headers: {
          "x-access-token": token,
        },
      })

      if (response.data.success || response.data.updatedUser) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully!",
        })
        
        // Close dialog
        handleOpenChange(false)
        
        // Refresh page to show updated data
        if (onProfileUpdated) {
          onProfileUpdated()
        } else {
          window.location.reload()
        }
      }
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your personal information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="John Doe"
                        className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="tel"
                        placeholder="08012345678"
                        className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Location</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Benue State, Nigeria"
                        className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 