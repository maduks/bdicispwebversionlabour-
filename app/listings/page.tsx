"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, DollarSign, Building,Clock, Home, Briefcase, ShoppingBag, Filter, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import { listingsApi } from "../api/listings"

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

export default function ListingsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams?.get("category") ?? null

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
  // Format price for display
  const formatPriceDisplay = (price: string | number) => {
    if (price === 0 || price === "0") return "N/A"
    
    try {
      const numPrice = typeof price === 'string' ? Number(price.replace(/[^0-9.]/g, "")) : price
      if (isNaN(numPrice)) return "N/A"
      return Number(numPrice).toLocaleString('en', { style: 'currency', currency: 'NGN' })
    } catch (e) {
      console.error("Price formatting error:", e)
      return "N/A"
    }
  }

  // Fetch listings with pagination and filters
  const fetchListings = async (pageNumber: number, isLoadMore = false) => {
    try {
      isLoadMore ? setIsLoadingMore(true) : setIsLoading(true)
      setError(null)

      // Construct query parameters for filtering
      const queryParams = {
        page: pageNumber,
        limit: ITEMS_PER_PAGE,
        search: searchTerm,
        type: selectedCategory !== "all" ? selectedCategory : undefined,
        ...((selectedCategory !== "businesses" && selectedCategory !== "services" ) && { minPrice: priceRange[0] }),
        ...((selectedCategory !== "businesses" && selectedCategory !== "services" ) && { maxPrice: priceRange[1] }), // Fixed typo: maxrice -> maxPrice
        //tags: selectedTags.length > 0 ? selectedTags.join(',') : undefined,
        minRating: minRating,
        sortBy: sortBy
      }

      // Make the API call with the constructed params
      const response = await listingsApi.getListings(queryParams)
      const data = response.data

      // Initialize arrays to handle potentially missing data
      const products = Array.isArray(data.products) ? data.products : []
      const businesses = Array.isArray(data.businesses) ? data.businesses : []
      const properties = Array.isArray(data.properties) ? data.properties : []
      const services = Array.isArray(data.services) ? data.services : []
      
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
          location: typeof product.state === 'object' ? `${product.state.city || ''}, ${product.state.state || ''}`.trim() : product.state,
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
          location: typeof business.location === 'object' ? `${business.location.city || ''}, ${business.location.state || ''}`.trim() : business.location,
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
          title: property.title,
          price: property.price,
          category: 'properties',
          location: typeof property.city === 'object' ? `${property.city.city || ''}, ${property.city.state || ''}`.trim() : (property.city || property.state),
          image: property.photos?.[0],
          featured: property.isFeatured === true || property.isFeatured === 'true',
          rating: 5.0,
          reviews: 20,
          tags: property.tags || []
        })) || []),
        ...(services?.map((service: any) => ({
          ...service,
          id: service._id,
          title: service.title || service.serviceName,
          price: service.price || 0,
          category: 'services',
          location: typeof service.location === 'object' ? 
            `${service.location.city || ''}, ${service.location.state || ''}`.trim() : 
            (service.location || service.city || service.state || 'Location not specified'),
          image: service.image || service.serviceImage || service.photos?.[0],
          featured: service.featured === true || service.featured === 'true',
          rating: service.rating || 4.0,
          reviews: service.reviews || 0,
          tags: service.tags || [],
          description: service.description || 'No description available'
        })) || [])
      ];


     // console.error(JSON.stringify(transformedListings))


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

      // Update the displayed listings
      if (isLoadMore) {
        setDisplayedListings(prev => [...prev, ...transformedListings])

      } else {
        setDisplayedListings(transformedListings)
      }
    } catch (err) {
      setError('Failed to fetch listings. Please try again later.')
      console.error('Error fetching listings:', err)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchListings(1)
  }, [])

  // Fetch when filters change
  useEffect(() => {
    setPage(1)
    fetchListings(1)
  }, [searchTerm, selectedCategory, priceRange, selectedTags, minRating, sortBy])

  // Set initial category from URL parameter
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

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

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setPriceRange([0, 900000000])
    setSelectedTags([])
    setMinRating(0)
    setSortBy("featured")
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchListings(nextPage, true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground">
              {selectedCategory === "all"
                ? "All Listings"
                : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our extensive collection of listings to find exactly what you're looking for
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and filter bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search listings..."
              className="pl-10 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Refine your search with the following filters</SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Category</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={selectedCategory === "all" ? "default" : "outline"}
                        className={selectedCategory === "all" ? "gradient-primary" : ""}
                        onClick={() => setSelectedCategory("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={selectedCategory === "properties" ? "default" : "outline"}
                        className={selectedCategory === "properties" ? "gradient-primary" : ""}
                        onClick={() => setSelectedCategory("properties")}
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Properties
                      </Button>
                      <Button
                        variant={selectedCategory === "businesses" ? "default" : "outline"}
                        className={selectedCategory === "businesses" ? "gradient-primary" : ""}
                        onClick={() => setSelectedCategory("businesses")}
                      >
                        <Building className="h-4 w-4 mr-2" />
                        Businesses
                      </Button>
                      <Button
                        variant={selectedCategory === "services" ? "default" : "outline"}
                        className={selectedCategory === "services" ? "gradient-primary" : ""}
                        onClick={() => setSelectedCategory("services")}
                      >
                        <Briefcase className="h-4 w-4 mr-2" />
                        Services
                      </Button>
                      <Button
                        variant={selectedCategory === "products" ? "default" : "outline"}
                        className={selectedCategory === "products" ? "gradient-primary" : ""}
                        onClick={() => setSelectedCategory("products")}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Products
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">Price Range</h3>
                    <Slider
                      defaultValue={[0, 90000000]}
                      max={90000000}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₦{priceRange[0].toLocaleString()}</span>
                      <span>₦{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">Minimum Rating</h3>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant={minRating >= rating ? "default" : "outline"}
                          className={`w-10 h-10 p-0 ${minRating >= rating ? "gradient-primary" : ""}`}
                          onClick={() => setMinRating(rating)}
                        >
                          {rating}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {allTags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-3">Tags</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {allTags.map((tag) => (
                          <div key={tag} className="flex items-center space-x-2">
                            <Checkbox
                              id={tag}
                              checked={selectedTags.includes(tag)}
                              onCheckedChange={() => handleTagToggle(tag)}
                            />
                            <label
                              htmlFor={tag}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {tag}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button variant="outline" className="w-full" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Filter pills */}
        {(selectedCategory !== "all" || selectedTags.length > 0 || minRating > 0 || searchTerm) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                {getCategoryIcon(selectedCategory)}
                <span>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</span>
                <button className="ml-1 rounded-full hover:bg-muted p-1" onClick={() => setSelectedCategory("all")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                <span>{tag}</span>
                <button className="ml-1 rounded-full hover:bg-muted p-1" onClick={() => handleTagToggle(tag)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {minRating > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span>{minRating}+</span>
                <button className="ml-1 rounded-full hover:bg-muted p-1" onClick={() => setMinRating(0)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1">
                <Search className="h-3 w-3" />
                <span>{searchTerm}</span>
                <button className="ml-1 rounded-full hover:bg-muted p-1" onClick={() => setSearchTerm("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(selectedCategory !== "all" || selectedTags.length > 0 || minRating > 0 || searchTerm) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
                Clear all
              </Button>
            )}
          </div>
        )}

        {/* Results info - now using total from API */}
        <p className="text-muted-foreground mb-6">
          Showing {displayedListings.length} of {total} {total === 1 ? "result" : "results"}
        </p>

        {/* Listings grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <X className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Error</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => fetchListings(1)}>Try Again</Button>
          </div>
        ) : displayedListings.length > 0 ? (
          <>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedListings.map((listing) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50 group"
                >
                  <Link href={`/listings/${listing._id}?type=${listing.category}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={listing.image || listing.productImages?.[0] || listing.businessProfilePicture || listing.photos?.[0] || "/placeholder.svg"}
                        alt={listing.title || 'Listing image'}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                      {(listing.featured === true || listing.featured === 'true') && (
                        <div className="absolute top-4 left-4 gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                      <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span>{listing.rating || 0}</span>
                        <span className="text-muted-foreground">({listing.reviews || 0})</span>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-full">
                        <span>{formatPriceDisplay(listing.price)}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {listing.category && (
                          <Badge variant="outline" className="flex p-1 items-center gap-1 bg-primary/5">
                            {getCategoryIcon(listing.category)}
                            <span className="capitalize">{listing.category}</span>
                          </Badge>
                        )}
                        {listing.subcategory && (
                          <Badge variant="outline" className="flex p-1 items-center gap-1 bg-primary/5">
                            <span className="capitalize">{listing.subcategory}</span>
                          </Badge>
                        )}
                        {listing.tags?.slice(0, 1).map((tag, index) => (
                          tag && (
                            <Badge key={index} variant="secondary" className="bg-secondary/50">
                              {tag}
                            </Badge>
                          )
                        ))}
                      </div>
                      <h3 className="capitalize text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {listing.title || 'Untitled Listing'}
                      </h3>
                      <p className="text-muted-foreground capitalize text-sm mb-4 line-clamp-2">{listing.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.location || 'Location not specified'}
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <button className="w-full py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium">
                        View Details
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}



            </div> */}

            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {displayedListings.map((listing:any) => (
                <div
                key={listing.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img src={listing?.image || listing?.featuredImage[0] || "/placeholder.svg"} alt={listing?.title} className="w-full h-48 object-cover" />
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
                    <span className="text-primary font-bold">{listing.price ===0 ? "No pricing":listing.price }</span>
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
              // <motion.div
              //   key={listing.id}
              //   layout
              //   initial={{ opacity: 0, y: 20 }}
              //   animate={{ opacity: 1, y: 0 }}
              //   exit={{ opacity: 0, y: -20 }}
              //   transition={{ duration: 0.5 }}
              //   className="bg-background rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50 group"
              // >
              //   <Link href={`/listings/${listing.id}`}>
              //     <div className="relative h-48 overflow-hidden">
              //       <Image
              //         src={listing.image || "/placeholder.svg"}
              //         alt={listing.title || 'Listing image'}
              //         layout="fill"
              //         objectFit="cover"
              //         className="transition-transform duration-500 group-hover:scale-110"
              //       />
              //       {listing.featured && (
              //         <div className="absolute top-4 left-4 gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full">
              //           Featured
              //         </div>
              //       )}
              //       <div className="absolute top-4 right-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-full">
              //         <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              //         <span>{listing.rating}</span>
              //         <span className="text-muted-foreground">({listing.reviews})</span>
              //       </div>
              //       <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium px-2 py-1 rounded-full">
              //         <span>{Number(listing.price).toLocaleString('en', { style: 'currency', currency: 'NGN' })}</span>
                      
              //       </div>
              //     </div>
              //     <div className="p-6">
              //       <div className="flex items-center gap-2 mb-2">
              //         <Badge variant="outline" className="capitalize flex items-center gap-1 bg-primary/5">
              //           {getCategoryIcon(listing?.category?? "")}
              //           <span className="capitalize">{listing?.category?.slice(0, -1)}</span>
              //         </Badge>
              //         {listing?.tags?.map((tag, index) => (
              //           <Badge key={index} variant="secondary" className="bg-secondary/50">
              //             {tag}
              //           </Badge>
              //         ))}
              //       </div>
              //       <h3 className="text-xl capitalize font-semibold mb-2 group-hover:text-primary transition-colors">
              //         {listing.title}
              //       </h3>
              //       <p className="text-muted-foreground capitalize text-sm mb-4">{listing.description}</p>
              //       <div className="flex items-center capitalize text-sm text-muted-foreground">
              //         <MapPin className="h-4 w-4 mr-1" />
              //         {listing.location || 'Location not specified'}

              //       </div>
              //     </div>
              //     <div className="px-6 pb-6">
              //       <button className="w-full py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium">
              //         View Details
              //       </button>
              //     </div>
              //   </Link>
              // </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

            {/* Load More button - now using API pagination */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={loadMore} 
                  disabled={isLoadingMore}
                  className="w-48 text-white"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Load More (${currentPage}/${totalPages})`
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No listings found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search term</p>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}