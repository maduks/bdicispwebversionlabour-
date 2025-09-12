"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCookie } from "cookies-next"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import axios from "axios"
import UserTable from "../components/UserTable"
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

export default function AdminUserManagementPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
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

    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const userCookie = getCookie("user")
      const userData = JSON.parse(userCookie as string)
      const token = userData?.token

      const usersResponse = await axios.get<User[]>("https://ministryoflabourbackend.vercel.app/api/v1/admin/users", {
        headers: {
          "x-access-token": token,
        },
      })

      setUsers(usersResponse.data)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to fetch users")
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
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <UserTable users={users} onUserUpdate={fetchUsers} />
      </div>
    </DashboardLayout>
  )
} 