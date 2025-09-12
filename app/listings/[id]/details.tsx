"use client"

import { useState } from "react"
import {
  Home,
  Tag,
  Bed,
  Bath,
  Check,
  CookingPotIcon as Kitchen,
  SquareIcon as SquareFootage,
  Building,
  Car,
  Sofa,
  PenToolIcon as Tool,
  Wallet,
  PawPrint,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Details(listing:any) {
  const [activeTab, setActiveTab] = useState("details")

  return (
    <div className="">
      <div className="overflow-hidden border-none  ">
       
        <Tabs defaultValue="details" className="w-full" onValueChange={setActiveTab}>
          <div className="px-6 border-b">
            <TabsList className="w-full justify-start h-14 bg-transparent gap-4">
              <TabsTrigger
                value="details"
                className={`${activeTab === "details" ? "border-b-2 border-emerald-500 rounded-none" : ""} data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2`}
              >
                Property Details
              </TabsTrigger>
              <TabsTrigger
                value="amenities"
                className={`${activeTab === "amenities" ? "border-b-2 border-emerald-500 rounded-none" : ""} data-[state=active]:bg-transparent data-[state=active]:shadow-none px-2`}
              >
                Amenities
              </TabsTrigger>
             
            </TabsList>
          </div>

          <CardContent className="p-5">
            <TabsContent value="details" className="mt-0 p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold ">Basic Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <PropertyFeature
                      icon={<Home className="h-5 w-5 text-emerald-600" />}
                      label="Property Type"
                      value={listing?.listing?.details?.propertyType}
                    />
                    <PropertyFeature
                      icon={<Tag className="h-5 w-5 text-emerald-600" />}
                      label="Listing Type"
                      value={listing?.listing?.details?.listingType}
                    />
                    <PropertyFeature icon={<Bed className="h-5 w-5 text-emerald-600" />} label="Bedrooms" value=
                    {listing?.listing?.details?.bedrooms}/>
                    <PropertyFeature icon={<Bath className="h-5 w-5 text-emerald-600" />} label="Bathrooms" value={listing?.listing?.details?.bathrooms} />
                    <PropertyFeature icon={<Bath className="h-5 w-5 text-emerald-600" />} label="Toilets" value={listing?.listing?.details?.toilets} />
                    <PropertyFeature
                      icon={<Kitchen className="h-5 w-5 text-emerald-600" />}
                      label="Kitchens"
                      value={listing?.listing?.details?.kitchens}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold ">Additional Details</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <PropertyFeature
                      icon={<SquareFootage className="h-5 w-5 text-emerald-600" />}
                      label="Area"
                      value={listing?.listing?.details?.area}
                    />
                    <PropertyFeature
                      icon={<Building className="h-5 w-5 text-emerald-600" />}
                      label="Floors"
                      value={listing?.listing?.details?.floors}
                    />
                    <PropertyFeature
                      icon={<Car className="h-5 w-5 text-emerald-600" />}
                      label="Parking Spaces"
                      value={listing?.listing?.details?.parking}
                    />
                    <PropertyFeature
                      icon={<Sofa className="h-5 w-5 text-emerald-600" />}
                      label="Furnishing"
                      value={listing?.listing?.details?.furnishing}
                    />
                    <PropertyFeature
                      icon={<Tool className="h-5 w-5 text-emerald-600" />}
                      label="Condition"
                      value={listing?.listing?.details?.condition}
                    />
                    <PropertyFeature
                      icon={<PawPrint className="h-5 w-5 text-emerald-600" />}
                      label="Pets Allowed"
                      value="Yes"
                      highlight
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium">Maintenance Fee:</span>
                  </div>
                  <span className="text-lg font-semibold">{listing?.listing?.details?.maintenanceFee}</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="amenities" className="mt-0 p-0">
              <div className="text-center py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {listing?.listing.details?.amenities &&
                    listing?.listing.details?.amenities.map((amenity:any, index:any) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary mr-2" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  {listing?.listing.details?.features &&
                    listing?.listing.details?.features.map((feature:any, index:any) => (
                      <div key={index} className="flex items-center gap-2">
                        {/* <div className="h-2 w-2 rounded-full bg-primary" /> */}
                        <Check className="w-5 h-5 text-primary mr-2" />

                        <span>{feature}</span>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="mt-0 p-0">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Location information would be displayed here.</p>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </div>
    </div>
  )
}

function PropertyFeature({
    icon,
    label,
    value,
    highlight = false,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
  }){
  return (
    <div className="flex flex-col mb-3 gap-1">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <p className={` ${highlight ? "text-emerald-400 text-sm" : "text-sm"}`}>{value}</p>
    </div>
  )
}
