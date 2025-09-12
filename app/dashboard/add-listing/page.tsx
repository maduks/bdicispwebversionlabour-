"use client"

import { useState,useEffect } from "react"
import { useRouter } from "next/navigation"
//import DashboardLayout from "../../components/dashboard/DashboardLayout"
import { Button } from "../../components/ui/button"
//import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import axios from "axios"
import { IKContext, IKUpload } from 'imagekitio-react'
import { getCookie } from 'cookies-next';
import { Upload,  CheckCircle} from "lucide-react"
import {toast,Toaster} from "sonner"
import { LISTING_TYPES } from './constants';
import { NIGERIA_STATES } from './constants';
import { PROPERTY_TYPES } from './constants';
import { PROPERTY_STATUS } from './constants';
import { PROPERTY_CONDITION } from './constants';
import { FURNISHING_TYPES } from './constants';
import { AMENITIES } from './constants';
import { BUSINESS_INDUSTRIES } from './constants';
import { BUSINESS_TYPES } from './constants';
import { TIME_OPTIONS } from './constants';
import { REGISTRATION_STATUS } from './constants';
import { PRODUCT_CATEGORIES } from './constants';
import { CERTIFICATION_STATUS } from "./constants"
import { BENUE_LGAS } from "./constants"
import { Alert } from "@/components/ui/alert"
import React from "react";

const INITIAL_FORM = {
  // Property
  title: "",
  propertyType: "",
  listingType: "",
  price: "",
  priceNegotiable: false,
  area: "",
  areaUnit: "",
  description: "",
  address: "",
  lga:"",
  city: "",
  state: "",
  maplocation: {},
  bedrooms: "",
  bathrooms: "",
  toilets: "",
  kitchens: "",
  floors: "",
  parking: "",
  furnishing: "",
  amenities: [],
  photos: [],
  videos: [],
  floorPlans: [],
  condition: "",
  petsAllowed: false,
  listedBy: "",
  contact: {
    name: "",
    email: "",
    phoneNumber: "",
  },
  maintenanceFee: "",
  nearbyAmenities: [],
  accessibilityFeatures: [],
  smartHomeFeatures: [],
  views: 0,
  status: "Active",
  isPromoted: false,
  tags: [],
  documents: [],
  featured: false,
  // Product
  prodName: "",
  category: "",
  productImages: [],
  certificationStatus: "",
  legalDocument: "",
  expiryDate: "",
  // Service
  serviceName: "",
  servicePriceType:"",
  locations:{
    address:"",
    city:"",
    state:"",
  },
  website: "",
  facebook: "",
  instagram: "",
  socialLinks: {
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  },

  yearsOfExperience:"",
  location: "",
  emergencyServices: false,
  responseTime: "",
  serviceCategory: "",
  reviewCount: 0,
  isAvailable: true,
  isVerified: false,
  featuredImage: [],
  legalname: "",
  industry: "",
  businessType: "",
  businessAddress: "",
  employeeCount: "",
  openingTime: "",
  closingTime: "",
  dateOfIncorporation: "",
  businessNumber: "",
  businessPhoneNumber: "",
  businessEmail: "",
  businessDescription: "",
  businessProfilePicture: "",
  businessWebsite: "",
  businessLogo: "",
  businessFacebook: "",
  businessTwitter: "",
  businessInstagram: "",
  businessLinkedIn: "",
  businessTaxId: "",
  registrationStatus: "",
  images: [],
}

