"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, Loader } from "lucide-react"
import { getCookie, setCookie } from 'cookies-next';
import axios from "axios"
import dynamic from "next/dynamic";
import { useApi } from "@/context/ApiContext";
import { NIGERIA_STATES } from "@/lib/nigeria-states";
import { Toaster, toast } from "sonner"

const ImageDocumentUploadStepper = dynamic(() => import("@/components/ImageKit/image-document-upload-stepper"), { ssr: false });

interface FormData {
  religion: string
  fullName: string
  maritalStatus: string
  residentialaddress: string
  community: string
  dateOfBirth: string
  state: string
  lga: string
  nin: string
}



const INITIAL_FORM: FormData & { photo?: string; bankAccountNumber?: string; bankName?: string; accountName?: string } = {
  religion: "",
  fullName: "",
  maritalStatus: "",
  residentialaddress: "",
  community: "",
  dateOfBirth: "",
  state: "",
  lga: "",
  nin: "",
  photo: "",
  bankAccountNumber: "",
  bankName: "",
  accountName: "",
};

export default function KycVerificationPage() {
  // All hooks at the top
  const router = useRouter();
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingKyc, setLoadingKyc] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedState, setSelectedState] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { completeKyc, kycCompleted } = useAuth();
  const [kycStatus, setKycStatus] = useState<string | undefined>(undefined);
  const userCookie = getCookie("user");
  const userData = userCookie ? JSON.parse(userCookie as string) : null;
  // Bank KYC state
  const api = useApi();
  const { currentUser } = useAuth();
  const [banks, setBanks] = useState<any[]>([]);
  const [accountNameLoading, setAccountNameLoading] = useState(false);
  const [accountNameError, setAccountNameError] = useState("");
  // Add state for ward options
  const [wardOptions, setWardOptions] = useState<string[]>([]);

  // Fetch banks on mount
  useEffect(() => {
    api.getBankList().then(setBanks).catch(() => setBanks([]));
  }, [api]);

  useEffect(() => {
    console.log("currentUser: ",currentUser)
  }, [])



  // Update ward options when state or lga changes
  useEffect(() => {
    if (formData.state && formData.lga) {
      const stateObj = NIGERIA_STATES.find(s => s.name === formData.state);
      const lgaObj = stateObj?.lgas.find(l => l.name === formData.lga);
      setWardOptions(lgaObj ? lgaObj.wards.map(w => w.name) : []);
    } else {
      setWardOptions([]);
    }
    // Reset community if lga changes
    setFormData(f => ({ ...f, community: "" }));
  }, [formData.state, formData.lga]);

  // Account validation logic
  const validateAccountName = async () => {
    setAccountNameError("");
    if (formData.bankAccountNumber && formData.bankName) {
      setAccountNameLoading(true);
      try {
        const selectedBank = banks.find(b => b.name === formData.bankName);
        const res = await api.validateAccountNumber(formData.bankAccountNumber, selectedBank.uuid);
        const name = res?.data?.destinationAccountHolderNameAtBank;
        if (name) {
          setFormData((f) => ({ ...f, accountName: name }));
        } else {
          setAccountNameError("Account not found or invalid");
          setFormData((f) => ({ ...f, accountName: "" }));
        }
      } catch (e) {
        setAccountNameError("Validation failed");
        setFormData((f) => ({ ...f, accountName: "" }));
      } finally {
        setAccountNameLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!userData) return;
    setLoadingKyc(true);
    const fetchKycStatus = async () => {
      axios.post(`https://ministryoflabourbackend.vercel.app/api/v1/kyc/retrieve`, { userId: userData.data._id }).then((res) => {
        setKycStatus(res.data.status);
        setLoadingKyc(false);
      }).catch(err => {
        setLoadingKyc(false);
        console.log(err);
      });
    };
    fetchKycStatus();
  }, []);

  // Only after all hooks:
  if (loadingKyc) return (
    <div className="text-center text-gray-600 p-10 flex flex-col items-center justify-center">
      <svg className="animate-spin h-10 w-10 text-green-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-xl font-semibold">Loading status...</p>
      <p className="text-gray-500">Fetching your kyc status</p>
    </div>
  );
  if (userData?.data?.isKYCVerified) {
    return (
      <div className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <motion.h1
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              KYC Verification 
            </motion.h1>
            <motion.p
              className="text-muted-foreground mt-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Your identity has been verified successfully
            </motion.p>
          </div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-4">Verification Status: <label className="bg-green-100 p-1">
                {kycStatus  ? kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1) : 'Pending'}
  
              </label></h2>
              <p className="text-gray-600 mb-6">
                Your KYC verification has been completed and approved. You now have full access to all platform features.You may have to wait for a few minutes for your account to be activated. Kindly logout and login again.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.push("/dashboard/kycverification")} className="gradient-primary">
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (name === "state") {
      setSelectedState(value)
      setFormData((prev) => ({ ...prev, lga: "" }))
    }
  }

  const validateStep = () => {
    let stepErrors: Record<string, string> = {}
    if (step === 1) {
      if (!formData.religion) stepErrors.religion = "Religion is required"
      if (!formData.fullName) stepErrors.fullName = "Full name is required"
      if (!formData.maritalStatus) stepErrors.maritalStatus = "Marital status is required"
      if (!formData.dateOfBirth) stepErrors.dateOfBirth = "Date of birth is required"
      if (!formData.nin || formData.nin.length !== 11) stepErrors.nin = "NIN must be exactly 11 digits"
      if (!formData.photo) stepErrors.photo = "Photo is required"
    } else if (step === 2) {
      if (!formData.state) stepErrors.state = "State is required"
      if (!formData.lga) stepErrors.lga = "LGA is required"
      if (!formData.community) stepErrors.community = "Community is required"
      if (!formData.residentialaddress) stepErrors.residentialaddress = "Residential address is required"
    }
    setErrors(stepErrors)
    return Object.keys(stepErrors).length === 0
  }


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
    return similarity >= threshold;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStep()) return;
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Only validate name matching on step 3 (bank details)
      if(!isNameMatchAboveThreshold(formData.fullName, formData?.accountName || "")){
        toast.error("Name mismatch, ensure the name on your bank account matches the name on your PROFILE")
        return;
      }
      
      try {
        setLoading(true);
    
        console.log("KYC: "+JSON.stringify(formData))
        const kyc = await completeKyc(formData);
        console.log("kyc: ",JSON.stringify(kyc))
        setLoading(false);
        if (kyc) {
          setKycStatus("verified")
          // Update user cookie: set isKYCVerified to true
          const userCookie = getCookie('user');
          if (userCookie) {
            let userObj: any = {};
            try {
              userObj = JSON.parse(userCookie as string);
              if (userObj.data) {
                userObj.data.isKYCVerified = true;
                setCookie('user', JSON.stringify(userObj));
              }
            } catch (err) {
              // ignore JSON parse error
            }
          }
          return setStep(4);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
       <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#10B981',
            color: 'white',
          },
          className: 'my-toast',
        }} 
        closeButton={true} 
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Verify Your Identity
          </motion.h1>
          <motion.p
            className="text-muted-foreground mt-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Complete the verification process to start using all features
          </motion.p>
        </div>

        {/* Progress steps: add Bank Details as step 3 */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-md">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step > i
                      ? "bg-green-100 text-green-600"
                      : step === i
                        ? "gradient-primary text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > i ? <CheckCircle size={20} /> : step === 4 ? <CheckCircle size={20} /> : i}
                </div>
                <div className="text-xs mt-2 text-center">
                  {i === 1 ? "Personal Info" : i === 2 ? "Address" : i === 3 ? "Bank Details" : "Completed"}
                </div>
                {i < 4 && <div className={`h-1 w-full mt-2 ${step > i ? "bg-primary" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6">{error}</div>}


          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h2 className="text-base font-semibold mb-4">Personal Information</h2>
                <div className="mb-4">
                  <label className="block mb-1 font-small text-sm" htmlFor="fullName">
                    Full Name (must match with the name on your NIN)
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                    placeholder="Enter your Full Name"
                  />
                  {errors.fullName && (
                    <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="religion">
                    Religion
                  </label>
                  <select
                    id="religion"
                    name="religion"
                    value={formData.religion}
                    onChange={handleSelectChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select Religion</option>
                    <option value="christianity">Christianity</option>
                    <option value="islam">Islam</option>
                    <option value="traditional">Traditional</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.religion && (
                    <div className="text-red-500 text-sm mt-1">{errors.religion}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="maritalStatus">
                    Marital Status
                  </label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleSelectChange}
                    className="w-full border rounded bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                  {errors.maritalStatus && (
                    <div className="text-red-500 text-sm mt-1">{errors.maritalStatus}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="dateOfBirth">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full border bg-white rounded px-3 py-2 text-sm"

                    />
                    <Calendar
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={18}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <div className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-small text-sm" htmlFor="nin">
                    NIN
                  </label>
                  <input
                    id="nin"
                    name="nin"
                    type="text"
                    maxLength={11}
                    value={formData.nin}
                    onChange={handleChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                    placeholder="Enter your 11-digit NIN"
                  />
                  {errors.nin && (
                    <div className="text-red-500 text-sm mt-1">{errors.nin}</div>
                  )}
                </div>
                {/* Photo Upload */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm">Photo (Capture/Upload)</label>
                  <ImageDocumentUploadStepper
                    imageSteps={[{ label: "Photo", name: "kycPhoto", accept: "image/*", capture: "environment" }]}
                    documentSteps={[]}
                    onComplete={urls => setFormData((f) => ({ ...f, photo: urls.kycPhoto }))}
                  />
                  {errors.photo && (
                    <div className="text-red-500 text-sm mt-1">{errors.photo}</div>
                  )}
                  {formData.photo && <img src={formData.photo} alt="KYC Photo" className="mt-2 w-32 h-32 max-w-full object-cover rounded" />}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-base font-semibold mb-4">Address Information</h2>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="state">
                    State of origin
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleSelectChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select State</option>
                    {NIGERIA_STATES.map((state) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <div className="text-red-500 text-sm mt-1">{errors.state}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="lga">
                    LGA
                  </label>
                  <select
                    id="lga"
                    name="lga"
                    value={formData.lga}
                    onChange={handleSelectChange}
                    className="w-full border rounded bg-white px-3 py-2 text-sm"
                  >
                    <option value="">
                      {selectedState ? "Select LGA" : "Select State first"}
                    </option>
                    {(NIGERIA_STATES.find(s => s.name === selectedState)?.lgas || []).map((lga) => (
                      <option key={lga.name} value={lga.name}>
                        {lga.name}
                      </option>
                    ))}
                  </select>
                  {errors.lga && (
                    <div className="text-red-500 text-sm mt-1">{errors.lga}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="community">
                    Community (Ward)
                  </label>
                  <select
                    id="community"
                    name="community"
                    value={formData.community}
                    onChange={handleSelectChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                  >
                    <option value="">{formData.lga ? "Select Ward" : "Select LGA first"}</option>
                    {wardOptions.map((ward) => (
                      <option key={ward} value={ward}>{ward}</option>
                    ))}
                  </select>
                  {errors.community && (
                    <div className="text-red-500 text-sm mt-1">{errors.community}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm" htmlFor="residentialAddress">
                    Residential Address
                  </label>
                  <input
                    id="residentialaddress"
                    name="residentialaddress"
                    type="text"
                    value={formData.residentialaddress}
                    onChange={handleChange}
                    className="w-full border bg-white rounded px-3 py-2 text-sm"
                    placeholder="Enter your residential address"
                  />
                  {errors.residentialaddress && (
                    <div className="text-red-500 text-sm mt-1">{errors.residentialaddress}</div>
                  )}
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="text-base font-semibold mb-4">Bank Details</h2>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm">Bank Name</label>
                  <select
                    className="w-full border rounded px-3 py-2 bg-white"
                    //value={formData.bankName || ""}
                    value={banks.find(b => b.name === formData.bankName)?.uuid || ""}
                    onChange={e => {
                      const selected = banks.find(b => b.uuid === e.target.value);
                      setFormData((f: any) => ({ ...f, bankName: selected ? selected.name : ""  }));
                    }}
                    //onChange={e => {
                    // setFormData(f => ({ ...f, bankName: e.target.value })); setTimeout(validateAccountName, 0); }}
                  >
                    <option value="">Select Bank</option>
                    {banks.map((bank: any) => (
                      <option key={bank.uuid} value={bank.uuid}>{bank.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm">Bank Account Number</label>
                  <input
                    className="w-full border rounded px-3 py-2 bg-white"
                    value={formData.bankAccountNumber || ""}
                    onChange={e => setFormData(f => ({ ...f, bankAccountNumber: e.target.value }))}
                    onBlur={validateAccountName}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm">Account Name</label>
                  <div className="relative">
                    <input
                      className={"w-full border rounded px-3 py-2 bg-white " + (accountNameLoading ? "pl-10 animate-pulse" : "")}
                      value={accountNameLoading ? "Loading..." : (formData.accountName || "")}
                      disabled
                      readOnly
                    />
                    {accountNameLoading && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2">
                        <Loader className="animate-spin w-5 h-5 text-green-600" />
                      </span>
                    )}
                  </div>
                  {accountNameError && <div className="text-red-600 text-xs mt-1">{accountNameError}</div>}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="flex flex-col ml-10 min-h-[60vh] text-center">
                  <div className="max-w-md mr-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">
                      KYC Sent Successfully!
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Your kyc has been completed and pending as our team will make a review.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => router.push("/dashboard")}>
                        Proceed To Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {step !== 4 && (
              <div className="flex justify-end pt-4 gap-2">
                {step > 1 && step < 4 && (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
                <Button disabled={loading } type="submit" className="gradient-primary">
                  {step < 3 ? "Continue" : loading ? "Sending..." : "Complete Verification"}
                </Button>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  )
}
