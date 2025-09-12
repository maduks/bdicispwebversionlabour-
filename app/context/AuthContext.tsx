"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setCookie, deleteCookie,getCookie } from "cookies-next";

interface User {
  message: string;
  token: string;
  data: {
    role: string;
    isKYCVerified: boolean;
    data:{
      newUser:{
        email:string,
        _id:string
      }
    }
    message:string
    newUser:{
      password: string,
      phoneNumber: string,
      isverified: boolean,
      role: string
      status: string,
      id: string;
      _id:string;
      email: string;
      fullName: string;
    
      isKYCVerified: boolean;
      createdAt: string;
    },
    _id: string;
  };
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  kycCompleted: boolean;
  emailVerified: boolean;
  signup: (userData: Omit<User, 'id' | 'isKYCVerified' | 'createdAt'>) => Promise<User>;
  login: (userData: { email: string; password: string }) => Promise<User>;
  logout: () => void;
  completeKyc: (kycData: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [kycCompleted, setKycCompleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('=== AUTH INITIALIZATION START ===');
        console.log('Document cookie:', document.cookie);
        
        // Try getCookie first
        let userCookies = getCookie('user')
        let authToken = getCookie('authToken')
        console.log('User cookies from getCookie:', !!userCookies, userCookies);
        console.log('AuthToken from getCookie:', !!authToken, authToken);
        
        // Don't use undefined authToken
        if (authToken === 'undefined' || authToken === undefined) {
          authToken = undefined;
          console.log('Ignoring undefined authToken');
        }
        
        // Fallback: try to get cookie directly from document.cookie
        if (!userCookies && typeof document !== 'undefined') {
          console.log('Trying document.cookie fallback...');
          const cookies = document.cookie.split(';');
          console.log('All cookies:', cookies);
          const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));
          const authTokenCookie = cookies.find(cookie => cookie.trim().startsWith('authToken='));
          console.log('Found user cookie:', userCookie);
          console.log('Found authToken cookie:', authTokenCookie);
          
          if (userCookie) {
            const cookieValue = userCookie.split('=')[1];
            console.log('Raw cookie value:', cookieValue);
            try {
              userCookies = JSON.parse(decodeURIComponent(cookieValue));
              console.log('User cookies from document.cookie:', userCookies);
            } catch (e) {
              console.error('Error parsing cookie from document.cookie:', e);
            }
          }
          
          if (authTokenCookie && !authToken) {
            const tokenValue = authTokenCookie.split('=')[1];
            if (tokenValue !== 'undefined') {
              authToken = tokenValue;
              console.log('AuthToken from document.cookie:', authToken);
            } else {
              console.log('AuthToken is undefined in cookie, ignoring');
            }
          }
        }
        
