"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  Building, 
  User, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Shield, 
  GraduationCap,
  Briefcase,
  Home,
  Camera,
  MessageCircle,
  Share2,
  Bookmark,
  ExternalLink,
  Plus,
  X,
  FileText,
  FileCheck,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast, Toaster } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  category: string
  profession: string
  address: {
    street: string
    city: string
    state: string
  }
  specialization: string
  skills: string[]
  yearsOfExperience: number
  serviceDescription: string
  businessName: string
  availability: string
  isVerified: boolean
  educationLevels: string
  assignmentDate: string
  approvalstatus: string
  rating: {
    average: number
    note?: string
  }
  status: string
  createdAt: string
  updatedAt: string
  certifications?: Certification[]
  user: {
    _id: string
    fullName: string
    email: string
    phoneNumber: string
    isverified: boolean
    isKYCVerified: boolean
    role: string
    status: string
    gender: string
    createdAt: string
  }
  kyc: {
    _id: string
    fullName: string
    userId: string
    religion: string
    bankAccountNumber: string
    bankName: string
    accountName: string
    residentialaddress: string
    community: string
    dateOfBirth: string
    state: string
    lga: string
    nin: string
    photo: string
    status: string
    createdAt: string
  }
  ministry?: {
    _id: string
    name: string
    description: string
    minister: string
    email: string
    phoneNumber: string
  }
  assignedBy?: {
    _id: string
    fullName: string
    email: string
    phoneNumber: string
    role: string
  }
}

