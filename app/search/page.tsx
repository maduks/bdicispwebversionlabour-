"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, ChevronDown, MapPin, Star, Clock, CheckCircle, X, Filter, Phone, Mail, Award, Calendar, TrendingUp, FileCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { NIGERIA_STATES } from "@/lib/nigeria-states"
import { useToast } from "@/components/ui/use-toast"

// Types
interface Certification {
  _id: string
  entityId: string
  certHash: string
  certificationType: string
  profession: string
  location: string
  specialization: string
  category: string
  validityPeriod: number
  licenseActive: boolean
  certificateReferenceId: string
  paymentType: string
  ministryId: string
  amountPaid: string
  Reference: string
  certificationAddressedTo: string
  issuedBy: string
  issueDate: string
  expirationDate: string
  approvedBy: string
  status: string
  notes: string
  auditTrail: any[]
}

interface ServiceProvider {
  _id: string
  profession: string
  category: string
  specialization: string
  skills: string[]
  yearsOfExperience: number
  availability: string
  isVerified: boolean
  status: string
  approvalstatus: string
  rating: {
    average: number
    note: string
  }
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  certifications?: Certification[]
  user: {
    _id: string
    fullName: string
    email: string
    phoneNumber: string
    gender: string
  }
  kyc: {
    _id: string
    fullName: string
    nin: string
    photo: string
    dateOfBirth: string
  }
  ministry: {
    _id: string
    name: string
    description: string
  }
  createdAt: string
  updatedAt: string
}

interface SearchFilters {
  search: string
  userName: string
  profession: string[]
  category: string[]
  specialization: string[]
  skills: string[]
  yearsOfExperience: number | null
  availability: string[]
  isVerified: boolean | null
  status: string[]
  approvalstatus: string[]
  ministry: string[]
  educationLevels: string[]
  state: string
  city: string
  zip: string
  minRating: number
  maxRating: number
  minExperience: number
  maxExperience: number
  createdAfter: string
  createdBefore: string
  assignedAfter: string
  assignedBefore: string
  sort: string
  page: number
  limit: number
}

interface SearchResponse {
  success: boolean
  message: string
  data: ServiceProvider[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
  filters: any
}

export default function SearchPage() {
  const { toast } = useToast()
  
  // State
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<ServiceProvider[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [cities, setCities] = useState<string[]>([])
  
  // Filters state
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    userName: "",
    profession: [],
    category: [],
    specialization: [],
    skills: [],
    yearsOfExperience: null,
    availability: [],
    isVerified: null,
    status: [],
    approvalstatus: [],
    ministry: [],
    educationLevels: [],
    state: "all",
    city: "all",
    zip: "",
    minRating: 0,
    maxRating: 5,
    minExperience: 0,
    maxExperience: 50,
    createdAfter: "",
    createdBefore: "",
    assignedAfter: "",
    assignedBefore: "",
    sort: "-createdAt",
    page: 1,
    limit: 12
  })

  // Get cities when state changes
  useEffect(() => {
    if (filters.state && filters.state !== 'all') {
      const stateData = NIGERIA_STATES.find(s => s.name === filters.state)
      if (stateData) {
        setCities(stateData.lgas.map(lga => lga.name))
      }
    } else {
      setCities([])
    }
    setFilters(prev => ({ ...prev, city: "all" }))
  }, [filters.state])

  // Build query parameters
  const buildQueryParams = useMemo(() => {
    const params: any = {}
    
    if (filters.search) params.search = filters.search
    if (filters.userName) params.userName = filters.userName
    if (filters.profession.length > 0) params.profession = filters.profession.join(',')
    if (filters.category.length > 0) params.category = filters.category.join(',')
    if (filters.specialization.length > 0) params.specialization = filters.specialization.join(',')
    if (filters.skills.length > 0) params.skills = filters.skills.join(',')
    if (filters.yearsOfExperience !== null) params.yearsOfExperience = filters.yearsOfExperience
    if (filters.availability.length > 0) params.availability = filters.availability.join(',')
    if (filters.isVerified !== null) params.isVerified = filters.isVerified
    if (filters.status.length > 0) params.status = filters.status.join(',')
    if (filters.approvalstatus.length > 0) params.approvalstatus = filters.approvalstatus.join(',')
    if (filters.ministry.length > 0) params.ministry = filters.ministry.join(',')
    if (filters.educationLevels.length > 0) params.educationLevels = filters.educationLevels.join(',')
    if (filters.state && filters.state !== 'all') params.state = filters.state
    if (filters.city && filters.city !== 'all') params.city = filters.city
    if (filters.zip) params.zip = filters.zip
    if (filters.minRating > 0) params.minRating = filters.minRating
    if (filters.maxRating < 5) params.maxRating = filters.maxRating
    if (filters.minExperience > 0) params.minExperience = filters.minExperience
    if (filters.maxExperience < 50) params.maxExperience = filters.maxExperience
    if (filters.createdAfter) params.createdAfter = filters.createdAfter
    if (filters.createdBefore) params.createdBefore = filters.createdBefore
    if (filters.assignedAfter) params.assignedAfter = filters.assignedAfter
    if (filters.assignedBefore) params.assignedBefore = filters.assignedBefore
    if (filters.sort) params.sort = filters.sort
    if (filters.page) params.page = filters.page
    if (filters.limit) params.limit = filters.limit
    
    return params
  }, [filters])

