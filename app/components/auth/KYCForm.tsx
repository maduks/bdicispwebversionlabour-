"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { useApi } from "@/context/ApiContext"
import { NIGERIA_STATES } from "@/lib/nigeria-states"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Calendar, MapPin, CreditCard, CheckCircle, Loader } from "lucide-react"
import dynamic from "next/dynamic"

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
  photo: string
  bankAccountNumber: string
  bankName: string
  accountName: string
}

const INITIAL_FORM: FormData = {
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

interface KYCFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function KYCForm({ open, onOpenChange }: KYCFormProps) {
  const { currentUser, completeKyc } = useAuth()
  const { toast } = useToast()
  const api = useApi()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [selectedState, setSelectedState] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [banks, setBanks] = useState<any[]>([])
  const [accountNameLoading, setAccountNameLoading] = useState(false)
  const [accountNameError, setAccountNameError] = useState("")
  const [wardOptions, setWardOptions] = useState<string[]>([])
  const [nameMatchError, setNameMatchError] = useState("")
  const [countdownInterval, setCountdownInterval] = useState<NodeJS.Timeout | null>(null)

  // Fetch banks on mount
  useEffect(() => {
    api.getBankList().then(setBanks).catch(() => setBanks([]));
  }, [api]);

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

  // Check name matching whenever account name changes
  useEffect(() => {
    if (formData.accountName && formData.fullName) {
      const isMatch = isNameMatchAboveThreshold(formData.fullName, formData.accountName);
      if (!isMatch) {
        setNameMatchError("Name mismatch: Bank account name doesn't match your profile name");
      } else {
        setNameMatchError("");
      }
    } else {
      setNameMatchError("");
    }
  }, [formData.accountName, formData.fullName]);

  // Cleanup countdown interval when dialog closes
  useEffect(() => {
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    }
  }, [countdownInterval]);

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
    } else if (step === 3) {
      if (!formData.bankName) stepErrors.bankName = "Bank name is required"
      if (!formData.bankAccountNumber) stepErrors.bankAccountNumber = "Bank account number is required"
      if (!formData.accountName) stepErrors.accountName = "Account name is required"
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
      try {
        setLoading(true);
        
        // Add user type for seekers
        const kycData = {
          ...formData,
          userType: "seeker"
        }
        
        const success = await completeKyc(kycData)
        
        if (success) {
          // Set to success step
          setStep(4)
          
          // Start countdown
          let countdown = 7
          const countdownElement = document.getElementById('countdown')
          const interval = setInterval(() => {
            countdown--
            if (countdownElement) {
              countdownElement.textContent = countdown.toString()
            }
            if (countdown <= 0) {
              clearInterval(interval)
              setCountdownInterval(null)
              // Close dialog and redirect to login
              onOpenChange(false)
              window.location.href = '/login'
            }
          }, 1000)
          setCountdownInterval(interval)
        } else {
          throw new Error("KYC submission failed")
        }
      } catch (error: any) {
        console.error("KYC submission error:", error)
        toast({
          title: "KYC Submission Failed",
          description: error.message || "Failed to submit KYC. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>KYC Verification</DialogTitle>
          <DialogDescription>
            Complete your identity verification to access enhanced features. This helps us ensure platform security.
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress steps */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center w-full max-w-md">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step > i
                      ? "bg-green-100 text-green-600"
                      : step === i
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > i ? <CheckCircle size={16} /> : step === 4 ? <CheckCircle size={16} /> : i}
                </div>
                <div className="text-xs mt-1 text-center">
                  {i === 1 ? "Personal" : i === 2 ? "Address" : i === 3 ? "Bank" : "Completed"}
                </div>
                {i < 4 && <div className={`h-1 w-full mt-1 ${step > i ? "bg-green-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name (must match with the name on your NIN)</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your Full Name"
                  />
                  {errors.fullName && <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>}
                </div>

                <div>
                  <Label htmlFor="religion">Religion</Label>
                  <select
                    id="religion"
                    name="religion"
                    value={formData.religion}
                    onChange={handleSelectChange}
                    className="w-full border rounded bg-white px-3 py-2"
                  >
                    <option value="">Select Religion</option>
                    <option value="christianity">Christianity</option>
                    <option value="islam">Islam</option>
                    <option value="traditional">Traditional</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.religion && <div className="text-red-500 text-sm mt-1">{errors.religion}</div>}
                </div>

                <div>
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <select
                    id="maritalStatus"
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleSelectChange}
                    className="w-full border bg-white rounded px-3 py-2"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                  {errors.maritalStatus && <div className="text-red-500 text-sm mt-1">{errors.maritalStatus}</div>}
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                  {errors.dateOfBirth && <div className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</div>}
                </div>

                <div>
                  <Label htmlFor="nin">NIN</Label>
                  <Input
                    id="nin"
                    name="nin"
                    maxLength={11}
                    value={formData.nin}
                    onChange={handleChange}
                    placeholder="Enter your 11-digit NIN"
                  />
                  {errors.nin && <div className="text-red-500 text-sm mt-1">{errors.nin}</div>}
                </div>

                <div>
                  <Label>Photo (Capture/Upload)</Label>
                  <ImageDocumentUploadStepper
                    imageSteps={[{ label: "Photo", name: "kycPhoto", accept: "image/*", capture: "environment" }]}
                    documentSteps={[]}
                    onComplete={urls => setFormData((f) => ({ ...f, photo: urls.kycPhoto }))}
                  />
                  {errors.photo && <div className="text-red-500 text-sm mt-1">{errors.photo}</div>}
                  {formData.photo && <img src={formData.photo} alt="KYC Photo" className="mt-2 w-32 h-32 max-w-full object-cover rounded" />}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-lg font-semibold mb-4">Address Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="state">State of origin</Label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleSelectChange}
                    className="w-full border bg-white rounded px-3 py-2"
                  >
                    <option value="">Select State</option>
                    {NIGERIA_STATES.map((state) => (
                      <option key={state.name} value={state.name}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <div className="text-red-500 text-sm mt-1">{errors.state}</div>}
                </div>

                <div>
                  <Label htmlFor="lga">LGA</Label>
                  <select
                    id="lga"
                    name="lga"
                    value={formData.lga}
                    onChange={handleSelectChange}
                    className="w-full border bg-white rounded px-3 py-2"
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
                  {errors.lga && <div className="text-red-500 text-sm mt-1">{errors.lga}</div>}
                </div>

                <div>
                  <Label htmlFor="community">Community (Ward)</Label>
                  <select
                    id="community"
                    name="community"
                    value={formData.community}
                    onChange={handleSelectChange}
                    className="w-full border bg-white rounded px-3 py-2"
                  >
                    <option value="">{formData.lga ? "Select Ward" : "Select LGA first"}</option>
                    {wardOptions.map((ward) => (
                      <option key={ward} value={ward}>{ward}</option>
                    ))}
                  </select>
                  {errors.community && <div className="text-red-500 text-sm mt-1">{errors.community}</div>}
                </div>

                <div>
                  <Label htmlFor="residentialaddress">Residential Address</Label>
                  <Input
                    id="residentialaddress"
                    name="residentialaddress"
                    value={formData.residentialaddress}
                    onChange={handleChange}
                    placeholder="Enter your residential address"
                  />
                  {errors.residentialaddress && <div className="text-red-500 text-sm mt-1">{errors.residentialaddress}</div>}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
              
              <div className="space-y-4">
                <div>
                  <Label>Bank Name</Label>
                  <select
                    className="w-full border bg-white rounded px-3 py-2"
                    value={banks.find(b => b.name === formData.bankName)?.uuid || ""}
                    onChange={e => {
                      const selected = banks.find(b => b.uuid === e.target.value);
                      setFormData((f: any) => ({ ...f, bankName: selected ? selected.name : "" }));
                    }}
                  >
                    <option value="">Select Bank</option>
                    {banks.map((bank: any) => (
                      <option key={bank.uuid} value={bank.uuid}>{bank.name}</option>
                    ))}
                  </select>
                  {errors.bankName && <div className="text-red-500 text-sm mt-1">{errors.bankName}</div>}
                </div>

                <div>
                  <Label>Bank Account Number</Label>
                  <Input
                    value={formData.bankAccountNumber}
                    onChange={e => setFormData(f => ({ ...f, bankAccountNumber: e.target.value }))}
                    onBlur={validateAccountName}
                    placeholder="Enter account number"
                  />
                  {errors.bankAccountNumber && <div className="text-red-500 text-sm mt-1">{errors.bankAccountNumber}</div>}
                </div>

                <div>
                  <Label>Account Name</Label>
                  <p className="text-xs text-gray-600 mb-2">
                    The account name must match your profile name for verification
                  </p>
                  <div className="relative">
                    <Input
                      className={accountNameLoading ? "pl-10 animate-pulse" : ""}
                      value={accountNameLoading ? "Loading..." : formData.accountName}
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
                  {errors.accountName && <div className="text-red-500 text-sm mt-1">{errors.accountName}</div>}
                  {nameMatchError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center text-red-700">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-sm">{nameMatchError}</span>
                      </div>
                    </div>
                  )}
                  {formData.accountName && !nameMatchError && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm">✓ Name matches your profile</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
                      )}

            {step === 4 && (
              <>
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-green-700">
                    KYC Submitted Successfully!
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Your KYC verification has been submitted and approved. ✅ 
                    
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-700">
                      <strong>What happens next?</strong><br />
                   
                      • You'll be redirected to login in a few seconds to refresh your account status
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Redirecting to login in <span id="countdown">7</span> seconds...
                  </div>
                </div>
              </>
            )}

          {step !== 4 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                <strong>Why KYC for Seekers?</strong><br />
                • Enhanced security and trust<br />
                • Access to verified artisan reviews<br />
                • Priority customer support<br />
                • Better dispute resolution
              </p>
            </div>
          )}

          {step !== 4 && (
            <div className="flex justify-end space-x-3 pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                disabled={loading || (step === 3 && !!nameMatchError)} 
                type="submit" 
                className="bg-green-600 hover:bg-green-700"
              >
                {step < 3 ? "Continue" : loading ? "Submitting..." : "Complete Verification"}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
} 