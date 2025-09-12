"use client"

import { useState, useEffect } from "react"
import { MapPin, Building, ShoppingBag, Briefcase } from "lucide-react"

export default function Hero() {
  const [activeTab, setActiveTab] = useState("properties")
  const [animationIndex, setAnimationIndex] = useState(0)

  const categories = [
    { id: "properties", name: "Properties", icon: <MapPin className="w-5 h-5" /> },
    { id: "businesses", name: "Businesses", icon: <Building className="w-5 h-5" /> },
    { id: "products", name: "Products", icon: <ShoppingBag className="w-5 h-5" /> },
    { id: "services", name: "Services", icon: <Briefcase className="w-5 h-5" /> },
  ]

  const images = [
    "https://ik.imagekit.io/paysupport/1533_sP0Qeto61.jpg?updatedAt=1744411275664",
    "https://ik.imagekit.io/bdic/benue-government-properties/Images/78154.jpg?updatedAt=1745966011889",
    "https://ik.imagekit.io/bdic/benue-government-properties/Images/39373.jpg?updatedAt=1745966331468",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl  md:text-3xl lg:text-5xl font-extrabold leading-tight">
                
              Expose Your Brand, {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Attract Buyers
              </span>
               <br/> & Get paid.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  
                </span>
              </h1>
              <p className="text-lg md:text-xl text-green-100 max-w-xl">
              Find the best properties, businesses, services, and products all in one place. Our platform connects you
              with top-rated listings tailored to your requirements.              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-xl">
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveTab(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === category.id ? "bg-white text-primary" : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>

              <button onClick={()=>window.location.href=`/listings?category=${activeTab}`}className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl">
                Explore All Listings
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-6">
                <img
                  className="w-11 h-11 rounded-full border-2 border-green-900"
                  src="https://ik.imagekit.io/bdic/benue-government-properties/Images/man.png?updatedAt=1745935633905"
                  alt="User"
                />
                <img
                  className="w-11 h-11 rounded-full border-2 border-green-900"
                  src="https://ik.imagekit.io/bdic/benue-government-properties/Images/gamer.png?updatedAt=1745935736840"
                  alt="User"
                />
                <img
                  className="w-11 h-11 rounded-full border-2 border-green-900"
                  src="https://ik.imagekit.io/bdic/benue-government-properties/Images/girl.png?updatedAt=1745935810769"
                  alt="User"
                />
              </div>
              <p className="text-sm text-green-100">
                Join <span className="font-bold">10,000+</span> users already listing and discovering
              </p>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/100 to-transparent z-10"></div>

            {images.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === animationIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img src={img || ""} alt="Featured listing" className="w-full h-full object-cover" />
              </div>
            ))}

            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-primary rounded-full text-xs font-medium">Featured</span>
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                  Service
                </span>
              </div>
              <h3 className="text-xl font-bold">Fashion Designer </h3>
              <p className="text-green-100 flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Gboko Benue, NG
              </p>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 z-20">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              <span className="w-3 h-3 rounded-full bg-white/50"></span>
              <span className="w-3 h-3 rounded-full bg-white/50"></span>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-3xl font-bold">2,500+</p>
            <p className="text-green-200">Properties</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-3xl font-bold">1,800+</p>
            <p className="text-green-200">Businesses</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-3xl font-bold">5,000+</p>
            <p className="text-green-200">Products</p>
          </div>
          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
            <p className="text-3xl font-bold">3,200+</p>
            <p className="text-green-200">Services</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-900 to-transparent"></div>
    </div>
  )
}
