"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { X } from "lucide-react"

interface FullScreenMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function FullScreenMenu({ isOpen, onClose }: FullScreenMenuProps) {
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "All Listings", href: "/listings" },
    { name: "Properties", href: "/listings?category=properties" },
    { name: "Businesses", href: "/listings?category=businesses" },
    { name: "Services", href: "/listings?category=services" },
    { name: "Products", href: "/listings?category=products" },
    { name: "Contact", href: "#contact" },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-background z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="absolute top-6 right-6 text-foreground p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
          <nav className="text-center">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="block text-3xl font-bold text-foreground mb-6 hover:text-primary transition-colors"
                  onClick={onClose}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: menuItems.length * 0.1 }}
              className="mt-8"
            >
              <button className="px-8 py-3 rounded-full gradient-primary text-white font-medium hover:opacity-90 transition-colors">
                Add Listing
              </button>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
