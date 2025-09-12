"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  EyeIcon,
  EyeOffIcon,
  User,
  Mail,
  Phone,
  Lock,
  Briefcase,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const formSchema = z
  .object({
    fullName: z.string().min(2, "First name must be at least 2 characters"),
    phoneNumber: z.string().min(11, "Phone number must be 11 digits"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["user", "seeker"], {
      required_error: "Please select your role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function SignupForm({ onSubmit, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "seeker", // Default to seeker
    },
  });

  const handleSubmit = async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row bg-gray-50">
      {/* Left side - Form */}

      <div className="hidden lg:block lg:w-1/2 relative min-h-screen">
        <Image
          src="https://ik.imagekit.io/bdic/benue-government-properties/Images/2148445502.jpg?updatedAt=1746620347113"
          alt="Signup background"
          fill
          className="object-cover rounded-l-2xl"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-l-2xl">
          <div className="text-white text-center p-8">
            <h2 className="text-3xl font-bold mb-4">Welcome to BDICP</h2>
            <p className="text-lg">
              Join our community and start your journey today
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image (hidden on mobile) */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 bg-white rounded-none shadow-xl">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-6">
            <h5 className="text-2xl sm:text-3xl font-bold text-gray-600">
              Create Account
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
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-2 sm:space-y-3"
            >
              <FormField
                control={form.control}
                name="fullName"
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
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Phone Number
                    </FormLabel>
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">I want to</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            field.value === "seeker"
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 bg-gray-50 hover:border-gray-300"
                          }`}
                          onClick={() => field.onChange("seeker")}
                        >
                          <div className="flex items-center space-x-3">
                            <Search className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                Find Artisans
                              </div>
                              <div className="text-sm text-gray-600">
                                Search & review services
                              </div>
                            </div>
                          </div>
                          {field.value === "seeker" && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>

                        <div
                          className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            field.value === "user"
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 bg-gray-50 hover:border-gray-300"
                          }`}
                          onClick={() => field.onChange("user")}
                        >
                          <div className="flex items-center space-x-3">
                            <Briefcase className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium text-gray-900">
                                Offer Services
                              </div>
                              <div className="text-sm text-gray-600">
                                Register as artisan
                              </div>
                            </div>
                          </div>
                          {field.value === "user" && (
                            <div className="absolute top-2 right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
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
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon size={16} className="sm:size-[18px]" />
                          ) : (
                            <EyeIcon size={16} className="sm:size-[18px]" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="********"
                          className="pl-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500 text-sm sm:text-base"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon size={16} className="sm:size-[18px]" />
                          ) : (
                            <EyeIcon size={16} className="sm:size-[18px]" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs sm:text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 sm:py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                {loading ? "Registering...." : "Create Account"}
              </Button>

              <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                By signing up, you agree to our{" "}
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
  );
}

export default SignupForm;
