"use client"

import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios"
import { createContext, useContext, ReactNode } from "react"
import { deleteCookie, getCookie } from "cookies-next";

// Define type for accessTypeData
export interface AccessTypeData {
  type: string;
  allowedCategories: string[];
  allowedSubcategories: string[];
}

// Update Ministry type
type Ministry = {
  id: number;
  name: string;
  description: string;
  established: string;
  minister: string;
  agentCount: number;
  serviceProviders: number;
  properties: number;
  status: string;
  allowedCategories: string[];
  allowedSubcategories: string[];
  accessTypes: AccessTypeData[];
  productCategories: string[];
  productSubcategories: string[];
  businessPremiseCategories: string[];
  businessPremiseSubcategories: string[];
  propertyCategories: string[];
  propertySubcategories: string[];
  email?: string;
  phoneNumber?: string;
  password?: string;
};

interface ApiContextType {
  // Ministry endpoints
  getMinistries: () => Promise<Ministry[]>
  getMinistry: (id: number) => Promise<Ministry>
  createMinistry: (ministry: Omit<Ministry, "id">) => Promise<Ministry>
  updateMinistry: (id: number, ministry: Partial<Ministry>) => Promise<Ministry>
  deleteMinistry: (id: number) => Promise<void>
  //Categories Endpoints
  getServiceCategories: () => Promise<any>
  getProductsCategories: () =>Promise<any>

  //Users ENDPOINT
  getAllUsers: ()=>Promise<any>
  deactivateUser:(id: number)=>Promise<any>
  activateUser:(id: number)=>Promise<any>
  updateUser:(id: number,data:any)=>Promise<any>
  createAgent:(payload:any)=>Promise<any>
  createUser:(payload:any)=>Promise<any>
  getUserById:(id:any)=>Promise<any>
  deleteAgent:(id:any,userid:any)=>Promise<any>
  updateAgent:(id:number,payload:any)=>Promise<any>
  getMinistryAgents:(id:number)=>Promise<any>
  getSubmissionsByUser:(userId:string)=>Promise<any>
  getTransactionsByUser:(userId:string)=>Promise<any>

  //Audit Logs
  getAuditLogs: ()=>Promise<any>,
  getAuditLogsFilter:(range:any)=>Promise<any>

  //KYC
  getUserKyc:(userid:any)=>Promise<any>


  //ADMIN STATS
  getTotalMinistries : ()=>Promise<any>
  getTotalActiveUsers: ()=>Promise<any>
  getServiceProviderAnalytics: (filters?: { state?: string; lga?: string; ward?: string }) => Promise<any>;
  getRecentMinistryActivities: (ministryId: string, limit?: number) => Promise<any>;

  submitPropertyRegistration: (payload: any) => Promise<any>;
  registerServiceProvider: (payload: any) => Promise<any>;
  updateServiceProvider: (submissionId: string, payload: { data: any; submissionId: string }) => Promise<any>;
  
  // Agent Submissions
  getAgentSubmissions: (agentId: string) => Promise<any>;
  updateSubmission: (id: string, payload: { status: string; notes?: string }) => Promise<any>;
  getSubmissionsByMinistry: (ministryId: string) => Promise<any[]>;

  // Fetch all service providers for a ministry
  getMinistryServiceProviders: (ministryId: string) => Promise<any[]>;
  getBankList: () => Promise<any[]>; // Add this
  validateAccountNumber: (accountNumber: string, bankUID: string, amount?: number) => Promise<any>; // Add this
}

// Create the context
const ApiContext = createContext<ApiContextType | undefined>(undefined)

