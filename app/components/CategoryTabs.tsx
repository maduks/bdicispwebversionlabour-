"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, Home, Briefcase, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const categories = [
  {
    id: "properties",
    name: "Properties",
    icon: <Home className="h-5 w-5" />,
    description: "Find your dream home, apartment, or commercial space",
  },
  {
    id: "businesses",
    name: "Businesses",
    icon: <Building2 className="h-5 w-5" />,
    description: "Discover local businesses, restaurants, and retail shops",
  },
  {
    id: "services",
    name: "Services",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Connect with professional service providers in your area",
  },
  {
    id: "products",
    name: "Products",
    icon: <ShoppingBag className="h-5 w-5" />,
    description: "Shop for quality products from verified sellers",
  },
]

export default function CategoryTabs() {
  const [activeTab, setActiveTab] = useState("properties")

  return (
    <section className="py-20 relative overflow-hidden" id="categories">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Browse by <span className="text-gradient-primary">Category</span></h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our extensive collection of listings across different categories
          </p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-all",
                activeTab === category.id
                  ? "gradient-primary text-white shadow-lg"
                  : "bg-background text-foreground hover:bg-primary/10 border border-border",
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.icon}
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Category content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-background rounded-2xl shadow-lg p-8 border border-border/50"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                {categories.find((c) => c.id === activeTab)?.icon}
                <span className="font-medium">{categories.find((c) => c.id === activeTab)?.name}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                {activeTab === "properties" && "Find Your Perfect Property"}
                {activeTab === "businesses" && "Discover Local Businesses"}
                {activeTab === "services" && "Connect with Service Providers"}
                {activeTab === "products" && "Shop Quality Products"}
              </h3>
              <p className="text-muted-foreground mb-6">{categories.find((c) => c.id === activeTab)?.description}</p>
              <ul className="space-y-3 mb-8">
                {activeTab === "properties" && (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Residential and commercial properties</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Rentals and properties for sale</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Detailed filters for your specific needs</span>
                    </li>
                  </>
                )}
                {activeTab === "businesses" && (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Local shops and restaurants</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Verified reviews and ratings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Business hours and contact information</span>
                    </li>
                  </>
                )}
                {activeTab === "services" && (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Professional service providers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Detailed portfolios and credentials</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Booking and appointment scheduling</span>
                    </li>
                  </>
                )}
                {activeTab === "products" && (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Quality products from verified sellers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Secure payment and delivery options</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>Customer reviews and product ratings</span>
                    </li>
                  </>
                )}
              </ul>
              <Link href={`/listings?category=${activeTab}`}>
                <button className="px-6 py-3 rounded-md gradient-primary text-white font-medium hover:opacity-90 transition-colors">
                  Explore {categories.find((c) => c.id === activeTab)?.name}
                </button>
              </Link>
            </div>
            <div className="relative h-[300px] rounded-xl overflow-hidden">
              <img
                src={`/assets/images/categories/${activeTab}.jpg`}
                alt={categories.find((c) => c.id === activeTab)?.name}
                className="h-full w-full object-cover"
              />


              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium">
                {activeTab === "properties" && "10,000+ listings"}
                {activeTab === "businesses" && "5,000+ listings"}
                {activeTab === "services" && "8,000+ listings"}
                {activeTab === "products" && "12,000+ listings"}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
