"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCookie } from "cookies-next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Users, Home, Briefcase, ShoppingBag, Building, Package, DollarSign, ArrowUp, ArrowDown, CheckCircle2 } from "lucide-react"
import axios from "axios"
// We will use UserTable and ListingTable in separate pages
// import UserTable from "./components/UserTable"
// import ListingTable from "./components/ListingTable"
import DashboardLayout from "../../components/dashboard/DashboardLayout"

interface User {
  _id: string
  fullName: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  phoneNumber: string
  lastLogin: string
}

interface Listing {
  _id: string
  title: string
  type: "property" | "service" | "product" | "business"
  owner: {
    _id: string
    fullName: string
  }
  status: "pending" | "approved" | "rejected"
  isFeatured: boolean
  createdAt: string
}

interface AdminStats {
  totalListings: number;
  listingsLastMonthChange: number;
  listingBreakdown: { property: number; service: number; product: number; business: number };
  totalUsers: number;
  usersLastMonthChange: number;
  userBreakdown: { buyers: number; sellers: number; agents: number; vendors: number };
  totalRevenue: number;
  revenueLastMonthChange: number;
  revenueBreakdown: { commissions: number; serviceFees: number; adsRevenue: number };
  pendingApprovals: number;
  pendingApprovalsLastMonthChange: number;
  pendingBreakdown: { listings: number; users: number; transactions: number; disputes: number };
}

export default function AdminDashboard() {
  const router = useRouter();
  // We will fetch and display users and listings in separate pages
  // const [users, setUsers] = useState<User[]>([]);
  // const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userCookie = getCookie("user");
    if (!userCookie) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(userCookie as string);
    if (userData?.data?.role !== "superadmin") {
      router.push("/dashboard");
      return;
    }

    // We will fetch users and listings data in their respective pages
    // fetchData();
    fetchStats();
  }, [router]);

  // We will fetch users and listings data in their respective pages
  // const fetchData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const userCookie = getCookie("user");
  //     const userData = JSON.parse(userCookie as string);
  //     const token = userData?.token;

  //   

  //     setUsers(usersResponse.data);
  //     setListings(listingsResponse.data);
  //   } catch (error) {
  //     console.error("Error fetching admin data:", error);
  //     toast.error("Failed to fetch admin data");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const fetchStats = async () => {
    try {
      const userCookie = getCookie("user");
      const userData = JSON.parse(userCookie as string);
      const token = userData?.token;

      const statsResponse = await axios.get<AdminStats>("https://ministryoflabourbackend.vercel.app/api/v1/admin/stats", {
        headers: {
          "x-access-token": token,
        },
      });
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      toast.error("Failed to fetch admin stats");
    }
  };

  if (isLoading || stats === null) { // Added stats === null check so it waits for stats to load
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalListings.toLocaleString()}</div>
              <p className={`text-xs ${stats.listingsLastMonthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.listingsLastMonthChange >= 0 ? <ArrowUp className="inline h-3 w-3 mr-1" /> : <ArrowDown className="inline h-3 w-3 mr-1" />}
                {stats.listingsLastMonthChange}% from last month
              </p>
              <div className="text-xs text-muted-foreground mt-2">
                {stats.listingBreakdown.property.toLocaleString()} Properties • {stats.listingBreakdown.service.toLocaleString()} Services • {stats.listingBreakdown.product.toLocaleString()} Products • {stats.listingBreakdown.business.toLocaleString()} Businesses
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className={`text-xs ${stats.usersLastMonthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                 {stats.usersLastMonthChange >= 0 ? <ArrowUp className="inline h-3 w-3 mr-1" /> : <ArrowDown className="inline h-3 w-3 mr-1" />}
                {stats.usersLastMonthChange}% from last month
              </p>
               <div className="text-xs text-muted-foreground mt-2">
                {stats.userBreakdown.buyers.toLocaleString()} Buyers • {stats.userBreakdown.sellers.toLocaleString()} Sellers • {stats.userBreakdown.agents.toLocaleString()} Agents • {stats.userBreakdown.vendors.toLocaleString()} Vendors
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
              <p className={`text-xs ${stats.revenueLastMonthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                 {stats.revenueLastMonthChange >= 0 ? <ArrowUp className="inline h-3 w-3 mr-1" /> : <ArrowDown className="inline h-3 w-3 mr-1" />}
                {stats.revenueLastMonthChange}% from last month
              </p>
               <div className="text-xs text-muted-foreground mt-2">
                {stats.revenueBreakdown.commissions.toLocaleString()} Commissions • {stats.revenueBreakdown.serviceFees.toLocaleString()} Service Fees • {stats.revenueBreakdown.adsRevenue.toLocaleString()} Ads Revenue
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals.toLocaleString()}</div>
              <p className={`text-xs ${stats.pendingApprovalsLastMonthChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                 {stats.pendingApprovalsLastMonthChange >= 0 ? <ArrowUp className="inline h-3 w-3 mr-1" /> : <ArrowDown className="inline h-3 w-3 mr-1" />}
                {stats.pendingApprovalsLastMonthChange}% from last month
              </p>
               <div className="text-xs text-muted-foreground mt-2">
                {stats.pendingBreakdown.listings.toLocaleString()} Listings • {stats.pendingBreakdown.users.toLocaleString()} Users • {stats.pendingBreakdown.transactions.toLocaleString()} Transactions • {stats.pendingBreakdown.disputes.toLocaleString()} Disputes
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listingsGrowth" className="space-y-4">
           <TabsList>
            <TabsTrigger value="listingsGrowth">Listings Growth</TabsTrigger>
            <TabsTrigger value="recentActivities">Recent Activities</TabsTrigger>
             <TabsTrigger value="pendingApprovals">Pending Approvals</TabsTrigger>
          </TabsList>
          <TabsContent value="listingsGrowth" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle>Listings Growth</CardTitle>
               <p className="text-sm text-muted-foreground">Monthly listings growth by category</p>
             </CardHeader>
             <CardContent>
               {/* Placeholder for Listings Growth Chart/Table */}
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Listings Growth Chart/Table Placeholder
                </div>
             </CardContent>
           </Card>
          </TabsContent>
          <TabsContent value="recentActivities" className="space-y-4">
            <Card>
             <CardHeader>
               <CardTitle>Recent Activities</CardTitle>
             </CardHeader>
             <CardContent>
               {/* Placeholder for Recent Activities List */}
               <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Recent Activities Placeholder
                </div>
             </CardContent>
           </Card>
          </TabsContent>
           <TabsContent value="pendingApprovals" className="space-y-4">
            <Card>
             <CardHeader>
               <CardTitle>Pending Approvals</CardTitle>
             </CardHeader>
             <CardContent>
               {/* Placeholder for Pending Approvals List */}
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Pending Approvals Placeholder
                </div>
             </CardContent>
           </Card>
          </TabsContent>
        </Tabs>

      </div>
    </DashboardLayout>
  );
} 