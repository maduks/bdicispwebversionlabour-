"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";
import { useCredoPayment } from "react-credo";
import { useApi } from "@/context/ApiContext";
//import ImageDocumentUploadStepper from "@/components/ImageKit/image-document-upload-stepper";
import { NIGERIA_STATES } from "@/lib/nigeria-states";
import { User, Briefcase, Building, CheckCircle, BookOpen, ShieldCheck, Image as ImageIcon, Mail, Phone, Calendar, MapPin, KeyRound, Loader } from "lucide-react";
import { getCookie } from "cookies-next";
import { toast } from "sonner";

const ImageDocumentUploadStepper = dynamic(() => import("@/components/ImageKit/image-document-upload-stepper"), { ssr: false });



const specializationOptions = ["Professional", "Artisan", "Trader", "General Services"];
const educationLevels = [
  "No Formal Education",
  "Primary School Leaving Certificate",
  "Junior Secondary School Certificate",
  "Senior Secondary School Certificate (SSCE/WAEC/NECO)",
  "National Diploma (ND/OND)",
  "NCE (Nigeria Certificate in Education)",
  "Higher National Diploma (HND)",
  "Bachelor's Degree (BSc/BA/BEd/etc)",
  "Postgraduate Diploma (PGD)",
  "Master's Degree (MSc/MA/MEd/etc)",
  "Doctorate (PhD)",
  "Other"
];
const steps = [
  "Basic Info",
  "Professional Info",
  "Business Info",
  "Service Details",
  "KYC & Licenses",
  "Portfolio",
  "Review & Submit"
];
const STORAGE_KEY = "serviceProviderRegForm";
const STEP_KEY = "serviceProviderRegStep";

// Helper: Jaccard similarity for name matching
function isNameMatchAboveThreshold(userName: string, bankName: string, threshold: number = 0.7): boolean {
  if (!userName || !bankName) return false;
  // Normalize: uppercase, remove extra spaces, split into tokens
  const userTokens = userName.toUpperCase().replace(/[^A-Z ]/g, '').split(/\s+/).filter(Boolean);
  const bankTokens = bankName.toUpperCase().replace(/[^A-Z ]/g, '').split(/\s+/).filter(Boolean);
  if (userTokens.length === 0 || bankTokens.length === 0) return false;
  // Jaccard similarity
  const setA = new Set(userTokens);
  const setB = new Set(bankTokens);
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  const similarity = Math.round(intersection.size / union.size);
  console.error(similarity)
  return similarity >= threshold;
}

// Helper: Find LGA for a given ward
function findLGAForWard(stateName: string, wardName: string): string | null {
  const state = NIGERIA_STATES.find((s: any) => s.name === stateName);
  if (!state) return null;
  
  for (const lga of state.lgas) {
    const ward = lga.wards.find((w: any) => w.name === wardName);
    if (ward) {
      return lga.name;
    }
  }
  return null;
}

