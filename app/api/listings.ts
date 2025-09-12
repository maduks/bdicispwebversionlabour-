import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ministryoflabourbackend.vercel.app/api/v1/';

export interface Listing {
  _id: string;
  type: 'product' | 'business' | 'property' | 'service';
  title: string;
  description: string;
  price: string;
  images: string[];
  businessProfilePicture?: string;
  businessLogo?: string;
  category?: string;
  featured?: boolean;
  location?: string;
  rating?: number;
  reviews?: number;
  petsAllowed?: string;
  tags: string[];
  contact: {
    name: string;
    email: string;
    phone: string;
    listedBy?: string;
  };
  details?: {
    serviceCategory?: string;
    responseTime?: string;
    emergencyServices?: boolean;
    isAvailable?: boolean;
    isVerified?: boolean;
    status?: string;
    createdAt?: string;
    socialLinks?: {
      website?: string;
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

export const listingsApi = {
  // Get all listings with optional filters
  getListings: async (filters?: {
    type?: string;
    searchTerm?: string;
    priceRange?: [number, number];
    tags?: string[];
    minRating?: number;
    sortBy?: string;
    limit:number;
    page:number
  }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listings/all`, {
        params: {
            
            ...filters
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  },

  getFeaturedListings: async (filters?: {
    type?: string;
    searchTerm?: string;
    priceRange?: [number, number];
    tags?: string[];
    minRating?: number;
    sortBy?: string;
    limit:number;
    page:number
  }) => {
    try {
      console.log('Fetching featured listings with filters:', filters);
      const response = await axios.post(`${API_BASE_URL}/listings/featured`, filters);
      console.log('Featured listings response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured listings:', error);
      if (axios.isAxiosError(error)) {
        console.error('API Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
      throw error;
    }
  },

  // Get a single listing by ID
  getListing: async (id: string,type:string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listings/${id}?type=${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw error;
    }
  },

  // Create a new listing
  createListing: async (listing: Omit<Listing, 'id'>) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/listings`, listing);
      return response.data;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  },

  // Update an existing listing
  updateListing: async (id: string, listing: Partial<Listing>) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/listings/${id}`, listing);
      return response.data;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  },

  // Delete a listing
  deleteListing: async (id: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/listings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw error;
    }
  }
};