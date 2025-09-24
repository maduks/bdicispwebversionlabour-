"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Star,
  Users,
  Briefcase,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Search,
  Palette,
  Code,
  Megaphone,
  Camera,
  PenTool,
  BarChart3,
  Zap,
  Award,
  DollarSign,
  MessageSquare,
  PlayCircle,
  ChevronDown,
  Sparkles,
  Target,
  Rocket,
  Heart,
  Wrench,
  Hammer,
  // Home,
  Car,
  Thermometer,
  Paintbrush,
  Scissors,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatedSection } from "./components/animated-section"
import { ServiceProviderCarousel } from "./components/service-provider-carousel"
import { useRouter } from "next/navigation"

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const router= useRouter()

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    setIsVisible(true)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const tradeCategories = [
    {
      name: "Plumbing",
      icon: Wrench,
      color: "from-blue-500 to-cyan-500",
      count: "1,200+ pros",
      description: "Pipe repair, installation, water heaters, and emergency services",
    },
    {
      name: "Electrical",
      icon: Zap,
      color: "from-yellow-500 to-amber-500",
      count: "1,500+ pros",
      description: "Wiring, installations, repairs, and electrical system upgrades",
    },
    {
      name: "Carpentry",
      icon: Hammer,
      color: "from-orange-500 to-red-500",
      count: "950+ pros",
      description: "Custom woodwork, framing, cabinetry, and finish carpentry",
    },
    {
      name: "HVAC",
      icon: Thermometer,
      color: "from-emerald-500 to-teal-500",
      count: "800+ pros",
      description: "Heating, cooling, ventilation installation and maintenance",
    },
    {
      name: "Roofing",
      icon: Hammer,
      color: "from-indigo-500 to-purple-500",
      count: "750+ pros",
      description: "Roof installation, repair, inspection, and maintenance",
    },
    {
      name: "Painting",
      icon: Paintbrush,
      color: "from-pink-500 to-rose-500",
      count: "1,100+ pros",
      description: "Interior and exterior painting, staining, and finishing",
    },
    {
      name: "Automotive",
      icon: Car,
      color: "from-slate-500 to-gray-500",
      count: "900+ pros",
      description: "Auto repair, maintenance, diagnostics, and specialized services",
    },
    {
      name: "Landscaping",
      icon: Scissors,
      color: "from-green-500 to-lime-500",
      count: "850+ pros",
      description: "Lawn care, garden design, irrigation, and outdoor spaces",
    },
  ]

  const categories = [
    {
      name: "Design & Creative",
      icon: Palette,
      count: "2,500+ experts",
      color: "from-purple-500 to-pink-500",
      description: "Logo design, branding, UI/UX, illustrations, and creative solutions that make your brand stand out",
      avgRate: "₦65-120/hr",
      topSkills: ["Logo Design", "UI/UX", "Branding", "Illustration"],
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
    },
    {
      name: "Development & Tech",
      icon: Code,
      count: "3,200+ experts",
      color: "from-blue-500 to-cyan-500",
      description: "Full-stack development, mobile apps, AI solutions, and cutting-edge technology implementations",
      avgRate: "₦80-150/hr",
      topSkills: ["React", "Node.js", "Python", "Mobile Apps"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    },
    {
      name: "Digital Marketing",
      icon: Megaphone,
      count: "1,800+ experts",
      color: "from-orange-500 to-red-500",
      description: "SEO, social media marketing, PPC campaigns, and growth strategies that drive real results",
      avgRate: "₦55-100/hr",
      topSkills: ["SEO", "Social Media", "PPC", "Content Marketing"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    },
    {
      name: "Photography & Video",
      icon: Camera,
      count: "1,200+ experts",
      color: "from-green-500 to-teal-500",
      description: "Professional photography, video production, editing, and visual storytelling services",
      avgRate: "₦70-130/hr",
      topSkills: ["Portrait", "Commercial", "Video Editing", "Drone"],
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    },
    {
      name: "Writing & Content",
      icon: PenTool,
      count: "2,100+ experts",
      color: "from-indigo-500 to-purple-500",
      description: "Copywriting, content strategy, technical writing, and compelling narratives for your brand",
      avgRate: "₦45-85/hr",
      topSkills: ["Copywriting", "Blog Posts", "Technical Writing", "SEO Content"],
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
    },
    {
      name: "Business & Analytics",
      icon: BarChart3,
      count: "900+ experts",
      color: "from-yellow-500 to-orange-500",
      description: "Business strategy, data analysis, market research, and insights that drive growth",
      avgRate: "₦75-140/hr",
      topSkills: ["Strategy", "Data Analysis", "Market Research", "Consulting"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    },
  ]

  const topProviders = [
    {
      name: "Sarah Chen",
      specialty: "Senior UI/UX Designer",
      rating: 4.9,
      reviews: 127,
      hourlyRate: "₦85",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      badges: ["Top 1%", "Design Expert"],
      completedProjects: 89,
      responseTime: "< 1 hour",
      skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
      description:
        "Award-winning designer with 8+ years creating intuitive digital experiences for Fortune 500 companies.",
    },
    {
      name: "Marcus Rodriguez",
      specialty: "Full Stack Developer",
      rating: 5.0,
      reviews: 89,
      hourlyRate: "₦95",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      badges: ["Verified Expert", "Top Rated"],
      completedProjects: 156,
      responseTime: "< 30 min",
      skills: ["React", "Node.js", "Python", "AWS"],
      description: "Senior developer specializing in scalable web applications and modern JavaScript frameworks.",
    },
    {
      name: "Emily Watson",
      specialty: "Growth Marketing Strategist",
      rating: 4.8,
      reviews: 156,
      hourlyRate: "₦75",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      badges: ["Marketing Pro", "Growth Hacker"],
      completedProjects: 203,
      responseTime: "< 2 hours",
      skills: ["SEO", "PPC", "Analytics", "Conversion Optimization"],
      description: "Marketing strategist who has helped 50+ startups achieve 300%+ growth in their first year.",
    },
  ]

  const benefits = [
    {
      icon: TrendingUp,
      title: "Accelerate Your Growth",
      description:
        "Join a thriving ecosystem where top professionals earn 40% more than traditional freelancing platforms",
      stats: "Average 40% income increase",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description:
        "Bank-level security with escrow payments, milestone protection, and comprehensive dispute resolution",
      stats: "99.9% payment success rate",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Users,
      title: "Premium Client Network",
      description: "Connect with verified businesses, startups, and enterprises actively seeking top-tier talent",
      stats: "85% client retention rate",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "AI-Powered Matching",
      description: "Our advanced algorithm connects you with projects that perfectly match your skills and preferences",
      stats: "3x faster project matching",
      color: "from-orange-500 to-red-500",
    },
  ]

  const processSteps = [
    {
      step: "01",
      title: "Create Your Professional Profile",
      description:
        "Create your professional profile to gain official recognition in Benue State. Register your property, business, products, or services seamlessly. Get certified and trusted through our integrated registration and verification platform.",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      image: "https://ik.imagekit.io/bdic/reg_.jpg?updatedAt=1750159900216",
    },
    {
      step: "02",
      title: "Complete your KYC",
      description:
        `Complete your KYC to verify your identity and unlock full access to our registration and certification services.
Ensure compliance with Benue State regulations for trusted professional engagement.
It’s fast, secure, and essential for your certification journey.`,
      icon: Target,
      color: "from-purple-500 to-pink-500",
      image: "https://ik.imagekit.io/bdic/kyc.jpg?updatedAt=1750160161525",
    },
    {
      step: "03",
      title: "Make Payment For Trade test certification",
      description:
        `Make your payment to complete the certification process and get officially recognized by Benue State.
Secure your certificate for registered properties, businesses, products, or services.
Enjoy verified status and increased trust across clients and institutions`,
      icon: Rocket,
      color: "from-emerald-500 to-teal-500",
      image: "https://ik.imagekit.io/bdic/payment.jpg?updatedAt=1750160275192",
    },
    {
      step: "04",
      title: "Hurray! You're Now Certified",
      description:
        `You’re now officially certified by Benue State.
Your property, business, product, or service is now recognized and trusted.
Stand out with confidence and enjoy the benefits of verified status!`,
      icon: DollarSign,
      color: "from-orange-500 to-red-500",
      image: "https://ik.imagekit.io/bdic/service-hub-property-registration-images/2147768586.jpg?updatedAt=1753193613333",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Floating Navigation */}
   
      <main className="flex-1">
        {/* Hero Section with Parallax */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 ">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"
              style={{ transform: `translateY(${scrollY * 0.5}px)` }}
            />
            <div
              className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
              style={{ transform: `translateY(${scrollY * -0.3}px)` }}
            />
            <div
              className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse"
              style={{ transform: `translate(-50%, -50%) translateY(${scrollY * 0.2}px)` }}
            />
          </div>

          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid gap-8 lg:gap-12 lg:grid-cols-2 items-center">
              <AnimatedSection animation="fadeUp" className="space-y-6 lg:space-y-8">
                <div className="space-y-4 lg:space-y-6">
                  <Badge className="w-fit bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-4 py-2 text-sm font-medium animate-bounce">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Join 50,000+ Certifications
                  </Badge>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-gray-900 leading-tight">
                  {/* Where Certification Meets Trust — Verified Services, ,  */}
                  Where Trust,
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                      {" "}
                      Meets Certification
                    </span>
                  </h1>
                  <p className="text-md sm:text-md text-black-600 leading-relaxed max-w-2xl">
                  Get officially certified by the Ministry of Labour & Employment.
This certification recognizes your skills, professionalism, and reliability.
With it, you earn credibility and the trust of employers, clients, and organizations seeking verified professionals and service providers.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    Get Certified Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  {/* <Button
                    variant="outline"
                    size="lg"
                    className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold border-2 hover:bg-gray-50 group"
                  >
                    <PlayCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Watch Success Stories
                  </Button> */}
                </div>

                {/* Enhanced Stats */}
                <div className="grid grid-cols-3 gap-4 lg:gap-6 pt-6 lg:pt-8">
                  <AnimatedSection animation="scaleUp" delay={200}>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">1.5M+</div>
                      <div className="text-xs sm:text-sm text-gray-600">Certified professionals</div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1 rounded-full w-4/5"></div>
                      </div>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection animation="scaleUp" delay={400}>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">4.9★</div>
                      <div className="text-xs sm:text-sm text-gray-600">Average rating</div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1 rounded-full w-full"></div>
                      </div>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection animation="scaleUp" delay={600}>
                    <div className="text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">98%</div>
                      <div className="text-xs sm:text-sm text-gray-600">Success rate</div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full w-full"></div>
                      </div>
                    </div>
                  </AnimatedSection>
                </div>
                {/* Animated Floating Stats */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {/* Top left area - only visible on larger screens */}
                

                  {/* Top right area */}
                  <div
                    className="hidden 
                     md:block 
                     absolute 
                     top-40
                 
                    lg:top-44
                     right-[-2px]
                     lg:right-[-0px]
                      
                     bg-white/90 backdrop-blur-sm
                     rounded-2xl p-3 
                     lg:p-4 shadow-lg border
                     border-white/20 animate-float-delayed"
                    style={{ transform: `translateY(${scrollY * -0.05}px)` }}
                  >
                    <div className="text-blue-600 font-bold text-base lg:text-lg">50k+</div>
                    <div className="text-xs text-gray-600">Business premises</div>
                  </div>

                  {/* Bottom left area */}
                  {/* <div
                    className="hidden lg:block absolute bottom-32 xl:bottom-40 left-8 xl:left-20 bg-white/90 backdrop-blur-sm rounded-2xl p-3 lg:p-4 shadow-lg border border-white/20 animate-float"
                    style={{ transform: `translateY(${scrollY * 0.08}px)` }}
                  >
                    <div className="text-purple-600 font-bold text-base lg:text-lg">24/7</div>
                    <div className="text-xs text-gray-600">Available</div>
                  </div> */}

                  {/* Bottom right area */}
                  <div
                    className="hidden md:block absolute bottom-24 lg:bottom-32
                    right-[-20px]
                     right-4 
                     lg:right-12
                      xl:right-10
                      bg-white/90 backdrop-blur-sm rounded-2xl p-3 lg:p-4 shadow-lg border border-white/20 animate-float-delayed"
                    style={{ transform: `translateY(${scrollY * -0.12}px)` }}
                  >
                    <div className="text-orange-600 font-bold text-sm lg:text-base">Certified</div>
                    <div className="text-xs text-gray-600">Top-tier professionals</div>
                  </div>

                  {/* Center right area - positioned to avoid carousel */}
                  {/* <div
                    className="hidden xl:block absolute
                     top-1/2 right-4 
                     transform 
                     -translate-y-1/2
                      bg-white/90
                       backdrop-blur-sm rounded-2xl p-3 lg:p-4 shadow-lg border border-white/20 animate-float"
                    style={{ transform: `translateY(${scrollY * 0.06}px) translateY(-60%)` }}
                  >
                    <div className="text-teal-600 font-bold text-base lg:text-lg">Global</div>
                    <div className="text-xs text-gray-600">top-tier professionals</div>
                  </div> */}

                  {/* Mobile-only stats - positioned at very top and bottom */}
                  <div
                    className="block md:hidden absolute top-8 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-white/20 animate-float"
                    style={{ transform: `translateY(${scrollY * 0.1}px)` }}
                  >
                    <div className="text-emerald-600 font-bold text-sm">+127%</div>
                    <div className="text-xs text-gray-600">Growth</div>
                  </div>

                  <div
                    className="block md:hidden absolute top-8 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-white/20 animate-float-delayed"
                    style={{ transform: `translateY(${scrollY * -0.05}px)` }}
                  >
                    <div className="text-blue-600 font-bold text-sm">50+</div>
                    <div className="text-xs text-gray-600">Cities</div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Service Provider Carousel */}
              <AnimatedSection animation="slideLeft" delay={300} className="relative">
                <div className="text-center mb-6">
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-2">
                    <Award className="w-4 h-4 mr-2" />
                    Featured Professionals
                  </Badge>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Meet Our Top Performers</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                  Certified individuals you can trust for skill, reliability, and professionalism.                  </p>
                </div>
                <ServiceProviderCarousel />
              </AnimatedSection>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-6 w-6 text-gray-400" />
          </div>
        </section>

        {/* Trade Categories Section */}
        <section className="py-12 lg:py-16 bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeUp" className="text-center mb-8 lg:mb-12">
              <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">
                <Wrench className="w-4 h-4 mr-2" />
                Skilled Trades
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Connect with Top Trade Professionals
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                Find licensed and certified experts in these popular trade categories
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {tradeCategories.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <AnimatedSection key={index} animation="fadeUp" delay={index * 100}>
                    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white hover:bg-gray-50 h-full">
                      <CardContent className="p-4 sm:p-6 text-center">
                        <div
                          className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{category.name}</h3>
                        <p className="text-xs sm:text-sm text-emerald-600 font-medium mb-2">{category.count}</p>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{category.description}</p>
                        <Button
                          variant="ghost"
                          className="w-full mt-4 text-sm hover:bg-emerald-50 hover:text-emerald-600 group"
                        >
                          Find {category.name} Pros
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </section>

        {/* Advanced Search Section */}
        <AnimatedSection animation="fadeUp">
          <section className="py-12 lg:py-16 bg-gradient-to-br from-gray-50 to-white relative">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Find Your Certified Perfect Project Match</h2>
                  <p className="text-gray-600">
                    Our large databse of certified providers connects you with vetted & trusted professionals to match your project.
                  </p>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative bg-white p-4 sm:p-6 rounded-2xl shadow-xl border">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="What service are you looking to offer? (e.g., plumbing, electrical, carpentry...)"
                          className="pl-12 pr-4 py-4 sm:py-6 text-base sm:text-lg border-2 border-gray-100 focus:border-emerald-500 rounded-xl"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-xl">
                        Find Provider
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="text-sm text-gray-500">Popular:</span>
                      {["Plumbing", "Electrical", "Carpentry", "HVAC", "Roofing"].map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>

      

        {/* Enhanced Service Providers */}
      

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
          </div>

          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedSection animation="fadeUp" className="text-center mb-12 lg:mb-16">
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                <Rocket className="w-4 h-4 mr-2" />
                Simple Process
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Your Journey to Success in 4 Steps</h2>
              <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto">
                From profile creation to getting paid, we've streamlined every step to help you focus on what you do
                best.
              </p>
            </AnimatedSection>

            <div className="space-y-12 lg:space-y-16">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon
                const isEven = index % 2 === 0

                return (
                  <AnimatedSection key={index} animation={isEven ? "slideRight" : "slideLeft"} delay={index * 200}>
                    <div
                      className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${!isEven ? "lg:flex-row-reverse" : ""}`}
                    >
                      <div className="flex-1 space-y-4 lg:space-y-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg`}
                          >
                            {step.step}
                          </div>
                          <div
                            className={`h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}
                          >
                            <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold">{step.title}</h3>
                        <p className="text-base sm:text-lg text-emerald-100 leading-relaxed">{step.description}</p>
                        <Button onClick={()=>router.push('/signup') } className="bg-white text-emerald-900 hover:bg-emerald-50 border-0 group">
                          Start Now
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                      <div className="flex-1">
                        <div className="relative group">
                          <Image
                            src={step.image || "/placeholder.svg"}
                            width={1000}
                            height={400}
                            alt={step.title}
                            className="rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-103"
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-20 rounded-2xl group-hover:opacity-30 transition-opacity`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        </section>
  {/* Enhanced Categories Section */}
  <section id="categories" className="py-16 lg:py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeUp" className="text-center mb-12 lg:mb-16">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
                <Sparkles className="w-4 h-4 mr-2" />
                Explore Opportunities
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Earn Money As A Registration Officer
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Join the Benue State Certification Network as a registration officer and earn income by helping others get certified.
              </p>
            </AnimatedSection>
            <div className="grid ">
            <Button onClick={()=>router.push('/agent-signup')} className="
            tex-center
            m-auto
            bg-gradient-to-r
            from-emerald-500
            to-teal-500 
            hover:from-emerald-600
            hover:to-teal-600
            px-6 sm:px-8 
            py-4 sm:py-6 
            text-base 
            sm:text-lg 
            font-semibold 
            rounded-xl">
                        Apply Now!
                      </Button>
            </div>
         

            {/* <div className="grid gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <AnimatedSection key={index} animation="fadeUp" delay={index * 100}>
                    <Card className="group hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 bg-white/80 backdrop-blur-sm hover:scale-105 overflow-hidden h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`}></div>
                        <div className="absolute top-4 left-4">
                          <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 right-4 text-white">
                          <div className="text-xl sm:text-2xl font-bold">{category.count.split("+")[0]}+</div>
                          <div className="text-sm opacity-90">experts</div>
                        </div>
                      </div>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-xl sm:text-2xl group-hover:text-emerald-600 transition-colors mb-2">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">Average Rate:</span>
                          <span className="font-bold text-emerald-600">{category.avgRate}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {category.topSkills.map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:text-white transition-all duration-300">
                          Explore {category.name}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                )
              })}
            </div> */}
          </div>
        </section>
        {/* Enhanced Benefits Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
          </div>

          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <AnimatedSection animation="fadeUp" className="text-center mb-12 lg:mb-16">
              <Badge className="mb-4 bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                <Heart className="w-4 h-4 mr-2" />
                Why Choose B-PROCERT
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Built for Professional Excellence</h2>
              <p className="text-lg sm:text-xl text-emerald-100 max-w-3xl mx-auto">
                We've created the ultimate platform for ambitious professionals who demand more from their careers.
              </p>
            </AnimatedSection>

            {/* <div className="grid gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12 lg:mb-16">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon
                return (
                  <AnimatedSection key={index} animation="fadeUp" delay={index * 150}>
                    <div className="group">
                      <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-500 h-full">
                        <CardContent className="p-6 lg:p-8 text-center space-y-4 lg:space-y-6">
                          <div
                            className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${benefit.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold">{benefit.title}</h3>
                          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">{benefit.description}</p>
                          <div className="text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full">
                            {benefit.stats}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div> */}

            {/* Enhanced Stats */}
            <div className="grid gap-6 lg:gap-8 md:grid-cols-3 mb-12 lg:mb-16 text-center">
              {[
                // { value: "$2.5M+", label: "Total Earnings Paid", icon: DollarSign },
                { value: "50,000+", label: "Active Professionals", icon: Users },
                { value: "98%", label: "Client Satisfaction", icon: Heart },
                { value: "24/7", label: "Support Available", icon: MessageSquare },
              ].map((stat, index) => {
                const IconComponent = stat.icon
                return (
                  <AnimatedSection key={index} animation="scaleUp" delay={index * 100}>
                    <div className="group">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                        <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-300 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                        <div className="text-3xl sm:text-4xl font-bold text-emerald-300 mb-2">{stat.value}</div>
                        <div className="text-sm sm:text-base text-emerald-100">{stat.label}</div>
                      </div>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>

            <AnimatedSection animation="fadeUp" delay={400} className="text-center space-y-6 lg:space-y-8">
              <h3 className="text-2xl sm:text-3xl font-bold">Ready to Transform Your Professional Life?</h3>
              <p className="text-lg sm:text-xl text-emerald-100 max-w-2xl mx-auto">
                Join thousands of professionals who've already discovered the power of premium project matching.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                onClick={()=>router.push('/signup')}
                  size="lg"
                  className="bg-white text-emerald-900 hover:bg-emerald-50 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold group"
                >
                  Start Your Success Story
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                onClick={()=>router.push('/search')}
                  size="lg"
                  className="border-white text-green hover:bg-white hover:text-emerald-900 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold"
                >
                  Search Professionals
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Enhanced Testimonials */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fadeUp" className="text-center mb-12 lg:mb-16">
              <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">
                <Star className="w-4 h-4 mr-2" />
                Success Stories
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Real Results from Real Professionals
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how we've transformed careers and businesses across benue state.
              </p>
            </AnimatedSection>

            <div className="grid gap-6 lg:gap-8 md:grid-cols-3">
              {[
                {
                  quote:
                    "Getting certified through this platform gave my business the credibility it needed. Clients now trust me more, and I’ve seen a clear boost in patronage.",
                  author: "Grace Terkwase",
                  role: "Fashion Entrepreneur, Makurdi",
                  company: "JP Creative Studio",
                  rating: 5,
                  image: "https://.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
                  metrics: { income: "+300%", projects: "47", clients: "23" },
                },
                {
                  quote:
                    "The registration process was smooth and transparent. With my certificate, I can confidently showcase my property and services as verified by the state.",
                  author: "David Giwa Stephen",
                  role: "Property Owner, Gboko",
                  company: "Property Elements LTD",
                  rating: 5,
                  image: "https://.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
                  metrics: { income: "+250%", projects: "32", clients: "18" },
                },
                {
                  quote:
                    "This system brought professionalism to the forefront. Being certified helped me stand out and secure partnerships I never thought possible.",
                  author: "Eunice O.",
                  role: "Commodity Trader, Otukpo",
                  company: "Sales/Marketing",
                  rating: 5,
                  image: "https://.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
                  metrics: { income: "+400%", projects: "89", clients: "34" },
                },
              ].map((testimonial, index) => (
                <AnimatedSection key={index} animation="fadeUp" delay={index * 200}>
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 h-full">
                    <CardContent className="p-6 lg:p-8">
                      <div className="flex mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="text-gray-700 mb-6 leading-relaxed text-base sm:text-lg">
                        "{testimonial.quote}"
                      </blockquote>

                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-12 w-12 sm:h-16 sm:w-16 border-2 border-emerald-200">
                          <AvatarImage src={testimonial.image || "/placeholder.svg"} />
                          <AvatarFallback>
                            {testimonial.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold text-gray-900 text-base sm:text-lg">{testimonial.author}</div>
                          <div className="text-emerald-600 font-medium text-sm sm:text-base">{testimonial.role}</div>
                          <div className="text-xs sm:text-sm text-gray-600">{testimonial.company}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <div className="font-bold text-emerald-600">{testimonial.metrics.income}</div>
                          <div className="text-xs text-gray-600">Income Growth</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-gray-900">{testimonial.metrics.projects}</div>
                          <div className="text-xs text-gray-600">Projects</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-gray-900">{testimonial.metrics.clients}</div>
                          <div className="text-xs text-gray-600">Clients</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6 lg:space-y-8">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Ready to Get Started?
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Perfect Pro-Search 
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {" "}
                  Engine
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Where you confirm before you commit — verify service providers, businesses, and more. Join thousands search and enroll
                 for reliable, certified connections.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
                >
                  Find Services Now
                  <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl font-semibold border-2 hover:bg-gray-50 group"
                >
                  <Briefcase className="mr-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" />
                  Register as artisan
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-gray-600 pt-6 lg:pt-8">
                {[
                  { icon: CheckCircle, text: "Free to join" },
                  { icon: Shield, text: "Secure & protected" },
                  { icon: Clock, text: "Quick setup" },
                  { icon: Award, text: "Quality guaranteed" },
                ].map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                      <span>{item.text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      {/* <footer className="bg-gray-900 text-white py-12 lg:py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">B-PROCERT</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Connecting skilled professionals with quality service opportunities across all trades and industries.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Professionals</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Find Projects
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Get Certified
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Find Services
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Safety & Trust
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Trust & Safety
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 lg:mt-12 pt-6 lg:pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2025 B-PROCERT

. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  )
}
