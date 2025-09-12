"use client"

import { motion } from "framer-motion"
import { Building, Home, Briefcase, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CallToAction() {
  return (
    <section className="py-20 relative overflow-hidden" id="cta">
      {/* Gradient background */}
      <div className="absolute inset-0 gradient-primary -z-10" />

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10">
          <Home className="h-20 w-20 text-white" />
        </div>
        <div className="absolute bottom-10 left-1/4">
          <Building className="h-16 w-16 text-white" />
        </div>
        <div className="absolute top-1/3 right-1/4">
          <Briefcase className="h-12 w-12 text-white" />
        </div>
        <div className="absolute bottom-1/4 right-10">
          <ShoppingBag className="h-14 w-14 text-white" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-background/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-xl border border-white/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                Ready to List Your Property, Business, Service, or Product?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join thousands of successful listings on our platform and connect with potential customers today.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 rounded-full bg-white text-primary font-medium hover:bg-gray-100 transition-colors">
                  Add Your Listing
                </button>
                <Link href="/listings">
                  <button className="px-6 py-3 rounded-full bg-transparent border border-white text-white font-medium hover:bg-white/10 transition-colors">
                    Browse Listings
                  </button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4">Why List With Us?</h3>
                <ul className="space-y-3 text-white">
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm">1</span>
                    </div>
                    <span>Reach thousands of potential customers daily</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm">2</span>
                    </div>
                    <span>Easy-to-use dashboard to manage your listings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm">3</span>
                    </div>
                    <span>Detailed analytics and performance insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-sm">4</span>
                    </div>
                    <span>Verified reviews to build your reputation</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
