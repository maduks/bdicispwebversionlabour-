"use client"

import { useState } from "react"
import { getCookie } from "cookies-next"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, Search, MoreHorizontal, Star } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios"

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

interface ListingTableProps {
  listings: Listing[]
  onListingUpdate: () => void
}

export default function ListingTable({ listings, onListingUpdate }: ListingTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || listing.type === typeFilter
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const handleUpdateStatus = async (listingId: string, status: string) => {
    setIsLoading(true)
    try {
      const userCookie = getCookie("user")
      const userData = JSON.parse(userCookie as string)
      const token = userData?.token

      await axios.put(
        `https://ministryoflabourbackend.vercel.app/api/v1/admin/listings/${listingId}/status`,
        { status },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )

      toast.success(`Listing ${status} successfully`)
      onListingUpdate()
    } catch (error) {
      console.error("Error updating listing status:", error)
      toast.error("Failed to update listing status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFeatured = async (listingId: string, currentStatus: boolean) => {
    setIsLoading(true)
    try {
      const userCookie = getCookie("user")
      const userData = JSON.parse(userCookie as string)
      const token = userData?.token

      await axios.put(
        `https://ministryoflabourbackend.vercel.app/api/v1/admin/listings/${listingId}/featured`,
        { isFeatured: !currentStatus },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )

      toast.success(`Listing ${currentStatus ? "unfeatured" : "featured"} successfully`)
      onListingUpdate()
    } catch (error) {
      console.error("Error updating listing featured status:", error)
      toast.error("Failed to update listing featured status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return

    setIsLoading(true)
    try {
      const userCookie = getCookie("user")
      const userData = JSON.parse(userCookie as string)
      const token = userData?.token

      await axios.delete(`https://ministryoflabourbackend.vercel.app/api/v1/admin/listings/${listingId}`, {
        headers: {
          "x-access-token": token,
        },
      })

      toast.success("Listing deleted successfully")
      onListingUpdate()
    } catch (error) {
      console.error("Error deleting listing:", error)
      toast.error("Failed to delete listing")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="property">Properties</SelectItem>
            <SelectItem value="service">Services</SelectItem>
            <SelectItem value="product">Products</SelectItem>
            <SelectItem value="business">Businesses</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.map((listing) => (
              <TableRow key={listing._id}>
                <TableCell>{listing.title}</TableCell>
                <TableCell className="capitalize">{listing.type}</TableCell>
                <TableCell>{listing.owner.fullName}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      listing.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : listing.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {listing.status}
                  </span>
                </TableCell>
                <TableCell>
                  {listing.isFeatured && (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  )}
                </TableCell>
                <TableCell>
                  {new Date(listing.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {listing.status === "pending" && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(listing._id, "approved")}
                            disabled={isLoading}
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleUpdateStatus(listing._id, "rejected")}
                            disabled={isLoading}
                          >
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem
                        onClick={() => handleToggleFeatured(listing._id, listing.isFeatured)}
                        disabled={isLoading}
                      >
                        {listing.isFeatured ? "Unfeature" : "Feature"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteListing(listing._id)}
                        disabled={isLoading}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 