  // Search function
  const performSearch = async () => {
    setLoading(true)
    try {
      const params = buildQueryParams
      
      const response = await fetch(`https://ministryoflabourbackend.vercel.app/api/v1/serviceproviderservicehub/service-provider-hub/search?${new URLSearchParams(params)}`)
      const data: SearchResponse = await response.json()
      
      if (data.success) {
        setSearchResults(data.data)
        setPagination(data.pagination)
      } else {
        toast({
          title: "Search Error",
          description: data.message || "Failed to search service providers",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search Error",
        description: "An error occurred while searching. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Handle array filter changes
  const handleArrayFilterChange = (key: keyof SearchFilters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked 
        ? [...(prev[key] as string[]), value]
        : (prev[key] as string[]).filter(item => item !== value)
    }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
    performSearch()
  }

  // Remove automatic search on filter changes - now only triggered by button click

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get rating stars
  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-full bg-white shadow-lg rounded-xl p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Find Professional Service Providers
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
                Search and connect with verified professionals across Nigeria. Filter by profession, location, ratings, and more.
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by profession, name, or specialization..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 text-lg"
                />
              </div>
              <Select value={filters.state} onValueChange={(value) => handleFilterChange('state', value)}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {NIGERIA_STATES.map((state) => (
                    <SelectItem key={state.name} value={state.name}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={() => {
                  setFilters(prev => ({ ...prev, page: 1 })) // Reset to first page when searching
                  performSearch()
                }}
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 text-lg py-3"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>

            {/* Advanced Filter Toggle */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="inline-flex items-center hover:bg-gray-50 text-lg py-3"
              >
                <Filter className="h-5 w-5 mr-2" />
                <ChevronDown
                  className={`h-5 w-5 ml-2 transform transition-transform duration-300 ${
                    showAdvancedFilters ? "rotate-180" : ""
                  }`}
                />
                Advanced Filters
              </Button>
            </div>

            {/* Advanced Filter Section */}
            {showAdvancedFilters && (
              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Refine Your Search</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Basic Filters */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">Basic Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search by Name
                      </label>
                      <Input
                        placeholder="Enter full name..."
                        value={filters.userName}
                        onChange={(e) => handleFilterChange('userName', e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <Select value={filters.city} onValueChange={(value) => handleFilterChange('city', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select City" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <Input
                        placeholder="Enter ZIP code..."
                        value={filters.zip}
                        onChange={(e) => handleFilterChange('zip', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Rating & Experience */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">Rating & Experience</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating Range: {filters.minRating} - {filters.maxRating}
                      </label>
                      <div className="space-y-2">
                        <Slider
                          value={[filters.minRating, filters.maxRating]}
                          onValueChange={([min, max]) => {
                            handleFilterChange('minRating', min)
                            handleFilterChange('maxRating', max)
                          }}
                          max={5}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0</span>
                          <span>5</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Range: {filters.minExperience} - {filters.maxExperience} years
                      </label>
                      <div className="space-y-2">
                        <Slider
                          value={[filters.minExperience, filters.maxExperience]}
                          onValueChange={([min, max]) => {
                            handleFilterChange('minExperience', min)
                            handleFilterChange('maxExperience', max)
                          }}
                          max={50}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0 years</span>
                          <span>50+ years</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status & Verification */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-700">Status & Verification</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Status
                      </label>
                      <Select 
                        value={filters.isVerified?.toString() || ""} 
                        onValueChange={(value) => handleFilterChange('isVerified', value === "" ? null : value === "true")}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="true">Verified Only</SelectItem>
                          <SelectItem value="false">Not Verified</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                      </label>
                      {["Available", "Unavailable", "Busy"].map((status) => (
                        <label key={status} className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            checked={filters.availability.includes(status)}
                            onCheckedChange={(checked) => 
                              handleArrayFilterChange('availability', status, checked as boolean)
                            }
                          />
                          <span className="text-sm">{status}</span>
                        </label>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Approval Status
                      </label>
                      {["approved", "pending", "rejected"].map((status) => (
                        <label key={status} className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            checked={filters.approvalstatus.includes(status)}
                            onCheckedChange={(checked) => 
                              handleArrayFilterChange('approvalstatus', status, checked as boolean)
                            }
                          />
                          <span className="text-sm capitalize">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        search: "",
                        userName: "",
                        profession: [],
                        category: [],
                        specialization: [],
                        skills: [],
                        yearsOfExperience: null,
                        availability: [],
                        isVerified: null,
                        status: [],
                        approvalstatus: [],
                        ministry: [],
                        educationLevels: [],
                        state: "all",
                        city: "all",
                        zip: "",
                        minRating: 0,
                        maxRating: 5,
                        minExperience: 0,
                        maxExperience: 50,
                        createdAfter: "",
                        createdBefore: "",
                        assignedAfter: "",
                        assignedBefore: "",
                        sort: "-createdAt",
                        page: 1,
                        limit: 12
                      })
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              </div>
            )}

            {/* Search Results */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Search Results {pagination && `(${pagination.total} found)`}
                </h2>
                
                {/* Sort Options */}
                <Select value={filters.sort} onValueChange={(value) => {
                  handleFilterChange('sort', value)
                  setFilters(prev => ({ ...prev, page: 1 })) // Reset to first page when sorting
                  performSearch()
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-createdAt">Newest First</SelectItem>
                    <SelectItem value="createdAt">Oldest First</SelectItem>
                    <SelectItem value="-rating.average">Highest Rating</SelectItem>
                    <SelectItem value="rating.average">Lowest Rating</SelectItem>
                    <SelectItem value="-yearsOfExperience">Most Experienced</SelectItem>
                    <SelectItem value="yearsOfExperience">Least Experienced</SelectItem>
                    <SelectItem value="profession">A-Z by Profession</SelectItem>
                    <SelectItem value="-profession">Z-A by Profession</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Searching for professionals...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
                </div>
              ) : (
                <>
                  {/* Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((provider) => (
                      <Card key={provider._id} className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                                {provider.user?.fullName || "N/A"}
                              </CardTitle>
                              <p className="text-emerald-600 font-medium">{provider.profession}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                              {provider.isVerified && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                                                            {(() => {
                                const relevantCerts = provider.certifications?.filter(
                                  cert => cert.profession === provider.profession
                                ) || []
                                return relevantCerts.length > 0 ? (
                                  <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                                    <FileCheck className="h-3 w-3 mr-1" />
                                    Certified
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="text-gray-600">
                                    <X className="h-3 w-3 mr-1" />
                                    Not Certified
                                  </Badge>
                                )
                              })()}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-3">
                          {/* Rating */}
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {getRatingStars(provider.rating?.average || 0)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {provider.rating?.average?.toFixed(1) || "N/A"}
                            </span>
                          </div>

                          {/* Specialization */}
                          {provider.specialization && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Award className="h-4 w-4 mr-2 text-emerald-500" />
                              <span className="font-medium">Specialization:</span>
                              <span className="ml-1">{provider.specialization}</span>
                            </div>
                          )}

                          {/* Experience */}
                          <div className="flex items-center text-sm text-gray-600">
                            <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
                            <span className="font-medium">Experience:</span>
                            <span className="ml-1">{provider.yearsOfExperience || 0} years</span>
                          </div>

                          {/* Location */}
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2 text-emerald-500" />
                            <span>
                              {provider.address?.city && `${provider.address.city}, `}
                              {provider.address?.state || "N/A"}
                            </span>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-1">
                            {provider.user?.phoneNumber && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2 text-emerald-500" />
                                <span>{provider.user.phoneNumber}</span>
                              </div>
                            )}
                            {provider.user?.email && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Mail className="h-4 w-4 mr-2 text-emerald-500" />
                                <span className="truncate">{provider.user.email}</span>
                              </div>
                            )}
                          </div>

                          {/* Skills */}
                          {provider.skills && provider.skills.length > 0 && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Skills:</p>
                              <div className="flex flex-wrap gap-1">
                                {provider.skills.slice(0, 3).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {provider.skills.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{provider.skills.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Availability & Status */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-1 text-emerald-500" />
                              <span className={`
                                ${provider.availability === 'Available' ? 'text-green-600' : 
                                  provider.availability === 'Busy' ? 'text-yellow-600' : 'text-red-600'}
                              `}>
                                {provider.availability || 'Unknown'}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Joined {formatDate(provider.createdAt)}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2 pt-3">
                            <Button 
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => {
                                const providerData = encodeURIComponent(JSON.stringify(provider))
                                window.open(`/search/${provider._id}?data=${providerData}`, '_blank')
                              }}
                            >
                              View Profile
                            </Button>
                            <Button variant="outline" className="flex-1">
                              Contact
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.pages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={!pagination.hasPrev}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                          const page = i + 1
                          return (
                            <Button
                              key={page}
                              variant={page === pagination.page ? "default" : "outline"}
                              onClick={() => handlePageChange(page)}
                              className="w-10 h-10"
                            >
                              {page}
                            </Button>
                          )
                        })}
                        {pagination.pages > 5 && (
                          <>
                            <span className="px-2">...</span>
                            <Button
                              variant="outline"
                              onClick={() => handlePageChange(pagination.pages)}
                              className="w-10 h-10"
                            >
                              {pagination.pages}
                            </Button>
                          </>
                        )}
                      </div>
                      
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={!pagination.hasNext}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 