interface Certificate {
  name: string;
  id?: string; // Example of another property
}
export default function AddListingPage() {
  const router = useRouter()
  //change the step to 1
  const [step, setStep] = useState(1)
  //change the listing type to property
  const [listingType, setListingType] = useState<string | null>("property")
  const [formData, setFormData] = useState<any>(INITIAL_FORM)
  const [hasKyc,setHasKyc] = useState();
  const [loading,setLoading]= useState(false);
  const urlEndpoint = 'https://ik.imagekit.io/bdic';
  const publicKey = 'public_k/7VGHSYTH1q/STxZGOGFWUrsdE='; 
  
  useEffect(() => {
    const userCookie = getCookie("user");
    const userData = JSON.parse(userCookie as string);
    const token = userData?.token;
    setHasKyc(userData?.data?.isKYCVerified)    
  }, [])

  const authenticator =  async () => {
      try {
          const response = await axios.post('https://bdicisp.onrender.com/api/v1/auth/imagekit/auth');
  
          if (!response.data) {
              const errorText = await response.data;
              throw new Error(`Request failed with status ${response.status}: ${errorText}`);
          }
  
          const data = await response.data;
          const { signature, expire, token } = data;
          return { signature, expire, token };
      } catch (error) {
          //throw new Error(`Authentication request failed: ${error.message}`);
      }
  };
  const [propertyPhotos,setPropertyPhotos] =useState<string[]>([]);
  const [iuploading,setIUploading] = useState(false)
  const [businessProfilePictureUploading,setBusinessProfilePictureUploading] = useState(false)
  const [businessLogoUploading,setBusinessLogoUploading] = useState(false)
  const [legalDocumentUploading,setLegalDocumentUploading] = useState(false)
  const [productImageUploading,setProductImageUploading] = useState(false)
  const [serviceImageUploading,setServiceImageUploading] = useState(false)
  // Add handleImageUpload function
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIUploading(true)

    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData((prev: any) => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  }

  const handleServiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceImageUploading(true)
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file)); 
      // setFormData((prev: any) => ({
      //   ...prev,
      //   featuredImage: [...prev.featuredImage, ...newImages]
      // }));
    }
  }
  
  const onServiceImageUploadProgress = (progress: number) => {
    setServiceImageUploading(true)
    console.log("Progress...", progress);
  }

  const onServiceImageError = (error: any) => {
    console.log("Error", error);
    setServiceImageUploading(false)
  }

  const onServiceImageSuccess = (res: any) => {
    console.log("Success", res);
    setServiceImageUploading(false)
    setFormData((prev: any) => ({
      ...prev,
      featuredImage: [...prev.featuredImage, res.url]
    }));
  }


  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessProfilePictureUploading(true)

    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      
      setFormData((prev: any) => ({
        ...prev,
        businessProfilePicture: newImages
      }));
    }
  }

  const handleLogoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessLogoUploading(true)

    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      
      setFormData((prev: any) => ({
        ...prev,
        businessLogo: newImages
      }));
    }
  }
  const handleCacImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLegalDocumentUploading(true)

    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));

      console.log("New images", newImages)
      
      setFormData((prev: any) => ({
        ...prev,
        legalDocument: newImages
      }));
    }
  }




  const onbusinessProfileError = (err:any) => {
    console.log("Error", err);
    setBusinessProfilePictureUploading(false)
  };
  
  const onbusinessProfileSuccess = (res:any) => {

    //setPropertyDeeds((prev)=> [...prev, res.url])
    setBusinessProfilePictureUploading(false)
    setFormData((prev: any) => {
      const updated = {
        ...prev,
        businessProfilePicture: res.url
      };
      console.log("Updated form data immediately:", updated);
      return updated;
    });

    console.log("Success", res,formData);
  };


  const onbusinessLogoError = (err:any) => {
    console.log("Error", err);
    setBusinessLogoUploading(false)
  };

  const onbusinessLogoSuccess = (res:any) => {
    setBusinessLogoUploading(false)
    setFormData((prev: any) => {
      const updated = {
        ...prev,
        businessLogo: res.url
      };
      console.log("Updated form data immediately:", updated);
      return updated;
    });
  };

  const onbusinessCacError = (err:any) => {
    console.log("Error", err);
    setLegalDocumentUploading(false)
  };

  const onbusinessCacSuccess = (res:any) => {
    setLegalDocumentUploading(false)
    setFormData((prev: any) => {
      const updated = {
        ...prev,
        legalDocument: res.url
      };
      console.log("Updated form data immediately:", updated);
      return updated;
    });
   
  }

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductImageUploading(true)

    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      
      // setFormData((prev: any) => ({
      //   ...prev,
      //   productImages: [...prev.productImages, ...newImages]
      // }));
    }
  }

  const onProductImageUploadProgress = (progress:any) => {
    setProductImageUploading(true)
    console.log("Progress...", progress);
  }

  const onProductImageError = (err:any) => {
    console.log("Error", err);
    setProductImageUploading(false)
  }

  const onProductImageSuccess = (res:any) => {
    setProductImageUploading(false)
    setFormData((prev: any) => {
      const updated = {
        ...prev,
        productImages: [...prev.productImages, res.url]
      };
      console.log("Updated form data immediately:", updated);
      return updated;
    });
  }

  

  // for product images
  const onIdeedsError = (err:any) => {
    console.log("Error", err);
    setIUploading(false)
  };
  
  const onIdeedsSuccess = (res:any) => {

    //setPropertyDeeds((prev)=> [...prev, res.url])
    setIUploading(false)
    setPropertyPhotos((prevImages) => [...prevImages , res.url]);

    console.log("Success", res,propertyPhotos);
  };

  const onIdeedsUploadProgress = (progress:any) => {
    setIUploading(true)
    console.log("Progress...", progress);
  };
  // Stepper
  const steps = ["Listing Type", "Contact Details", "Review"]

  // Listing type selection handler
  const handleTypeSelect = (type: string) => {
    setListingType(type)
    setStep(1)
  }

  async function getUser(){
    // 1. Get cookie (handle both sync/async cases)
    const userCookie = getCookie('user');
   
    // 2. Type guard to ensure it's a string
    if (typeof userCookie !== 'string') {
      throw new Error('User cookie not found or invalid');
    }
    
    // 3. Now safely parse
    const userData = JSON.parse(userCookie);
    
    // 4. Access _id with optional chaining (in case data is undefined)
    const userId = userData?.data?._id;
    return userId
       }
       async function getUserToken(){
        // 1. Get cookie (handle both sync/async cases)
        const userCookie = getCookie('user');
       
        // 2. Type guard to ensure it's a string
        if (typeof userCookie !== 'string') {
          throw new Error('User cookie not found or invalid');
        }
        
        // 3. Now safely parse
        const userData = JSON.parse(userCookie);
        
        // 4. Access _id with optional chaining (in case data is undefined)
        const token = userData.token;
      
        return token
           }
  // Field change handler
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://ministryoflabourbackend.vercel.app/api/v1";
  useEffect(() => {
    setLoading(true);
     const userCookie = getCookie("user");
     const userData = JSON.parse(userCookie as string);
    const id = userData?.data?._id;
    axios
      .get(`${API_BASE_URL}/certifications/${id}`)
      .then((res) => {
        setLoading(false);

        const newCertificates = res?.data?.data?.map((cert: any) => {
          // You might transform or filter the cert data here if needed
          return {
            name: cert.certificationType,
            // ... other properties you need
          };
          
        });
        setCertificates(newCertificates); // Update state once with the entire new array

        

      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, []);

   // Prevent blank step 2
   const handleContinue = (e: any) => {
    e.preventDefault();
    if(!hasKyc) return toast.error("Ensure KYC completion before making a listing ")
    let hasCert = certificates.some((item: Certificate) => item.name === listingType)
    //alert(JSON.stringify(certificates) +" "+ listingType)
    if(!hasCert)  return toast.error(`Ensure you have a certification for ${listingType} listing`)
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }

  }


  // Add handleSubmit function
  const handleSubmit = async(e: any) => {
    //e.preventDefault();
   setLoading(true)
   if(listingType==="property")
   {
   let data = {
    title:formData.title,
    ownerId: await getUser(),
    propertyType:formData.propertyType,
    listingType:formData.listingType,
    price:formData.price,
    priceNegotiable:formData.priceNegotiable,
    area:formData.area,
    areaUnit:formData.areaUnit,
    description:formData.description,
    address:formData.address,
    city:formData.city,
    state:formData.state,
    tags:[],
    country:"Nigeria",
    bedrooms: formData.bedrooms,
    bathrooms: formData.bathrooms,
    toilets: formData.toilets,
    kitchens: formData.kitchens,
    floors: formData.floors,
    photos: propertyPhotos,
    parking: formData.parking,
    furnishing: formData.furnishing,
    amenities:formData.amenities,
    condition:formData.condition,
    petsAllowed:formData.petsAllowed,
    maintenanceFee:formData.maintenanceFee,
    listedBy:formData.contact.name,
    contact:{
      "email":formData.contact.email,
      "phone":formData.contact.phoneNumber,
      "name":formData.contact.name,
    }
   }
   console.log("Form submitted:", data);
      axios.post('https://ministryoflabourbackend.vercel.app/api/v1/properties/', data, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": `Bearer `,
      },
    }).then((res)=>{
      console.log(res.data)
      toast.success("Listing sent successfully....")
      setStep(3)
      setLoading(false)
    }).catch(err=>{
      console.log(err.message)
    });
  }
  if(listingType === "business"){
    let bData={
      legalname:formData.legalname,
      state:formData.state,
      ownerId:await getUser(),
      businessAddress:formData.businessAddress,
      industry:formData.industry,
      location:formData.location,
      businessType:formData.businessType,
      legalDocument:formData.legalDocument,
      employeeCount:formData.employeeCount,
      openingTime:formData.openingTime,
      closingTime:formData.closingTime,
      dateOfIncorporation:formData.dateOfIncorporation,
      businessNumber:formData.businessNumber,
      businessPhoneNumber:formData.businessPhoneNumber,
      businessEmail:formData.businessEmail,
      businessDescription:formData.businessDescription,
      businessProfilePicture:formData.businessProfilePicture,
      businessTaxId:formData.businessTaxId,
      registrationStatus:formData.registrationStatus.toLowerCase(),
      businessLogo:formData.businessLogo,
      businessWebsite:formData.businessWebsite,
      businessFacebook:formData.businessFacebook,
      businessTwitter:formData.businessTwitter,
      businessInstagram:formData.businessInstagram,
      businessLinkedIn:formData.businessLinkedIn,
     }
     
    console.error("Business data",bData)
    axios.post("https://ministryoflabourbackend.vercel.app/api/v1/business/create",bData,{
      headers:{
        "Content-Type": "application/json",
        "x-access-token": `${await getUserToken()}`,
      }
    }).then((res)=>{
     console.log(res.data)
     toast.success("Listing sent successfully....")
     setStep(3)
     setLoading(false)
    }).catch(err=>{
     console.log(err.message)
    })
  }
  if(listingType === "product"){
    let pData={
      ownerId:await getUser(),
      prodName:formData.prodName,
      description:formData.description,
      price:formData.price,
      featured:false,
      certificationStatus:formData.certificationStatus,
      productImages:formData.productImages,
      category:formData.category,
      legalDocument:formData.legalDocument,
      //expiryDate:"N/A",
      contact: {
        name:formData.contact.name,
        email:formData.contact.email,
        phoneNumber:formData.contact.phoneNumber,
      }
    }
  
    console.log("Product data",pData)
    axios.post("https://ministryoflabourbackend.vercel.app/api/v1/products/create",pData,{
      headers:{
        "Content-Type": "application/json",
        "x-access-token": `${await getUserToken()}`,
      }
    }).then((res)=>{
      console.log(res.data)
      toast.success("Listing sent successfully....")
      setStep(3)
      setLoading(false)
    }).catch(err=>{
      console.log(err.message)
    })
  }
  if(listingType === "service"){
    let sData = {
      serviceName: formData.serviceName,
      ownerId: await getUser(),
      description: formData.description,
      location: {
        state: formData.locations.state,
        city: formData.locations.city,
        address: formData.locations.address,
      },
      emergencyServices: formData.emergencyServices,
      responseTime: formData.responseTime,
      price: formData.price,
      serviceCategory: formData.serviceCategory,
      reviewCount: 0,
      featured: false,
      isAvailable: formData.isAvailable,
      isVerified: formData.isVerified,
      featuredImage: formData.featuredImage || [],
      socialLinks:{
        website: formData.socialLinks.website,
        facebook: formData.socialLinks.facebook,
        instagram: formData.socialLinks.instagram,
      },
      documents: formData.documents || [],
      status: "pending",
      reviews: [],
      contact: {
        name: formData.contact.name,
        email: formData.contact.email,
        phoneNumber: formData.contact.phoneNumber,
      }
    }

    console.log("Service data", sData)
    axios.post("https://ministryoflabourbackend.vercel.app/api/v1/serviceproviders/create", sData, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": `${await getUserToken()}`,
      }
    }).then((res) => {
      console.log(res.data)
      toast.success("Service listing created successfully!")
      setStep(3)
      setLoading(false)
    }).catch(err => {
      console.log(err.message)
      toast.error("Failed to create service listing")
      setLoading(false)
    })
  }
}

  // Add new state for the new service provider stepper
  const SERVICE_STEPS = [
    "User Info",
    "Address",
    "Professional Info",
    "Business Info",
    "Service Details",
    "KYC",
    "Licenses",
    "Portfolio",
    "Other/Meta"
  ];
  const [serviceStep, setServiceStep] = useState(1);
  const [serviceForm, setServiceForm] = useState({
    // 1. User (Personal Info)
    fullName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    password: "",
    // 2. Address
    street: "",
    city: "",
    state: "",
    ward: "",
    // 3. Professional Info
    profession: "",
    specialization: "",
    skills: [],
    yearsOfExperience: "",
    serviceDescription: "",
    educationLevel: "",
    // 4. Business Info
    businessName: "",
    businessRegistrationNumber: "",
    // 5. Service Details
    serviceAreas: [],
    availability: "Available",
    operatingHours: "",
    weekdays: { from: "", to: "" },
    weekends: { from: "", to: "" },
    // 6. KYC
    kyc: {
      nin: "",
      bankAccountNumber: "",
      bankName: "",
      accountName: "",
      dob: "",
      religion: "",
      photo: "",
    },
    // 7. Licenses
    licenses: [] as any[], // [{ name, number, authority, issued, expires, document, noExpiry }]
    // 8. Portfolio
    portfolio: [] as any[], // [{ title, description, images, date }]
    // 9. Other/Meta
    ministry: "",
    assignedBy: "",
    assignmentDate: "",
    rating: 0,
    average: 0,
    note: "",
    status: "Active",
    isVerified: true,
    category: "",
  });

  // Handler for service form fields
  const handleServiceChange = (e: any) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for nested KYC fields
  const handleKycChange = (e: any) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, kyc: { ...prev.kyc, [name]: value } }));
  };

  // Handler for array fields (skills, serviceAreas)
  const handleArrayChange = (name: string, value: string) => {
    setServiceForm((prev) => ({ ...prev, [name]: value.split(/[,\s]+/).filter(Boolean) }));
  };

  // Handler for next/prev step
  const handleServiceNext = () => setServiceStep((s) => Math.min(s + 1, SERVICE_STEPS.length));
  const handleServicePrev = () => setServiceStep((s) => Math.max(s - 1, 1));

  // Render fields for each type
  const renderFields = () => {
    if (listingType === "product") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="prodName">Product Name</Label>
            <Input id="prodName" name="prodName" value={formData.prodName} onChange={handleChange} placeholder="Enter product name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" value={formData.price} onChange={handleChange} placeholder="Enter price" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full border rounded bg-white px-3 py-2 text-sm" required>
              <option value="">Select Category</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {/* <Input id="category" name="category" value={formData.category} onChange={handleChange} placeholder="Enter category" required /> */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="certificationStatus">Product Certification</Label>
            <select id="certificationStatus" name="certificationStatus" 
            value={formData.certificationStatus} onChange={handleChange}
             className="w-full border rounded bg-white px-3 py-2 text-sm"
              required>
              <option value="">Select Certification</option>
              {CERTIFICATION_STATUS.map((certification) => (
                <option key={certification} value={certification}>{certification}</option>
              ))}
            </select>
            </div>

          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Provide a detailed description" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Address</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Address" required />
          </div>
          <div className="space-y-2">
          <Label htmlFor="lga">Local Government Area</Label>
          <select id="lga" name="lga" value={formData.lga} onChange={handleChange} className="w-full border rounded bg-white px-3 py-2 text-sm" required>
            <option value="">Select LGA</option>
            {BENUE_LGAS.map((lga) => (
              <option key={lga} value={lga}>{lga}</option>
            ))}
          </select>
          </div>
        </>
      )
    }
    if (listingType === "service") {
      // Helper for dynamic array fields
      const addLicense = () => setServiceForm(prev => ({ ...prev, licenses: [...(prev.licenses || []), { name: '', number: '', authority: '', issued: '', expires: '', document: '', noExpiry: false }] }));
      const removeLicense = (idx: any) => setServiceForm(prev => ({ ...prev, licenses: prev.licenses.filter((_: any, i: number) => i !== idx) }));
      const updateLicense = (idx: any, field: any, value: any) => setServiceForm(prev => ({ ...prev, licenses: prev.licenses.map((lic: any, i: number) => i === idx ? { ...lic, [field]: value } : lic) }));

      const addPortfolio = () => setServiceForm(prev => ({ ...prev, portfolio: [...(prev.portfolio || []), { title: '', description: '', images: [], date: '' }] }));
      const removePortfolio = (idx: any) => setServiceForm(prev => ({ ...prev, portfolio: prev.portfolio.filter((_: any, i: number) => i !== idx) }));
      const updatePortfolio = (idx: any, field: any, value: any) => setServiceForm(prev => ({ ...prev, portfolio: prev.portfolio.map((item: any, i: number) => i === idx ? { ...item, [field]: value } : item) }));
      const updatePortfolioImage = (idx: any, files: any) => {
        if (!files) return;
        setServiceForm((prev) => ({ ...prev, portfolio: prev.portfolio.map((item: any, i: number) => i === idx ? { ...item, images: Array.from(files).map((f: any) => URL.createObjectURL(f)) } : item) }));
      };

      // For KYC photo
      const handleKycPhoto = (e: any) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        if (file) setServiceForm((prev) => ({ ...prev, kyc: { ...prev.kyc, photo: URL.createObjectURL(file) } }));
      };

      // For meta fields (simulate auto-set)
      // useEffect(() => {
      //   setServiceForm(prev => ({
      //     ...prev,
      //     ministry: prev.ministry || "Ministry of Commerce", // Example default
      //     assignedBy: prev.assignedBy || "agent123", // Example user ID
      //     assignmentDate: prev.assignmentDate || new Date().toISOString().slice(0, 10),
      //   }));
      // }, []);

      // Submit handler
      const handleServiceSubmit = (e: any) => {
        e.preventDefault();
        console.log("Service Provider Registration Data:", serviceForm);
        alert("Registration data logged to console.");
      };

      return (
        <div className="p-6 max-w-3xl mx-auto">
          <Toaster position="top-right" closeButton={true} />
          <h1 className="text-2xl font-bold mb-6">Service Provider Registration</h1>
          {/* Stepper UI */}
          <div className="flex items-center mb-8">
            {SERVICE_STEPS.map((label, idx) => (
              <div key={label} className="flex items-center w-full">
                <div className={`rounded-full border-2 flex items-center justify-center w-8 h-8 text-lg font-semibold z-10 ${serviceStep === idx + 1 ? 'bg-green-500 text-white border-green-500' : 'bg-white border-gray-300 text-gray-400'}`}>{idx + 1}</div>
                {idx < SERVICE_STEPS.length - 1 && <div className={`flex-1 h-1 ${serviceStep > idx + 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
              </div>
            ))}
          </div>
          {/* Step Content */}
          {serviceStep === 1 && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleServiceNext(); }}>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" value={serviceForm.fullName} onChange={handleServiceChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={serviceForm.email} onChange={handleServiceChange} required />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" value={serviceForm.phoneNumber} onChange={handleServiceChange} required />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select id="gender" name="gender" value={serviceForm.gender} onChange={handleServiceChange} className="w-full border rounded bg-white px-3 py-2 text-sm" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" value={serviceForm.password} onChange={handleServiceChange} required />
              </div>
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={handleServicePrev} disabled={serviceStep === 1}>Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}
          {serviceStep === 2 && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleServiceNext(); }}>
              <div>
                <Label htmlFor="street">Street</Label>
                <Input id="street" name="street" value={serviceForm.street} onChange={handleServiceChange} required />
              </div>
              <div>
                <Label htmlFor="city">City (LGA)</Label>
                <Input id="city" name="city" value={serviceForm.city} onChange={handleServiceChange} required />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" value={serviceForm.state} onChange={handleServiceChange} required />
              </div>
              <div>
                <Label htmlFor="ward">Ward</Label>
                <Input id="ward" name="ward" value={serviceForm.ward} onChange={handleServiceChange} required />
              </div>
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={handleServicePrev}>Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}
          {serviceStep === 3 && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleServiceNext(); }}>
              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input id="profession" name="profession" value={serviceForm.profession} onChange={handleServiceChange} required />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <select id="specialization" name="specialization" value={serviceForm.specialization} onChange={handleServiceChange} className="w-full border rounded bg-white px-3 py-2 text-sm" required>
                  <option value="">Select Specialization</option>
                  <option value="Professional">Professional</option>
                  <option value="Artisan">Artisan</option>
                  <option value="Trader">Trader</option>
                  <option value="General Services">General Services</option>
                </select>
              </div>
              <div>
                <Label htmlFor="skills">Skills (comma or space separated)</Label>
                <Input id="skills" name="skills" value={serviceForm.skills.join(', ')} onChange={e => handleArrayChange('skills', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                <Input id="yearsOfExperience" name="yearsOfExperience" value={serviceForm.yearsOfExperience} onChange={handleServiceChange} required />
              </div>
              <div>
                <Label htmlFor="serviceDescription">Service Description</Label>
                <Textarea id="serviceDescription" name="serviceDescription" value={serviceForm.serviceDescription} onChange={handleServiceChange} required />
              </div>
              <div>
                <Label htmlFor="educationLevel">Education Level</Label>
                <Input id="educationLevel" name="educationLevel" value={serviceForm.educationLevel} onChange={handleServiceChange} required />
              </div>
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={handleServicePrev}>Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}
          {serviceStep === 4 && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleServiceNext(); }}>
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" name="businessName" value={serviceForm.businessName} onChange={handleServiceChange} required />
              </div>
              <div>
                <Label htmlFor="businessRegistrationNumber">Business Registration Number</Label>
                <Input id="businessRegistrationNumber" name="businessRegistrationNumber" value={serviceForm.businessRegistrationNumber} onChange={handleServiceChange} required />
              </div>
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={handleServicePrev}>Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}
          {serviceStep === 5 && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleServiceNext(); }}>
              <div>
                <Label htmlFor="serviceAreas">Service Areas (comma or space separated)</Label>
                <Input id="serviceAreas" name="serviceAreas" value={serviceForm.serviceAreas.join(', ')} onChange={e => handleArrayChange('serviceAreas', e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <select id="availability" name="availability" value={serviceForm.availability} onChange={handleServiceChange} className="w-full border rounded bg-white px-3 py-2 text-sm" required>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div>
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Input id="operatingHours" name="operatingHours" value={serviceForm.operatingHours} onChange={handleServiceChange} required />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Weekdays From</Label>
                  <Input type="time" value={serviceForm.weekdays.from} onChange={e => setServiceForm(prev => ({ ...prev, weekdays: { ...prev.weekdays, from: e.target.value } }))} required />
                </div>
                <div className="flex-1">
                  <Label>Weekdays To</Label>
                  <Input type="time" value={serviceForm.weekdays.to} onChange={e => setServiceForm(prev => ({ ...prev, weekdays: { ...prev.weekdays, to: e.target.value } }))} required />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Weekends From</Label>
                  <Input type="time" value={serviceForm.weekends.from} onChange={e => setServiceForm(prev => ({ ...prev, weekends: { ...prev.weekends, from: e.target.value } }))} required />
                </div>
                <div className="flex-1">
                  <Label>Weekends To</Label>
                  <Input type="time" value={serviceForm.weekends.to} onChange={e => setServiceForm(prev => ({ ...prev, weekends: { ...prev.weekends, to: e.target.value } }))} required />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={handleServicePrev}>Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}
          {serviceStep === 6 && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleServiceNext(); }}>
              <div>
                <Label htmlFor="nin">National Identification Number (NIN)</Label>
                <Input id="nin" name="nin" value={serviceForm.kyc.nin} onChange={handleKycChange} required />
              </div>
              <div>
                <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                <Input id="bankAccountNumber" name="bankAccountNumber" value={serviceForm.kyc.bankAccountNumber} onChange={handleKycChange} required />
              </div>
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" name="bankName" value={serviceForm.kyc.bankName} onChange={handleKycChange} required />
              </div>
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input id="accountName" name="accountName" value={serviceForm.kyc.accountName} onChange={handleKycChange} required />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" name="dob" type="date" value={serviceForm.kyc.dob} onChange={handleKycChange} required />
              </div>
              <div>
                <Label htmlFor="religion">Religion</Label>
                <Input id="religion" name="religion" value={serviceForm.kyc.religion} onChange={handleKycChange} required />
              </div>
              <div>
                <Label htmlFor="kycPhoto">Photo (Image Upload)</Label>
                <Input id="kycPhoto" name="kycPhoto" type="file" accept="image/*" onChange={handleKycPhoto} />
                {serviceForm.kyc.photo && <img src={serviceForm.kyc.photo} alt="KYC" className="w-24 h-24 mt-2 object-cover rounded" />}
              </div>
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={handleServicePrev}>Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}
          {serviceStep === 7 && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleServiceNext(); }}>
              <div className="flex justify-between items-center">
                <Label>Licenses</Label>
                <Button type="button" onClick={addLicense}>Add License</Button>
              </div>
              {(serviceForm.licenses || []).map((lic, idx) => (
                <div key={idx} className="border p-4 rounded mb-2 relative">
                  <Button type="button" variant="outline" className="absolute top-2 right-2" onClick={() => removeLicense(idx)}>Remove</Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Label>Name</Label>
                      <Input value={lic.name} onChange={e => updateLicense(idx, 'name', e.target.value)} required />
                    </div>
                    <div>
                      <Label>Number</Label>
                      <Input value={lic.number} onChange={e => updateLicense(idx, 'number', e.target.value)} required />
                    </div>
                    <div>
                      <Label>Authority</Label>
                      <Input value={lic.authority} onChange={e => updateLicense(idx, 'authority', e.target.value)} required />
                    </div>
                    <div>
                      <Label>Issued</Label>
                      <Input type="date" value={lic.issued} onChange={e => updateLicense(idx, 'issued', e.target.value)} required />
                    </div>
                    <div>
                      <Label>Expires</Label>
                      <Input type="date" value={lic.expires} onChange={e => updateLicense(idx, 'expires', e.target.value)} disabled={lic.noExpiry} required={!lic.noExpiry} />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input type="checkbox" checked={lic.noExpiry} onChange={e => updateLicense(idx, 'noExpiry', e.target.checked)} />
                      <Label>Does not expire</Label>
                    </div>
                    <div>
                      <Label>Document (File Upload)</Label>
                      <Input type="file" onChange={e => updateLicense(idx, 'document', e.target.files?.[0]?.name || '')} />
                      {lic.document && <span className="text-xs text-gray-500">{lic.document}</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={handleServicePrev}>Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}
          {serviceStep === 8 && (
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleServiceNext(); }}>
              <div className="flex justify-between items-center">
                <Label>Portfolio</Label>
                <Button type="button" onClick={addPortfolio}>Add Portfolio Item</Button>
              </div>
              {(serviceForm.portfolio || []).map((item, idx) => (
                <div key={idx} className="border p-4 rounded mb-2 relative">
                  <Button type="button" variant="outline" className="absolute top-2 right-2" onClick={() => removePortfolio(idx)}>Remove</Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Label>Title</Label>
                      <Input value={item.title} onChange={e => updatePortfolio(idx, 'title', e.target.value)} required />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={item.description} onChange={e => updatePortfolio(idx, 'description', e.target.value)} required />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input type="date" value={item.date} onChange={e => updatePortfolio(idx, 'date', e.target.value)} required />
                    </div>
                    <div>
                      <Label>Images (Upload)</Label>
                      <Input type="file" multiple onChange={e => updatePortfolioImage(idx, e.target.files)} />
                      {item.images && item.images.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {item.images.map((img: any, i: any) => (
                            <img key={i} src={img} alt="Portfolio" className="w-16 h-16 object-cover rounded" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={handleServicePrev}>Back</Button>
                <Button type="submit">Continue</Button>
              </div>
            </form>
          )}
          {serviceStep === 9 && (
            <form className="space-y-4" onSubmit={handleServiceSubmit}>
              <div>
                <Label htmlFor="ministry">Ministry (auto-set)</Label>
                <Input id="ministry" name="ministry" value={serviceForm.ministry} readOnly />
              </div>
              <div>
                <Label htmlFor="assignedBy">Assigned By (user ID)</Label>
                <Input id="assignedBy" name="assignedBy" value={serviceForm.assignedBy} readOnly />
              </div>
              <div>
                <Label htmlFor="assignmentDate">Assignment Date</Label>
                <Input id="assignmentDate" name="assignmentDate" value={serviceForm.assignmentDate} readOnly />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <Input id="rating" name="rating" value={serviceForm.rating} onChange={handleServiceChange} type="number" min="0" max="5" step="0.1" />
              </div>
              <div>
                <Label htmlFor="average">Average</Label>
                <Input id="average" name="average" value={serviceForm.average} onChange={handleServiceChange} type="number" min="0" max="5" step="0.1" />
              </div>
              <div>
                <Label htmlFor="note">Note</Label>
                <Textarea id="note" name="note" value={serviceForm.note} onChange={handleServiceChange} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" value={serviceForm.status} onChange={handleServiceChange} className="w-full border rounded bg-white px-3 py-2 text-sm">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
              <div>
                <Label htmlFor="isVerified">Is Verified</Label>
                <select id="isVerified" name="isVerified" value={serviceForm.isVerified ? 'true' : 'false'} onChange={e => setServiceForm(prev => ({ ...prev, isVerified: e.target.value === 'true' }))} className="w-full border rounded bg-white px-3 py-2 text-sm">
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={serviceForm.category} onChange={handleServiceChange} required />
              </div>
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={handleServicePrev}>Back</Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          )}
        </div>
      );
    }
    if (listingType === "property") {
      return (
        <div className="space-y-8">
          {/* General Information */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter a descriptive title" required />
              </div>
              <div>
                <Label htmlFor="propertyType text-sm" className="text-sm">Property Type</Label>
                <select id="propertyType" 
                 name="propertyType"
                  value={formData.propertyType} onChange={handleChange}
                  className="w-full border rounded bg-white px-3 py-2 text-sm" required>
                  <option value=""  className="text-sm font-medium">Select Property Type</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="listingType" className="text-sm font-medium">Property Status</Label>
                <select id="listingType" 
                name="listingType" 
                value={formData.listingType} 
                onChange={handleChange} 
                className="w-full border rounded bg-white px-3 py-2 text-sm" required>
                  <option value="">Select Status</option>
                  {PROPERTY_STATUS.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" value={formData.price} onChange={handleChange} placeholder="Enter price" required />
              </div>
              <div>
                <Label htmlFor="priceNegotiable" className="text-sm font-medium"> Price Negotiable</Label>
                <select id="priceNegotiable" 
                name="priceNegotiable"
                 value={formData.priceNegotiable ? "true" : "false"}
                  onChange={e => setFormData((prev: any) => ({ ...prev, priceNegotiable: e.target.value === "true" }))}
                  className="w-full border rounded bg-white px-3 py-2 text-sm">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <Label htmlFor="area">Area</Label>
                <Input id="area" name="area" value={formData.area} onChange={handleChange} placeholder="Enter area" required />
              </div>
              <div>
                <Label htmlFor="areaUnit">Area Unit</Label>
                <select id="priceNegotiable" name="priceNegotiable" 
                value={formData.areaUnit }
                 onChange={e => setFormData((prev: any) => ({ ...prev, areaUnit: e.target.value  }))}
                 className="w-full border rounded bg-white px-3 py-2 text-sm">
                  <option value="sqm">Sqm</option>
                  <option value="Sqft">sqft</option>
                </select>
                {/* <Input id="areaUnit" name="areaUnit" value={formData.areaUnit} onChange={handleChange} placeholder="sqm, sqft, etc." required /> */}
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Provide a detailed description" required />
              </div>
            </div>
          </div>
          {/* Location Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Location Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter full address" required />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Enter city" required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="state">State</Label>
                <select id="state" name="state"
                 value={formData.state} onChange={handleChange}
                  required className="w-full border rounded bg-white px-3 py-2 text-sm">
                  <option value="">Select State</option>
                  {NIGERIA_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Property Details */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Number of bedrooms" type="number" min="0" required />
              </div>
              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Number of bathrooms" type="number" min="0" required />
              </div>
              <div>
                <Label htmlFor="toilets">Toilets</Label>
                <Input id="toilets" name="toilets" value={formData.toilets} onChange={handleChange} placeholder="Number of toilets" type="number" min="0" required />
              </div>
              <div>
                <Label htmlFor="kitchens">Kitchens</Label>
                <Input id="kitchens" name="kitchens" value={formData.kitchens} onChange={handleChange} placeholder="Number of kitchens" type="number" min="0" />
              </div>
              <div>
                <Label htmlFor="floors">Floors</Label>
                <Input id="floors" name="floors" value={formData.floors} onChange={handleChange} placeholder="Number of floors" type="number" min="0" />
              </div>
              <div>
                <Label htmlFor="parking">Parking</Label>
                <Input id="parking" name="parking" value={formData.parking} onChange={handleChange} placeholder="Number of parking spaces" type="number" min="0" />
              </div>
            </div>
          </div>
          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="condition">Property Condition</Label>
                <select id="condition"
                 name="condition" value={formData.condition} onChange={handleChange}
                  required className="w-full border rounded bg-white px-3 py-2 text-sm">
                  <option value="">Select Condition</option>
                  {PROPERTY_CONDITION.map((cond) => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="furnishing">Furnishing</Label>
                <select id="furnishing" name="furnishing" 
                value={formData.furnishing} onChange={handleChange} required 
                className="w-full border rounded bg-white px-3 py-2 text-sm">
                  <option value="">Select Furnishing</option>
                  {FURNISHING_TYPES.map((furn) => (
                    <option key={furn} value={furn}>{furn}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="petsAllowed">Pets Allowed</Label>
                <select id="petsAllowed" name="petsAllowed"
                 value={formData.petsAllowed} onChange={handleChange}
                  required className="w-full border rounded bg-white px-3 py-2 text-sm">
                  <option value="">Select</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div>
                <Label htmlFor="maintenanceFee">Maintenance Fee</Label>
                <Input id="maintenanceFee" name="maintenanceFee" value={formData.maintenanceFee} onChange={handleChange} placeholder="Enter maintenance fee" />
              </div>
            </div>
          </div>
          {/* Amenities & Facilities */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Amenities & Facilities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {AMENITIES.map(({ key, label, icon: Icon }) => (
                <label key={key} className="flex items-center gap-2 p-2 
                rounded-lg border hover:border-green-400
                 transition cursor-pointer bg-white">
                  <input
                    type="checkbox"
                    name="amenities"
                    value={key}
                    checked={formData.amenities?.includes(key)}
                    onChange={handleAmenitiesChange}
                    className="accent-green-500"
                  />
                  <Icon className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    }
    if (listingType === "business") {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="legalname">Business Name</Label>
            <Input id="legalname" name="legalname" value={formData.legalname} onChange={handleChange} placeholder="Enter business name" required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <select id="industry" name="industry" value={formData.industry} onChange={handleChange} className="w-full border bg-white text-sm font-medium rounded px-2 py-2" required>
                <option value="">Select Industry</option>
                {BUSINESS_INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <select id="businessType" name="businessType" value={formData.businessType} onChange={handleChange} className="w-full border bg-white text-sm font-medium rounded px-2 py-2" required>
                <option value="">Select Business Type</option>
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Input id="businessAddress" name="businessAddress" value={formData.businessAddress} onChange={handleChange} placeholder="Enter business address" required />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="Enter location" required />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="state">State</Label>
              <select id="state" name="state" value={formData.state} onChange={handleChange} className="w-full border bg-white text-sm font-medium rounded px-2 py-2" required>
                <option value="">Select State</option>
                {NIGERIA_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="employeeCount">Employee Count</Label>
              <Input id="employeeCount" name="employeeCount" value={formData.employeeCount} onChange={handleChange} placeholder="Enter number of employees" required />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="registrationStatus">Registration Status</Label>
              <select id="registrationStatus" name="registrationStatus" value={formData.registrationStatus} onChange={handleChange} className="w-full border bg-white text-sm font-medium rounded px-2 py-2" required>
                <option value="">Select Status</option>
                {REGISTRATION_STATUS.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
          {formData.registrationStatus === "Registered" && (
            <>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="businessNumber">Business Number</Label>
                  <Input id="businessNumber" name="businessNumber" value={formData.businessNumber} onChange={handleChange} placeholder="Enter business registration number" required />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="businessTaxId">Tax ID</Label>
                  <Input id="businessTaxId" name="businessTaxId" value={formData.businessTaxId} onChange={handleChange} placeholder="Enter tax ID" required />
                </div>
              </div>
            </>
          )}
            <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="businessPhoneNumber">Date Of Incorporation</Label>
              <Input id="dateOfIncorporation" type="date" name="dateOfIncorporation" value={formData.dateOfIncorporation} onChange={handleChange} placeholder="Enter business date of incorporation" required />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="businessEmail">Email</Label>
              <Input id="businessEmail" name="businessEmail" type="email" value={formData.businessEmail} onChange={handleChange} placeholder="Enter business email" required />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="openingTime">Opening Time</Label>
              <select id="openingTime" name="openingTime" value={formData.openingTime} onChange={handleChange} className="w-full border bg-white text-sm font-medium rounded px-2 py-2" required>
                <option value="">Select Opening Time</option>
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="closingTime">Closing Time</Label>
              <select id="closingTime" name="closingTime" value={formData.closingTime} onChange={handleChange} className="w-full border bg-white text-sm font-medium rounded px-2 py-2" required>
                <option value="">Select Closing Time</option>
                {TIME_OPTIONS.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="businessPhoneNumber">Phone Number</Label>
              <Input id="businessPhoneNumber" name="businessPhoneNumber" value={formData.businessPhoneNumber} onChange={handleChange} placeholder="Enter business phone number" required />
            </div>
         
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessDescription">Business Description</Label>
            <Textarea id="businessDescription" name="businessDescription" value={formData.businessDescription} onChange={handleChange} placeholder="Provide a detailed business description" required />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="businessWebsite">Website</Label>
              <Input id="businessWebsite" name="businessWebsite" value={formData.businessWebsite} onChange={handleChange} placeholder="Enter website URL" />
            </div>
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="legalDocument">Legal Document URL</Label>
            <Input id="legalDocument" name="legalDocument" value={formData.legalDocument} onChange={handleChange} placeholder="Enter legal document URL" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessProfilePicture">Profile Picture URL</Label>
            <Input id="businessProfilePicture" name="businessProfilePicture" value={formData.businessProfilePicture} onChange={handleChange} placeholder="Enter profile picture URL" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessLogo">Logo URL</Label>
            <Input id="businessLogo" name="businessLogo" value={formData.businessLogo} onChange={handleChange} placeholder="Enter logo URL" required />
          </div> */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="businessFacebook">Facebook URL</Label>
              <Input id="businessFacebook"
               name="businessFacebook" value={formData.businessFacebook}
                onChange={handleChange} placeholder="Enter Facebook URL" />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="businessTwitter">Twitter URL</Label>
              <Input id="businessTwitter" name="businessTwitter" value={formData.businessTwitter} onChange={handleChange} placeholder="Enter Twitter URL" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="businessInstagram">Instagram URL</Label>
              <Input id="businessInstagram" name="businessInstagram" value={formData.businessInstagram} onChange={handleChange} placeholder="Enter Instagram URL" />
            </div>
            <div className="flex-1 space-y-2">
              <Label htmlFor="businessLinkedIn">LinkedIn URL</Label>
              <Input id="businessLinkedIn" name="businessLinkedIn" value={formData.businessLinkedIn} onChange={handleChange} placeholder="Enter LinkedIn URL" />
            </div>
          </div>
        
        </div>
      )
    }
    return null
  }

  // Handle amenities checkbox change
  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev: any) => {
      const amenities = prev.amenities || [];
      if (checked) {
        return { ...prev, amenities: [...amenities, value] };
      } else {
        return { ...prev, amenities: amenities.filter((a: string) => a !== value) };
      }
    });
  };

  // Place this at the top level of AddListingPage, after all useState declarations
  useEffect(() => {
    if (listingType === "service") {
      setServiceForm(prev => ({
        ...prev,
        ministry: prev.ministry || "Ministry of Commerce", // Example default
        assignedBy: prev.assignedBy || "agent123", // Example user ID
        assignmentDate: prev.assignmentDate || new Date().toISOString().slice(0, 10),
      }));
    }
  // eslint-disable-next-line
  }, [listingType]);

  return (
    <>
      <Toaster position="top-right" closeButton={true}  />
      <div className="p-6 max-w-3xl mx-auto">
      <Alert className="mb-4" style={{background:'#FCF4EF'}}>
        <label className="text-sm"> <b>NOTE: </b>⚠️ Ensure you're certified under
         the category of listings you're about to make. Example to make a product listing, you must have a PRODUCT certification.</label>
      </Alert>

        <h1 className="text-2xl font-bold mb-6">Add New Listing</h1>
        {/* Stepper */}
        <div className="flex items-center mb-8">
          {steps.map((label, idx) => (
            <div key={label} className="flex items-center w-full">
              <div className={`rounded-full border-2 flex items-center justify-center w-8 h-8 text-lg font-semibold z-10 ${step === idx + 1 ? 'bg-green-500 text-white border-green-500' : 'bg-white border-gray-300 text-gray-400'}`}>{idx + 1}</div>
              {idx < steps.length - 1 && <div className={`flex-1 h-1 ${step > idx + 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Listing Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {LISTING_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      type="button"
                      key={type.key}
                      className={`flex flex-col items-center border rounded-lg p-4 transition-all ${listingType === type.key ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:border-green-400'}`}
                      onClick={() => setListingType(type.key)}
                    >
                      <Icon className="w-8 h-8 mb-2" />
                      <span className="font-medium text-sm text-black">{type.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Basic Information</h2>
              <form className="space-y-4" onSubmit={handleContinue}>
                {renderFields()}
                <div className="flex gap-4 mt-6">
                  <Button type="submit">Continue</Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/dashboard/my-listings")}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 2: Contact Details and Images */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-6">Contact Details & Images</h2>
            <form className="space-y-6" onSubmit={handleContinue}>
             { listingType !== "business" && <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    name="contact.name"
                    value={formData.contact.name}
                    onChange={(e) => setFormData((prev: any) => ({
                      ...prev,
                      contact: { ...prev.contact, name: e.target.value }
                    }))}
                    placeholder="Enter contact name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contact.email"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData((prev: any) => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value }
                    }))}
                    placeholder="Enter contact email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contact.phoneNumber"
                    value={formData.contact.phoneNumber}
                    onChange={(e) => setFormData((prev: any) => ({
                      ...prev,
                      contact: { ...prev.contact, phoneNumber: e.target.value }
                    }))}
                    placeholder="Enter contact phone number"
                    required
                  />
                </div>
              </div> }

              {
                listingType === "product" && (
                 
                    <IKContext 
                      urlEndpoint={urlEndpoint}
                      publicKey={publicKey}
                      authenticator={authenticator}
                    > 
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label>Product Image</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <IKUpload
                            id="product-image"
                            className="hidden"
                            multiple={false}
                            onChange={handleProductImageUpload}
                            validateFile={(file:any) => file.size < 2000000}
                            onUploadProgress={onProductImageUploadProgress}
                            folder={"/benue-government-properties-web/products/images"}
                            fileName="product-image.png"
                            onError={onProductImageError}
                            onSuccess={onProductImageSuccess}
                            />
                              <label
                                onClick={() => formData.productImages.length < 6 ? document.getElementById("product-image")?.click() : alert("You can only upload 6 images")}
                                className="cursor-pointer flex flex-col items-center"
                              >
                                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">Upload Product Image</p>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                              </label>
                        </div>
                        {productImageUploading && 
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      }
                      {formData.productImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          {formData.productImages.map((image: string, index: number) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      </div>
                       </div>
                    </IKContext>
                   
                )
              }

              {/* Business-specific uploads */}
              {listingType === "business" && (
                <IKContext
                urlEndpoint={urlEndpoint}
                publicKey={publicKey}
                authenticator={authenticator}
              >
                 <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Business Profile Picture</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <IKUpload
                        id="business-profile"
                        className="hidden"
                        multiple={false}
                        onChange={handleProfileImageUpload}
                        validateFile={(file:any) => file.size < 2000000}
                        onUploadProgress={onIdeedsUploadProgress}
                        folder={"/benue-government-properties-web/business/profile"}
                        fileName="business-profile.png"
                        onError={onbusinessProfileError}
                        onSuccess={onbusinessProfileSuccess}
                      />
                      <label
                        onClick={() => formData.businessProfilePicture.length === 0 ? document.getElementById("business-profile")?.click() : alert("You can only upload one image")}
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Upload Business Profile Picture</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                      </label>
                    </div>
                    {businessProfilePictureUploading && 
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  }
                    {formData.businessProfilePicture.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                   
                        <div  className="relative">
                          <img
                            src={formData.businessProfilePicture}
                            alt={`Upload `}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                   
                    </div>
                  )}
                  </div>

                  <div className="space-y-4">
                    <Label>Business Logo</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <IKUpload
                        id="business-logo"
                        className="hidden"
                        multiple={false}
                        onChange={handleLogoImageUpload}
                        validateFile={(file:any) => file.size < 2000000}
                        onUploadProgress={onIdeedsUploadProgress}
                        folder={"/benue-government-properties-web/business/logo"}
                        fileName="business-logo.png"
                        onError={onbusinessLogoError}
                        onSuccess={onbusinessLogoSuccess}
                      />
                      <label
                        onClick={() => formData.businessLogo.length === 0 ? document.getElementById("business-logo")?.click() : alert("You can only upload one image")}
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Upload Business Logo</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                      </label>
                    </div>
                    {businessLogoUploading && 
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  }
                    {formData.businessLogo.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                    
                        <div  className="relative">
                          <img
                            src={formData.businessLogo}
                            alt={`Upload `}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
               
                    </div>
                  )}
                  </div>

                  <div className="space-y-4">
                    <Label>Legal CAC Documents</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <IKUpload
                        id="business-cac"
                        className="hidden"
                        multiple={false}
                        onChange={handleCacImageUpload}
                        validateFile={(file:any) => file.size < 2000000}
                        onUploadProgress={onIdeedsUploadProgress}
                        folder={"/benue-government-properties-web/business/documents"}
                        fileName="cac-document.png"
                        onError={onbusinessCacError}
                        onSuccess={onbusinessCacSuccess}
                      />
                      <label
                        onClick={() => formData.legalDocument.length === 0 ? document.getElementById("business-cac")?.click() : alert("You can only upload one image")}
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Upload CAC Documents</p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG up to 2MB</p>
                      </label>
                    </div>
                    {legalDocumentUploading && 
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  }
                    {formData.legalDocument.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                    
                        <div  className="relative">
                          <img
                            src={formData.legalDocument}
                            alt={`Upload `}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                
                    </div>
                  )}
                  </div>
                </div>

              </IKContext>
               
              )}

               {listingType === "property" && <IKContext
                urlEndpoint={urlEndpoint}
                publicKey={publicKey}
                authenticator={authenticator}
              >
                <div className="space-y-4">
                  <Label>Upload Property Photos</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <IKUpload
                      id="property-images"
                      className="hidden"
                      multiple={false}
                      onChange={handleImageUpload}
                      validateFile={(file:any) => file.size < 2000000}
                      onUploadProgress={onIdeedsUploadProgress}
                      folder={"/benue-government-properties-web/images"}
                      fileName="test-upload.png"
                      onError={onIdeedsError}
                      onSuccess={onIdeedsSuccess}
                    />
                    <label
                      onClick={() => document.getElementById("property-images")?.click()}
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                  {iuploading && 
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  }
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {formData.images.map((image: string, index: number) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </IKContext> 
}

{listingType === "service" &&   <IKContext
                urlEndpoint={urlEndpoint}
                publicKey={publicKey}
                authenticator={authenticator}
              ><div className="space-y-4">
  <Label>Upload Service Photos</Label>
  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
    <IKUpload
      id="service-images"
      className="hidden"
      multiple={false}
      onChange={handleServiceImageUpload}
      validateFile={(file:any) => file.size < 2000000}
      onUploadProgress={onServiceImageUploadProgress}
      folder={"/benue-government-properties-web/images"}
      fileName="test-upload.png"
      onError={onServiceImageError}
      onSuccess={onServiceImageSuccess}
    />
    <label
      onClick={() => document.getElementById("service-images")?.click()}
      className="cursor-pointer flex flex-col items-center"
    >
      <Upload className="w-12 h-12 text-gray-400 mb-2" />
      <p className="text-sm text-gray-600">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-gray-500">
        PNG, JPG, GIF up to 10MB
      </p>
    </label>
    
  </div>
  {serviceImageUploading && 
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  }
                  {formData.featuredImage.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {formData.featuredImage.map((image: string, index: number) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
  </div>
</IKContext>
}
              <div className="flex gap-4 mt-6">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleSubmit} disabled={false} type="button">{loading ? "Registering....":"Register Listing"}</Button>
              </div>
            </form>

          </div>
        )}

        {/* Step 3: Success Message */}
        {step === 3 && (
          <div className="flex flex-col ml-10  min-h-[60vh] text-center">
            <div className="max-w-md mr-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Listing Created Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your listing has been created and is now pending approval.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/dashboard/my-listings")}>
                  View My Listings
                </Button>
                <Button variant="outline" onClick={() => {
                  setStep(1);
                  setFormData(INITIAL_FORM);
                }}>
                  Create Another Listing
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      </>
  )
}
