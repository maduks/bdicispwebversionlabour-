"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter,useSearchParams } from "next/navigation"
import Image from "next/image"
import Details from "./details"
import Link from "next/link"
import {
  ChevronLeft,
  Star,
User,
  MapPin,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Share2,
  Heart,
  Building,
  Home,
  Briefcase,
  ShoppingBag,
  Loader2,
  X,
  Tag,
  Bed,
  Bath,
  Utensils,
  Ruler,
  Layers,
  Car,
  Armchair,
  Hammer,
  Wallet,
  PawPrint
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { listingsApi, type Listing } from "../../api/listings"

export default function ListingDetailsPage() {
  const params = useParams()
  const searchParams = useSearchParams();
  const type = searchParams?.get('type');
  const router = useRouter()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [listing, setListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await listingsApi.getListing(params?.id as string || '',type as string)
        const transformedListing =   
        data.data.type == "products" ?
       {
          ...data.data.data,
            title: data.data.data.prodName,
            category: data.data.data.category,
            description: data.data.data.description,
            tags: data.data.data.tags,
            featured: data.data.data.featured,
            rating: data.data.data.rating,
            reviews: data.data.data.reviews,
            location: data.data.data.location,
            price: data.data.data.price,
            images: data.data.data.productImages,
            contact:{
              phone: data.data.data.user.phoneNumber,
              email: data.data.data.user.email,
              listedBy: data.data.data.user.fullName,
            }
        } : data.data.type == "properties"? {
          ...data.data.data,
          title: data.data.data.title,
          category: "properties",
          description: data.data.data.description,
          tags: data.data.data.tags,
          featured: data.data.data.featured,
          rating: 0,
          reviews: [],
          location: `${data.data.data.address}, ${data.data.data.city}, ${data.data.data.state}`,
          price: data.data.data.price,
          images: data.data.data.photos,
          contact: {
            phone: data.data.data.contact?.phone || '',
            email: data.data.data.contact?.email || '',
            listedBy: data.data.data.listedBy,
          },
          details: {
            bedrooms: data.data.data.bedrooms,
            bathrooms: data.data.data.bathrooms,
            area: `${data.data.data.area} ${data.data.data.areaUnit}`,
            yearBuilt: data.data.data.yearBuilt || 'N/A',
            amenities: data.data.data.amenities,
            propertyType: data.data.data.propertyType,
            listingType: data.data.data.listingType,
            furnishing: data.data.data.furnishing,
            condition: data.data.data.condition,
            parking: data.data.data.parking,
            floors: data.data.data.floors,
            toilets: data.data.data.toilets,
            kitchens: data.data.data.kitchens,
            maintenanceFee: data.data.data.maintenanceFee ? 
              `₦${data.data.data.maintenanceFee.toLocaleString()}` : 'None'
          }
        } : data.data.type == "businesses" ? {
          ...data.data.data,
          title: data.data.data.legalname,
          category: "businesses",
          description: data.data.data.businessDescription,
          tags: [data.data.data.industry, data.data.data.businessType],
          featured: data.data.data.featured || false,
          rating: 0,
          reviews: 0,
          location: `${data.data.data.businessAddress}, ${data.data.data.location}, ${data.data.data.state}`,
          price: "Contact for price",
          images: [data.data.data.businessProfilePicture, data.data.data.businessLogo].filter(Boolean),
          contact: {
            phone: data.data.data.businessPhoneNumber,
            email: data.data.data.businessEmail,
            name: data.data.data.legalname,
          },
          details: {
            industry: data.data.data.industry,
            businessType: data.data.data.businessType,
            employeeCount: data.data.data.employeeCount,
            dateOfIncorporation: new Date(data.data.data.dateOfIncorporation).toLocaleDateString(),
            businessNumber: data.data.data.businessBusinessNumber,
            taxId: data.data.data.businessTaxId,
            registrationStatus: data.data.data.registrationStatus,
            socialMedia: {
              website: data.data.data.businessWebsite,
              facebook: data.data.data.businessFacebook,
              twitter: data.data.data.businessTwitter,
              instagram: data.data.data.businessInstagram,
              linkedin: data.data.data.businessLinkedIn
            }
          }
        } : data.data.type == "services" ? {
          ...data.data.data,
          title: data.data.data.serviceName,
          category: "services",
          description: data.data.data.description,
          tags: [data.data.data.serviceCategory],
          featured: data.data.data.featured || false,
          rating: 0,
          reviews: data.data.data.reviewCount || 0,
          location: `${data.data.data.location?.address || ''}, ${data.data.data.location?.city || ''}, ${data.data.data.location?.state || ''}`,
          price: data.data.data.price || "Contact for price",
          images: data.data.data.featuredImage || [],
          contact: {
            phone: data.data.data.contact?.phone || '',
            email: data.data.data.contact?.email || '',
            name: data.data.data.serviceName,
          },
          details: {
            serviceCategory: data.data.data.serviceCategory,
            responseTime: data.data.data.responseTime,
            emergencyServices: data.data.data.emergencyServices === "true",
            isAvailable: data.data.data.isAvailable,
            isVerified: data.data.data.isVerified,
            socialLinks: data.data.data.socialLinks || {},
            status: data.data.data.status,
            createdAt: new Date(data.data.data.createdAt).toLocaleDateString()
          }
        } : {}
        //console.error(transformedListing)
        //console.error(data.data.data.user)
        setListing(transformedListing)
      } catch (err) {
        setError('Failed to fetch listing details. Please try again later.')
        console.error('Error fetching listing:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (params?.id) {
      fetchListing()
    }
  }, [params?.id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <X className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-4">{error || 'Listing Not Found'}</h2>
          <p className="text-muted-foreground mb-6">
            {error ? 'Please try again later.' : 'The listing you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Link href="/listings">
            <Button>Back to Listings</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "properties":
        return <Home className="h-5 w-5" />
      case "businesses":
        return <Building className="h-5 w-5" />
      case "services":
        return <Briefcase className="h-5 w-5" />
      case "products":
        return <ShoppingBag className="h-5 w-5" />
      default:
        return null
    }
  }

  const getCategoryName = (category: string) => {
    return category?.charAt(0)?.toUpperCase() + category?.slice(1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Listings
        </Button>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Images and details */}
          <div className="lg:col-span-2">
            {/* Title and basic info */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2 ">
                <Badge variant="outline" className="flex p-1 bg-green-100 items-center gap-1 bg-primary/5">
                  {getCategoryIcon(listing?.category || '')}
                  <span className="px-2 py-1 text-primary text-xs font-medium rounded-full mr-2">
                    {getCategoryName(listing?.category || '')}
                  </span>
                </Badge>
                {/* {listing.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-secondary/50">
                    {tag}
                  </Badge>
                ))} */}
                {listing?.featured && <Badge className="gradient-primary p-1 text-white">Featured</Badge>}
              </div>
              <h1 className="capitalize text-3xl font-bold mb-2">{listing?.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {listing?.location}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
                  <span>{listing?.rating}</span>
                  <span className="ml-1">({listing?.reviews} reviews)</span>
                </div>
                <div className="flex items-center font-medium text-primary">
                {Number(listing?.price).toLocaleString('en', { style: 'currency', currency: 'NGN' })}
                 
                </div>
              </div>
            </div>

            {/* Image gallery */}
            <div className="mb-8">
              <div className="relative h-[400px] rounded-lg overflow-hidden mb-4">
                <Image
                  src={Array.isArray(listing?.images) ? listing.images[activeImageIndex] || '/placeholder.svg' : '/placeholder.svg'}
                  alt={listing?.title || 'Listing image'}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-300"
                />
              </div>

              {/* Thumbnail gallery */}
              <div className="grid grid-cols-5 gap-2">
                {Array.isArray(listing?.images) && listing.images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
                      activeImageIndex === index ? "border-primary" : "border-transparent"
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${listing?.title || 'Listing'} - Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs for details */}
            <Tabs defaultValue="description" className="mt-8">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="bg-background rounded-lg p-6 border border-border/50">
                <h3 className="text-xl font-semibold mb-4">
                  About this {getCategoryName(listing?.category || '').toLowerCase()}
                </h3>
                { listing.category==="properties" && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div style={{backgroundColor:'#edf0f4'}} className=" p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Bedrooms</p>
              <p className="font-bold text-lg">{listing?.details?.bedrooms || 'N/A'}</p>
            </div>
            <div style={{backgroundColor:'#edf0f4'}} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Bathrooms</p>
              <p className="font-bold text-lg">{listing?.details?.bathrooms || 'N/A'}</p>
            </div>
            <div style={{backgroundColor:'#edf0f4'}} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Area</p>
              <p className="font-bold text-lg">{listing?.details?.area || 'N/A'}</p>
            </div>
            <div style={{backgroundColor:'#edf0f4'}} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-500 text-sm">Type</p>
              <p className="font-bold text-lg">Apartment</p>
            </div>
          </div>}
                <p className="capitalize text-muted-foreground whitespace-pre-line">{listing?.description}</p>
              </TabsContent>
    
              
              <TabsContent value="details" className="bg-background rounded-lg p-6 border border-border/50">
                {/* <h3 className="text-xl font-semibold mb-4">{getCategoryName(listing?.category)} Details</h3> */}
                {listing?.category === "properties" && (
                  <Details listing={listing} />


)}
                <div className=" gap-4">
                
   

                  {listing?.category === "businesses" && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Established:</span>
                        <span>{listing?.details?.established}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Revenue:</span>
                        <span>{listing?.details?.revenue}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Employees:</span>
                        <span>{listing?.details?.employees}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Lease:</span>
                        <span>{listing?.details?.lease}</span>
                      </div>
                    </>
                  )}
                  {listing?.category === "services" && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Service Category:</span>
                        <span>{listing?.details?.serviceCategory}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Response Time:</span>
                        <span>{listing?.details?.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Emergency Services:</span>
                        <span>{listing?.details?.emergencyServices ? 'Available' : 'Not Available'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Availability:</span>
                        <span>{listing?.details?.isAvailable ? 'Available' : 'Not Available'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Verification Status:</span>
                        <span>{listing?.details?.isVerified ? 'Verified' : 'Not Verified'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <span className="capitalize">{listing?.details?.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Created:</span>
                        <span>{listing?.details?.createdAt}</span>
                      </div>
                      {listing?.details?.socialLinks && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Social Links:</h4>
                          <div className="space-y-2">
                            {listing?.details?.socialLinks?.website && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Website:</span>
                                <a href={listing?.details?.socialLinks?.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {listing?.details?.socialLinks?.website}
                                </a>
                              </div>
                            )}
                            {listing?.details?.socialLinks?.facebook && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Facebook:</span>
                                <a href={listing?.details?.socialLinks?.facebook} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {listing?.details?.socialLinks?.facebook}
                                </a>
                              </div>
                            )}
                            {listing?.details?.socialLinks?.twitter && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Twitter:</span>
                                <a href={listing?.details?.socialLinks?.twitter} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {listing?.details?.socialLinks?.twitter}
                                </a>
                              </div>
                            )}
                            {listing?.details?.socialLinks?.instagram && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Instagram:</span>
                                <a href={listing?.details?.socialLinks?.instagram} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {listing?.details?.socialLinks?.instagram}
                                </a>
                              </div>
                            )}
                            {listing?.details?.socialLinks?.linkedin && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">LinkedIn:</span>
                                <a href={listing?.details?.socialLinks?.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  {listing?.details?.socialLinks?.linkedin}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {listing?.category === "products" && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Brand:</span>
                        <span>{listing?.details?.brand}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Made In:</span>
                        <span>{listing?.details?.madeIn}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Warranty:</span>
                        <span>{listing?.details?.warranty}</span>
                      </div>
                    </>
                  )}
                </div>

             
              </TabsContent>
              <TabsContent value="contact" className="bg-background rounded-lg p-6 border border-border/50">
               



      {/* Contact information */}
      <div className="bg-gray-50 bg-background  p-6 rounded-xl" >
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
        <div className="flex items-start">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{listing?.contact?.listedBy}</h3>
            <div className="mt-3 space-y-2">
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2" />
                <span>{listing?.contact?.phone}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-2" />
                <span>{listing?.contact?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right column - Actions and related listings */}
          <div>
            {/* Action card */}
            <div className="bg-background rounded-lg border border-border/50 p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Interested in this listing?</h3>
              <div className="space-y-4">
                <Button onClick={()=>window.location.href = `tel:${listing?.contact.phone}`} className="w-full gradient-primary text-white hover:opacity-90">Contact Seller</Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                    {isFavorite ? "Saved" : "Save"}
                  </Button>
                  <Button variant="outline" className="flex-1 flex items-center justify-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Share
                  </Button>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Listing ID: #{listing._id}</p>
                  <p className="text-sm text-muted-foreground">
                    Listed in{" "}
                    <Link href={`/listings?category=${listing?.category || ''}`} className="text-primary hover:underline">
                      {getCategoryName(listing?.category || '')}
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Similar listings */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Similar Listings</h3>
              {/* <div className="space-y-4">
                {listing
                  .filter((item:any) => item.category === listing.category && item.id !== listing.id)
                  .slice(0, 3)
                  .map((item:any) => (
                    <Link href={`/listings/${item.id}`} key={item.id}>
                      <div className="bg-background rounded-lg border border-border/50 overflow-hidden hover:border-primary/50 transition-colors group">
                        <div className="flex">
                          <div className="relative h-24 w-24 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                              {item.title}
                            </h4>
                            <p className="text-muted-foreground text-xs line-clamp-1 mb-1">{item.location}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-primary">{item.price}</span>
                              <div className="flex items-center text-xs">
                                <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-0.5" />
                                {item.rating}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
