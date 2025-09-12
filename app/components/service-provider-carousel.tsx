"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

const featuredItems = [
  // --- Service Providers ---
  {
    id: 1,
    type: "provider",
    name: "Hemen Ogunda",
    specialty: "Master Electrician",
    rating: 4.9,
    reviews: 127,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    badges: ["Licensed", "Certified"],
    completedProjects: 189,
    skills: ["Residential", "Commercial", "Solar"],
    location: "Minna, GA",
    available: true,
    stock: "In Stock"
  },
  {
    id: 2,
    type: "provider",
    name: "Msughter Williams",
    specialty: "Master Plumber",
    rating: 5.0,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    badges: ["Master Plumber", "Emergency Service"],
    completedProjects: 156,
    skills: ["Pipe Repair", "Installation", "Emergency"],
    location: "No 12 High-Level Road, Gboko",
    available: true,
    stock: "In Stock"
  },

  // --- Business Premises ---
  {
    id: 101,
    type: "business",
    name: "Tony's Auto Garage",
    category: "Auto Repair",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=150&h=150&fit=crop",
    verified: true,
    address: "No 12 High-Level Road, Makurdi",
    rating: 4.6,
    reviews: 53,
    stock: "In Stock",
    services: ["Engine Repair", "Oil Change", "Tire Replacement"]
  },

  // --- Product ---
  {
    id: 201,
    type: "product",
    name: "Aluminum Roofing Sheet",
    category: "Building Material",
    image: "https://images.unsplash.com/photo-1604147706283-4c4fdd062e4e?w=150&h=150&fit=crop",
    price: "₦4,200 per sqm",
    vendor: "Benue Steel Depot",
    verified: true,
    prodType:"Imported",
    location: "Gboko Road, Makurdi",
    stock: "In Stock"
  },

  // --- Property ---
  // {
  //   id: 301,
  //   type: "property",
  //   name: "3-Bedroom Bungalow",
  //   category: "Residential",
  //   image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&h=150&fit=crop",
  //   verified: true,
  //   price: "₦12,000,000",
  //   address: "New GRA, Makurdi",
  //   features: ["3 Beds", "2 Baths", "1 Kitchen", "Parking Space"],
  //   stock: "In Stock"
  // }
];


export function ServiceProviderCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredItems.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredItems.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative w-full max-w-[90vw] sm:max-w-md mx-auto">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredItems.map((item) => (
            <div key={item.id} className="w-full flex-shrink-0">
              <Card className="border-0 shadow-xl sm:shadow-2xl bg-white/95 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="text-center space-y-3 sm:space-y-4 lg:space-y-6">
                    {/* Avatar / Image */}
                    <div className="relative mx-auto w-fit">
                      <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-2 sm:border-4 border-white shadow-lg">
                        <AvatarImage src={item.image || "/placeholder.svg"} alt={item.name} />
                        <AvatarFallback className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                          {item.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {item.type === "provider" && (
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full border-2 border-white flex items-center justify-center ${
                            item.available ? "bg-green-500" : "bg-gray-400"
                          }`}
                        >
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Badges / Category */}
                    <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
                      {item.type === "provider" && (
                        <Badge className="text-xs sm:text-sm">{item.specialty}</Badge>
                      )}
                      {item.type === "business" && (
                        <Badge className="text-xs sm:text-sm">{item.category}</Badge>
                      )}
                      {item.type === "product" && (
                        <Badge className="text-xs sm:text-sm">{item.category}</Badge>
                      )}
                      {item.type === "property" && (
                        <Badge className="text-xs sm:text-sm">{item.category}</Badge>
                      )}
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                      {(item.location || item.address) && (
                        <p className="text-xs sm:text-sm text-gray-600">
                          {item.location || item.address}
                        </p>
                      )}
                    </div>

                    {/* Skills / Services / Features */}
                    <div className="flex justify-center gap-1 sm:gap-2 flex-wrap text-xs sm:text-sm">
                      {item.skills?.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs sm:text-sm">
                          {skill}
                        </Badge>
                      ))}
                      {item.services?.map((service) => (
                        <Badge key={service} variant="outline" className="text-xs sm:text-sm">
                          {service}
                        </Badge>
                      ))}
                      {item.features?.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs sm:text-sm">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <Badge className="text-xs sm:text-sm">
                      Certified <CheckCircle className="ml-1 mb-0.5 sm:mb-1" size={12} />
                    </Badge>

                    {/* CTA Button */}
                    {item.type === "provider" && (
                      <Button
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 text-xs sm:text-sm py-2 sm:py-3"
                        disabled={!item.available}
                      >
                        {item.available ? "View Professional" : "Currently Busy"}
                      </Button>
                    )}
                    {item.type === "business" && (
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 text-xs sm:text-sm py-2 sm:py-3">
                        View Business
                      </Button>
                    )}
                    {item.type === "product" && (
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 text-xs sm:text-sm py-2 sm:py-3">
                        View Product
                      </Button>
                    )}
                    {item.type === "property" && (
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 text-xs sm:text-sm py-2 sm:py-3">
                        View Property
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-1 sm:left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white shadow-lg w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
        onClick={prevSlide}
      >
        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-1 sm:right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm border-white/20 hover:bg-white shadow-lg w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10"
        onClick={nextSlide}
      >
        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1 sm:gap-2 mt-3 sm:mt-4 lg:mt-6">
        {featuredItems.map((_, index) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-emerald-500 w-4 sm:w-6 lg:w-8" : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
