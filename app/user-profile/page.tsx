"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import EditProfileForm from "@/components/auth/EditProfileForm"
import PasswordChangeForm from "@/components/auth/PasswordChangeForm"
import KYCForm from "@/components/auth/KYCForm"
import { 
  User, 
  Star, 
  Heart, 
  Settings, 
  LogOut, 
  Search, 
  MessageSquare,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CheckCircle
} from "lucide-react"
import { motion } from "framer-motion"

export default function UserProfilePage() {
  const { currentUser, logout, loading: authLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0) // For refreshing profile data
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [showKYC, setShowKYC] = useState(false)

  // Helper function to safely extract user data
  const userData = useMemo(() => {
    if (!currentUser) return null
    
    console.log('Current user structure:', currentUser)
    
    // Handle different data structures
    const userData = currentUser?.data?.newUser || currentUser?.data || currentUser
    console.log('Extracted user data:', userData)
    
    return {
      fullName: userData?.fullName || "Seeker",
      email: userData?.email || "N/A",
      phoneNumber: userData?.phoneNumber || "N/A",
      address: (userData as any)?.address || "N/A",
      createdAt: userData?.createdAt || null,
      isverified: userData?.isverified || false,
      status: userData?.status || "active",
      isKYCVerified: (userData as any)?.isKYCVerified || false,
      role: userData?.role || "seeker"
    }
  }, [currentUser])

  // Mock data - replace with real API calls
  const [userStats] = useState({
    reviewsWritten: 8,
    savedArtisans: 5
  })

  const [recentReviews] = useState([
    {
      id: 1,
      artisanName: "Johnson Plumbers Ltd",
      rating: 5,
      comment: "Excellent service, very professional and punctual.",
      date: "2024-01-15"
    },
    {
      id: 2,
      artisanName: "Makurdi Electric Co.",
      rating: 4,
      comment: "Good work but a bit expensive.",
      date: "2024-01-10"
    }
  ])

  const [savedArtisans] = useState([
    {
      id: 1,
      name: "Johnson Plumbers Ltd",
      category: "Plumbing",
      location: "Makurdi",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Makurdi Electric Co.",
      category: "Electrical",
      location: "Makurdi",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
    }
  ])

  useEffect(() => {
    console.log('User profile useEffect - currentUser:', currentUser);
    console.log('User profile useEffect - userData:', userData);
    console.log('User profile useEffect - authLoading:', authLoading);
    
    if (!userData) {
      console.log('No currentUser, redirecting to login');
      //router.push('/login')
      return
    }

    // Wait for user data to be loaded before checking role
    if (currentUser && userData) {
      // Check if user is an artisan (role === "user") - redirect to dashboard
      // Seekers (role === "seeker") should stay on user-profile page
      const userRole = userData.role
      console.log('User role check:', { userRole, currentUser, userData })
      
      if (userRole === "user") {
        console.log('Redirecting artisan to dashboard')
        // Redirect artisans to their dashboard
        router.push('/dashboard')
        return
      } else if (userRole === "seeker") {
        console.log('Seeker can access user profile')
        // Seekers can stay on this page
        return
      }
    }
  }, [currentUser, userData, router])

  // Refresh user data when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0) {
      // The page reload in handleProfileUpdated will handle the refresh
    }
  }, [refreshKey])

  const handleLogout = () => {
    setLoading(true)
    logout()
    router.push('/')
  }

  const handleProfileUpdated = () => {
    setRefreshKey(prev => prev + 1) // Trigger re-render
    // Force a page reload to get the latest user data from cookies
    window.location.reload()
  }

  if (authLoading) {
    console.log('Auth still loading, showing loading state');
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!currentUser || !userData) {
    router.push('/login')
    console.log('User profile loading state:', { hasCurrentUser: !!currentUser, hasUserData: !!userData });
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
          <p className="text-xs text-gray-400 mt-2">
            {!currentUser ? 'No user data' : 'Loading user data...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account and preferences</p>
            </div>
            <Button
              onClick={handleLogout}
              disabled={loading}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {loading ? "Signing out..." : "Sign Out"}
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src="/placeholder-user.jpg" />
                                       <AvatarFallback className="text-2xl bg-green-100 text-green-600">
                     {userData?.fullName?.charAt(0) || "U"}
                   </AvatarFallback>
                 </Avatar>
                 <h2 className="text-xl font-bold text-gray-900 mb-1">
                   {userData?.fullName || "User"}
                 </h2>
                  <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
                    <Search className="h-3 w-3 mr-1" />
                    Artisan Seeker
                  </Badge>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-3 text-gray-400" />
                      {userData?.email || "email@example.com"}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-3 text-gray-400" />
                      {userData?.phoneNumber || "08012345678"}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                      {userData?.address || "N/A"}
                    </div>
                    {userData?.createdAt && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                        Member since {new Date(userData.createdAt).toLocaleDateString()}
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <div className={`w-2 h-2 rounded-full mr-3 ${userData?.isverified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <span className={userData?.isverified ? 'text-green-600' : 'text-yellow-600'}>
                        {userData?.isverified ? 'Email Verified' : 'Email Pending Verification'}
                      </span>
                    </div>
                  </div>

                                     <EditProfileForm onProfileUpdated={handleProfileUpdated} />
                                     
                                     {/* Password Change */}
                                     <div className="mt-4">
                                       <Button 
                                         variant="outline" 
                                         className="w-full"
                                         onClick={() => setShowPasswordChange(true)}
                                       >
                                         <Settings className="h-4 w-4 mr-2" />
                                         Change Password
                                       </Button>
                                     </div>
                                     
                                     {/* KYC Verification for Seekers */}
                                     {!userData?.isKYCVerified && (
                                       <div className="mt-4">
                                         <Button 
                                           variant="outline" 
                                           className="w-full bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                           onClick={() => setShowKYC(true)}
                                         >
                                           <User className="h-4 w-4 mr-2" />
                                           Complete KYC Verification
                                         </Button>
                                       </div>
                                     )}
                                     
                                     {userData?.isKYCVerified && (
                                       <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                         <div className="flex items-center text-green-700">
                                           <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                           <span className="text-sm font-medium">KYC Verified</span>
                                         </div>
                                       </div>
                                     )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
                         {/* Stats Cards */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Card className="bg-blue-50 border-blue-200">
                 <CardContent className="p-4 text-center">
                   <div className="text-2xl font-bold text-blue-600">{userStats.reviewsWritten}</div>
                   <div className="text-sm text-blue-700">Reviews Written</div>
                 </CardContent>
               </Card>
               
               <Card className="bg-purple-50 border-purple-200">
                 <CardContent className="p-4 text-center">
                   <div className="text-2xl font-bold text-purple-600">{userStats.savedArtisans}</div>
                   <div className="text-sm text-purple-700">Saved Artisans</div>
                 </CardContent>
               </Card>

               <Card className="bg-green-50 border-green-200">
                 <CardContent className="p-4 text-center">
                   <div className="text-2xl font-bold text-green-600">
                     {userData?.isverified ? '✓' : '⏳'}
                   </div>
                   <div className="text-sm text-green-700">
                     {userData?.isverified ? 'Email Verified' : 'Pending'}
                   </div>
                 </CardContent>
               </Card>
             </div>

            {/* Recent Reviews */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentReviews.length > 0 ? (
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{review.artisanName}</h4>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No reviews yet</p>
                    <p className="text-sm">Start reviewing artisans you've worked with</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Artisans */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-red-500" />
                  Saved Artisans
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedArtisans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedArtisans.map((artisan) => (
                      <div key={artisan.id} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={artisan.image} />
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {artisan.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{artisan.name}</h4>
                          <p className="text-sm text-gray-600">{artisan.category} • {artisan.location}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{artisan.rating}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No saved artisans yet</p>
                    <p className="text-sm">Save artisans you're interested in for quick access</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* KYC Status */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-500" />
                  KYC Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userData?.isKYCVerified ? (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-green-700 mb-2">KYC Verified</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Your identity has been verified successfully. You have full access to all platform features.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700">
                        <strong>Benefits:</strong><br />
                        • Enhanced security and trust<br />
                        • Access to verified artisan reviews<br />
                        • Priority customer support<br />
                        • Better dispute resolution
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold text-yellow-700 mb-2">KYC Not Verified</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Complete your KYC verification to access enhanced features and improve your account security.
                    </p>
                    <Button 
                      onClick={() => setShowKYC(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Complete KYC Verification
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Password Change Dialog */}
      <PasswordChangeForm 
        open={showPasswordChange} 
        onOpenChange={setShowPasswordChange} 
      />
      
      {/* KYC Form Dialog */}
      <KYCForm 
        open={showKYC} 
        onOpenChange={setShowKYC} 
      />
    </div>
  )
} 