// Create the provider component
export function ApiProvider({ children }: { children: ReactNode }) {
  // Create axios instance with default config
  const storedUser = getCookie("user")
  let userData: any = null;

  try {
    if (
      storedUser &&
      typeof storedUser === "string" &&
      storedUser !== "undefined"
    ) {
      userData = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Error parsing user data from cookie:", error);
    userData = null;
  }
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://ministryoflabourbackend.vercel.app/api/v1/",
    headers: {
      "Content-Type": "application/json",
      ...(userData && userData._id ? { "user-id": userData._id } : {})
    },
  })

  // Add request interceptor for authentication
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getCookie("token")
    if (token) {
      config.headers.Authorization = `x-access-token ${token}`
    }
    return config
  })

  // Add response interceptor for error handling
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        deleteCookie("token")
        deleteCookie("user")
        alert("unauthorized: " + error)
        window.location.href = "/"
      }
      return Promise.reject(error)
    }
  )

  const getTransactionsByUser = async (userId: string): Promise<any> => {
    const response = await api.post(`/transactionservicehub/user/${userId}`);
    return response.data.data;
  };

  // Ministry API calls
  const getMinistries = async (): Promise<Ministry[]> => {
    const response = await api.post("/ministry/fetch")
    return response.data.data
  }
  const getMinistry = async (id: number): Promise<Ministry> => {
    const response = await api.get(`/ministry/${id}`)
    return response.data
  }
  const getServiceCategories = async ()=>{
    const response = await api.get('/serviceproviders/retrieve/category')
    return response.data
  }

  const getProductsCategories = async ()=>{
    const response = await api.get('/products/retrieve/category')
    return response.data
  }



  const createMinistry = async (ministry: Omit<Ministry, "id">): Promise<Ministry> => {
    const response = await api.post("/ministry/create", ministry)
    return response.data
  }

  const updateMinistry = async (id: number, ministry: Partial<Ministry>): Promise<Ministry> => {
    const response = await api.put(`/ministry/${id}`, ministry)
    return response.data
  }

  const deleteMinistry = async (id: number): Promise<void> => {
    await api.delete(`/ministry/${id}`)
  }

  // USERS MANAGEMENT API CALLS

  const getAllUsers = async (): Promise<[]> => {
    const response = await api.post("/profile/allusers")
    return response.data.users_list
  }

  // New: Get total active users
  const getTotalActiveUsers = async (): Promise<number> => {
    const response = await api.get("/profile/active/total")
    return response.data.total
  }

  // New: Get total ministries
  const getTotalMinistries = async (): Promise<number> => {
    const response = await api.post("/ministry/total")
    return response.data.total
  }

  const getMinistryUsers = async (): Promise<[]> => {
    const response = await api.post("/profile/ministries")
    return response.data.data
  }

  const getAgentUsers = async (): Promise<[]> => {
    const response = await api.post("/profile/agents")
    return response.data.data
  }

  const getPublicUsers = async (): Promise<[]> => {
    const response = await api.post("/profile/publicusers")
    return response.data.data
  }

  const deactivateUser = async (id: number): Promise<any> => {
    const response = await api.post(`/profile/deactivate/${id}`)
    return response.data.data
  }
  const activateUser = async (id: number): Promise<any> => {
    const response = await api.post(`/profile/activate/${id}`)
    return response.data.data
  }

  const updateUser = async (id: number, data: any): Promise<any> => {
    const response = await api.post(`/profile/${id}`, data)
    return response.data.data
  }

  const createUser = async(payload:any):Promise<any>=>{
    const response = await api.post(`/users/register`, payload)
    return response.data.data
  }

  const getUserById = async(id:any):Promise<any>=>{
    const response = await api.get(`/profile/${id}`)
    return response.data
  }

  //AGENTS API 
  const createAgent =  async(payload:any):Promise<any>=>{
    const response = await api.post(`/agents/create`,payload)
    return response.data.data
  }
  const updateAgent =  async(id:number,payload:any):Promise<any>=>{
    const response = await api.post(`/agents/update/${id}`,payload)
    return response.data.data
  }
  const deleteAgent =  async(id:number,userid:number):Promise<any>=>{
    const response = await api.delete(`/agents/delete/${id}/${userid}`)
    return response.data.data
  }

  const getMinistryAgents = async(id:any):Promise<any>=>{
    const response  =await api.get(`/agents/ministry/${id}`)
    return response.data.data
  }



   // Get Submissions by user
   const getSubmissionsByUser = async (userId: string): Promise<any[]> => {
    const response = await api.get(`/submissions/submissions/user/${userId}`);
    return response.data.data;
  };

  //AUDIT LOGS API
  const getAuditLogs = async():Promise<any>=>{
    const response = await api.get("/auditlogs")
    return response.data.data
  }
  const getAuditLogsFilter = async(range:any):Promise<any>=>{
    const response = await api.get(`/auditlogs?range=${range}`)
    return response.data.data
  }

  const submitPropertyRegistration = async (payload: any): Promise<any> => {
    const response = await api.post("/propertyservicehub", payload);
    return response.data;
  };

  // Service Provider Registration
  const registerServiceProvider = async (payload: any): Promise<any> => {
    const response = await api.post("/serviceproviderservicehub/service-provider-hub", payload);
    return response.data;
  };

  // Update Service Provider
  const updateServiceProvider = async (submissionId: string, payload: { data: any; submissionId: string }): Promise<any> => {
    const response = await api.put(`/serviceproviderservicehub/service-provider-hub/${submissionId}`, payload);
    return response.data;
  };

  // Agent Submissions
  const getAgentSubmissions = async (agentId: string): Promise<any> => {
    const response = await api.get(`/submissions/submissions/agent/${agentId}`);
    return response.data.data;
  };

  // Update Submission Status
  const updateSubmission = async (id: string, payload: { status: string; notes?: string }) => {
    const response = await api.patch(`/submissions/submissions/${id}/status`, payload);
    return response.data;
  };

  // Get Submissions by Ministry
  const getSubmissionsByMinistry = async (ministryId: string): Promise<any[]> => {
    const response = await api.get(`/submissions/submissions/ministry/${ministryId}`);
    return response.data.data;
  };

  // Add the analytics API call
  const getServiceProviderAnalytics = async (filters?: { state?: string; lga?: string; ward?: string }): Promise<any> => {
    const params: any = {};
    if (filters?.state && filters.state !== "__all__") params.state = filters.state;
    if (filters?.lga && filters.lga !== "__all__") params.lga = filters.lga;
    if (filters?.ward && filters.ward !== "__all__") params.ward = filters.ward;
    const response = await api.get('serviceproviderservicehub/analytics/service-providers', { params });
    return response.data;
  };

  // Add the recent activities API call
  const getRecentMinistryActivities = async (ministryId: string, limit: number = 5): Promise<any> => {
    const response = await api.get(`/analytics/recent-activities/ministry/${ministryId}?limit=${limit}`);
    return response.data;
  };

  // Fetch all service providers for a ministry
  const getMinistryServiceProviders = async (ministryId: string) => {
    const response = await api.get(`/serviceproviderservicehub/service-provider-hub/ministry/${ministryId}`);
    // Map API response to UI attributes
    return response.data.data 
  };

  // Add getBankList implementation
  const getBankList = async (): Promise<any[]> => {
    const response = await axios.post("http://13.60.216.170:8000/api/collection/get-banks");
    return response.data?.data?.banks || [];
  };

  // Add validateAccountNumber implementation
  const validateAccountNumber = async (accountNumber: string, bankUID: string, amount: number = 50): Promise<any> => {
    const response = await axios.post("http://13.60.216.170:8000/api/collection/validate-account", {
      accountNumber,
      amount,
      bankUID,
    });
    return response.data;
  };


  const getUserKyc = async (userid:any) => {
    const res = await api.post(`https://ministryoflabourbackend.vercel.app/api/v1/kyc/retrieve`,{
      userId:userid
    })
    const userkyc = res.data;
    return userkyc;
  }

  const value = {
    //MINISTRIES SUPER ADMIN
    getMinistries,
    getMinistry,
    createMinistry,
    updateMinistry,
    deleteMinistry,
    getServiceCategories,
    getProductsCategories,
    getSubmissionsByUser,
    getTransactionsByUser,

    //USERS SUPER ADMIN
    getAllUsers,
    getMinistryUsers,
    getAgentUsers,
    getPublicUsers,
    updateUser,
    deactivateUser,
    activateUser,
    createUser,
    getUserById,
    getTotalActiveUsers,
    getTotalMinistries,
    getUserKyc,

    //AGENTS
    createAgent,
    updateAgent,
    getMinistryAgents,
    deleteAgent,

    //AUDIT LOGS
    getAuditLogs,
    getAuditLogsFilter,

    submitPropertyRegistration,
    registerServiceProvider,
    updateServiceProvider,
    getAgentSubmissions,
    updateSubmission,
    getSubmissionsByMinistry,
    getServiceProviderAnalytics,
    getRecentMinistryActivities,
    getMinistryServiceProviders,
    getBankList,
    validateAccountNumber,
  }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

// Custom hook to use the API context
export function useApi() {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider")
  }
  return context
} 