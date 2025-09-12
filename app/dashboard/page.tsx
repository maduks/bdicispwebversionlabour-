"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Building, Home, Briefcase, ShoppingBag } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis,  Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { useToast } from "../components/ui/use-toast"
import { getCookie } from "cookies-next"
import axios from "axios"


export default function DashboardPage() {
  const { currentUser, loading, kycCompleted } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  // Role-based access control - only allow artisans (role === "user")
  useEffect(() => {
    if (!currentUser) {
    //  alert("no user")
    //  router.push('/login')
      return
    }
    // Check if user is a seeker (role === "seeker") - redirect to user-profile
    const userRole = currentUser?.data?.role
    if (userRole === "seeker") {
      router.push('/user-profile')
      return
    }
  }, [currentUser, router])
  const [loadings, setLoadings] = useState(true)
  const [productsCount, setProductsCount] = useState(0)
  const [businessesCount, setBusinessesCount] = useState(0)
  const [servicesCount, setServicesCount] = useState(0)
  const [propertiesCount, setPropertiesCount] = useState(0)

  const [servicesExpiredCount, setServicesExpiredCount] = useState(0)
  const [businessesExpiredCount, setBusinessesExpiredCount] = useState(0)
  const [productsExpiredCount, setProductsExpiredCount] = useState(0)
  const [propertiesExpiredCount, setPropertiesExpiredCount] = useState(0)

  const [listingsChartData, setListingsChartData] = useState([{}])
  const [renewalNotifications, setRenewalNotifications] = useState([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const fetchListings = async () => {
    try {
      setLoadings(true)
      const userId = currentUser?.data?._id
      if (!userId) {
        return
      }

      await axios.get(`https://ministryoflabourbackend.vercel.app/api/v1/listings/all`, {
        params: {
          ownerId: userId
        },
        headers: {
          // Optional: include token if stored in cookies
          // 'x-access-token': getCookie('authToken') as string
        }
      }).then((response) => {
        if (response.data.data) {
          // setProductsCount(response.data?.data?.products?.length || 0)
          // setBusinessesCount(response.data?.data?.businesses?.length || 0)
          // setPropertiesCount(response.data.data?.properties?.length || 0)
          // setServicesCount(response.data?.data?.services?.length || 0)

          const listingData = [
            { name: 'Properties', value: response.data?.data?.properties?.length || 0 },
            { name: 'Businesses', value: response.data?.data?.businesses?.length || 0 },
            { name: 'Services', value: response.data?.data?.services?.length || 0 },
            { name: 'Products', value: response.data?.data?.products?.length || 0 },
          ]
          setListingsChartData(listingData)
        }
      }).catch(err => {
        console.error(err)
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch listings",
        variant: "destructive"
      })
    } finally {
      setLoadings(false)
    }
  }

  const fetchRenewalNotifications = async () => {
    try {
      setLoadingNotifications(true)
      const userCookies = await getCookie('user')
      const userId = JSON.parse(userCookies as string).data?._id

      if (!userId || !userCookies) {
        return
      }

      const response = await axios.get(`https://ministryoflabourbackend.vercel.app/api/v1/certifications/${userId}`)
      
      if (response?.data?.data !=="Certifications not found....") {

        console.log(response?.data?.data)
        // Filter certifications that are active and calculate days until expiry
        const notifications = response?.data?.data?.map((cert: any) => {
          const expirationDate = new Date(cert.expirationDate)
          const today = new Date()
          const daysUntilExpiry = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          
          return {
            ...cert,
            daysUntilExpiry,
            isExpired: daysUntilExpiry < 0,
            isExpiringSoon: daysUntilExpiry <= 30 && daysUntilExpiry >= 0
          }
        }).filter((cert: any) => cert?.licenseActive && cert?.status === 'active')

        const serviceCertCount = notifications.filter((cert: any) => cert.certificationType === 'service').length
        const businessCertCount = notifications.filter((cert: any) => cert.certificationType === 'business').length
        const productCertCount = notifications.filter((cert: any) => cert.certificationType === 'product').length
        const propertyCertCount = notifications.filter((cert: any) => cert.certificationType === 'property').length

        const servicesExpiredCount = notifications.filter((cert: any) => cert?.certificationType === 'service' && cert?.expirationDate >= new Date()).length
        const businessesExpiredCount = notifications.filter((cert: any) => cert.certificationType === 'business' && cert.expirationDate >= new Date()).length
        const productsExpiredCount = notifications.filter((cert: any) => cert.certificationType === 'product' && cert.expirationDate >= new Date()).length
        const propertiesExpiredCount = notifications.filter((cert: any) => cert.certificationType === 'property' && cert.expirationDate >= new Date()).length

        setServicesExpiredCount(servicesExpiredCount || 0)
        setBusinessesExpiredCount(businessesExpiredCount || 0)
        setProductsExpiredCount(productsExpiredCount || 0)
        setPropertiesExpiredCount(propertiesExpiredCount || 0)

        setServicesCount(serviceCertCount || 0)
        setBusinessesCount(businessCertCount || 0)
        setProductsCount(productCertCount || 0)
        setPropertiesCount(propertyCertCount || 0)
        setRenewalNotifications(notifications)
      }
    } catch (error) {
      console.error('Error fetching renewal notifications:', error)
      toast({
        title: "Error",
        description: "Failed to fetch renewal notifications",
        variant: "destructive"
      })
    } finally {
      setLoadingNotifications(false)
    }
  }

  useEffect(() => {
    if (!loading && currentUser) {
      fetchListings()
      fetchRenewalNotifications()
    }
  }, [currentUser, loading])

  useEffect(() => {
    if (!loading && !currentUser) {
      //router.push('/login')
    } 
   
  }, [currentUser, loading, kycCompleted, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    )
  }

  const getRandomColor = (index: number) => {
    const colors = [
      '#8884d8', // Purple
      '#82ca9d', // Green
      '#ffc658', // Yellow
      '#ff8042', // Orange
      '#0088fe', // Blue
      '#00c49f', // Teal
      '#ffbb28', // Gold
      '#ff8042', // Coral
      '#a4de6c', // Light Green
      '#d0ed57'  // Lime
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Your Listings by Category */}
      <h2 className="text-xl font-semibold mb-4">Your Trade tests by Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Home className="h-4 w-4 mr-2 text-blue-500" />
              Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertiesCount||0}</div>
            <p className="text-xs text-muted-foreground">{propertiesCount} active, {propertiesExpiredCount > 0 ? propertiesExpiredCount : '0'} expired</p>
          </CardContent>
        </Card> */}

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building className="h-4 w-4 mr-2 text-purple-500" />
              Businesses Licenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessesCount || 0}</div>
            <p className="text-xs text-muted-foreground">{businessesCount} active, {businessesExpiredCount > 0 ? businessesExpiredCount : '0'} expired</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-green-500" />
              Trade Test Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{servicesCount}</div>
            <p className="text-xs text-muted-foreground">{servicesCount} active, {servicesExpiredCount > 0 ? servicesExpiredCount : '0'} expired</p>
          </CardContent>
        </Card>

        {/* <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2 text-orange-500" />
              Products Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount ||0}</div>
            <p className="text-xs text-muted-foreground">{productsCount} active, {productsExpiredCount > 0 ? productsExpiredCount : '0'} expired</p>
          </CardContent>
        </Card> */}
      </div>

      {/* Bar Chart Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Listings Distribution</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart width={500} height={300} data={listingsChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value">
                    {listingsChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getRandomColor(index)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Renewal Notifications Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Renewal Notifications</h2>
        <Card>
          <CardContent className="pt-6">
            {loadingNotifications ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading notifications...</p>
              </div>
            ) : renewalNotifications.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issued To</TableHead>
                    <TableHead>Issued By</TableHead>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Days Left</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renewalNotifications.map((notification: any) => (
                    <TableRow key={notification._id}>
                      <TableCell className="font-medium">
                        {notification.certificationAddressedTo}
                      </TableCell>
                      <TableCell className="capitalize">
                        {notification.ministryId.name}
                      </TableCell>
                      <TableCell className="capitalize">
                        {notification.certificateReferenceId}
                      </TableCell>
                      <TableCell className="capitalize">
                        {notification.certificationType}
                      </TableCell>
                      <TableCell>
                        {new Date(notification.expirationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`font-semibold ${
                          notification.isExpired 
                            ? 'text-red-600' 
                            : notification.isExpiringSoon 
                              ? 'text-orange-600' 
                              : 'text-green-600'
                        }`}>
                          {notification.isExpired 
                            ? `${Math.abs(notification.daysUntilExpiry)} days expired`
                            : `${notification.daysUntilExpiry} days left`
                          }
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          notification.isExpired 
                            ? 'bg-red-100 text-red-800' 
                            : notification.isExpiringSoon 
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {notification.isExpired 
                            ? 'Expired' 
                            : notification.isExpiringSoon 
                              ? 'Expiring Soon'
                              : 'Active'
                          }
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No renewal notifications found.</p>
                <p className="text-sm mt-1">All your certificates are up to date.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}