        if (userCookies) {
          // Parse the user cookie properly
          const userData = typeof userCookies === 'string' ? JSON.parse(userCookies) : userCookies;
          console.log('Final parsed user data:', userData);
          // Normalize and set state
          const normalizedUser = userData?.data ? { data: userData.data } : userData;
          setCurrentUser(normalizedUser as any);
          setKycCompleted(Boolean((normalizedUser as any)?.data?.isKYCVerified));
          setEmailVerified(Boolean((normalizedUser as any)?.data?.isverified));
          console.log('Current user set successfully');
        } else {
          console.log('No user cookies found - user will need to login');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
        console.log('=== AUTH INITIALIZATION END ===');
      }
    };

    // Try immediately first
    initializeAuth();
    
    // Also try after a delay as backup
    const timer = setTimeout(() => {
      console.log('Retrying auth initialization after delay...');
      initializeAuth();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const signup = async (userData: Omit<User, 'id' | 'isKYCVerified' | 'createdAt'>) => {
    try {
      const newUser:any = await axios.post("https://ministryoflabourbackend.vercel.app/api/v1/users/register",userData)

      if (newUser?.data?.token) {
        setCookie("authToken",newUser.data.token,{ 
          maxAge: 60 * 60 * 24 * 1, // 1 day
          path: '/',
          sameSite: 'lax'
        });
      } else {
        console.error('No token found in signup response:', newUser);
      }
      // Store only essential, small user data to avoid cookie size issues
      setCookie('user', JSON.stringify({ data: newUser.data.newUser }), { 
        maxAge: 60 * 60 * 24 * 2, // 2 days
        path: '/',
        sameSite: 'lax'
      });
      setCurrentUser(newUser);
      console.log("newUser.data.newUser.isverified: ",newUser.data.data.newUser.isverified)
      setEmailVerified(newUser?.data?.data?.newUser?.isverified);
      return newUser;
    } catch (err:any) {
      console.log("err: ",err)
      //const key_s = Object.keys(err?.response?.data?.errors)[0]
      //console.error("mis: "+Object.keys(err?.response?.data?.errors)[0]+" "+err?.response?.data?.errors[key_s]);
      const errors = err?.response?.data?.errors;
      if (errors) {
        const firstErrorKey = Object.keys(errors)[0];
        const firstErrorMessage = firstErrorKey ? errors[firstErrorKey] : undefined;
        
        if (firstErrorMessage) {
          console.error(`Error in ${firstErrorKey}: ${firstErrorMessage}`);
          throw new Error(firstErrorMessage);
          // Example output: "Error in password: Password should be at least 5 characters"
        }
      }

      throw new Error(err?.response?.data?.message || err?.response?.data?.errors.key);
    
    }
  
  };

  const login = async (userData: { email: string; password: string }) => {
    try {
      const res = await axios.post("https://ministryoflabourbackend.vercel.app/api/v1/auth/login", userData);
      const user = res.data;

      // Handle both "user" (artisan) and "seeker" roles
      if(user.data?.role === "user" || user.data?.role === "seeker"){
        console.log('=== LOGIN SUCCESS ===');
        console.log('Setting user cookie:', user);
        console.log('User role:', user.data?.role);
        
        // Store a minimal user payload to keep cookie small and consistent
        const cookieValue = JSON.stringify({ data: user.data });
        console.log('Cookie value to be stored:', cookieValue);
        
        setCookie('user', cookieValue, { 
          maxAge: 60 * 60 * 24 * 2, // 2 days
          path: '/',
          sameSite: 'lax'
        });
        
        // Set authToken cookie properly
        if (user.token) {
          setCookie('authToken', user.token, { 
            maxAge: 60 * 60 * 24 * 2, // 2 days
            path: '/',
            sameSite: 'lax'
          });
        } else {
          console.error('No token found in user data:', user);
        }
        
        // Verify cookies were set
        setTimeout(() => {
          const storedUserCookie = getCookie('user');
          const storedAuthToken = getCookie('authToken');
          console.log('Verification - stored user cookie:', !!storedUserCookie);
          console.log('Verification - stored authToken:', storedAuthToken);
          console.log('Document cookie after setting:', document.cookie);
        }, 100);
        
        setCurrentUser(user);
        console.log("user: ",user.data)
        setEmailVerified(user.data.isverified || false);
        setKycCompleted(user.isKYCVerified || false);
        console.log('=== LOGIN COMPLETE ===');
      }
    
      return user;
    } catch (err: any) {
      console.error(err);
      throw new Error(err?.response?.data?.message ||err?.response?.data?.errors);
    }
  };

  const logout = () => {
    deleteCookie('user');
    deleteCookie('authToken');
    // Clear persisted Service Provider Registration state
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('serviceProviderRegForm');
        localStorage.removeItem('serviceProviderRegStep');
      } catch (e) {
        // noop: localStorage may be unavailable
      }
    }
    setCurrentUser(null);
    setKycCompleted(false);
    router.push('/login');
  };

 

  const completeKyc = async (kycData: any) => {
    console.log("currentUser: ", currentUser);
    
    let userData;
    if (typeof currentUser === 'string') {
      userData = JSON.parse(currentUser);
    } else {
      userData = currentUser;
    }
    const userId = userData?.data?._id;
    kycData.userId = userId || null;
    const res = await axios.post("https://ministryoflabourbackend.vercel.app/api/v1/kyc/send", kycData);
    const userkyc = res.data.kyc;
    console.log("KYC first: "+ JSON.stringify(userkyc))
    if(!userkyc) return false
    console.log("KYC: "+ JSON.stringify(userkyc))
    setCookie('userKyc', JSON.stringify(userkyc), { maxAge: 60 * 60 * 24 * 7 }); // 7 days
    setKycCompleted(true);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, kycCompleted, emailVerified, signup, login, logout, completeKyc }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
