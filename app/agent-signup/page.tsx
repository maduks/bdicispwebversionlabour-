"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { toast, Toaster } from "sonner"
import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { User, Mail, Phone, Building2, KeyRound } from "lucide-react"
import Image from "next/image"
import { NIGERIA_STATES } from "@/lib/nigeria-states";
import { useApi } from "@/context/ApiContext";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  ministry: z.string().min(1, "Please select a ministry"),
  phone: z.string().min(11, "Phone number must be 11 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function AgentSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const api = useApi();
  const [ministries, setMinistries] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Fetch ministries on mount
  useEffect(() => {
    api.getMinistries().then(setMinistries).catch(() => setMinistries([]));
  }, []);

  // LGA and Ward options
  const lgaOptions = selectedState ? (NIGERIA_STATES.find((s: any) => s.name === selectedState)?.lgas || []) : [];
  const wardOptions = selectedLGA ? (lgaOptions.find((l: any) => l.name === selectedLGA)?.wards || []) : [];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      ministry: "",
      phone: "",
      password: "",
      // Remove state, lga, ward from here
    },
  })

  const handleSubmit = async (values: any) => {
    setLoading(true)
    // Build agentPayload as specified
    const agentPayload = {
      agentData: {
        ministry: values.ministry, // this is now the _id
        assignedLga: selectedLGA,
        assignedwards: selectedWard,
        isActive: false,
        state: selectedState,
      },
      userData: {
        fullName: values.name,
        email: values.email,
        phoneNumber: values.phone,
        role: "agent",
        isverified: true,
        password: values.password, // fallback if not present
        ministry: values.ministry, // this is now the _id
        status: "active",
        isKYCVerified: false,
        lastLogin: null,
        state: selectedState,
      }
    };
    try {
      await api.createAgent(agentPayload);
      toast.success("Application submitted successfully!")
      router.push("/agent-signup/success")
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col lg:flex-row bg-gray-50">
      {/* Left side - Form */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-screen">
        <Image
          src="https://ik.imagekit.io/bdic/service-hub-property-registration-images/106219.jpg?updatedAt=1753229432492"
          alt="Signup background"
          fill
          className="object-cover rounded-l-2xl"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-l-2xl">
          <div className="text-white text-center p-8">
            <h2 className="text-3xl font-bold mb-4">Become an Agent</h2>
            <p className="text-lg">
            Join the Benue State Certification Network as a registered agent and earn income by helping others get certified.


            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 bg-white rounded-none shadow-xl">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-6">
            <h5 className="text-2xl sm:text-3xl font-bold text-gray-600">
              Agent Application
            </h5>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-green-600 hover:text-green-500 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 sm:space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <Input
                          placeholder="John Doe"
                          className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ministry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Ministry</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <select
                          className="pl-10 w-full rounded-md border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base py-2"
                          {...field}
                        >
                          <option value="">Select a ministry</option>
                          {ministries.map((ministry: any) => (
                            <option key={ministry._id} value={ministry._id}>{ministry.name}</option>
                          ))}
                        </select>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <Input
                          type="tel"
                          placeholder="08012345678"
                          className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <Input
                          type="password"
                          placeholder="Enter password"
                          className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-gray-700 font-medium">State</label>
                <select className="w-full rounded-md border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base py-2" value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedLGA(""); setSelectedWard(""); }} required>
                  <option value="">Select State</option>
                  {NIGERIA_STATES.map((state: any) => <option key={state.name} value={state.name}>{state.name}</option>)}
                </select>
                <label className="text-gray-700 font-medium">LGA</label>
                <select className="w-full rounded-md border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base py-2" value={selectedLGA} onChange={e => { setSelectedLGA(e.target.value); setSelectedWard(""); }} required disabled={!selectedState}>
                  <option value="">Select LGA</option>
                  {lgaOptions.map((lga: any) => <option key={lga.name} value={lga.name}>{lga.name}</option>)}
                </select>
                <label className="text-gray-700 font-medium">Ward</label>
                <select className="w-full rounded-md border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base py-2" value={selectedWard} onChange={e => setSelectedWard(e.target.value)} required disabled={!selectedLGA}>
                  <option value="">Select Ward</option>
                  {wardOptions.map((ward: any) => {
                    const wardName = typeof ward === "string" ? ward : ward.name;
                    return <option key={wardName} value={wardName}>{wardName}</option>;
                  })}
                </select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </Button>

              <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                By submitting this application, you agree to our{" "}
                <Link
                  href="/terms"
                  className="text-green-600 hover:text-green-500"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-green-600 hover:text-green-500"
                >
                  Privacy Policy
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
} 