"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../context/AuthContext"
import DashboardLayout from "../../components/dashboard/DashboardLayout"
import ListingManagement from "./ListingManagement"

export default function MyListingsPage() {
  const { currentUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login')
    }
  }, [currentUser, loading, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    )
  }

  return (
  
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Listings</h1>
          <button
            onClick={() => router.push('/dashboard/add-listing')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Add New Listing
          </button>
        </div>
        <ListingManagement />
      </div>

  )
}