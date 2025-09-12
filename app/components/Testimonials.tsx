"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "Benue state integrated property service has helped me find my dream apartment in just a few days. The filtering options made it easy to narrow down exactly what I was looking for.",
    author: "Sarah Johnson",
    position: "Property Renter",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
  },
  {
    quote:
      "As a business owner, I've seen a significant increase in customers since listing my shop on this platform. The exposure has been incredible!",
    author: "Michael Chen",
    position: "Business Owner",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
  },
  {
    quote:
      "I found a reliable plumber through Benue state integrated property service when I had an emergency. The verified reviews helped me choose someone trustworthy and skilled.",
    author: "Emily Rodriguez",
    position: "Homeowner",
    image: "/placeholder.svg?height=100&width=100",
    rating: 4,
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 relative overflow-hidden" id="testimonials">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">What Our Users Say</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from people who have found success using our platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              className="bg-background p-6 rounded-xl shadow-lg border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonial.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-foreground mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center ">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
                <div className="ml-3">
                  <p className="font-bold text-foreground">{testimonial.author}</p>
                  <p className="text-muted-foreground text-sm">{testimonial.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
