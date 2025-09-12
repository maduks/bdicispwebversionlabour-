export interface Contact {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface ListingForm {
  _id?: string;
  // Common fields
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  listingType: 'property' | 'business' | 'product' | 'service';
  contactName: string;
  contactEmail: string;
  contactPhone: string;

  // Property specific fields
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  propertyStatus?: string;
  propertyCondition?: string;
  furnishingType?: string;

  // Business specific fields
  legalname?: string;
  industry?: string;
  businessType?: string;
  businessAddress?: string;
  openingTime?: string;
  closingTime?: string;
  registrationStatus?: string;
  businessNumber?: string;
  taxId?: string;
  businessProfilePicture?: string;
  businessLogo?: string;
  legalDocument?: string;

  // Product specific fields
  prodName?: string;
  category?: string;
  productImages?: string[];
  brand?: string;
  model?: string;
  condition?: string;
  warranty?: string;

  // Service specific fields
  serviceName?: string;
  serviceCategory?: string;
  responseTime?: string;
  emergencyServices?: boolean;
  isAvailable?: boolean;
  isVerified?: boolean;
  featured?: boolean;
  featuredImage?: string[];
  state?: string;
  city?: string;
  address?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  documents?: string[];
  status?: string;
  reviews?: any[];
  createdAt?: Date;
  updatedAt?: Date;
} 