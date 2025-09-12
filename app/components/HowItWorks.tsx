"use client"

import { motion } from "framer-motion"
import { Search, ListFilter, MapPin, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: <Search className="h-8 w-8" />,
    title: "Search",
    description: "Browse through thousands of listings across different categories",
    color: "from-violet-500 to-indigo-500",
  },
  {
    icon: <ListFilter className="h-8 w-8" />,
    title: "Filter",
    description: "Narrow down your options with our advanced filtering system",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "Locate",
    description: "Find listings in your preferred location with our interactive map",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <CheckCircle className="h-8 w-8" />,
    title: "Connect",
    description: "Contact property owners, business managers, or service providers directly",
    color: "from-cyan-500 to-teal-500",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20 relative overflow-hidden" id="how-it-works">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Finding your perfect listing is simple and straightforward with our platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="bg-background rounded-xl shadow-lg p-6 border border-border/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${step.color} text-white mb-6`}
              >
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to find your perfect match? Start exploring our listings today!
          </p>
          <button className="px-8 py-3 rounded-md bg-gradient-to-r from-green-600 to-green-800 text-white font-medium hover:from-green-700 hover:to-green-700 transition-colors">
            Get Started
          </button>
        </motion.div>
      </div>
    </section>
  )
}
