"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../../components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "../../components/ui/dialog"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../components/ui/select"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu"
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  Package,
  Store,
  Home,
  DollarSign,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Clock,
  Globe,
  Facebook,
  Instagram,
  Phone,
  Mail,
  Building2,
  Calendar,
  Tag,
  AlertCircle,
  Award,
  ShoppingBag,
  Users,
  Briefcase,
  Landmark,
  FileText,
  List,
  Shield,
  Upload
} from "lucide-react"
import { Toaster,toast } from "sonner"
import { useAuth } from "../../context/AuthContext"
import { Label } from "../../components/ui/label"
import { ServiceView } from './components/ServiceView'
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Separator } from "../../components/ui/separator"
import { Card, CardContent } from "../../components/ui/card"
import Image from "next/image"
import { Textarea } from "../../components/ui/textarea"
import { NIGERIA_STATES } from "../add-listing/constants"
import { PRODUCT_CATEGORIES } from "../add-listing/constants"
import { IKContext, IKUpload } from 'imagekitio-react'
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { PromoteListingModal } from './components/PromoteListingModal'
import { ToastAction } from "@radix-ui/react-toast"

interface Product {
  _id: string;
  prodName: string;
  category: string;
  price: string;
  description: string;
  certificationStatus: string;
  featured: boolean;
  createdAt: string;
  productImages: string[];
  contact?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  condition?: string;
  warranty?: string;
  stock?: string;
  brand?: string;
  specifications?: { key: string; value: string }[];
}

interface Business {
  _id: string;
  legalname: string;
  industry: string;
  location: string;
  businessPhoneNumber:string;
  businessEmail:string;
  businessType: string;
  businessDescription: string;
  featured: boolean;
  createdAt: string;
  businessProfilePicture: string;
  businessLogo: string;
  registrationStatus?: string;
  openingTime?: string;
  closingTime?: string;
  businessNumber?: string;
  taxId?: string;
  socialMedia?: {
    website?: string;
    facebook?: string;
    instagram?: string;
  };
}