export default function ProfileViewPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()

  const { currentUser } = useAuth()
  const [provider, setProvider] = useState<ServiceProvider | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [showPortfolioDialog, setShowPortfolioDialog] = useState(false)
  const [showCertificationsDialog, setShowCertificationsDialog] = useState(false)
  const [showCertificateViewer, setShowCertificateViewer] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState<Certification | null>(null)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    const loadProvider = () => {
      setLoading(true)
      
      try {
        // Try to get data from URL parameters first
        const dataParam = searchParams.get('data')
        if (dataParam) {
          const decodedData = JSON.parse(decodeURIComponent(dataParam))
          setProvider(decodedData)
          setLoading(false)
          return
        }
        
        // Fallback to API call if no data in URL
        fetchProvider()
      } catch (error) {
        console.error("Error parsing provider data:", error)
        // Fallback to API call if parsing fails
        fetchProvider()
      }
    }

    const fetchProvider = async () => {
      if (!params.id) {
        setError("Provider ID not found")
        setLoading(false)
        return
      }
      
      try {
        const response = await fetch(`https://ministryoflabourbackend.vercel.app/api/v1/serviceproviderservicehub/service-provider-hub/${params.id}`)
        const data = await response.json()
        
        if (data.success) {
          setProvider(data.data)
        } else {
          setError(data.message || "Failed to fetch provider details")
          toast.error(data.message || "Failed to fetch provider details")
        }
      } catch (error) {
        console.error("Error fetching provider:", error)
        setError("An error occurred while fetching provider details")
        toast.error("An error occurred while fetching provider details")
      } finally {
        setLoading(false)
      }
    }

    loadProvider()
  }, [params.id, searchParams, toast])

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'text-green-600 bg-green-100'
      case 'Busy':
        return 'text-yellow-600 bg-yellow-100'
      case 'Unavailable':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getApprovalStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`
  }

  const handleEmail = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  const handleViewCertificate = (cert: Certification) => {
    setSelectedCertificate(cert)
    setShowCertificateViewer(true)
  }

  const handleSubmitReview = async () => {
    if (!currentUser) {
      toast.error("Please log in to leave a review")
      return
    }

    if (reviewRating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review")
      return
    }

    setSubmittingReview(true)
    try {
      // Here you would make an API call to submit the review
      // For now, we'll simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Thank you for your review!")
      
      setShowReviewDialog(false)
      setReviewRating(0)
      setReviewText("")
      
      // Refresh provider data to show new rating
      // You would typically refetch the provider data here
      
    } catch (error) {
      toast.error("Failed to submit review. Please try again.")
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The requested profile could not be found."}</p>
          <Button onClick={() => router.back()} className="bg-emerald-600 hover:bg-emerald-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/search')}
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Header Card */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-32 relative">
                <div className="absolute -bottom-16 left-6">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage 
                      src={provider.kyc?.photo} 
                      alt={provider.user.fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl font-bold bg-emerald-100 text-emerald-800">
                      {provider.user.fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              <CardContent className="pt-20 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{provider.user.fullName}</h1>
                      {provider.isVerified && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xl text-emerald-600 font-semibold mb-2">{provider.profession}</p>
                    
                    {provider.businessName && (
                      <p className="text-gray-600 mb-3">
                        <Building className="h-4 w-4 inline mr-2" />
                        {provider.businessName}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {provider.address.city}, {provider.address.state}
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {provider.yearsOfExperience} years experience
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleEmail(provider.user.email)}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating & Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-500" />
                      Rating & Reviews
                    </div>
                    {currentUser ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowReviewDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Leave Review
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast.error("Please login or signup to leave a review")
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Leave Review
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center">
                      {getRatingStars(provider.rating.average)}
                    </div>
                    <span className="text-2xl font-bold">{provider.rating.average.toFixed(1)}</span>
                    <span className="text-gray-500">/ 5.0</span>
                  </div>
                  {provider.rating.note && (
                    <p className="text-gray-600 italic">"{provider.rating.note}"</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">No reviews yet. Be the first to review!</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-emerald-500" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`text-sm font-medium ${getAvailabilityColor(provider.availability)}`}>
                    {provider.availability}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    Last updated: {formatDate(provider.updatedAt)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Service Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-emerald-500" />
                  About My Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{provider.serviceDescription}</p>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Specialization</h4>
                    <Badge variant="secondary" className="text-emerald-700 bg-emerald-50">
                      {provider.specialization}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Category</h4>
                    <Badge variant="secondary" className="text-blue-700 bg-blue-50">
                      {provider.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {provider.skills && provider.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-emerald-500" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {provider.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-emerald-700 border-emerald-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-emerald-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{provider.user.phoneNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-3 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{provider.user.email}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {provider.address.street}, {provider.address.city}, {provider.address.state}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog open={showCertificationsDialog} onOpenChange={setShowCertificationsDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <FileCheck className="h-4 w-4 mr-2" />
                      View Certifications
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <FileCheck className="h-5 w-5 mr-2" />
                         Certifications - {provider.user.fullName}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      {provider.certifications && provider.certifications.length > 0 ? (
                        (() => {
                          const relevantCerts = provider.certifications.filter(
                            cert => cert.profession === provider.profession
                          )
                          return relevantCerts.length > 0 ? (
                            <div className="space-y-4">
                              {relevantCerts.map((cert, index) => (
                            <Card key={cert._id} className="border-l-4 border-l-emerald-500">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">{cert.profession}</CardTitle>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={cert.status === 'active' ? "default" : "secondary"}>
                                      {cert.status}
                                    </Badge>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewCertificate(cert)}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Button>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Certificate Reference</p>
                                    <p className="font-medium text-sm">{cert.certificateReferenceId}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="font-medium text-sm">{cert.category}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Specialization</p>
                                    <p className="font-medium text-sm">{cert.specialization}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium text-sm">{cert.location}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Issued By</p>
                                    <p className="font-medium text-sm">{cert.issuedBy}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Approved By</p>
                                    <p className="font-medium text-sm">{cert.approvedBy}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Issue Date</p>
                                    <p className="font-medium text-sm">{formatDate(cert.issueDate)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Expiration Date</p>
                                    <p className="font-medium text-sm">{formatDate(cert.expirationDate)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Validity Period</p>
                                    <p className="font-medium text-sm">{cert.validityPeriod} months</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">License Active</p>
                                    <Badge variant={cert.licenseActive ? "default" : "secondary"} className="text-xs">
                                      {cert.licenseActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Payment Reference</p>
                                    <p className="font-medium text-sm">{cert.Reference}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Amount Paid</p>
                                    <p className="font-medium text-sm">₦{cert.amountPaid}</p>
                                  </div>
                                </div>
                                
                                <Separator />
                                
                                <div>
                                  <p className="text-sm text-gray-500">Certification Addressed To</p>
                                  <p className="font-medium">{cert.certificationAddressedTo}</p>
                                </div>
                                
                                {cert.notes && (
                                  <div>
                                    <p className="text-sm text-gray-500">Notes</p>
                                    <p className="text-sm">{cert.notes}</p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                          ) : (
                            <div className="text-center py-8">
                              <FileCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Relevant Certifications</h3>
                              <p className="text-gray-500">
                                {provider.user.fullName} doesn't have any certifications for {provider.profession}.
                              </p>
                            </div>
                          )
                        })()
                      ) : (
                        <div className="text-center py-8">
                          <FileCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Certifications Available</h3>
                          <p className="text-gray-500">
                            {provider.user.fullName} hasn't uploaded any professional certifications yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleCall(provider.user.phoneNumber)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                
                <Dialog open={showPortfolioDialog} onOpenChange={setShowPortfolioDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Portfolio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Portfolio - {provider.user.fullName}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="text-center py-8">
                        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Portfolio Coming Soon</h3>
                        <p className="text-gray-500">
                          {provider.user.fullName} is working on their portfolio. Check back later for samples of their work.
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>


               {/* Certification Details */}
               <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-emerald-500" />
                  Certification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
             
                
               
                
                <Separator className="my-3" />
                
                                 <div className="flex items-center justify-between">
                   <span className="text-sm">Certifications</span>
                   {(() => {
                     const relevantCerts = provider.certifications?.filter(
                       cert => cert.profession === provider.profession
                     ) || []
                     return relevantCerts.length > 0 ? (
                       <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                         <CheckCircle className="h-3 w-3 mr-1" />
                         {relevantCerts.length} Certificate{relevantCerts.length > 1 ? 's' : ''}
                       </Badge>
                     ) : (
                       <Badge variant="secondary" className="text-gray-600">
                         <X className="h-3 w-3 mr-1" />
                         Not Certified
                       </Badge>
                     )
                   })()}
                 </div>
                 
                 {(() => {
                   const relevantCerts = provider.certifications?.filter(
                     cert => cert.profession === provider.profession
                   ) || []
                   return relevantCerts.length > 0 ? (
                     <div className="text-xs text-gray-600">
                       Click "View Certifications" above to see relevant professional certificates
                     </div>
                   ) : null
                 })()}
                
                <Separator className="my-3" />
                
             
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-emerald-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium">{provider.kyc.fullName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-medium capitalize">{provider.user.gender}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium">
                    {formatDate(provider.kyc.dateOfBirth)} ({formatAge(provider.kyc.dateOfBirth)} years old)
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Religion</p>
                  <p className="font-medium">{provider.kyc.religion}</p>
                </div>
              </CardContent>
            </Card>

            {/* Education & Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-emerald-500" />
                  Education & Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Education Level</p>
                  <p className="font-medium">{provider.educationLevels}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Years of Experience</p>
                  <p className="font-medium">{provider.yearsOfExperience} years</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{formatDate(provider.createdAt)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-emerald-500" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verified</span>
                  <Badge variant={provider.user.isverified ? "default" : "secondary"}>
                    {provider.user.isverified ? "Yes" : "No"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">KYC Verified</span>
                  <Badge variant={provider.user.isKYCVerified ? "default" : "secondary"}>
                    {provider.user.isKYCVerified ? "Yes" : "No"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Approval Status</span>
                  <Badge className={getApprovalStatusColor(provider.approvalstatus)}>
                    {provider.approvalstatus}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">NIN Verified</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Photo ID</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bank Account</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </CardContent>
            </Card>



         

            {/* Ministry Information */}
            {provider.ministry && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-emerald-500" />
                    Ministry Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Ministry</p>
                    <p className="font-medium">{provider.ministry.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Minister</p>
                    <p className="font-medium">{provider.ministry.minister}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Assignment Date</p>
                    <p className="font-medium">{formatDate(provider.assignmentDate)}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
          </DialogHeader>
          {currentUser ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review
                </label>
                <Textarea
                  placeholder="Share your experience with this service provider..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReviewDialog(false)
                    setReviewRating(0)
                    setReviewText("")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={submittingReview || reviewRating === 0 || !reviewText.trim()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {submittingReview ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center py-6">
              <div className="text-gray-400 mb-4">
                <User className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Login Required</h3>
              <p className="text-gray-600 mb-4">
                You need to be logged in to leave a review for this service provider.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReviewDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowReviewDialog(false)
                    router.push('/login')
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Login / Signup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificate Viewer Modal */}
      <Dialog open={showCertificateViewer} onOpenChange={setShowCertificateViewer}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileCheck className="h-5 w-5 mr-2" />
                Certificate - {selectedCertificate?.profession}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCertificateViewer(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[80vh]">
            {selectedCertificate && (
              <div className="p-4">
                <div
                  style={{
                    width: "100%",
                    maxWidth: "297mm",
                    padding: "40px",
                    boxSizing: "border-box",
                    border: "8px solid transparent",
                    background: `
                      linear-gradient(white, white) padding-box,
                      linear-gradient(45deg, #1e8449, #28a745, #ffd700, #1e8449) border-box
                    `,
                    borderRadius: "15px",
                    backgroundColor: "#fff",
                    textAlign: "center",
                    position: "relative",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                    backgroundImage: `
                      linear-gradient(45deg, transparent 24%, rgba(30, 132, 73, 0.02) 25%, rgba(30, 132, 73, 0.02) 26%, transparent 27%, transparent 74%, rgba(30, 132, 73, 0.02) 75%, rgba(30, 132, 73, 0.02) 76%, transparent 77%, transparent),
                      linear-gradient(-45deg, transparent 24%, rgba(30, 132, 73, 0.02) 25%, rgba(30, 132, 73, 0.02) 26%, transparent 27%, transparent 74%, rgba(30, 132, 73, 0.02) 75%, rgba(30, 132, 73, 0.02) 76%, transparent 77%, transparent),
                      radial-gradient(circle at 50% 50%, rgba(30, 132, 73, 0.01) 0%, transparent 50%),
                      repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(30, 132, 73, 0.005) 1deg, transparent 2deg),
                      linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(248, 255, 248, 0.9))
                    `,
                    backgroundSize: "30px 30px, 30px 30px, 100% 100%",
                    margin: "0 auto"
                  }}
                >
                  {/* Nigeria Map Watermark */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "clamp(200px, 30vw, 400px)",
                      height: "clamp(200px, 30vw, 400px)",
                      zIndex: 0,
                      pointerEvents: "none",
                      opacity: 0.08,
                    }}
                  >
                    <svg
                      viewBox="0 0 400 400"
                      style={{ width: "100%", height: "100%" }}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M80 120 C90 110, 120 100, 150 105 C180 110, 200 115, 220 120 C250 125, 280 130, 310 140 C320 145, 325 155, 320 170 C315 185, 310 200, 305 220 C300 240, 295 260, 290 280 C285 300, 280 320, 270 335 C260 350, 245 360, 225 365 C205 370, 185 365, 165 360 C145 355, 125 350, 110 340 C95 330, 85 315, 80 300 C75 285, 75 270, 75 255 C75 240, 75 225, 75 210 C75 195, 75 180, 75 165 C75 150, 75 135, 80 120 Z"
                        fill="rgba(30, 132, 73, 0.8)"
                        stroke="rgba(30, 132, 73, 0.9)"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  {/* Multiple Watermarks */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%) rotate(-45deg)",
                      fontSize: "clamp(80px, 12vw, 120px)",
                      color: "rgba(30, 132, 73, 0.05)",
                      fontWeight: "900",
                      zIndex: 0,
                      pointerEvents: "none",
                      whiteSpace: "nowrap",
                      letterSpacing: "10px",
                    }}
                  >
                    AUTHENTIC
                  </div>

                  {/* Enhanced Decorative border pattern */}
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      left: "15px",
                      right: "15px",
                      bottom: "15px",
                      border: "3px solid #1e8449",
                      borderRadius: "10px",
                      zIndex: 0,
                      pointerEvents: "none",
                      background: `
                        repeating-linear-gradient(
                          0deg,
                          transparent,
                          transparent 2px,
                          rgba(30, 132, 73, 0.1) 2px,
                          rgba(30, 132, 73, 0.1) 4px
                        ),
                        repeating-linear-gradient(
                          90deg,
                          transparent,
                          transparent 2px,
                          rgba(30, 132, 73, 0.1) 2px,
                          rgba(30, 132, 73, 0.1) 4px
                        )
                      `,
                    }}
                  />

                  {/* Centered Benue State Logo */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: "30px",
                    }}
                  >
                    <img
                      src="https://ik.imagekit.io/bdic/ministry-labour.png?updatedAt=1757610747399"
                      alt="Benue State Government Logo"
                      style={{
                        width: "clamp(80px, 10vw, 120px)",
                        height: "auto",
                        position: "relative",
                        zIndex: 1,
                      }}
                      crossOrigin="anonymous"
                    />
                  </div>

                  {/* Header */}
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(24px, 4vw, 36px)",
                      color: "#1e8449",
                      marginBottom: "20px",
                      textTransform: "uppercase",
                      letterSpacing: "3px",
                      fontWeight: "700",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                      zIndex: 1,
                      background: "linear-gradient(135deg, #1e8449, #28a745)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Certificate of Authentication
                  </div>

                  {/* Government Authority */}
                  <div
                    style={{
                      fontSize: "clamp(12px, 1.5vw, 16px)",
                      color: "#333",
                      marginBottom: "10px",
                      fontWeight: "600",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    ISSUED BY THE AUTHORITY OF BENUE STATE GOVERNMENT
                  </div>

                  <div
                    style={{
                      fontSize: "clamp(14px, 1.8vw, 18px)",
                      marginBottom: "15px",
                      color: "#555",
                      fontWeight: "600",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    This certifies that
                  </div>

                  {/* Certificate recipient */}
                  <div
                    style={{
                      fontSize: "clamp(20px, 3.2vw, 32px)",
                      fontWeight: "bold",
                      color: "#1e8449",
                      margin: "30px 0",
                      textTransform: "capitalize",
                      lineHeight: "1.2",
                      position: "relative",
                      zIndex: 1,
                      padding: "20px 40px",
                      border: "3px solid #1e8449",
                      borderRadius: "15px",
                      background: `
                        linear-gradient(135deg, rgba(30, 132, 73, 0.05), rgba(40, 167, 69, 0.05)),
                        repeating-linear-gradient(
                          45deg,
                          transparent,
                          transparent 10px,
                          rgba(30, 132, 73, 0.02) 10px,
                          rgba(30, 132, 73, 0.02) 20px
                        )
                      `,
                      boxShadow:
                        "inset 0 2px 10px rgba(30, 132, 73, 0.1), 0 4px 20px rgba(30, 132, 73, 0.1)",
                      textShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {selectedCertificate.certificationAddressedTo}
                  </div>

                  <div
                    style={{
                      fontSize: "clamp(14px, 1.8vw, 18px)",
                      marginBottom: "15px",
                      color: "#555",
                      fontWeight: "600",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    Is hereby recognized as an authenticated{" "}
                    <strong style={{ color: "#1e8449" }}>Service Provider</strong> under the
                  </div>

                  <div
                    style={{
                      fontSize: "clamp(16px, 2.2vw, 22px)",
                      fontWeight: "bold",
                      color: "#1e8449",
                      marginBottom: "40px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {selectedCertificate.category}
                  </div>

                  {/* Security features */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      margin: "30px 0",
                      padding: "15px",
                      background:
                        "linear-gradient(135deg, rgba(30, 132, 73, 0.05), rgba(40, 167, 69, 0.05))",
                      borderRadius: "10px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "clamp(10px, 1.2vw, 14px)",
                        color: "#333",
                        fontWeight: "700",
                      }}
                    >
                      <strong>Issue Date:</strong>
                      <br />
                      {new Date(selectedCertificate.issueDate).toLocaleDateString("en-GB")}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(10px, 1.2vw, 14px)",
                        color: "#333",
                        fontWeight: "700",
                      }}
                    >
                      <strong>Valid Until:</strong>
                      <br />
                      {new Date(selectedCertificate.expirationDate).toLocaleDateString("en-GB")}
                    </div>
                    <div
                      style={{
                        fontSize: "clamp(10px, 1.2vw, 14px)",
                        color: "#333",
                        fontWeight: "700",
                      }}
                    >
                      <strong>Cert. ID:</strong>
                      <br />
                      {selectedCertificate.certificateReferenceId}
                    </div>
                  </div>

                  {/* Enhanced signature area */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "flex-end",
                      marginTop: "50px",
                      width: "90%",
                      marginLeft: "auto",
                      marginRight: "auto",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <div style={{ flex: 1, padding: "0 20px", textAlign: "center" }}>
                      <div
                        style={{
                          width: "150px",
                          height: "60px",
                          margin: "0 auto 10px",
                          background:
                            "url('https://ik.imagekit.io/bdic/signature_.png?updatedAt=1748480486518') no-repeat center",
                          backgroundSize: "contain",
                        }}
                      />
                      <div
                        style={{
                          borderTop: "2px solid #1e8449",
                          paddingTop: "8px",
                          marginBottom: "5px",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "clamp(10px, 1.2vw, 14px)",
                          color: "#444",
                          fontWeight: "600",
                        }}
                      >
                        {selectedCertificate.approvedBy}
                      </div>
                      <div style={{ fontSize: "clamp(9px, 1.1vw, 12px)", color: "#666" }}>
                        Director, ICT Department
                      </div>
                    </div>

                    <div style={{ flex: 1, padding: "0 20px", textAlign: "center" }}>
                      <div
                        style={{
                          width: "150px",
                          height: "60px",
                          margin: "0 auto 10px",
                          background:
                            "url('https://ik.imagekit.io/bdic/signature_.png?updatedAt=1748480486518') no-repeat center",
                          backgroundSize: "contain",
                        }}
                      />
                      <div
                        style={{
                          borderTop: "2px solid #1e8449",
                          paddingTop: "8px",
                          marginBottom: "5px",
                        }}
                      />
                      <div
                        style={{
                          fontSize: "clamp(10px, 1.2vw, 14px)",
                          color: "#444",
                          fontWeight: "600",
                        }}
                      >
                        Authentication Officer
                      </div>
                      <div style={{ fontSize: "clamp(9px, 1.1vw, 12px)", color: "#666" }}>
                        Benue State Government
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "40px",
                      left: "40px",
                      width: "clamp(80px, 10vw, 120px)",
                      height: "clamp(80px, 10vw, 120px)",
                      background: "white",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "2px solid #1e8449",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                    }}
                  >
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
                        `Certificate ID: ${selectedCertificate.certificateReferenceId}\nIssued to: ${selectedCertificate.certificationAddressedTo}\nIssue Date: ${new Date(selectedCertificate.issueDate).toLocaleDateString("en-GB")}\nVerify at: https://benue.gov.ng/verify`
                      )}`}
                      alt="QR Code for Certificate Verification"
                      style={{
                        width: "100%",
                        height: "auto",
                        maxWidth: "80px",
                      }}
                      crossOrigin="anonymous"
                    />
                    <div
                      style={{
                        fontSize: "clamp(8px, 1vw, 10px)",
                        color: "#1e8449",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginTop: "5px",
                      }}
                    >
                      SCAN TO VERIFY
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      <Toaster position="top-right" />
    </div>
  )
} 