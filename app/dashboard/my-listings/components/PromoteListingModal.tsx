"use client";

import { useState, useEffect } from "react";
import { useCredoPayment } from "react-credo";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";
import { cn } from "@/lib/utils";
import { Toaster,toast } from "sonner";
import { useSearchParams } from "next/navigation";

interface PromoteListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: any; // Can be Product, Business, Property, or Service
  listingType: "products" | "businesses" | "properties" | "services";
  onSuccessfulPromotion: () => void;
}

// Define pricing tiers for different promotion durations
const pricingTiers: { [key: string]: number } = {
  "7 days": 5000, // Price in Naira (example)
  "30 days": 15000,
  "90 days": 40000,
  "180 days": 75000,
};

export function PromoteListingModal({ isOpen, onClose, listing, listingType, onSuccessfulPromotion }: PromoteListingModalProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();

  const getAmount = () => {
    if (!selectedPeriod) return 0;
    return pricingTiers[selectedPeriod] * 100; // Convert Naira to kobo
  };

  const generateRandomAlphanumeric = (length: number) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  };

  const transRef = generateRandomAlphanumeric(20); // Generate a unique transaction reference
  const encodedListingType = encodeURIComponent(listingType);
  const encodedSelectedPeriod = encodeURIComponent(selectedPeriod?.toString().replace(/\s/g,'') || '');
  const encodedListingId = encodeURIComponent(listing._id); // Good practice
  const encodedTransRef = encodeURIComponent(transRef); // Good practice
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ministryoflabourbackend.vercel.app/api/v1";
  const encodedUrl= `https://servicehub.benuestate.gov.ng/dashboard/my-listings?promotion=true&listingId=${encodedListingId}&listingType=${encodedListingType}&period=${encodedSelectedPeriod}&transRef=${encodedTransRef}`;

  const config = {
    key: "0PUB1347IvOpGudi0qVM7ugiH46HcYbp", // Replace with your actual public key or environment variable
    customerFirstName: "User", // Replace with actual user data
    email: "user@example.com", // Replace with actual user data
    amount: getAmount(),
    currency: "NGN",
    bearer: 0,
    reference: transRef,
    customerPhoneNumber: "", // Replace with actual user data
    callbackUrl:encodedUrl ,
    onClose: () => {
      console.log("Credo Widget Closed");
      setIsLoading(false);
    },
    callBack: (response: any) => {
       console.log("Successful Payment Response: ", response);
       // The actual listing update will happen in the useEffect in ListingManagement.tsx
       // Redirect to the callback URL
       window.location.href = response.callbackUrl;
    },
  };

  const credoPayment = useCredoPayment(config);

  const handleProceedToPayment = () => {
    if (!selectedPeriod || !listing) {
      toast.error("Please select a promotion period.");
      return;
    }
    setIsLoading(true);
    credoPayment();
  };
  const calculateFeaturedUntil=(tier:any)=> {
    // Get the current date and time
    const now = new Date();
  
    // Parse the tier string to get the number of days
    const parts = tier?.toLowerCase().split(' ');
    if (parts?.length !== 2 || parts[1] !== 'days') {
      console.warn(`Invalid pricing tier format: "${tier}". Expected "X days".`);
      return null; // Or throw an error, depending on desired strictness
    }
  
    const days = parseInt(parts[0], 10);
  
    if (isNaN(days) || days <= 0) {
      console.warn(`Invalid number of days in tier: "${tier}".`);
      return null;
    }
  
    // Calculate the featured_until date
    // We use setDate() to add days to the current date
    const featuredUntil = new Date(now); // Create a new Date object to avoid modifying 'now'
    featuredUntil.setDate(now.getDate() + days);
  
    return featuredUntil;
  }
  // Reset state when dialog opens/closes or listing changes
  useEffect(() => {
    if (isOpen) {
      setSelectedPeriod(null);
      setIsLoading(false);
    }
  }, [isOpen, listing]);


 

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Promote Listing: {listing?.prodName || listing?.legalname || listing?.title || listing?.serviceName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Promotion Period</Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(pricingTiers).map((period) => (
                <div
                  key={period}
                  className={cn(
                    "cursor-pointer rounded-md border p-4 text-center",
                    selectedPeriod === period
                      ? "border-primary bg-primary/10"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => setSelectedPeriod(period)}
                >
                  <div className="font-semibold">{period}</div>
                  <div className="text-sm text-muted-foreground">₦{pricingTiers[period]?.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
          {selectedPeriod && (
            <div className="text-lg font-semibold text-center">
              Selected Package Price: ₦{pricingTiers[selectedPeriod]?.toLocaleString()}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleProceedToPayment} disabled={!selectedPeriod || isLoading}>
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 