interface Property {
  _id: string;
  title: string;
  propertyType: string;
  listingType: string;
  price: string;
  description: string;
  address: string;
  city: string;
  state: string;
  featured: boolean;
  createdAt: string;
  photos: string[];
  maintenanceFee:string;
  condition:string;
  kitchens?: number;
  petsAllowed?: boolean;
  contact?: {
    name: string;
    phone: string;
    email: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnishing?: string;
  amenities?: string[];
}

interface Service {
  _id: string;
  serviceName: string;
  serviceCategory: string;
  price: string;
  description: string;
  responseTime: string;
  emergencyServices: boolean;
  isAvailable: boolean;
  isVerified: boolean;
  featured: boolean;
  createdAt: string;
  featuredImage: string[];
  state: string;
  city: string;
  address: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  location: {
    address: string;
    city: string;
    state: string;
  };
  contact?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
}

interface FilterOptions {
  category: string;
  status: string;
  search: string;
}

interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export default function ListingManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<FilterOptions>({
    category: '',
    status: '',
    search: ''
  })
  const [sort, setSort] = useState<SortOptions>({
    field: 'createdAt',
    direction: 'desc'
  })
  const [selectedListing, setSelectedListing] = useState<Product | Business | Property | Service | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false)
  const [selectedListingForPromotion, setSelectedListingForPromotion] = useState<Product | Business | Property | Service | null>(null)
  const [activeTab, setActiveTab] = useState<'products' | 'businesses' | 'properties' | 'services'>('products')
  const searchParams = useSearchParams()

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ministryoflabourbackend.vercel.app/api/v1";


  const { currentUser } = useAuth()

  const urlEndpoint = 'https://ik.imagekit.io/bdic';
  const publicKey = 'public_k/7VGHSYTH1q/STxZGOGFWUrsdE='; 
  const authenticator = async () => {
    try {
      const response = await axios.post('https://bdicisp.onrender.com/api/v1/auth/imagekit/auth');
      if (!response.data) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.data;
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      console.error('Authentication request failed:', error);
    }
  };

  const [productImageUploading, setProductImageUploading] = useState(false);
  const [propertyImageUploading, setPropertyImageUploading] = useState(false);
  const [businessImageUploading, setBusinessImageUploading] = useState(false);
  const [serviceImageUploading, setServiceImageUploading] = useState(false);

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductImageUploading(true);
  }

  const handlePropertyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyImageUploading(true);
  }

  const handleBusinessImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessImageUploading(true);
  }

  const handleServiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceImageUploading(true);
  }

  const onProductImageUploadProgress = (progress: number) => {
    setProductImageUploading(true);
    console.log("Progress...", progress);
  }

  const onPropertyImageUploadProgress = (progress: number) => {
    setPropertyImageUploading(true);
    console.log("Progress...", progress);
  }

  const onBusinessImageUploadProgress = (progress: number) => {
    setBusinessImageUploading(true);
    console.log("Progress...", progress);
  }

  const onServiceImageUploadProgress = (progress: number) => {
    setServiceImageUploading(true);
    console.log("Progress...", progress);
  }

  const onProductImageError = (error: any) => {
    console.log("Error", error);
    setProductImageUploading(false);
    toast.error("Failed to upload product image");
  }

  const onPropertyImageError = (error: any) => {
    console.log("Error", error);
    setPropertyImageUploading(false);
    toast.error("Failed to upload property image");
  }

  const onBusinessImageError = (error: any) => {
    console.log("Error", error);
    setBusinessImageUploading(false);
    toast.error("Failed to upload business image");
  }

  const onServiceImageError = (error: any) => {
    console.log("Error", error);
    setServiceImageUploading(false);
    toast.error("Failed to upload service image");
  }

  const onProductImageSuccess = (res: any) => {
    console.log("Success", res);
    setProductImageUploading(false);
    if (selectedListing) {
      setSelectedListing({
        ...selectedListing,
        productImages: [
          ...(selectedListing as Product).productImages || [],
          res.url
        ]
      } as Product);
    }
    toast.success("Product image uploaded successfully");
  }

  const onPropertyImageSuccess = (res: any) => {
    console.log("Success", res);
    setPropertyImageUploading(false);
    if (selectedListing) {
      setSelectedListing({
        ...selectedListing,
        photos: [
          ...(selectedListing as Property).photos || [],
          res.url
        ]
      } as Property);
    }
    toast.success("Property image uploaded successfully");
  }
 const [businessesLogo,setBusinessesLogo]=useState()
 const [businessProfile,setBusinessProfile] = useState()

  const onBusinessImageSuccess = (res: any) => {
    console.log("Success", res);
    
    setBusinessImageUploading(false);
    if (selectedListing) {
      const imageType = res.name.includes('profile') ? 'businessProfilePicture' : 'businessLogo';
      imageType =="businessLogo" ? setBusinessesLogo(res.url): setBusinessProfile(res.url)
      console.log(imageType)
      setSelectedListing({
        ...selectedListing,
        [imageType]: res.url
      } as Business);
    }
    toast.success("Business image uploaded successfully");
  }

  const onServiceImageSuccess = (res: any) => {
    console.log("Success", res);
    setServiceImageUploading(false);
    if (selectedListing) {
      setSelectedListing({
        ...selectedListing,
        featuredImage: [
          ...(selectedListing as Service).featuredImage || [],
          res.url
        ]
      } as Service);
    }
    toast.success("Service image uploaded successfully");
  }

  const fetchListings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`https://ministryoflabourbackend.vercel.app/api/v1/listings/all`, {
        params: {
          page: currentPage,
          limit: 10,
          category: filters.category==="all" ? "":filters.category,
          status: filters.status,
          search: filters.search,
          sortBy: sort.field,
          sortOrder: sort.direction,
          ownerId: currentUser?.data?._id
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })

      if (response.data.data) {
        setProducts(response.data.data.products || [])
        setBusinesses(response.data.data.businesses || [])
        setProperties(response.data.data.properties || [])
        setServices(response.data.data.services || [])
        setTotalPages(response.data.pagination.totalPages)
      }
    } catch (error) {
      toast.error("Failed to fetch listings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [currentPage, filters, sort])



  // useEffect(() => {
  //   const promotion = searchParams?.get("promotion") ?? null;
  //   const listingId = searchParams?.get("listingId") ?? null;
  //   const listingType = searchParams?.get("listingType") ?? null;
  //   const period = searchParams?.get("period") ?? null
  //   const transRef = searchParams?.get("transRef") ?? null

  //   const data_ ={
  //       promotion,
  //       listingId,
  //       listingType,
  //       featured:true,
  //       period,
  //       featured_until: calculateFeaturedUntil(period),
  //       transRef
  //   }
   
  //   if(promotion=="true"){
  //   const prop = listingType?.toLowerCase() ==="services" ? "serviceproviders": listingType
  //   axios.patch(`${API_BASE_URL}/${prop}/${listingId}/set-featured`,data_).then(res=>{
  //       console.error(res.data.data)

  //       toast.success("Your promotion was successful");
  //       setTimeout(() => {
  //         window.location.href =
  //           "http://localhost:3000/dashboard/my-listings";
  //       }, 2000);
  //   }).catch(err=>{
  //    console.error(err)
  //   })
  //   }
  // }, [])
  const promotionParam = searchParams?.get("promotion");
  useEffect(() => {
    const promotionParam = searchParams?.get("promotion");
    const listingId = searchParams?.get("listingId");
    const listingType = searchParams?.get("listingType");
    const period = searchParams?.get("period");
    const transRef = searchParams?.get("transRef");

    if (promotionParam === "true" && listingId && listingType && period && transRef) {
      // Update the listing's featured status and expiration
      const updateListingPromotion = async () => {
        try {
          const currentDate = new Date();
          const expirationDate = new Date(currentDate);
          const days = parseInt(period.split(" ")[0]);
          expirationDate.setDate(currentDate.getDate() + days);

          const response = await axios.put(
            `${API_BASE_URL}/listings/${listingId}?type=${listingType}`,
            {
              featured: true,
              period,
              promotionDate: new Date(),
              featured_until: expirationDate.toISOString(),
              promotionReference: transRef
            },
            {
              headers: {
                "x-access-token": ` ${localStorage.getItem("token")}`
              }
            }
          );

          if (response.data) {
            toast.success("Listing promoted successfully");
                  setTimeout(() => {
                    clearUrlQueryParams()
                  }, 2000);
            //fetchListings(); // Refresh the listings
          }
        } catch (error) {
          toast.error("Failed to update listing promotion");
        }
      };

      updateListingPromotion();
    }
  }, [promotionParam]);
  function clearUrlQueryParams() {
    // 1. Get the current URL
    const currentUrl = window.location.href;
  
    // 2. Create a URL object from the current URL
    const url = new URL(currentUrl);
  
    // 3. Clear the search (query parameters) part of the URL
    url.search = ''; // This sets the query string to empty
  
    // 4. Update the browser's URL using history.replaceState()
    //    - The first argument (state object) can be null or an object to associate with the history entry.
    //    - The second argument (title) is largely ignored by modern browsers.
    //    - The third argument (URL) is the new URL to set.
    window.history.replaceState({}, document.title, url.toString());
  
    console.log('URL query parameters cleared. New URL:', window.location.href);
  }
  const handleDelete = async (id: string,type:string) => {
    try {
      await axios.delete(`https://ministryoflabourbackend.vercel.app/api/v1/listings/${id}?type=${type}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      toast.success("Listing deleted successfully")
      fetchListings()
    } catch (error) {
      toast.error("Failed to delete listing")
    }
    setIsDeleteDialogOpen(false)
  }

  const handleView = (listing: Product | Business | Property | Service) => {

    setSelectedListing(listing)
    setIsViewDialogOpen(true)
   // console.error("my "+JSON.stringify(listing))
  }

  const handleEdit = (listing: Product | Business | Property | Service) => {
    setSelectedListing(listing)
    setIsEditDialogOpen(true)
  }
  const [updatingLoading,setUpdatingLoading] = useState(false)
  const handleUpdateListing = async () => {
    try {
    setUpdatingLoading(true)
      await axios.put(`https://ministryoflabourbackend.vercel.app/api/v1/listings/${selectedListing?._id}?type=${activeTab}`, selectedListing, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      setUpdatingLoading(false)
      toast.success("Listing updated successfully")
      fetchListings()
      setIsEditDialogOpen(false)
    } catch (error) {
    setUpdatingLoading(false)
      toast.error("Failed to update listing")
    }
  }

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const renderTable = () => {
    switch (activeTab) {
      case 'products':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">No data found</TableCell>
                </TableRow>
              )}
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.prodName.charAt(0).toUpperCase() + product.prodName.slice(1)}</TableCell>
                  <TableCell>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</TableCell>
                  <TableCell>₦{product.price}</TableCell>
                  <TableCell>{product.certificationStatus}</TableCell>
                  <TableCell>{product.featured ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(product)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {/* {<DropdownMenuItem disabled={product.featured} onClick={() => handlePromote(product)}>
                          <Star className="mr-2 h-4 w-4" />
                          Promote
                        </DropdownMenuItem>} */}
                        {/* <DropdownMenuItem 
                          onClick={() => {
                            setSelectedListing(product)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case 'businesses':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">No data found</TableCell>
                </TableRow>
              )}
              {businesses.map((business) => (
                <TableRow key={business._id}>
                  <TableCell>{business.legalname.charAt(0).toUpperCase() + business.legalname.slice(1)}</TableCell>
                  <TableCell>{business.industry.charAt(0).toUpperCase() + business.industry.slice(1)}</TableCell>
                  <TableCell>{business.location.charAt(0).toUpperCase() + business.location.slice(1)}</TableCell>
                  <TableCell>{business.businessType.charAt(0).toUpperCase() + business.businessType.slice(1)}</TableCell>
                  <TableCell>{business.featured===true ? 'Yes' : 'No'} </TableCell>
                  <TableCell>{new Date(business.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(business)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(business)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={() => handlePromote(business)}>
                          <Star className="mr-2 h-4 w-4" />
                          Promote
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedListing(business)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
               
              ))}
            </TableBody>
          </Table>
        )
      case 'properties':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">No data found</TableCell>
                </TableRow>
              )}
              {properties.map((property) => (
                <TableRow key={property._id}>
                  <TableCell>{property.title}</TableCell>
                  <TableCell>{property.propertyType}</TableCell>
                  <TableCell>₦{property.price}</TableCell>
                  <TableCell>{property.city}, {property.state}</TableCell>
                  <TableCell>{property.featured ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{new Date(property.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(property)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(property)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={() => handlePromote(property)}>
                          <Star className="mr-2 h-4 w-4" />
                          Promote
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedListing(property)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      case 'services':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">No data found</TableCell>
                </TableRow>
              )}
              {services.map((service) => (
                <TableRow key={service._id}>
                  <TableCell>{service.serviceName}</TableCell>
                  <TableCell>{service.serviceCategory}</TableCell>
                  <TableCell>{service.price}</TableCell>
                  <TableCell>{service.responseTime}</TableCell>
                  <TableCell>
                    <Badge variant={service.isAvailable ? "default" : "destructive"}>
                      {service.isAvailable ? "Available" : "Not Available"}
                    </Badge>
                  </TableCell>
                  <TableCell>{service.featured ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{new Date(service.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(service)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(service)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={() => handlePromote(service)}>
                          <Star className="mr-2 h-4 w-4" />
                          Promote
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedListing(service)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
    }
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

  const handlePromote = (listing: Product | Business | Property | Service) => {
    setSelectedListingForPromotion(listing);
    setIsPromoteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Toaster  position="top-right"
     
        closeButton={true}/>
      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <Button
          variant={activeTab === 'products' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('products')}
        >
          Products
        </Button>
        <Button
          variant={activeTab === 'businesses' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('businesses')}
        >
          Businesses
        </Button>
        <Button
          variant={activeTab === 'properties' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('properties')}
        >
          Properties
        </Button>
        <Button
          variant={activeTab === 'services' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('services')}
        >
          Services
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search listings..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-8"
            />
          </div>
        </div>
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
            <SelectItem value="home">Home Appliances</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        {renderTable()}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedListing && handleDelete(selectedListing._id,activeTab)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {activeTab === 'products' && (selectedListing as Product)?.prodName}
              {activeTab === 'businesses' && (selectedListing as Business)?.legalname}
              {activeTab === 'properties' && (selectedListing as Property)?.title}
              {activeTab === 'services' && (selectedListing as Service)?.serviceName}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[600px] pr-4">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                {activeTab === 'products' && (
                  <>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Category</Label>
                            </div>
                            <p className="text-sm font-medium capitalize text-green-900">{(selectedListing as Product)?.category}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Price</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">₦{(selectedListing as Product)?.price?.toLocaleString()}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Condition</Label>
                            </div>
                            <p className="text-sm font-medium capitalize text-green-900">{(selectedListing as Product)?.condition || 'N/A'}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Warranty</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Product)?.warranty || 'N/A'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Stock</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Product)?.stock || 'N/A'}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Certification</Label>
                            </div>
                            <p className="text-sm font-medium capitalize text-green-900">{(selectedListing as Product)?.certificationStatus || 'N/A'}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Brand</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Product)?.brand || 'N/A'}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Featured</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Product)?.featured ? "Yes" : "No"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Description</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">{(selectedListing as Product)?.description}</p>
                          </div>
                          {(selectedListing as Product)?.specifications && (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <List className="h-4 w-4 text-muted-foreground" />
                                <Label className="text-sm font-medium">Specifications</Label>
                              </div>
                              <div className="space-y-1">
                                {(selectedListing as Product)?.specifications?.map((spec, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">{spec.key}:</span>
                                    <span className="text-sm text-muted-foreground">{spec.value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {activeTab === 'businesses' && (
                  <>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Store className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Industry</Label>
                            </div>
                            <p className="text-sm font-medium capitalize text-green-900">{(selectedListing as Business)?.industry}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Business Type</Label>
                            </div>
                            <p className="text-sm font-medium capitalize text-green-900">{(selectedListing as Business)?.businessType}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Location</Label>
                            </div>
                            <p className="text-sm font-medium capitalize text-green-900">{(selectedListing as Business)?.location}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Award className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Registration Status</Label>
                            </div>
                            <p className="text-sm font-medium capitalize text-green-900">{(selectedListing as Business)?.registrationStatus || 'N/A'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Opening Hours</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">
                              {(selectedListing as Business)?.openingTime || 'N/A'} - {(selectedListing as Business)?.closingTime || 'N/A'}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Business Number</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Business)?.businessNumber || 'N/A'}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Tax ID</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Business)?.taxId || 'N/A'}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Star className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Featured</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Business)?.featured ? "Yes" : "No"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Description</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">{(selectedListing as Business)?.businessDescription}</p>
                          </div>
                          {(selectedListing as Business)?.socialMedia && (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <Label className="text-sm font-medium">Social Media</Label>
                              </div>
                              <div className="space-y-1">
                                {(selectedListing as Business)?.socialMedia?.website && (
                                  <a href={(selectedListing as Business)?.socialMedia?.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block">
                                    Website
                                  </a>
                                )}
                                {(selectedListing as Business)?.socialMedia?.facebook && (
                                  <a href={(selectedListing as Business)?.socialMedia?.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block">
                                    Facebook
                                  </a>
                                )}
                                {(selectedListing as Business)?.socialMedia?.instagram && (
                                  <a href={(selectedListing as Business)?.socialMedia?.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block">
                                    Instagram
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {activeTab === 'properties' && (
                  <>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Home className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Property Type</Label>
                            </div>
                            <p className="text-sm font-medium capitalize text-green-900">{(selectedListing as Property)?.propertyType}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Price</Label>
                            </div>
                            <p className="text-sm font-bold text-black-900">₦{(selectedListing as Property)?.price?.toLocaleString()}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Location</Label>
                            </div>
                            <p className="text-sm font-medium capitalize text-green-900">
                              {(selectedListing as Property)?.address}, {(selectedListing as Property)?.city}, {(selectedListing as Property)?.state}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Listing Type</Label>
                            </div>
                            <p className="text-sm font-medium capitalize text-green-900">{(selectedListing as Property)?.listingType}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Bedrooms</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Property)?.bedrooms || 'N/A'}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Bathrooms</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Property)?.bathrooms || 'N/A'}</p>
                          </div>
                           <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Kitchen</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Property)?.kitchens || 'N/A'}</p>
                          </div>
                           <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Pets Allowed</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Property)?.petsAllowed ? "Yes" : "No"}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Area</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Property)?.area || 'N/A'} sq ft</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Furnishing</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Property)?.furnishing || 'N/A'}</p>
                          </div>



                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Condition</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">{(selectedListing as Property)?.condition || 'N/A'}</p>
                          </div>


                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Maintenance Fee</Label>
                            </div>
                            <p className="text-sm font-medium text-green-900">₦{(selectedListing as Property)?.maintenanceFee || 'N/A'}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Amenities</Label>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {(selectedListing as Property)?.amenities?.map((amenity, index) => (
                                <Badge key={index} variant="secondary" className="capitalize">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Description</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">{(selectedListing as Property)?.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {activeTab === 'services' && (
                  <>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Category</Label>
                            </div>
                            <p className="text-sm text-sm font-medium capitalize text-green-900">{(selectedListing as Service)?.serviceCategory}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Response Time</Label>
                            </div>
                            <p className="text-sm capitalize font-bold text-black-900">{(selectedListing as Service)?.responseTime}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Price</Label>
                            </div>
                            <p className="text-sm font-bold text-black-900">₦{(selectedListing as Service)?.price?.toLocaleString()}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Emergency Services</Label>
                            </div>
                            <p className="text-sm text-sm font-medium text-green-900">{(selectedListing as Service)?.emergencyServices ? "Available" : "Not Available"}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Location</Label>
                            </div>
                            <p className="text-sm">
                              {(selectedListing as Service)?.location?.address}, {(selectedListing as Service)?.location?.city}, {(selectedListing as Service)?.location?.state}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <Label className="text-sm font-medium">Social Links</Label>
                            </div>
                            <div className="space-y-1">
                              {(selectedListing as Service)?.website && (
                                <a href={(selectedListing as Service)?.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block">
                                  Website
                                </a>
                              )}
                              {(selectedListing as Service)?.facebook && (
                                <a href={(selectedListing as Service)?.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block">
                                  Facebook
                                </a>
                              )}
                              {(selectedListing as Service)?.instagram && (
                                <a href={(selectedListing as Service)?.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block">
                                  Instagram
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <Label className="text-sm font-medium">Description</Label>
                          </div>
                          <p className="text-sm text-muted-foreground">{(selectedListing as Service)?.description}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={selectedListing && (selectedListing as Service).location?.city || ''}
                        onChange={(e) =>
                          setSelectedListing({
                            ...selectedListing,
                            location: {
                              ...((selectedListing as Service)?.location || {}),
                              city: e.target.value
                            }
                          } as Service)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>State</Label>
                      <Select
                        value={selectedListing && (selectedListing as Service).location?.state || ''}
                        onValueChange={(value) =>
                          setSelectedListing({
                            ...selectedListing,
                            location: {
                              ...((selectedListing as Service)?.location || {}),
                              state: value
                            }
                          } as Service)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {NIGERIA_STATES.map((state: string) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={selectedListing && (selectedListing as Service).location?.address || ''}
                        onChange={(e) =>
                          setSelectedListing({
                            ...selectedListing,
                            location: {
                              ...((selectedListing as Service)?.location || {}),
                              address: e.target.value
                            }
                          } as Service)
                        }
                      />
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                {activeTab === 'products' && (
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {(selectedListing as Product)?.productImages?.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="relative aspect-square">
                          <Image
                            src={image}
                            alt={`Product image ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const updatedImages = [...(selectedListing as Product).productImages];
                            updatedImages.splice(index, 1);
                            setSelectedListing({
                              ...selectedListing,
                              productImages: updatedImages,
                            } as Product);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="relative aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <div className="text-center">
                        <IKUpload
                          id="product-images"
                          className="hidden"
                          multiple={false}
                          onChange={handleProductImageUpload}
                          validateFile={(file: any) => file.size < 2000000}
                          onUploadProgress={onProductImageUploadProgress}
                          folder={"/benue-government-properties-web/products/images"}
                          fileName="product-image.png"
                          onError={onProductImageError}
                          onSuccess={onProductImageSuccess}
                        />
                        <label
                          onClick={() => document.getElementById("product-images")?.click()}
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Upload Image</p>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                {productImageUploading && (
                  <div className="flex justify-center mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}

                {activeTab === 'businesses' && (
                  <div className="grid grid-cols-2 gap-4">
                    {(selectedListing as Business)?.businessProfilePicture && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Profile Picture</Label>
                        <div className="relative aspect-square">
                          <Image
                            src={(selectedListing as Business)?.businessProfilePicture}
                            alt="Business profile"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                    {(selectedListing as Business)?.businessLogo && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Business Logo</Label>
                        <div className="relative aspect-square">
                          <Image
                            src={(selectedListing as Business)?.businessLogo}
                            alt="Business logo"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'properties' && (
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {(selectedListing as Property)?.photos?.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={image}
                          alt={`Property image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {(selectedListing as Service)?.featuredImage?.map((image, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={image}
                          alt={`Service image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                {activeTab === 'products' && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Contact Name</Label>
                        </div>
                        <p className="text-sm">{(selectedListing as Product)?.contact?.name}</p>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Email</Label>
                        </div>
                        <p className="text-sm">{(selectedListing as Product)?.contact?.email}</p>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Phone</Label>
                        </div>
                        <p className="text-sm">{(selectedListing as Product)?.contact?.phoneNumber}</p>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Created At</Label>
                        </div>
                        <p className="text-sm">{new Date((selectedListing as Product)?.createdAt || '').toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'properties' && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Contact Name</Label>
                        </div>
                        <p className="text-sm">{(selectedListing as Property)?.contact?.name}</p>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Email</Label>
                        </div>
                        <p className="text-sm">{(selectedListing as Property)?.contact?.email}</p>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Phone</Label>
                        </div>
                        <p className="text-sm">{(selectedListing as Property)?.contact?.phone}</p>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Created At</Label>
                        </div>
                        <p className="text-sm">{new Date((selectedListing as Property)?.createdAt || '').toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'services' && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Phone</Label>
                        </div>
                        <p className="text-sm">{(selectedListing as Service)?.contact?.phoneNumber}</p>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Email</Label>
                        </div>
                        <p className="text-sm">{(selectedListing as Service)?.contact?.email}</p>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Created At</Label>
                        </div>
                        <p className="text-sm">{new Date((selectedListing as Service)?.createdAt || '').toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'businesses' && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Phone</Label>
                        </div>
                        <p className="text-sm">{(selectedListing as Business)?.businessPhoneNumber}</p>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Email</Label>
                        </div>
                        <p className="text-sm">{(selectedListing as Business)?.businessEmail}</p>

                        <Separator />

                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <Label className="text-sm font-medium">Created At</Label>
                        </div>
                        <p className="text-sm">{new Date((selectedListing as Business)?.createdAt || '').toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {activeTab === 'products' && 'Edit Product'}
              {activeTab === 'businesses' && 'Edit Business'}
              {activeTab === 'properties' && 'Edit Property'}
              {activeTab === 'services' && 'Edit Service'}
            </DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {activeTab === 'products' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Product Name </Label>
                        <Input
                          value={(selectedListing as Product).prodName}
                          onChange={(e) =>
                            setSelectedListing({
                              ...selectedListing,
                              prodName: e.target.value,
                            } as Product)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category {(selectedListing as Product).category}</Label>
                        <Select
                          value={(selectedListing as Product).category?.charAt(0).toUpperCase() + (selectedListing as Product).category.slice(1)}
                          onValueChange={(value) =>
                            setSelectedListing({
                              ...selectedListing,
                              category: value,
                            } as Product)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {PRODUCT_CATEGORIES.map((category: string) => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                           
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          value={(selectedListing as Product).price}
                          onChange={(e) =>
                            setSelectedListing({
                              ...selectedListing,
                              price: e.target.value,
                            } as Product)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Certification Status</Label>
                        <Select
                          value={(selectedListing as Product).certificationStatus}
                          onValueChange={(value) =>
                            setSelectedListing({
                              ...selectedListing,
                              certificationStatus: value,
                            } as Product)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Certified">Certified</SelectItem>
                            <SelectItem value="Not Certified">Not Certified</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={(selectedListing as Product).description}
                        onChange={(e) =>
                          setSelectedListing({
                            ...selectedListing,
                            description: e.target.value,
                          } as Product)
                        }
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Product Images</Label>
                      <IKContext
                        urlEndpoint={urlEndpoint}
                        publicKey={publicKey}
                        authenticator={authenticator}
                      >
                        <div className="grid grid-cols-3 gap-4">
                          {(selectedListing as Product)?.productImages?.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="relative aspect-square">
                                <Image
                                  src={image}
                                  alt={`Product image ${index + 1}`}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const updatedImages = [...(selectedListing as Product).productImages];
                                  updatedImages.splice(index, 1);
                                  setSelectedListing({
                                    ...selectedListing,
                                    productImages: updatedImages,
                                  } as Product);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <div className="relative aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            <div className="text-center">
                              <IKUpload
                                id="product-images"
                                className="hidden"
                                multiple={false}
                                onChange={handleProductImageUpload}
                                validateFile={(file: any) => file.size < 2000000}
                                onUploadProgress={onProductImageUploadProgress}
                                folder={"/benue-government-properties-web/products/images"}
                                fileName="product-image.png"
                                onError={onProductImageError}
                                onSuccess={onProductImageSuccess}
                              />
                              <label
                                onClick={() => document.getElementById("product-images")?.click()}
                                className="cursor-pointer flex flex-col items-center"
                              >
                                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Upload Image</p>
                              </label>
                            </div>
                          </div>
                        </div>
                        {productImageUploading && (
                          <div className="flex justify-center mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        )}
                      </IKContext>
                    </div>

                  </>
                )}

                {activeTab === 'businesses' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Business Name</Label>
                        <Input
                          value={(selectedListing as Business).legalname}
                          onChange={(e) =>
                            setSelectedListing({
                              ...selectedListing,
                              legalname: e.target.value,
                            } as Business)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Industry</Label>
                        <Input
                          value={(selectedListing as Business).industry}
                          onChange={(e) =>
                            setSelectedListing({
                              ...selectedListing,
                              industry: e.target.value,
                            } as Business)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Business Type</Label>
                        <Select
                          value={(selectedListing as Business).businessType}
                          onValueChange={(value) =>
                            setSelectedListing({
                              ...selectedListing,
                              businessType: value,
                            } as Business)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="Partnership">Partnership</SelectItem>
                            <SelectItem value="Corporation">Corporation</SelectItem>
                            <SelectItem value="LLC">Limited Liability Company</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={(selectedListing as Business).location}
                          onChange={(e) =>
                            setSelectedListing({
                              ...selectedListing,
                              location: e.target.value,
                            } as Business)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={(selectedListing as Business).businessDescription}
                        onChange={(e) =>
                          setSelectedListing({
                            ...selectedListing,
                            businessDescription: e.target.value,
                          } as Business)
                        }
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Business Images</Label>
                      <IKContext
                        urlEndpoint={urlEndpoint}
                        publicKey={publicKey}
                        authenticator={authenticator}
                      >
                        <div className="grid grid-cols-3 gap-4">
                          {(selectedListing as Business)?.businessProfilePicture && (
                            <div className="relative group">
                              <div className="relative aspect-square">
                                {/* <Image
                                  src={(selectedListing as Business).businessProfilePicture}
                                  alt="Business profile"
                                  fill
                                  className="object-cover rounded-lg"
                                /> */}

                                  {businessProfile ? 
                                <Image
                                  src={businessProfile}
                                  alt="Business profile"
                                  fill
                                  className="object-cover rounded-lg"
                                /> :  <Image
                                  src={(selectedListing as Business).businessProfilePicture}
                                  alt="Business profile"
                                  fill
                                  className="object-cover rounded-lg"
                                />}
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  setSelectedListing({
                                    ...selectedListing,
                                    businessProfilePicture: '',
                                  } as Business);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          {(selectedListing as Business)?.businessLogo && (
                            <div className="relative group">
                              <div className="relative aspect-square">
                              {businessesLogo ? 
                                <Image
                                  src={businessesLogo}
                                  alt="Business logo"
                                  fill
                                  className="object-cover rounded-lg"
                                /> :  <Image
                                  src={(selectedListing as Business).businessLogo}
                                  alt="Business logo"
                                  fill
                                  className="object-cover rounded-lg"
                                />}
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  setSelectedListing({
                                    ...selectedListing,
                                    businessLogo: '',
                                  } as Business);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                          <div className="relative aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            <div className="text-center">
                              <IKUpload
                                id="business-profile"
                                className="hidden"
                                multiple={false}
                                onChange={handleBusinessImageUpload}
                                validateFile={(file: any) => file.size < 2000000}
                                onUploadProgress={onBusinessImageUploadProgress}
                                folder={"/benue-government-properties-web/businesses/profile"}
                                fileName="business-profile.png"
                                onError={onBusinessImageError}
                                onSuccess={onBusinessImageSuccess}
                              />
                              <label
                                onClick={() => document.getElementById("business-profile")?.click()}
                                className="cursor-pointer flex flex-col items-center"
                              >
                                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Upload Profile Picture</p>
                              </label>
                            </div>
                          </div>
                          <div className="relative aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            <div className="text-center">
                              <IKUpload
                                id="business-logo"
                                className="hidden"
                                multiple={false}
                                onChange={handleBusinessImageUpload}
                                validateFile={(file: any) => file.size < 2000000}
                                onUploadProgress={onBusinessImageUploadProgress}
                                folder={"/benue-government-properties-web/businesses/logo"}
                                fileName="business-logo.png"
                                onError={onBusinessImageError}
                                onSuccess={onBusinessImageSuccess}
                              />
                              <label
                                onClick={() => document.getElementById("business-logo")?.click()}
                                className="cursor-pointer flex flex-col items-center"
                              >
                                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Upload Logo</p>
                              </label>
                            </div>
                          </div>
                        </div>
                        {businessImageUploading && (
                          <div className="flex justify-center mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        )}
                      </IKContext>
                    </div>
                  </>
                )}

                {activeTab === 'properties' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={(selectedListing as Property).title}
                          onChange={(e) =>
                            setSelectedListing({
                              ...selectedListing,
                              title: e.target.value,
                            } as Property)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Property Type</Label>
                        <Select
                          value={(selectedListing as Property).propertyType}
                          onValueChange={(value) =>
                            setSelectedListing({
                              ...selectedListing,
                              propertyType: value,
                            } as Property)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Land">Land</SelectItem>
                            <SelectItem value="Commercial">Commercial</SelectItem>
                            <SelectItem value="Industrial">Industrial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          value={(selectedListing as Property).price}
                          onChange={(e) =>
                            setSelectedListing({
                              ...selectedListing,
                              price: e.target.value,
                            } as Property)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Listing Type</Label>
                        <Select
                          value={(selectedListing as Property).listingType}
                          onValueChange={(value) =>
                            setSelectedListing({
                              ...selectedListing,
                              listingType: value,
                            } as Property)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="For Sale">For Sale</SelectItem>
                            <SelectItem value="For Rent">For Rent</SelectItem>
                            <SelectItem value="For Lease">For Lease</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Select
                          value={(selectedListing as Property).state}
                          onValueChange={(value) =>
                            setSelectedListing({
                              ...selectedListing,
                              state: value,
                            } as Property)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {NIGERIA_STATES.map((state: string) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={(selectedListing as Property).city}
                          onChange={(e) =>
                            setSelectedListing({
                              ...selectedListing,
                              city: e.target.value,
                            } as Property)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        value={(selectedListing as Property).address}
                        onChange={(e) =>
                          setSelectedListing({
                            ...selectedListing,
                            address: e.target.value,
                          } as Property)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={(selectedListing as Property).description}
                        onChange={(e) =>
                          setSelectedListing({
                            ...selectedListing,
                            description: e.target.value,
                          } as Property)
                        }
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Property Images</Label>
                      <IKContext
                        urlEndpoint={urlEndpoint}
                        publicKey={publicKey}
                        authenticator={authenticator}
                      >
                        <div className="grid grid-cols-3 gap-4">
                          {(selectedListing as Property)?.photos?.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="relative aspect-square">
                                <Image
                                  src={image}
                                  alt={`Property image ${index + 1}`}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const updatedImages = [...(selectedListing as Property).photos];
                                  updatedImages.splice(index, 1);
                                  setSelectedListing({
                                    ...selectedListing,
                                    photos: updatedImages,
                                  } as Property);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <div className="relative aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            <div className="text-center">
                              <IKUpload
                                id="property-images"
                                className="hidden"
                                multiple={false}
                                onChange={handlePropertyImageUpload}
                                validateFile={(file: any) => file.size < 2000000}
                                onUploadProgress={onPropertyImageUploadProgress}
                                folder={"/benue-government-properties-web/properties/images"}
                                fileName="property-image.png"
                                onError={onPropertyImageError}
                                onSuccess={onPropertyImageSuccess}
                              />
                              <label
                                onClick={() => document.getElementById("property-images")?.click()}
                                className="cursor-pointer flex flex-col items-center"
                              >
                                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Upload Image</p>
                              </label>
                            </div>
                          </div>
                        </div>
                        {propertyImageUploading && (
                          <div className="flex justify-center mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        )}
                      </IKContext>
                    </div>
                  </>
                )}

                {activeTab === 'services' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Service Name</Label>
                        <Input
                          value={(selectedListing as Service).serviceName}
                          onChange={(e) =>
                            setSelectedListing({
                              ...selectedListing,
                              serviceName: e.target.value,
                            } as Service)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={(selectedListing as Service).serviceCategory}
                          onValueChange={(value) =>
                            setSelectedListing({
                              ...selectedListing,
                              serviceCategory: value,
                            } as Service)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tech & Digital">Tech & Digital</SelectItem>
                            <SelectItem value="Home Services">Home Services</SelectItem>
                            <SelectItem value="Professional Services">Professional Services</SelectItem>
                            <SelectItem value="Health & Wellness">Health & Wellness</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Legal Services">Legal Services</SelectItem>
                            <SelectItem value="Financial Services">Financial Services</SelectItem>
                            <SelectItem value="Creative Services">Creative Services</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          value={(selectedListing as Service).price}
                          onChange={(e) =>
                            setSelectedListing({
                              ...selectedListing,
                              price: e.target.value,
                            } as Service)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Response Time</Label>
                        <Input
                          value={(selectedListing as Service).responseTime}
                          onChange={(e) =>
                            setSelectedListing({
                              ...selectedListing,
                              responseTime: e.target.value,
                            } as Service)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={(selectedListing as Service).description}
                        onChange={(e) =>
                          setSelectedListing({
                            ...selectedListing,
                            description: e.target.value,
                          } as Service)
                        }
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>State</Label>
                      <Select
                        value={(selectedListing as Service).state}
                        onValueChange={(value) =>
                          setSelectedListing({
                            ...selectedListing,
                            state: value,
                          } as Service)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {NIGERIA_STATES.map((state: string) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        value={(selectedListing as Service).city}
                        onChange={(e) =>
                          setSelectedListing({
                            ...selectedListing,
                            city: e.target.value,
                          } as Service)
                        }
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Service Images</Label>
                      <IKContext
                        urlEndpoint={urlEndpoint}
                        publicKey={publicKey}
                        authenticator={authenticator}
                      >
                        <div className="grid grid-cols-3 gap-4">
                          {(selectedListing as Service)?.featuredImage?.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="relative aspect-square">
                                <Image
                                  src={image}
                                  alt={`Service image ${index + 1}`}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const updatedImages = [...(selectedListing as Service).featuredImage];
                                  updatedImages.splice(index, 1);
                                  setSelectedListing({
                                    ...selectedListing,
                                    featuredImage: updatedImages,
                                  } as Service);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <div className="relative aspect-square border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            <div className="text-center">
                              <IKUpload
                                id="service-images"
                                className="hidden"
                                multiple={false}
                                onChange={handleServiceImageUpload}
                                validateFile={(file: any) => file.size < 2000000}
                                onUploadProgress={onServiceImageUploadProgress}
                                folder={"/benue-government-properties-web/services/images"}
                                fileName="service-image.png"
                                onError={onServiceImageError}
                                onSuccess={onServiceImageSuccess}
                              />
                              <label
                                onClick={() => document.getElementById("service-images")?.click()}
                                className="cursor-pointer flex flex-col items-center"
                              >
                                <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Upload Image</p>
                              </label>
                            </div>
                          </div>
                        </div>
                        {serviceImageUploading && (
                          <div className="flex justify-center mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        )}
                      </IKContext>
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button disabled={updatingLoading} onClick={handleUpdateListing}>{updatingLoading ? "Updating...":"Save Changes"}</Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add the PromoteListingModal */}
      {selectedListingForPromotion && (
        <PromoteListingModal
          isOpen={isPromoteDialogOpen}
          onClose={() => {
            setIsPromoteDialogOpen(false);
            setSelectedListingForPromotion(null);
          }}
          listing={selectedListingForPromotion}
          listingType={activeTab}
          onSuccessfulPromotion={() => {
            setIsPromoteDialogOpen(false);
            setSelectedListingForPromotion(null);
            fetchListings();
          }}
        />
      )}
    </div>
  )
} 