"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { Eye, XCircle, Rocket, Info } from "lucide-react"; // Added Rocket and Info icons
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "sonner";

// Define interfaces for different listing types to handle mixed data
interface PromotedListing {
  _id: string;
  ownerId: string;
  featured: boolean;
  featured_until?: string; // Standardized on featured_until
  promotionReference?: string;
  createdAt: string;
  
  // Common fields that exist across ALL listing types or are optional
  title?: string;      // Used for properties, or a generic listing title
  prodName?: string;   // Products
  legalname?: string;  // Businesses
  serviceName?: string; // Services
  imageUrl?: string; // Added for card thumbnail
  
  // Catch-all for any other specific fields that might come from the API
  [key: string]: any; 
}

export default function MyPromotionsPage() {
    const router = useRouter()
  const [promotions, setPromotions] = useState<PromotedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<PromotedListing | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://ministryoflabourbackend.vercel.app/api/v1";

  const fetchPromotions = async () => {
    if (!currentUser?.data?._id) {
      setLoading(false); 
      return;
    }
    try {
      setLoading(true);
   


      const response = await axios.get(`https://ministryoflabourbackend.vercel.app/api/v1/listings/all`, {
        params: {
           featured:"true",
          ownerId: currentUser?.data?._id
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log("API Response Data for Promotions:", response.data.data);

      const allListings = [
        ...(response.data.data.services || []),
        ...(response.data.data.properties || []),
        ...(response.data.data.businesses || []),
        ...(response.data.data.products || []),
      ];

      const activePromotions = allListings.filter((item: PromotedListing) => 
        item.featured && item.featured_until && new Date(item.featured_until) > new Date()
      );
      setPromotions(activePromotions);
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your promotions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, [currentUser]); 

  const handleCancelClick = (promotion: PromotedListing) => {
    setSelectedPromotion(promotion);
    setIsCancelDialogOpen(true);
  };

  const handleViewClick = (promotion: PromotedListing) => {
    setSelectedPromotion(promotion);
    setIsViewDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedPromotion) return;
    try {
      let listingType: string | null = null;
      if (selectedPromotion.prodName) {
        listingType = 'products';
      } else if (selectedPromotion.legalname) {
        listingType = 'businesses';
      } else if (selectedPromotion.title) {
        listingType = 'properties';
      } else if (selectedPromotion.serviceName) {
        listingType = 'services';
      }

      if (!listingType) {
         toast({
          title: "Error",
          description: "Could not determine listing type for cancellation.",
          variant: "destructive",
        });
        return;
      }

      await axios.put(`${API_BASE_URL}/listings/${selectedPromotion._id}?type=${listingType}`, {
        featured: false,
        featured_until: null, 
      }, {
         headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast({
        title: "Promotion Cancelled",
        description: "The promotion has been cancelled. No refund will be issued.",
      });
      setIsCancelDialogOpen(false);
      fetchPromotions(); 
    } catch (error) {
      console.error("Failed to cancel promotion:", error);
      toast({
        title: "Error",
        description: "Failed to cancel the promotion.",
        variant: "destructive",
      });
    }
  };

  const getListingName = (listing: PromotedListing | null) => {
    if (!listing) return "N/A";
    return listing.prodName || listing.legalname || listing.title || listing.serviceName || "Untitled Listing";
  };

   const getListingType = (listing: PromotedListing | null) => {
    if (!listing) return "N/A";
    if (listing.prodName) return 'Product';
    if (listing.legalname) return 'Business';
    if (listing.title && !listing.serviceName && !listing.prodName && !listing.legalname) return 'Property';
    if (listing.serviceName) return 'Service';
    return "Unknown Type";
  };

  const calculatePromotionDuration = (startDate: string | undefined, endDate: string | undefined) => {
    if (!startDate || !endDate) return 'N/A';
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return `${diffDays} days`;
    } catch (e) {
      console.error("Error calculating promotion duration:", e);
      return 'N/A';
    }
  };

  const calculateRemainingPercentage = (createdAt: string, featuredUntil: string): number => {
    const start = new Date(createdAt).getTime();
    const end = new Date(featuredUntil).getTime();
    const now = new Date().getTime();

    if (now >= end) return 0; // Expired
    if (now <= start) return 100; // Not started or just started (e.g., if created and featured at same time)

    const totalDuration = end - start;
    const elapsedDuration = now - start;
    const percentage = (1 - (elapsedDuration / totalDuration)) * 100;
    return Math.max(0, Math.min(100, percentage)); // Ensure it's between 0 and 100
  }


  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-900 to-green-400 text-white p-8 rounded-lg shadow-lg mb-8 overflow-hidden">
        {/* Subtle pattern background */}
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-10" 
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '20px' }}
        ></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold mb-2 flex items-center">
              My Promotions <Rocket className="ml-3 h-9 w-9" />
            </h1>
            <p className="text-lg opacity-90">Manage your active and expired featured listings.</p>
          </div>
          {/* You'd replace # with your actual "start new promotion" page/modal link */}
          <Button 
            className="mt-6 sm:mt-0 bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 text-lg font-semibold shadow-lg transition-all duration-200 ease-in-out hover:scale-105"
            onClick={()=>router.push("/dashboard/my-listings")}
          >
            Start New Promotion
            <span className="ml-2 text-xl">🚀</span>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-600 p-10 flex flex-col items-center justify-center">
          <svg className="animate-spin h-12 w-12 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl font-semibold">Loading promotions...</p>
          <p className="text-gray-500">Fetching your featured listings.</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="text-center text-gray-600 p-12 border border-dashed rounded-md bg-white shadow-sm flex flex-col items-center justify-center">
          <svg className="h-24 w-24 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-2xl font-bold text-gray-700 mb-3">No Active Promotions Found!</p>
          <p className="mb-6 text-lg">It looks like you haven't promoted any listings yet. Start now to get more visibility for your products, services, properties, or businesses!</p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold shadow-md transition-all duration-200 hover:scale-105"
            onClick={() => toast({ title: "Action Needed", description: "Link to 'Promote New Listing' page goes here!" })}
          >
            Promote Your First Listing 🎉
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {promotions.map((promotion) => {
            const featuredUntilDate = promotion.featured_until ? new Date(promotion.featured_until) : null;
            const isExpiringSoon = featuredUntilDate && (featuredUntilDate.getTime() - new Date().getTime() < (7 * 24 * 60 * 60 * 1000)); // Less than 7 days
            const percentageRemaining = promotion.createdAt && promotion.featured_until ? calculateRemainingPercentage(promotion.promotionDate, promotion.featured_until) : 0;

            return (
              <Card key={promotion._id} className="relative shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out bg-white overflow-hidden">
                {/* Promotion Status Badge */}
                {isExpiringSoon ? (
                  <Badge className="absolute top-3 right-3 bg-yellow-500 text-white font-bold px-3 py-1 rounded-full animate-pulse text-xs">Expiring Soon!</Badge>
                ) : promotion.featured ? (
                  <Badge className="absolute top-3 right-3 bg-green-500 text-white font-bold px-3 py-1 rounded-full text-xs">Active</Badge>
                ) : null}

                {/* Listing Image Thumbnail */}
                <div className="w-full h-40 bg-gray-100 overflow-hidden flex items-center justify-center">
                  {promotion.imageUrl ? (
                    <img src={promotion.imageUrl} alt={getListingName(promotion)} className="w-full h-full object-cover"/>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                       <Rocket className="h-12 w-12 mb-2"/>
                       <span className="text-sm">No Image</span>
                    </div>
                  )}
                 </div>

                <CardContent className="p-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between space-x-2">
                    <h3 className="text-base font-semibold text-gray-800 truncate">{getListingName(promotion)}</h3>
                    <Badge variant="secondary" className="capitalize shrink-0 text-xs">{getListingType(promotion)}</Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-gray-600">Expiry Date:</Label>
                    <p className="text-sm text-gray-800">
                      {featuredUntilDate
                        ? format(featuredUntilDate, 'PPP')
                        : 'N/A'}
                    </p>
                  </div>

                  {/* Progress Bar for Duration */}
                  {promotion.createdAt && promotion.featured_until && percentageRemaining > 0 && (
                    <div className="mt-2 space-y-1">
                      <Label className="text-xs font-medium text-gray-600">Duration Remaining:</Label>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentageRemaining}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {percentageRemaining.toFixed(1)}% ({calculatePromotionDuration(promotion.createdAt, promotion.featured_until)} total)
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <Button variant="outline" size="sm" onClick={() => handleViewClick(promotion)} className="flex items-center text-xs px-3 py-1">
                      <Eye className="mr-1 h-3 w-3" /> View
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleCancelClick(promotion)} className="flex items-center text-xs px-3 py-1">
                      <XCircle className="mr-1 h-3 w-3" /> Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Cancel Promotion Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent style={{ padding: 20, textAlign: 'center' }} className="rounded-lg shadow-xl">
          <DialogHeader className="flex flex-col items-center text-center pb-4 border-b border-gray-200">
            <XCircle className="h-16 w-16 text-red-500 mb-4 animate-bounce-in" />
            <DialogTitle className="text-2xl font-bold text-gray-700">Confirm Cancellation</DialogTitle>
            <DialogDescription className="text-center pt-3 text-base text-gray-700 leading-relaxed">
              You are about to cancel the promotion for "<span className="font-bold text-base text-blue-700">{getListingName(selectedPromotion)}</span>".
              <br /><br />
              <span className="font-extrabold text-red-600 text-base">This action is permanent and no refund will be issued.</span>
              <br />
              Are you absolutely sure you wish to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-col sm:flex-row-reverse sm:justify-center gap-3">
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              className="px-6 py-2 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              Yes, Cancel Promotion
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
              className="px-6 py-2 text-base font-semibold border-gray-300 hover:bg-gray-100 transition-all duration-200"
            >
              Keep Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Promotion Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-6 rounded-lg shadow-xl">
          <DialogHeader className="flex flex-row items-center space-x-4 pb-4 border-b border-gray-200">
            <Info className="h-7 w-7 text-blue-600" />
            <DialogTitle className="text-2xl font-bold text-gray-800">Promotion Details</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[450px] pr-4 py-4">
            {selectedPromotion && (
              <div className="space-y-6">
                {/* Promotion Info Card */}
                <Card className="shadow-sm bg-blue-50 border border-blue-100">
                  <CardContent className="pt-6 space-y-4 text-sm">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Listing Name:</Label>
                      <p className="text-base font-semibold text-gray-900">{getListingName(selectedPromotion)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Listing Type:</Label>
                      <p className="text-base text-gray-900">{getListingType(selectedPromotion)}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Reference:</Label>
                      <p className="text-base text-gray-900 break-all">{selectedPromotion.promotionReference || 'N/A'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Promotion Period:</Label>
                      <p className="text-base text-gray-900">
                        {selectedPromotion.createdAt && selectedPromotion.featured_until ? (
                          calculatePromotionDuration(selectedPromotion.createdAt, selectedPromotion.featured_until)
                        ) : 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Promotion Started:</Label>
                      <p className="text-base text-gray-900">
                        {selectedPromotion.createdAt
                          ? format(new Date(selectedPromotion.createdAt), 'PPP p')
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Expiry Date:</Label>
                      <p className="text-base text-gray-900">
                        {selectedPromotion.featured_until
                          ? format(new Date(selectedPromotion.featured_until), 'PPP p')
                          : 'N/A'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Placeholder for Demographics */}
                <Card className="shadow-sm bg-gray-50 border border-gray-100">
                  <CardContent className="pt-6 space-y-4 text-sm">
                    <h4 className="text-xl font-bold text-gray-800">Performance Metrics (Placeholder)</h4>
                    <p className="text-gray-600 text-sm">Real-time data will appear here once integrated.</p>
                    <div className="grid grid-cols-2 gap-4 text-base text-gray-700">
                      <div>Views: <span className="font-semibold text-gray-900">N/A</span></div>
                      <div>Clicks: <span className="font-semibold text-gray-900">N/A</span></div>
                      <div>Impressions: <span className="font-semibold text-gray-900">N/A</span></div>
                      <div>Conversions: <span className="font-semibold text-gray-900">N/A</span></div>
                    </div>
                    {/* You can add a simple chart here using a library like Recharts in the future */}
                  </CardContent>
                </Card>

              </div>
            )}
          </ScrollArea>
          <DialogFooter className="pt-4 border-t mt-4 flex justify-end">
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="px-6 py-2">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster position="bottom-right" />
    </div>
  );
}