export default function ServiceProviderRegistrationPage() {
  const [step, setStep] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem(STEP_KEY);
      if (savedStep) return parseInt(savedStep, 10);
    }
    return 0;
  });
  const [form, setForm] = useState<any>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    }
    return {
      user: {
        fullName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        password: "",
      },
      address: {
        street: "",
        city: "",
        state: "",
        ward: "",
      },
      category: "", // <-- add category here
      profession: "",
      specialization: "",
      skills: [],
      yearsOfExperience: "",
      serviceDescription: "",
      businessName: "",
      businessRegistrationNumber: "",
      serviceAreas: [],
      availability: "Available",
      operatingHours: {
        weekdays: { from: "", to: "" },
        weekends: { from: "", to: "" },
      },
      licenses: [
        {
          name: "",
          number: "",
          authority: "",
          issued: "",
          expires: "",
          document: "",
        },
      ],
      kyc: {
        nin: "",
        bankAccountNumber: "",
        bankName: "",
        accountName: "",
        dob: "",
        religion: "",
        photo: "",
      },
      isVerified: true,
      portfolio: [
        {
          title: "",
          description: "",
          images: [],
          date: "",
        },
      ],
      status: "Active",
      educationLevel: "",
    };
  });
  const [formErrors, setFormErrors] = useState<any>({});
  const [registering, setRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const lgaOptions = selectedState ? (NIGERIA_STATES.find((s: any) => s.name === selectedState)?.lgas || []) : [];
  const wardOptions = selectedLGA ? (lgaOptions.find((l: any) => l.name === selectedLGA)?.wards || []) : [];
  const { registerServiceProvider } = useApi();
  const api = useApi();
  const {getUserKyc} = useApi();
  const [banks, setBanks] = useState<any[]>([]);
  const [accountNameLoading, setAccountNameLoading] = useState(false);
  const [accountNameError, setAccountNameError] = useState("");
  const [isKycVerified, setIsKycVerified] = useState(false);
  
  // Service categories from API
  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch service categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await api.getServiceCategories();
        if (response?.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching service categories:", error);
        // Fallback to dummy categories if API fails
        setCategories([
          { name: "Health", subCategories: ["Doctor", "Nurse", "Pharmacist"] },
          { name: "Legal", subCategories: ["Lawyer"] },
          { name: "Education", subCategories: ["Teacher", "Lecturer"] },
          { name: "IT", subCategories: ["IT Specialist", "Consultant"] },
          { name: "Other", subCategories: ["Other"] },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [api]);

  // When category changes, update subCategories and reset profession
  useEffect(() => {
    const cat = categories.find((c) => c.name === category);
    if (cat && cat.subCategories) {
      setSubCategories(cat.subCategories);
    } else {
      setSubCategories([]);
    }
    setForm((f: any) => ({ ...f, profession: "" }));
  }, [category, categories]);

  // Persist form and step to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }
  }, [form]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STEP_KEY, String(step));
    }
  }, [step]);
  useEffect(() => {
    if (registrationSuccess && typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STEP_KEY);
    }
  }, [registrationSuccess]);

  useEffect( ()=> {
    // On mount, set user fields from cookie
    const userCookie = getCookie('user');
    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie as string);
        setForm((prev: any) => ({
          ...prev,
          user: {
            ...prev.user,
            fullName: userData?.data?.fullName || "",
            email: userData?.data?.email || "",
            phoneNumber: userData?.data?.phoneNumber || "",
            password: userData?.data?.password || "",
          },
        }));
        // Check if user is KYC verified and fetch KYC data
        console.log("User data:", userData?.data);
        console.log("Is KYC verified:", userData?.data?.isKYCVerified);
        console.log("User ID:", userData?.data?._id);
        
        if (userData?.data?.isKYCVerified && userData?.data?._id) {
          console.log("Fetching KYC data for user:", userData.data._id);
          setIsKycVerified(true);
           getUserKyc(userData.data._id)
            .then((response) => {
              console.log("KYC API response:", response);
              if (response) {
                const kycData = response;
                console.log("KYC data:", kycData);
                console.log("KYC lga:", kycData?.lga);
                console.log("KYC community:", kycData?.community);
                
                // Try to find the correct LGA for the ward if the data seems swapped
                let correctLGA = kycData?.lga;
                let correctWard = kycData?.community;
                
                // If the "lga" field contains a ward name, find the correct LGA
                if (kycData?.lga && kycData?.state) {
                  const foundLGA = findLGAForWard(kycData.state, kycData.lga);
                  if (foundLGA) {
                    console.log("Found correct LGA for ward:", foundLGA);
                    correctLGA = foundLGA;
                    correctWard = kycData.lga; // The original "lga" was actually the ward
                  }
                }
                
                setForm((prev: any) => ({
                  ...prev,
                  kyc: {
                    ...prev.kyc,
                    nin: kycData?.nin || "",
                    bankAccountNumber: kycData?.bankAccountNumber || "",
                    bankName: kycData?.bankName || "",
                    accountName: kycData?.accountName || "",
                    dob: kycData?.dateOfBirth || "",
                    religion: kycData?.religion.charAt(0).toUpperCase() + kycData?.religion.slice(1) || "",
                    photo: kycData?.photo || "",
                  },
                  address: {
                    ...prev.address,
                    state: kycData?.state || "",
                    city: correctLGA || "",
                    ward: correctWard || "",
                  }
                }));
                // Set selected state for LGA dropdown
                if (kycData?.state) {
                  setSelectedState(kycData?.state);
                }
                if (correctLGA) {
                  setSelectedLGA(correctLGA);
                }
              }
            })
            .catch((error) => {
              console.error("Error fetching KYC data:", error);
            });
        }
      } catch {}
    }
    // Fetch banks
    api.getBankList().then(setBanks).catch(() => setBanks([]));
  }, [api]);

  // Ensure selectedState is synchronized with form.address.state
  useEffect(() => {
    if (form.address.state && form.address.state !== selectedState) {
      setSelectedState(form.address.state);
    }
  }, [form.address.state, selectedState]);

  const [kycStatusChecked, setKycStatusChecked] = useState(false);
  const [userKycVerified, setUserKycVerified] = useState(true);

  useEffect(() => {
    if (step === 0 && typeof window !== 'undefined') {
      const userCookie = getCookie('user');
      let isVerified = true;
      try {
        if (userCookie && typeof userCookie === 'string' && userCookie !== 'undefined') {
          const userData = JSON.parse(userCookie);
          isVerified = !!userData?.data?.isKYCVerified;
        }
      } catch (e) {
        console.error('Error parsing user cookie:', e);
        isVerified = true;
      }
      setUserKycVerified(isVerified);
      setKycStatusChecked(true);
    }
  }, [step]);



  // Validation logic for each step
  function validateStep(stepIdx: number) {
    const errors: any = {};
    // Step 0: Basic Info
    if (stepIdx === 0) {
      if (!form.user.fullName || form.user.fullName.trim().length < 2) errors.fullName = "Full name is required.";
      if (!form.user.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.user.email)) errors.email = "Valid email is required.";
      if (!form.user.phoneNumber || form.user.phoneNumber.length < 7) errors.phoneNumber = "Valid phone number is required.";
      if (!form.user.password || form.user.password.length < 6) errors.password = "Password must be at least 6 characters.";
      if (!form.address.street) errors.street = "Street is required.";
      if (!form.address.city) errors.city = "City is required.";
      if (!form.address.state) errors.state = "State is required.";

      if (!form.user.gender) errors.gender = "Gender is required.";
    }
    // Step 1: Professional Info
    if (stepIdx === 1) {
      if (!form.profession) errors.profession = "Profession is required.";
      if (!form.specialization) errors.specialization = "Specialization is required.";
      if (!form.skills || form.skills.length === 0 || !form.skills[0]) errors.skills = "At least one skill is required.";
      if (!form.yearsOfExperience || isNaN(Number(form.yearsOfExperience)) || Number(form.yearsOfExperience) < 0) errors.yearsOfExperience = "Years of experience must be 0 or more.";
      if (!form.serviceDescription) errors.serviceDescription = "Service description is required.";
      if (!form.educationLevel) errors.educationLevel = "Level of education is required.";
    }
    // Step 2: Business Info
    if (stepIdx === 2) {
      if ((form.businessName && !form.businessRegistrationNumber) || (!form.businessName && form.businessRegistrationNumber)) {
        errors.business = "Both business name and registration number are required if one is filled.";
      }
    }
    // Step 3: Service Details
    if (stepIdx === 3) {
      if (!form.serviceAreas || form.serviceAreas.length === 0 || !form.serviceAreas[0]) errors.serviceAreas = "At least one service area is required.";
      if (!form.availability) errors.availability = "Availability is required.";
      if (!form.operatingHours.weekdays.from || !form.operatingHours.weekdays.to) errors.weekdays = "Weekday hours required.";
      if (!form.operatingHours.weekends.from || !form.operatingHours.weekends.to) errors.weekends = "Weekend hours required.";
    }
    // Step 4: KYC
    if (stepIdx === 4) {
      if (!form.kyc.bankName) errors.bankName = "Bank name is required.";
      if (!form.kyc.bankAccountNumber) errors.bankAccountNumber = "Bank account number is required.";
      if (!form.kyc.accountName) errors.accountName = "Account name is required.";
      if (!form.kyc.nin) errors.nin = "NIN is required.";
      if (!form.kyc.dob) errors.dateOfBirth = "Date of birth is required.";
      if (!form.kyc.religion) errors.religion = "Religion is required.";
      if(!form.kyc.photo) errors.photo = "Photo is required.";
    }
    return errors;
  }

  // Navigation handlers with validation
  const nextStep = () => {
    const errors = validateStep(step);
    
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  function generateRandomAlphanumeric(length:number) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const transRef = generateRandomAlphanumeric(10);
   // Configuration for Credo payment gateway
   const config = {
   // key: "1PUB3466GESC81RMcR0KnKwA7sG3PIs8At4Hl2'
    key: "1PUB3466GESC81RMcR0KnKwA7sG3PIs8At4Hl2",
    customerFirstName: "userData.fullName",
    email: "userData.email@gmail.com",
    amount: 5900,
    currency: "NGN",
    channels: ['card', 'bank'],
    bearer: 0,
    reference: transRef,
    customerPhoneNumber: "08076767890",
    callbackUrl: typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?payment=true&reference=${transRef}` : '',
    onClose: () => {
      console.log("Credo Widget Closed");
    },
    
    callBack: async(response:any) => {
     //alert("Credo Payment Response:"+ JSON.stringify(response));

      if(response.errorMessage && response.errorMessage==="The authorization process was canceled or didn't complete successfully"){
        return alert("Payment was canceled or didn't complete successfully");
      }
      else{
        setPaymentProcessed(true);
        processRegistration(response);
      }
     
     // window.location.href = response.callbackUrl;
    },
  };

  // Initialize Credo payment hook with client-side check
  const credoPayment = typeof window !== 'undefined' ? useCredoPayment(config) : null;



  const processRegistration = async(response:any)=>{
    setRegistering(true);
    try {
      if(response){
        toast.success("Payment successful, please wait while we process your registration");

      form.gatewayReference=response.reference;
      form.paymentStatus=response.status === 0 ?"successful":"failed";
      form.paymentMethod ="online"
      form.paymentReference= response.transRef;
      form.registrationFee =59.88
      }

       await registerServiceProvider(form).then((res: any) => {
        setTimeout(() => {
          setRegistrationSuccess(true);
          setRegistering(false);
        }, 1000);
      }).catch((err: any) => {
        setRegistering(false);
        alert("Registration failed. Please try again."+ JSON.stringify(err));
        console.error(err)
      });
    } catch (e) {
      alert("Registration failed. Please try again."+ JSON.stringify(e));
      setRegistering(false);
    }
    
  }
  // On submit, validate all steps
  const handleSubmit = async () => {
    
 
    let errors: any = {};
    for (let i = 0; i < steps.length - 1; i++) {
      errors = { ...errors, ...validateStep(i) };
    }
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return alert("Go back to fix errors: "+ Object.keys(errors)+" Is required");
    if(!paymentProcessed){
      if (credoPayment) {
        credoPayment()
      } else {
        alert("Payment system not available. Please try again.");
      }
    }
    else{
      processRegistration(null);
    }

   
    
   

    //   setRegistering(true);
    // try {
    //    await registerServiceProvider(form).then((res: any) => {
    //     setTimeout(() => {
    //       setRegistrationSuccess(true);
    //       setRegistering(false);
    //     }, 1000);
    //   }).catch((err: any) => {
    //     setRegistering(false);
    //     alert("Registration failed. Please try again.");
    //     console.error(err)
    //   });
    // } catch (e) {
    //   alert("Registration failed. Please try again.");
    //   setRegistering(false);
    // }
  
  };

  // Add this function to validate account number and bank
  const validateAccountName = async () => {
    setAccountNameError("");
    let selectedBank = banks.find(b=>b.name===form.kyc.bankName)
    if (form.kyc.bankAccountNumber && form.kyc.bankName) {
      setAccountNameLoading(true);
      try {
        const res = await api.validateAccountNumber(form.kyc.bankAccountNumber, selectedBank.uuid);
        const name = res?.data?.destinationAccountHolderNameAtBank;
        if (name) {
          // Integrate name match check
          const userName = form.user.fullName;
          if (isNameMatchAboveThreshold(userName, name)) {
            setForm((f: any) => ({ ...f, kyc: { ...f.kyc, accountName: name } }));
          } else {
            setForm((f: any) => ({ ...f, kyc: { ...f.kyc, accountName: name } }));
            setAccountNameError("Account name does not sufficiently match your full name");
            //setForm((f: any) => ({ ...f, kyc: { ...f.kyc, accountName: "" } }));
          }
        } else {
          setAccountNameError("Account not found or invalid");
          setForm((f: any) => ({ ...f, kyc: { ...f.kyc, accountName: "" } }));
        }
      } catch (e) {
        //setAccountNameError("Validation failed");
        setForm((f: any) => ({ ...f, kyc: { ...f.kyc, accountName: "" } }));
      } finally {
        setAccountNameLoading(false);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4">
            {!userKycVerified && kycStatusChecked && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4 font-semibold">
                You must complete your KYC verification before registering as a service provider. <br />
                <a href="/dashboard/kycverification" className="underline text-yellow-900">Go to KYC Verification</a>
              </div>
            )}
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-2">
              <div>
                <Label>Full Name</Label>
                <Input value={form.user.fullName} onChange={e => 
                  setForm((f: any) => ({ ...f, user: { ...f.user, fullName: e.target.value } }))
                  } disabled />
                {formErrors.fullName && <div className="text-red-600 text-xs mt-1">{formErrors.fullName}</div>}
              </div>
              <div style={{display: 'none'}}>
                <Label>Password</Label>
                <Input type="password" value={form.user.password} onChange={e => setForm((f: any) => ({ ...f, user: { ...f.user, password: e.target.value } }))} disabled />
                {formErrors.password && <div className="text-red-600 text-xs mt-1">{formErrors.password}</div>}
              </div>
              <div>
                <Label>Email</Label>
                <Input value={form.user.email} onChange={e => setForm((f: any) => ({ ...f, user: { ...f.user, email: e.target.value } }))} disabled />
                {formErrors.email && <div className="text-red-600 text-xs mt-1">{formErrors.email}</div>}
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={form.user.phoneNumber} onChange={e => setForm((f: any) => ({ ...f, user: { ...f.user, phoneNumber: e.target.value } }))} disabled />
                {formErrors.phoneNumber && <div className="text-red-600 text-xs mt-1">{formErrors.phoneNumber}</div>}
              </div>
           
              <div>
                <Label>State</Label>
                <select className="w-full border rounded px-3 py-2 bg-white" value={selectedState} onChange={e => {
                  setSelectedState(e.target.value);
                  setSelectedLGA("");
                  setForm((f: any) => ({ ...f, address: { ...f.address, state: e.target.value, city: "", ward: f.address.ward } }));
                }} disabled={isKycVerified}>
                  <option value="">Select State</option>
                  {NIGERIA_STATES.map((s: any) => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
                {formErrors.state && <div className="text-red-600 text-xs mt-1">{formErrors.state}</div>}
              </div>
              <div>
                <Label>Local Government </Label>
                <select className="w-full border rounded px-3 py-2 bg-white" value={form.address.city || selectedLGA} onChange={e => {
                  setSelectedLGA(e.target.value);
                  setForm((f: any) => ({ ...f, address: { ...f.address, city: e.target.value } }));
                }} disabled={isKycVerified}>
                  <option value="">Select LGA</option>
                  {lgaOptions.map((lga: any) => <option key={lga.name} value={lga.name}>{lga.name}</option>)}
                </select>
                {/* Debug info */}
                <div className="text-xs text-gray-500 mt-1">
                </div>
                {formErrors.city && <div className="text-red-600 text-xs mt-1">{formErrors.city}</div>}
              </div>
              <div>
                <Label>Ward</Label>
                <select className="w-full border rounded px-3 py-2 bg-white" value={form.address.ward || ""} onChange={e => setForm((f: any) => ({ ...f, address: { ...f.address, ward: e.target.value } }))} disabled={isKycVerified}>
                  <option value="">Select Ward</option>
                  {wardOptions.map((w: any) => {
                    const wardName = typeof w === "string" ? w : w.name;
                    return <option key={wardName} value={wardName}>{wardName}</option>;
                  })}
                </select>
              </div>
              <div>
                <Label>Street</Label>
                <Input value={form.address.street} onChange={e => setForm((f: any) => ({ ...f, address: { ...f.address, street: e.target.value } }))} />
                {formErrors.street && <div className="text-red-600 text-xs mt-1">{formErrors.street}</div>}
              </div>
              <div>
                <Label>Gender</Label>
                <select className="w-full border rounded px-3 py-2 bg-white" value={form.user.gender} onChange={e => setForm((f: any) => ({ ...f, user: { ...f.user, gender: e.target.value } }))}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {formErrors.gender && <div className="text-red-600 text-xs mt-1">{formErrors.gender}</div>}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-4 mb-4">
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-2">
              <div className="mb-4">
                <label className="block mb-1 font-medium">Category <span className="text-red-500">*</span></label>
                <select
                  className="w-full border rounded px-3 py-2 bg-white"
                  value={category}
                  onChange={e => {
                    setCategory(e.target.value);
                    setForm((f: any) => ({ ...f, category: e.target.value }));
                  }}
                  required
                  disabled={loadingCategories}
                >
                  <option value="">
                    {loadingCategories ? "Loading categories..." : "Select category"}
                  </option>
                  {!loadingCategories && categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Profession <span className="text-red-500">*</span></label>
                <select
                  className="w-full border rounded px-3 py-2 bg-white"
                  value={form.profession}
                  onChange={e => setForm((f: any) => ({ ...f, profession: e.target.value }))}
                  required
                  disabled={!category}
                >
                  <option value="">
                    {!category 
                      ? "Select a category first" 
                      : subCategories.length === 0 
                        ? "No professions available" 
                        : "Select profession"
                    }
                  </option>
                  {subCategories.map((sub: any, idx: number) => (
                    <option key={idx} value={typeof sub === 'string' ? sub : sub.name}>
                      {typeof sub === 'string' ? sub : sub.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <Label>Specialization</Label>
                <select className="w-full border rounded px-3 py-2 bg-white" value={form.specialization} onChange={e => setForm((f: any) => ({ ...f, specialization: e.target.value }))}>
                  <option value="">Select Specialization</option>
                  {specializationOptions.map((opt: string) => <option key={opt}>{opt}</option>)}
                </select>
                {formErrors.specialization && <div className="text-red-600 text-xs mt-1">{formErrors.specialization}</div>}
              </div>
              <div className="mb-2">
                <Label>Skills (comma or space separated)</Label>
                <Input value={form.skills.join(", ")} onChange={e => setForm((f: any) => ({ ...f, skills: e.target.value.split(/[ ,]+/).map((s: string) => s.trim()).filter(Boolean) }))} />
                {formErrors.skills && <div className="text-red-600 text-xs mt-1">{formErrors.skills}</div>}
              </div>
              <div className="mb-2">
                <Label>Years of Experience</Label>
                <Input type="number" value={form.yearsOfExperience} onChange={e => setForm((f: any) => ({ ...f, yearsOfExperience: e.target.value }))} />
                {formErrors.yearsOfExperience && <div className="text-red-600 text-xs mt-1">{formErrors.yearsOfExperience}</div>}
              </div>
              <div className="mb-2">
                <Label>Level of Education</Label>
                <select className="w-full border rounded px-3 py-2 bg-white" value={form.educationLevel} onChange={e => setForm((f: any) => ({ ...f, educationLevel: e.target.value }))}>
                  <option value="">Select Level of Education</option>
                  {educationLevels.map(level => <option key={level}>{level}</option>)}
                </select>
                {formErrors.educationLevel && <div className="text-red-600 text-xs mt-1">{formErrors.educationLevel}</div>}
              </div>
            </div>
            <div className="mb-2">
              <Label>Service Description</Label>
              <Input value={form.serviceDescription} onChange={e => setForm((f: any) => ({ ...f, serviceDescription: e.target.value }))} />
              {formErrors.serviceDescription && <div className="text-red-600 text-xs mt-1">{formErrors.serviceDescription}</div>}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4">
            <div>
              <Label>Business Name</Label>
              <Input value={form.businessName} onChange={e => setForm((f: any) => ({ ...f, businessName: e.target.value }))} />
            </div>
            <div>
              <Label>Business Registration Number</Label>
              <Input value={form.businessRegistrationNumber} onChange={e => setForm((f: any) => ({ ...f, businessRegistrationNumber: e.target.value }))} />
            </div>
            {formErrors.business && <div className="text-red-600 text-xs mt-1">{formErrors.business}</div>}
          </div>
        );
      case 3:
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4">
            <div>
              <Label>Service Areas (comma or space separated)</Label>
              <Input value={form.serviceAreas.join(", ")} onChange={e => setForm((f: any) => ({ ...f, serviceAreas: e.target.value.split(/[ ,]+/).map((s: string) => s.trim()).filter(Boolean) }))} />
              {formErrors.serviceAreas && <div className="text-red-600 text-xs mt-1">{formErrors.serviceAreas}</div>}
            </div>
            <div>
              <Label>Availability</Label>
              <select className="w-full border rounded px-3 py-2 bg-white" value={form.availability} onChange={e => setForm((f: any) => ({ ...f, availability: e.target.value }))}>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
                <option value="On Leave">On Leave</option>
              </select>
              {formErrors.availability && <div className="text-red-600 text-xs mt-1">{formErrors.availability}</div>}
            </div>
            <div>
              <Label>Operating Hours (Weekdays)</Label>
              <div className="flex gap-2">
                <Input type="time" value={form.operatingHours.weekdays.from} onChange={e => setForm((f: any) => ({ ...f, operatingHours: { ...f.operatingHours, weekdays: { ...f.operatingHours.weekdays, from: e.target.value } } }))} />
                <span>to</span>
                <Input type="time" value={form.operatingHours.weekdays.to} onChange={e => setForm((f: any) => ({ ...f, operatingHours: { ...f.operatingHours, weekdays: { ...f.operatingHours.weekdays, to: e.target.value } } }))} />
              </div>
              {formErrors.weekdays && <div className="text-red-600 text-xs mt-1">{formErrors.weekdays}</div>}
            </div>
            <div>
              <Label>Operating Hours (Weekends)</Label>
              <div className="flex gap-2">
                <Input type="time" value={form.operatingHours.weekends.from} onChange={e => setForm((f: any) => ({ ...f, operatingHours: { ...f.operatingHours, weekends: { ...f.operatingHours.weekends, from: e.target.value } } }))} />
                <span>to</span>
                <Input type="time" value={form.operatingHours.weekends.to} onChange={e => setForm((f: any) => ({ ...f, operatingHours: { ...f.operatingHours, weekends: { ...f.operatingHours.weekends, to: e.target.value } } }))} />
              </div>
              {formErrors.weekends && <div className="text-red-600 text-xs mt-1">{formErrors.weekends}</div>}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4">
            <div className="mb-6">
              {isKycVerified && (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Your KYC information has been verified and pre-filled. All KYC fields are read-only.</span>
                </div>
              )}
              <div className="font-semibold mb-2">KYC Information</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <Label>NIN</Label>
                  <Input value={form.kyc.nin} onChange={e => setForm((f: any) => ({ ...f, kyc: { ...f.kyc, nin: e.target.value } }))} disabled={isKycVerified} />
                </div>
               
                <div>
                  <Label>Bank Name</Label>
                  <select className="w-full border rounded px-3 py-2 bg-white"
                   value={banks.find(b => b.name === form.kyc.bankName)?.uuid || ""}
                     onChange={e => {
                      const selected = banks.find(b => b.uuid === e.target.value);
                      setForm((f: any) => ({ ...f, kyc: { ...f.kyc, bankName: selected ? selected.name : "" } }));
                    }}

                   //onChange={e => { setForm((f: any) => ({ ...f, kyc: { ...f.kyc, bankName: e.target.value } })); setTimeout(validateAccountName, 0); }}
                   disabled={isKycVerified}>
                    <option value="">Select Bank</option>
                    {banks.map((bank: any) => (
                      <option key={bank.uuid} value={bank.uuid}>{bank.name}</option>
                    ))}
                  </select>
                  {formErrors.bankName && <div className="text-red-600 text-xs mt-1">{formErrors.bankName}</div>}
                </div>
                <div>
                  <Label>Bank Account Number</Label>
                  <Input value={form.kyc.bankAccountNumber} onChange={e => setForm((f: any) => ({ ...f, kyc: { ...f.kyc, bankAccountNumber: e.target.value } }))} onBlur={validateAccountName} disabled={isKycVerified} />
                  {/* {accountNameLoading ? <Loader className="animate-spin w-5 h-5 text-green-600 inline-block" /> : accountNameError && <div className="text-red-600 text-xs mt-1">{accountNameError}</div>} */}
                </div>
                <div>
                  <Label>Account Name</Label>
                  <div className="relative">
                    <Input value={accountNameLoading ? "Loading..." : form.kyc.accountName} disabled readOnly className={accountNameLoading ? "pl-10 animate-pulse" : ""} />
                    {accountNameLoading && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2">
                        <Loader className="animate-spin w-5 h-5 text-green-600" />
                      </span>
                    )}
                  </div>
                  {accountNameError && <div className="text-red-600 text-xs mt-1">{accountNameError}</div>}
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" value={form.kyc.dob} onChange={e => setForm((f: any) => ({ ...f, kyc: { ...f.kyc, dob: e.target.value } }))} disabled={isKycVerified} />
                </div>
                <div>
                  <Label>Religion</Label>
                  <select className="w-full border rounded px-3 py-2 bg-white" value={form.kyc.religion} onChange={e => setForm((f: any) => ({ ...f, kyc: { ...f.kyc, religion: e.target.value } }))} disabled={isKycVerified}>
                    <option value="">Select Religion</option>
                    <option value="Christianity">Christianity</option>
                    <option value="Islam">Islam</option>
                    <option value="Traditional">Traditional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Label>Photo (Capture/Upload)</Label>
                  <ImageDocumentUploadStepper
                    imageSteps={[{ label: "Photo", name: "kycPhoto", accept: "image/*", capture: "environment" }]}
                    documentSteps={[]}
                    onComplete={urls => setForm((f: any) => ({ ...f, kyc: { ...f.kyc, photo: urls.kycPhoto } }))}
                  />
                  {formErrors.photo && <div className="text-red-600 text-xs mt-1">{formErrors.photo}</div>}
                  {form.kyc.photo && <img src={form.kyc.photo} alt="KYC Photo" className="mt-2 w-32 h-32 max-w-full object-cover rounded" />}
                </div>
              </div>
            </div>
            <div className="font-semibold mt-10 mb-5">License Information</div>
            {form.licenses.map((lic: any, idx: number) => (
              <div key={idx} className="border-b pb-4 mb-4">
                <div>
                  <Label>License Name</Label>
                  <Input value={lic.name} onChange={e => setForm((f: any) => {
                    const licenses = [...f.licenses];
                    licenses[idx].name = e.target.value;
                    return { ...f, licenses };
                  })} />
                </div>
                <div>
                  <Label>License Number</Label>
                  <Input value={lic.number} onChange={e => setForm((f: any) => {
                    const licenses = [...f.licenses];
                    licenses[idx].number = e.target.value;
                    return { ...f, licenses };
                  })} />
                </div>
                <div>
                  <Label>Issuing Authority</Label>
                  <Input value={lic.authority} onChange={e => setForm((f: any) => {
                    const licenses = [...f.licenses];
                    licenses[idx].authority = e.target.value;
                    return { ...f, licenses };
                  })} />
                </div>
                <div>
                  <Label>Issued Date</Label>
                  <Input type="date" value={lic.issued} onChange={e => setForm((f: any) => {
                    const licenses = [...f.licenses];
                    licenses[idx].issued = e.target.value;
                    return { ...f, licenses };
                  })} />
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <div className="flex items-center gap-2">
                    <Input type="date" value={lic.expires} onChange={e => setForm((f: any) => {
                      const licenses = [...f.licenses];
                      licenses[idx].expires = e.target.value;
                      return { ...f, licenses };
                    })} disabled={lic.noExpiry} />
                    <label className="flex items-center gap-1 text-xs">
                      <input
                        type="checkbox"
                        checked={!!lic.noExpiry}
                        onChange={e => setForm((f: any) => {
                          const licenses = [...f.licenses];
                          licenses[idx].noExpiry = e.target.checked;
                          if (e.target.checked) licenses[idx].expires = '';
                          return { ...f, licenses };
                        })}
                      />
                      Does not expire
                    </label>
                  </div>
                </div>
                <div>
                  <Label>Document (Upload)</Label>
                  <ImageDocumentUploadStepper
                    imageSteps={[]}
                    documentSteps={[{ label: "License Document", name: `licenseDoc_${idx}` }]}
                    onComplete={urls => setForm((f: any) => {
                      const licenses = [...f.licenses];
                      licenses[idx].document = urls[`licenseDoc_${idx}`];
                      return { ...f, licenses };
                    })}
                  />
                  {lic.document && <a href={lic.document} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 block">View Uploaded Document</a>}
                </div>
                {form.licenses.length > 1 && (
                  <Button variant="destructive" onClick={() => setForm((f: any) => ({ ...f, licenses: f.licenses.filter((_: any, i: number) => i !== idx) }))} className="mt-2">Remove License</Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={() => setForm((f: any) => ({ ...f, licenses: [...f.licenses, { name: "", number: "", authority: "", issued: "", expires: "", document: "", noExpiry: false }] }))}>Add License</Button>
          </div>
        );
      case 5:
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4">
            <div className="font-semibold text-lg mb-2">Portfolio <span className="text-xs text-gray-500">(Optional)</span></div>
            {form.portfolio.map((item: any, idx: number) => (
              <div key={idx} className="border-b pb-4 mb-4">
                <div>
                  <Label>Title</Label>
                  <Input value={item.title} onChange={e => setForm((f: any) => {
                    const portfolio = [...f.portfolio];
                    portfolio[idx].title = e.target.value;
                    return { ...f, portfolio };
                  })} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input value={item.description} onChange={e => setForm((f: any) => {
                    const portfolio = [...f.portfolio];
                    portfolio[idx].description = e.target.value;
                    return { ...f, portfolio };
                  })} />
                </div>
                <div>
                  <Label>Images (Upload)</Label>
                  <ImageDocumentUploadStepper
                    imageSteps={[{ label: "Portfolio Image", name: `portfolioImg_${idx}` }]}
                    documentSteps={[]}
                    onComplete={urls => setForm((f: any) => {
                      const portfolio = [...f.portfolio];
                      portfolio[idx].images = [urls[`portfolioImg_${idx}`]];
                      return { ...f, portfolio };
                    })}
                  />
                  {item.images && item.images[0] && <img src={item.images[0]} alt="Portfolio" className="mt-2 w-32 h-32 max-w-full object-cover rounded" />}
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={item.date} onChange={e => setForm((f: any) => {
                    const portfolio = [...f.portfolio];
                    portfolio[idx].date = e.target.value;
                    return { ...f, portfolio };
                  })} />
                </div>
                {form.portfolio.length > 1 && (
                  <Button variant="destructive" onClick={() => setForm((f: any) => ({ ...f, portfolio: f.portfolio.filter((_: any, i: number) => i !== idx) }))} className="mt-2">Remove Portfolio Item</Button>
                )}
              </div>
            ))}
            <Button variant="outline" onClick={() => setForm((f: any) => ({ ...f, portfolio: [...f.portfolio, { title: "", description: "", images: [], date: "" }] }))}>Add Portfolio Item</Button>
          </div>
        );
      case 6:
        return (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 mb-4">
            <div className="font-semibold text-lg mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5 text-green-600" /> Review & Submit</div>
            {registrationSuccess ? (
              <div className="flex flex-col items-center justify-center py-8">
                <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
                <div className="text-green-700 font-bold text-lg mb-2">Registration submitted successfully!</div>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-6">
                  {/* Basic Info */}
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-green-700 mb-2"><User className="w-5 h-5" /> Basic Info</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Full Name:</span> {form.user.fullName}</div>
                      <div className="flex items-center gap-1"><Mail className="w-4 h-4 text-gray-400" /> {form.user.email}</div>
                      <div className="flex aitems-center gap-1"><Phone className="w-4 h-4 text-gray-400" /> {form.user.phoneNumber}</div>
                      <div><span className="font-medium">Gender:</span> {form.user.gender}</div>
                      <div className="flex items-center gap-1"><KeyRound className="w-4 h-4 text-gray-400" /> Password: ******</div>
                      <div><span className="font-medium">Street:</span> {form.address.street}</div>
                      <div><span className="font-medium">State:</span> {form.address.state}</div>
                      <div><span className="font-medium">LGA:</span> {form.address.city}</div>
                      <div><span className="font-medium">Ward:</span> {form.address.ward}</div>
                    </div>
                  </div>
                  {/* Professional Info */}
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-green-700 mb-2"><Briefcase className="w-5 h-5" /> Professional Info</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Category:</span> {category}</div>
                      <div><span className="font-medium">Profession:</span> {form.profession}</div>
                      <div><span className="font-medium">Specialization:</span> {form.specialization}</div>
                      <div><span className="font-medium">Skills:</span> {form.skills.join(", ")}</div>
                      <div><span className="font-medium">Years of Experience:</span> {form.yearsOfExperience}</div>
                      <div><span className="font-medium">Level of Education:</span> {form.educationLevel}</div>
                      <div className="md:col-span-2"><span className="font-medium">Service Description:</span> {form.serviceDescription}</div>
                    </div>
                  </div>
                  {/* Business Info */}
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-green-700 mb-2"><Building className="w-5 h-5" /> Business Info</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Business Name:</span> {form.businessName}</div>
                      <div><span className="font-medium">Registration Number:</span> {form.businessRegistrationNumber}</div>
                    </div>
                  </div>
                  {/* Service Details */}
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-green-700 mb-2"><ShieldCheck className="w-5 h-5" /> Service Details</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Service Areas:</span> {form.serviceAreas.join(", ")}</div>
                      <div><span className="font-medium">Availability:</span> {form.availability}</div>
                      <div><span className="font-medium">Weekdays:</span> {form.operatingHours.weekdays.from} to {form.operatingHours.weekdays.to}</div>
                      <div><span className="font-medium">Weekends:</span> {form.operatingHours.weekends.from} to {form.operatingHours.weekends.to}</div>
                    </div>
                  </div>
                  {/* KYC Info */}
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-green-700 mb-2"><ShieldCheck className="w-5 h-5" /> KYC Info</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">NIN:</span> {form.kyc.nin}</div>
                      <div><span className="font-medium">Bank Account Number:</span> {form.kyc.bankAccountNumber}</div>
                      <div><span className="font-medium">Bank Name:</span> {form.kyc.bankName}</div>
                      <div><span className="font-medium">Account Name:</span> {form.kyc.accountName}</div>
                      <div><span className="font-medium">Date of Birth:</span> {form.kyc.dob}</div>
                      <div><span className="font-medium">Religion:</span> {form.kyc.religion}</div>
                      <div className="md:col-span-2 flex items-center gap-2">
                        <span className="font-medium">Photo:</span>
                        {form.kyc.photo ? <img src={form.kyc.photo} alt="KYC Photo" className="w-12 h-12 object-cover rounded" /> : <span className="text-gray-400">No photo</span>}
                      </div>
                    </div>
                  </div>
                  {/* Licenses */}
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-green-700 mb-2"><ShieldCheck className="w-5 h-5" /> Licenses</div>
                    {form.licenses.length === 0 || !form.licenses[0].name ? <div className="text-gray-400 text-sm">No licenses provided</div> : (
                      <div className="space-y-2">
                        {form.licenses.map((lic: any, idx: number) => (
                          <div key={idx} className="border rounded p-2 flex flex-col gap-1">
                            <div><span className="font-medium">Name:</span> {lic.name}</div>
                            <div><span className="font-medium">Number:</span> {lic.number}</div>
                            <div><span className="font-medium">Authority:</span> {lic.authority}</div>
                            <div><span className="font-medium">Issued:</span> {lic.issued}</div>
                            <div><span className="font-medium">Expires:</span> {lic.noExpiry ? "Does not expire" : lic.expires}</div>
                            <div className="flex items-center gap-2"><span className="font-medium">Document:</span> {lic.document ? <a href={lic.document} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a> : <span className="text-gray-400">No document</span>}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Portfolio */}
                  <div>
                    <div className="flex items-center gap-2 font-semibold text-green-700 mb-2"><ImageIcon className="w-5 h-5" /> Portfolio</div>
                    {form.portfolio.length === 0 || !form.portfolio[0].title ? <div className="text-gray-400 text-sm">No portfolio items</div> : (
                      <div className="space-y-2">
                        {form.portfolio.map((item: any, idx: number) => (
                          <div key={idx} className="border rounded p-2 flex flex-col gap-1">
                            <div><span className="font-medium">Title:</span> {item.title}</div>
                            <div><span className="font-medium">Description:</span> {item.description}</div>
                            <div className="flex items-center gap-2"><span className="font-medium">Image:</span> {item.images && item.images[0] ? <img src={item.images[0]} alt="Portfolio" className="w-12 h-12 object-cover rounded" /> : <span className="text-gray-400">No image</span>}</div>
                            <div><span className="font-medium">Date:</span> {item.date}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-8">
                  <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-green-600" /> Raw JSON</div>
                  <pre className="bg-gray-100 rounded p-4 text-xs overflow-x-auto">{JSON.stringify(form, null, 2)}</pre>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-6" onClick={handleSubmit} disabled={registering}>{registering ? "Registering..." : "Submit Registration"}</Button>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-1 sm:px-2 md:px-4 mx-4 w-full max-w-full">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">Service Provider Registration</h1>
      <p className="text-gray-600 mt-2 mb-4">Register a new service provider</p>
      <div className="min-h-screen mx-1 py-3 md:py-5">
        <div className="mb-6">
          <div className="flex items-center bg-white/80 border border-gray-200 rounded-lg p-1 sm:p-2 shadow-sm overflow-x-auto min-w-0" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="flex w-full min-w-max">
              {steps.map((label, idx) => (
                <div key={label} className="flex-1 flex flex-col items-center min-w-[70px] px-0.5">
                  <div
                    className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white transition-all duration-200 border-1 ${
                      idx === step
                        ? "bg-green-600 border-green-700 scale-110 shadow-lg"
                        : idx < step
                        ? "bg-green-500 border-green-600"
                        : "bg-gray-300 border-gray-300"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className={`mt-1 text-xs text-center whitespace-nowrap overflow-hidden text-ellipsis w-full ${idx === step ? "font-semibold text-green-700" : "text-gray-500"}`}>{label}</span>
                  {idx < steps.length - 1 && (
                    <div
                      className={`w-full h-1 mt-1 mb-1 transition-all duration-200 ${
                        idx < step
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mb-8">{renderStep()}</div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between">
          {registrationSuccess ? (
            <Button
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                setStep(0);
                setForm({
                  user: {
                    fullName: "",
                    email: "",
                    phoneNumber: "",
                    gender: "",
                    password: "",
                  },
                  address: {
                    street: "",
                    city: "",
                    state: "",
                    ward: "",
                  },
                  category: "",
                  profession: "",
                  specialization: "",
                  skills: [],
                  yearsOfExperience: "",
                  serviceDescription: "",
                  businessName: "",
                  businessRegistrationNumber: "",
                  serviceAreas: [],
                  availability: "Available",
                  operatingHours: {
                    weekdays: { from: "", to: "" },
                    weekends: { from: "", to: "" },
                  },
                  licenses: [
                    {
                      name: "",
                      number: "",
                      authority: "",
                      issued: "",
                      expires: "",
                      document: "",
                    },
                  ],
                  kyc: {
                    nin: "",
                    bankAccountNumber: "",
                    bankName: "",
                    accountName: "",
                    dob: "",
                    religion: "",
                    photo: "",
                  },
                  isVerified: true,
                  portfolio: [
                    {
                      title: "",
                      description: "",
                      images: [],
                      date: "",
                    },
                  ],
                  status: "Active",
                  educationLevel: "",
                });
                setRegistrationSuccess(false);
              }}
            >
              Home
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={prevStep} disabled={step === 0} className="w-full sm:w-auto">Back</Button>
              {step < steps.length - 1 && (
                <Button 
                  onClick={nextStep} 
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                  disabled={(Boolean(accountNameError) && step === 4) || (step === 0 && kycStatusChecked && !userKycVerified)}
                >
                  Next
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 