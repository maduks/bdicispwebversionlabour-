"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCookie } from "cookies-next"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import axios from "axios"
import ListingTable from "../components/ListingTable"
import DashboardLayout from "../../../components/dashboard/DashboardLayout"

interface User {
  _id: string
  fullName: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  phoneNumber: string
  lastLogin: string
}

interface Listing {
  _id: string
  title: string
  type: "property" | "service" | "product" | "business"
  owner: {
    _id: string
    fullName: string
  }
  status: "pending" | "approved" | "rejected"
  isFeatured: boolean
  createdAt: string
}

export default function AdminListingManagementPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userCookie = getCookie("user")
    if (!userCookie) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(userCookie as string)
    if (userData?.data?.role !== "superadmin") {
      router.push("/dashboard")
      return
    }

    fetchListings()
  }, [router])

  const fetchListings = async () => {
    setIsLoading(true)
    try {
      const userCookie = getCookie("user")
      const userData = JSON.parse(userCookie as string)
      const token = userData?.token

      const listingsResponse = await axios.get<Listing[]>("https://ministryoflabourbackend.vercel.app/api/v1/admin/listings", {
        headers: {
          "x-access-token": token,
        },
      })

      setListings(listingsResponse.data)
    } catch (error) {
      console.error("Error fetching listings:", error)
      toast.error("Failed to fetch listings")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Listing Management</h1>
        </div>
        <ListingTable listings={listings} onListingUpdate={fetchListings} />
      </div>
    </DashboardLayout>
  )
} 