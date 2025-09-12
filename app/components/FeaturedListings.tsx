"use client"

import { useState ,useEffect} from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { MapPin, Star, DollarSign,Clock, Building, Home, Briefcase, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { listingsApi } from "../api/listings"
import { useSearchParams } from "next/navigation"



const categories = [
  { id: "all", name: "All Listings" },
  { id: "properties", name: "Properties", icon: <Home className="h-4 w-4" /> },
  { id: "businesses", name: "Businesses", icon: <Building className="h-4 w-4" /> },
  { id: "services", name: "Services", icon: <Briefcase className="h-4 w-4" /> },
  { id: "products", name: "Products", icon: <ShoppingBag className="h-4 w-4" /> },
]
type ApiListing = {
  _id: string;
  id?: string;
  title?: string;
  prodName?: string;
  legalname?: string;
  description: string;
  price: string | number;
  category?: string;
  subcategory?: string;
  industry?: string;
  propertyType?: string;
  location?: string;
  city?: string;
  state?: string;
  featured: boolean | string;
  rating?: number;
  reviews?: number;
  image?: string;
  productImages?: string[];
  businessProfilePicture?: string;
  photos?: string[];
  tags?: string[];
};
export default function FeaturedListings() {
  const searchParams = useSearchParams()

  const categoryParam = searchParams?.get("category") ?? null
  const [activeTab, setActiveTab] = useState<string>(categoryParam || "all");
  const [allListings, setAllListings] = useState<ApiListing[]>([]); // Store all fetched listings
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all")
  const [priceRange, setPriceRange] = useState([0, 900000000])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("featured")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [displayedListings, setDisplayedListings] = useState<ApiListing[]>([])
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const ITEMS_PER_PAGE = 2
  const [allTags, setAllTags] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [limit, setLimit] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading ,setLoading]=useState(true)
  const [errorListing,setErrorListing] = useState(false)

  function timeAgo(dateString: Date | string): string  {
    const now = new Date().getTime();
    const then = new Date(dateString).getTime();
    const seconds = Math.floor((now - then ) / 1000);
    const intervals = [
      { label: 'year', secs: 31536000 },
      { label: 'month', secs: 2592000 },
      { label: 'week', secs: 604800 },
      { label: 'day', secs: 86400 },
      { label: 'hour', secs: 3600 },
      { label: 'minute', secs: 60 },
      { label: 'second', secs: 1 }
    ];
  
    for (let i = 0; i < intervals.length; i++) {
      const interval = Math.floor(seconds / intervals[i].secs);
      if (interval >= 1) {
        return `${interval} ${interval === 1 ? intervals[i].label : intervals[i].label + 's'} ago`;
      }
    }
  
    return 'just now';
  }
 
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "properties":
        return <Home className="h-4 w-4" />
      case "businesses":
        return <Building className="h-4 w-4" />
      case "services":
        return <Briefcase className="h-4 w-4" />
      case "products":
        return <ShoppingBag className="h-4 w-4" />
      default:
        return null
    }
  }
  const fetchListings = async (pageNumber: number, isLoadMore = false) => {
    try {
      isLoadMore ? setIsLoadingMore(true) : setIsLoading(true)
      setError(null)
      setLoading(true)
      setErrorListing(false)
      // Construct query parameters for filtering
      const queryParams = {
        page: pageNumber,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        type: selectedCategory !== "all" ? selectedCategory : undefined,
        ...((selectedCategory !== "businesses" && selectedCategory !== "services") && { minPrice: priceRange[0] }),
        ...((selectedCategory !== "businesses" && selectedCategory !== "services" ) && { maxPrice: priceRange[1] }), // Fixed typo: maxrice -> maxPrice
        //tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
        minRating: minRating,
        sortBy: sortBy
      }

      // Make the API call with the constructed params
      const response = await listingsApi.getFeaturedListings(queryParams)
      const data = response.data

      console.log('API Response:', data)
      console.log('Properties from API:', data.properties)

      setLoading(false)

      // Initialize arrays to handle potentially missing data
      const products = Array.isArray(data.products) ? data.products : []
      const businesses = Array.isArray(data.businesses) ? data.businesses : []
      const properties = Array.isArray(data.properties) ? data.properties : []
      const services = Array.isArray(data.services) ? data.services : []
      
      console.log('Transformed properties array:', data)

      // Store pagination information from the API
      const totalPages = response.pagination.totalPages
      const total = response.pagination.total
      const currentPage = response.pagination.currentPage
      const lismit = response.pagination.limit
      
      // Update state with pagination information
      setTotal(total)
      setCurrentPage(currentPage)
      setLimit(limit)
      setTotalPages(totalPages)
      
      // Check if there are more pages to load based on API pagination
      setHasMore(currentPage < totalPages)

      // Transform the API data with null/undefined checks
      const transformedListings: ApiListing[] = [
        ...(products?.map((product: any) => ({
          ...product,
          id: product._id,
          title: product.prodName,
          price: product.price,
          category: 'products',
          subcategory: product.category,
          location: product.state,
          image: product.productImages?.[0],
          featured: product.featured === true || product.featured === 'true',
          rating: 4.5,
          reviews: 10,
          tags: product.tags || []
        })) || []),
        ...(businesses?.map((business: any) => ({
          ...business,
          id: business._id,
          title: business.legalname,
          price: 0,
          category: 'businesses',
          location: business.location,
          image: business.businessProfilePicture,
          featured: business.featured === true || business.featured === 'true',
          rating: 4.0,
          reviews: 5,
          tags: [],
          description: business.businessDescription || 'No description available'
        })) || []),
        
        ...(properties?.map((property: any) => ({
            ...property,
            id: property._id,
            title: property.title || property.propertyName,
            price: property.price || 0,
            category: 'properties',
            location: typeof property.location === 'object' ? 
              `${property.location.city || ''}, ${property.location.state || ''}`.trim() : 
              (property.location || property.city || property.state || 'Location not specified'),
            image: property.photos?.[0] || property.images?.[0] || property.featuredImage?.[0],
            featured: property.featured === true || property.featured === 'true' || property.isFeatured === true || property.isFeatured === 'true',
            rating: property.rating || 5.0,
            reviews: property.reviews || 20,
            tags: property.tags || [],
            description: property.description || 'No description available'
          
        })) || []),
        ...(services?.map((service: any) => ({
          ...service,
          id: service._id,
          title: service.serviceName || service.title,
          price: service.price || 0,
          category: 'services',
          location: typeof service.location === 'object' ? 
            `${service.location.city || ''}, ${service.location.state || ''}`.trim() : 
            (service.location || service.city || service.state || 'Location not specified'),
          image: service.featuredImage?.[0] || service.image || service.serviceImage,
          featured: service.featured === true || service.featured === 'true',
          rating: service.rating || 4.0,
          reviews: service.reviews || 0,
          tags: service.tags || [],
          description: service.description || 'No description available'
        })) || [])
      ];

      console.log('Final transformed listings:', transformedListings)

      // Collect all tags for the filter sidebar
      if (pageNumber === 1) {
        const allTagsSet = new Set<string>()
        transformedListings.forEach(listing => {
          if (listing.tags) {
            listing.tags.forEach(tag => {
              if (tag) allTagsSet.add(tag)
            })
          }
        })
        setAllTags(Array.from(allTagsSet))
      }

      if (isLoadMore) {
        setAllListings(prev => [...prev, ...transformedListings]);
      } else {
        setAllListings(transformedListings);
      }

    } catch (err) {
      setLoading(false)
      setErrorListing(true)
      setTimeout(() => {
        fetchListings(1)
      }, 10000);
      setError('Failed to fetch listings. Please try again later.')
      console.error('Error fetching listings:', err)
    } finally {
      setLoading(false)
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    if (activeTab === "all") {
      setDisplayedListings(allListings);
    } else {
      setDisplayedListings(allListings.filter(listing => listing.category === activeTab));
    }
  }, [activeTab, allListings]);

    // Initial fetch
    useEffect(() => {
      fetchListings(1)
    }, [])
  return (
    <section className="py-10 relative overflow-hidden" id="featured">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Featured Listings</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of top-rated properties, businesses, services, and products
          </p>
        </motion.div>


        <motion.div className="container mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md shadow-sm"  role="group">
              {categories.map((category) => (
                 <motion.button
                 key={category.id}
                 onClick={() => setActiveTab(category.id)}
                 style={{
                  borderTopLeftRadius: `${category.name==="All Listings"  ? '0.5rem':0}`,
                   borderBottomLeftRadius:`${category.name==="All Listings"  ? '0.5rem':0}`,
                   borderTopRightRadius: `${category.name==="Products"  ? '0.5rem':0}`,
                   borderBottomRightRadius:`${category.name==="Products"  ? '0.5rem':0}`
                  }}
                  whileHover={{scale: 1.02}}
                  whileTap={{scale:0.95}}
                 //className={`px-4 py-2 text-sm font-medium rounded-l-lg ${category === category ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                className={`px-4 py-2 text-sm font-medium ${category.name==="All Listings" ? "rounded-l-lg":"" } ${category.id === activeTab ?"bg-primary text-white" : " bg-white text-gray-700 hover:bg-gray-100"}`}
               >

                 {/* {category.icon} */}
                 {category.name} 
               </motion.button>
              ))}
             
              </div>
            </div>
            </motion.div>

   
     {loading ? 
        (
        <div className="text-center text-gray-600 p-10 flex flex-col items-center justify-center">
        <svg
          className="animate-spin h-8 w-8 text-green-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-md font-semibold">Loading...</p>
        <p className="text-gray-500 text-sm">Fetching featured listings</p>
      </div>
      
     ):null}

     {errorListing ? (
      <div className="text-center text-gray-600 p-10 flex flex-col items-center justify-center">
      <p className="text-md font-semibold">Error</p>
      <p className="text-gray-500 text-sm">Check your internet connection and refresh</p>
      </div>
     ):null}
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {displayedListings.map((listing:any) => (
                <div
                key={listing.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img src={listing.image || "/placeholder.svg"} alt={listing.title} className="w-full h-48 object-cover" />
                  {listing.featured && (
                    <span className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
                      Featured 
                    </span>
                  )}
                  <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-gray-800 text-xs font-medium px-2 py-1 rounded-md">
                    {listing?.category.charAt(0).toUpperCase() + listing?.category.slice(1)}
                  </span>
                </div>
      
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-primary font-bold">{listing.price}</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-600 ml-1">
                        {listing.rating} ({listing.reviews})
                      </span>
                    </div>
                  </div>
      
                  <h3 className="font-bold text-gray-900 mb-1 text-transform: capitalize">{listing.title}</h3>
      
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-transform: capitalize">{listing.location}</span>
                  </div>
      
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description.charAt(0).toUpperCase()+listing.description.slice(1)}</p>
      
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{timeAgo(listing?.createdAt)}</span>
                    </div>
      
                    <a
                    href={`/listings/${listing.id}?type=${listing?.category}`}
                      //onClick={() => onViewDetails(listing)}
                      className="text-sm font-medium text-primary hover:text-green-800"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
              
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 text-center">
          <Link href="/listings">
            <motion.button
              className="px-6 py-3 rounded-md gradient-primary text-white font-medium hover:opacity-90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Listings
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  )
}
