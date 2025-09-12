"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ListFilter,
  PlusCircle,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  FileCheck,
  Star,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Role-based access control - only allow artisans (role === "user")
  useEffect(() => {
    if (loading) return; // Wait for auth to initialize
    if (!currentUser) {
      router.push("/login");
      return;
    }

    // Check if user is a seeker (role === "seeker") - redirect to user-profile
    const userRole = currentUser?.data?.role;
    if (userRole === "seeker") {
      router.push("/user-profile");
      return;
    }
  }, [currentUser, loading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    // {
    //   name: "My Listings",
    //   path: "/dashboard/my-listings",
    //   icon: <ListFilter className="h-5 w-5" />,
    // },
    // {
    //   name: "Add Listing",
    //   path: "/dashboard/add-listing",
    //   icon: <PlusCircle className="h-5 w-5" />,
    // },
    // New menu item for Service Provider Registration
    {
      name: "Application For Trade Test ",
      path: "/dashboard/service-provider-registration",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      name: "KYC",
      path: "/dashboard/kycverification",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "My Test Certificates",
      path: "/dashboard/certification",
      icon: <FileCheck className="h-5 w-5" />,
    },
    // {
    //   name: "My Promotions",
    //   path: "/dashboard/my-promotions",
    //   icon: <Star className="h-5 w-5" />,
    // },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  const isActive = (path) => pathname === path;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:z-auto transition-transform duration-300 ease-in-out`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-xl">
                B
              </div>
              <span className="ml-2 text-xl font-bold text-gradient-primary">
                Ministry Of Labour
              </span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white border-b px-4 py-2 flex items-center justify-between">
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="flex items-center ml-auto">
            <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <DropdownMenu>
              {/* <DropdownMenuTrigger asChild>
                <button className="flex items-center ml-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={currentUser?.firstName} />
                    <AvatarFallback>
                      {currentUser?.firstName?.[0]}
                      {currentUser?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium hidden sm:block">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </span>
                </button>
              </DropdownMenuTrigger> */}
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/profile")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
