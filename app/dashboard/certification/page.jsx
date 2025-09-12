"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useCredoPayment } from "react-credo"; // Assuming this is installed and configured
import { Toaster, toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCookie } from "cookies-next";
import EnhancedCertificate from "./certtemp"; // Import the correct component name
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import html2canvas from "html2canvas"; // Assuming this is installed
import jsPDF from "jspdf"; // Assuming this is installed
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Printer,
} from "lucide-react";
import { useApi } from "@/context/ApiContext";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Users,
  Key,
  FileText,
  Settings,
  Globe,
  Database,
  Lock,
} from "lucide-react";

function CertificationContent() {
  // State to manage form data for certification application
  const [formData, setFormData] = useState({
    certificationType: "",
    nuberOfYears: "",
    name: "",
    type: "", // new or renewal
  });

  const [loading, setLoading] = useState(false);
  const [hasKyc, setHasKyc] = useState(false);

  const [renewalYears, setRenewalYears] = useState(""); // New state for renewal years

  // State to hold a list of existing certificates (placeholder data)
  const [certificates, setCertificates] = useState([]);

  // State for transaction history (will be populated from API)
  const [certificationHistory, setCertificationHistory] = useState([]);

  const [serviceSubmissions, setServiceSubmissions] = useState([]);

  // State for history table filtering and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const { getSubmissionsByUser, getTransactionsByUser } = useApi();

  // State for submissions table filtering and pagination
  const [submissionSearchTerm, setSubmissionSearchTerm] = useState("");
  const [submissionStatusFilter, setSubmissionStatusFilter] = useState("all");
  const [submissionCategoryFilter, setSubmissionCategoryFilter] = useState(
    "all"
  );
  const [submissionCurrentPage, setSubmissionCurrentPage] = useState(1);
  const [submissionItemsPerPage] = useState(5);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://ministryoflabourbackend.vercel.app/api/v1";
  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "https://servicehub.benuestate.gov.ng";

  useEffect(() => {
    setLoading(true);
    const userCookie = getCookie("user");
    const userData = JSON.parse(userCookie);
    const id = userData.data._id;
    axios
      .get(`${API_BASE_URL}/certifications/${id}`)
      .then((res) => {
        setLoading(false);
        if (res.data.data !== "Certifications not found....") {
          setCertificates(res.data.data);
        } else {
          setCertificates([]);
        }
        // console.error(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, []);

  useEffect(() => {
    const userCookie = getCookie("user");
    const userData = userCookie ? JSON.parse(userCookie) : null;
    const token = userData?.token;
    setHasKyc(userData.data.isKYCVerified);
  }, []);

  const searchParams = useSearchParams();
  useEffect(() => {
    const payParam = searchParams?.get("payment") ?? null;
    const nuberOfYears = searchParams?.get("nuberOfYears") ?? null;
    const certificationType = searchParams?.get("certificationType") ?? null;
    const name = searchParams?.get("name") ?? null;
    const type = searchParams?.get("type") ?? null;
    const transRef = searchParams?.get("transRef") ?? null;
    if (payParam == "true") {
      const userCookie = getCookie("user");
      const userData = JSON.parse(userCookie);
      const id = userData.data._id;
      // Calculate expiration date based on selected years
      const currentDate = new Date();
      const expirationDateObj = new Date(currentDate);
      const numberOfYears = parseInt(nuberOfYears, 10); // Ensure nuberOfYears is a number
      expirationDateObj.setFullYear(currentDate.getFullYear() + numberOfYears);

      const data = {
        entityId: id,
        certificationType: certificationType,
        certificationAddressedTo: name,
        paymentType: type,
        Reference: transRef,
        amountPaid: nuberOfYears * 5000,
        expirationDate: expirationDateObj.toISOString(), // Use calculated date
        status: "pending", //"["active", "pending", "expired"]"
        certificateReferenceId: `BENUE-BSPCPSB-${Date.now()}`, // This should probably be dynamic too
      };
      axios
        .post(`${API_BASE_URL}/certifications/`, data)
        .then((res) => {
          console.error(res);
          setLoading(false);
          toast.success("Certification successful");
          setTimeout(() => {
            window.location.href = `${BASE_URL}/dashboard/certification`;
          }, 2000);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    const userCookie = getCookie("user");
    const userData = JSON.parse(userCookie);
    const id = userData.data._id;
    Promise.all([
      getSubmissionsByUser(id).then((res) => {
        setServiceSubmissions(res);
      }),
      getTransactionsByUser(id).then((res) => {
        console.log("transactions: " + JSON.stringify(res));
        setTransactions(res.transactions);

        // Transform transaction data to match certification history format
        const transformedHistory = res.transactions.map(
          (transaction, index) => ({
            id: transaction._id,
            fullName: transaction.userId?.fullName || "N/A",
            category:
              transaction.metadata?.category ||
              transaction.submissionId?.category ||
              "N/A",
            profession:
              transaction.metadata?.profession ||
              transaction.submissionId?.profession ||
              "N/A",
            status: transaction.status,
            submittedDate: transaction.paymentDate,
            referenceId: transaction.reference,
            amount: `NGN ${transaction.amount}`,
            paymentMethod: transaction.paymentMethod,
            gatewayReference: transaction.gatewayReference,
            description: transaction.description,
            registrationType: transaction.metadata?.registrationType || "N/A",
          })
        );
        setCertificationHistory(transformedHistory);
      }),
    ]);
  }, []);

  // State to manage the currently selected certificate for viewing
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  // Ref for the certificate component, used for PDF generation
  const certificateRef = useRef(null);

  // Function to generate a random alphanumeric string for transaction reference
  function generateRandomAlphanumeric(length) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }

  // Helper functions for certification history
  const getStatusBadge = (status) => {
    const statusConfig = {
      successful: { color: "bg-green-100 text-green-800", text: "Successful" },
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      failed: { color: "bg-red-100 text-red-800", text: "Failed" },
      approved: { color: "bg-green-100 text-green-800", text: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
    };
    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      text: status,
    };
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  // Filter and search certification history
  const filteredHistory = certificationHistory.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" ||
      item.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHistory = filteredHistory.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewHistory = (item) => {
    setSelectedHistoryItem(item);
  };

  const handleEditHistory = (item) => {
    // Switch to register tab and populate form with item data
    setFormData({
      certificationType: item.category.toLowerCase(),
      nuberOfYears: item.years.toString(),
      name: item.fullName,
      type: "renewal",
    });
    // You would need to add a way to switch tabs programmatically
    toast.info("Switching to registration form with pre-filled data");
  };

  // Helper functions for service submissions
  const getSubmissionStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: "bg-green-100 text-green-800", text: "Active" },
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" },
    };
    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      text: status,
    };
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  // Filter and search service submissions
  const filteredSubmissions = serviceSubmissions.filter((item) => {
    const matchesSearch =
      item?.ministry?.name
        .toLowerCase()
        .includes(submissionSearchTerm.toLowerCase()) ||
      item?.submissionId?.kyc?.fullName
        .toLowerCase()
        .includes(submissionSearchTerm.toLowerCase()) ||
      item?.submissionId?.address?.state
        .toLowerCase()
        .includes(submissionSearchTerm.toLowerCase()) ||
      item?.submissionId?.profession
        .toLowerCase()
        .includes(submissionSearchTerm.toLowerCase()) ||
      item?.submissionId?.category
        .toLowerCase()
        .includes(submissionSearchTerm.toLowerCase());
    const matchesStatus =
      submissionStatusFilter === "all" ||
      item?.status === submissionStatusFilter;
    const matchesCategory =
      submissionCategoryFilter === "all" ||
      item?.submissionId?.category === submissionCategoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination for submissions
  const submissionTotalPages = Math.ceil(
    filteredSubmissions.length / submissionItemsPerPage
  );
  const submissionStartIndex =
    (submissionCurrentPage - 1) * submissionItemsPerPage;
  const submissionEndIndex = submissionStartIndex + submissionItemsPerPage;
  const currentSubmissions = filteredSubmissions.slice(
    submissionStartIndex,
    submissionEndIndex
  );

  const handleSubmissionPageChange = (page) => {
    setSubmissionCurrentPage(page);
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  const handleEditSubmission = (submission) => {
    // Navigate to edit service provider page
    const submissionData = encodeURIComponent(JSON.stringify(submission));
    window.location.href = `/dashboard/edit-service-provider?data=${submissionData}`;
  };
  const transRef = generateRandomAlphanumeric(20); // Generate a unique transaction reference
  const userCookie = getCookie("user");
  //const userData = JSON.parse(userCookie);

  const encodedListingType = encodeURIComponent(formData.type);
  const encodedCertificationType = encodeURIComponent(
    formData.certificationType
  );
  const encodedName = encodeURIComponent(formData.name); // Good practice
  const encodedYears = encodeURIComponent(formData.nuberOfYears); // Good practice

  // Configuration for Credo payment gateway
  const config = {
    key: "0PUB1347IvOpGudi0qVM7ugiH46HcYbp",
    customerFirstName: "userData.fullName",
    email: "userData.email@gmail.com",
    amount: 109000,
    currency: "NGN",
    bearer: 0,
    reference: transRef,
    customerPhoneNumber: "userData.phoneNumber",
    callbackUrl: `${BASE_URL}/dashboard/certification?payment=true&nuberOfYears=${encodedYears}&certificationType=${encodedCertificationType}&name=${encodedName}&type=${encodedListingType}`,
    onClose: () => {
      console.log("Credo Widget Closed");
    },
    callBack: (response) => {
      window.location.href = response.callbackUrl;
    },
  };

  // Initialize Credo payment hook
  const credoPayment = useCredoPayment(config);

  // Function to print transaction receipt
  const printReceipt = (transaction) => {
    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
            position: relative;
          }
          
          /* Watermark */
          .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.08);
            z-index: 1;
            pointer-events: none;
            white-space: nowrap;
            text-align: center;
            line-height: 1;
          }
          
          .receipt {
            max-width: 400px;
            margin: 0 auto;
            border: 2px solid #333;
            padding: 20px;
            background: white;
            position: relative;
            z-index: 2;
          }
          
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
            position: relative;
          }
          
          .header h1 {
            margin: 0;
            color: #333;
            font-size: 24px;
          }
          
          .header p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
          }
          
          .details {
            margin-bottom: 20px;
          }
          
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
          }
          
          .detail-label {
            font-weight: bold;
            color: #333;
          }
          
          .detail-value {
            color: #666;
          }
          
          .amount {
            font-size: 18px;
            font-weight: bold;
            color: #28a745;
          }
          
          .status {
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
          }
          
          .status.successful {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }
          
          .status.pending {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
          }
          
          .status.failed {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }
          
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #333;
            font-size: 12px;
            color: #666;
          }
          
          /* Security features */
          .security-text {
            font-size: 10px;
            color: #999;
            text-align: center;
            margin-top: 10px;
            font-style: italic;
          }
          
          @media print {
            body { margin: 0; }
            .receipt { border: none; }
            .watermark { 
              color: rgba(0, 0, 0, 0.12) !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <!-- Watermark -->
        <div class="watermark">
          BENUE STATE<br>GOVERNMENT
        </div>
        
        <div class="receipt">
          <div class="header">
            <h1>BENUE STATE</h1>
            <p>Service Provider Registration</p>
            <p>Payment Receipt</p>
          </div>
          
          <div class="details">
            <div class="detail-row">
              <span class="detail-label">Receipt No:</span>
              <span class="detail-value">${transaction.referenceId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date:</span>
              <span class="detail-value">${new Date(
                transaction.submittedDate
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Customer Name:</span>
              <span class="detail-value">${transaction.fullName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service Category:</span>
              <span class="detail-value">${transaction.category}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Profession:</span>
              <span class="detail-value">${transaction.profession}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Registration Type:</span>
              <span class="detail-value">${transaction.registrationType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment Method:</span>
              <span class="detail-value">${transaction.paymentMethod}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Gateway Ref:</span>
              <span class="detail-value">${transaction.gatewayReference}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Description:</span>
              <span class="detail-value">${transaction.description}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value amount">${transaction.amount}</span>
            </div>
          </div>
          
          <div class="status ${transaction.status}">
            Status: ${transaction.status.toUpperCase()}
          </div>
          
          <div class="footer">
            <p>Thank you for your payment!</p>
            <p>This is an official receipt from Benue State Government</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <div class="security-text">
              This document contains security features to prevent unauthorized copying
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Function to handle PDF download of the selected certificate
  const downloadCertificateAsPdf = async () => {
    try {
      if (!certificateRef.current) {
        console.error("Certificate element not found for PDF generation.");
        toast.error("Certificate element not found. Please try again.");
        return;
      }

      if (!selectedCertificate) {
        console.error("No certificate selected for download.");
        toast.error("No certificate selected for download.");
        return;
      }

      console.log("Starting PDF generation...");
      const element = certificateRef.current;

      // Show loading toast
      toast.success("Generating PDF...", {
        duration: 10000,
      });

      // Generate canvas from the certificate element, increasing scale for better resolution
      // useCORS: true is important if the certificate includes images from other domains (like a logo)
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#f5f5f5",
        width: element.scrollWidth,
        height: element.scrollHeight,
      });

      console.log("Canvas generated, creating PDF...");
      const imgData = canvas.toDataURL("image/png"); // Get image data as PNG

      // Initialize jsPDF in landscape (l), millimeters (mm), A4 size
      const pdf = new jsPDF("l", "mm", "a4");
      const imgWidth = 297; // A4 landscape width in mm
      const pageHeight = 210; // A4 landscape height in mm

      // Calculate image height while maintaining aspect ratio to fit the width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let finalImgWidth = imgWidth;
      let finalImgHeight = imgHeight;

      // If the image height exceeds page height, scale it down to fit the page height
      if (imgHeight > pageHeight) {
        finalImgHeight = pageHeight;
        finalImgWidth = (canvas.width * finalImgHeight) / canvas.height;
      }

      // Add the image to the PDF, centered horizontally
      const xPosition = (imgWidth - finalImgWidth) / 2;
      pdf.addImage(imgData, "PNG", xPosition, 0, finalImgWidth, finalImgHeight);

      // Save the PDF with a dynamic filename using the correct certificate ID
      const certificateId =
        selectedCertificate.certificateReferenceId ||
        selectedCertificate._id ||
        "certificate";
      const filename = `certificate_${certificateId}.pdf`;

      console.log("Saving PDF as:", filename);
      pdf.save(filename);

      // Show success toast
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  // Function to handle form submission (triggers payment)
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault(); // Prevent default form submission
    // Trigger the Credo payment modal
    credoPayment();
  };
  if (loading) {
    return (
      <div className="text-center text-gray-600 p-10 flex flex-col items-center justify-center">
        <svg
          className="animate-spin h-10 w-10 text-green-500 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="text-xl font-semibold">Loading...</p>
        <p className="text-gray-500">Fetching your certificates</p>
      </div>
    );
  }
  if (!hasKyc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-600 flex flex-col justify-center items-center -mt-32">
          <p className="text-md font-semibold mb-8">
            Please complete your KYC verification to access this page
          </p>
          <Link href="/dashboard/kycverification">
            <Button className="bg-green-500 text-white hover:bg-green-600">
              Complete KYC Verification
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-8">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "green",
            color: "white",
          },
        }}
        closeButton={true}
      />
      {/* Tabs for switching between viewing and registering certificates */}
      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="view">View Certificates</TabsTrigger>
          {/* <TabsTrigger value="register">Register for Certification</TabsTrigger> */}
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="submissions">My Submissions</TabsTrigger>
        </TabsList>

        {/* Content for "View Certificates" tab */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedCertificate
                  ? "Certificate Details"
                  : "My Certificates"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCertificate ? (
                // Display details of the selected certificate
                <div className="flex flex-col items-center w-full space-y-4">
                  <div className="flex justify-between w-full">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCertificate(null)}
                    >
                      Back to List
                    </Button>
                    {/* Button to download the certificate as PDF */}
                    <Button onClick={downloadCertificateAsPdf}>
                      Download as PDF
                    </Button>
                  </div>
                  {/* Render the EnhancedCertificate component with the selected certificate data */}
                  <EnhancedCertificate
                    ref={certificateRef}
                    {...selectedCertificate}
                  />
                </div>
              ) : (
                // Display a list of all available certificates
                <div className="space-y-4 p-4 rounded-md border border-green-100 bg-gray-50">
                  {" "}
                  {/* Added bg-gray-50 for a subtle background */}
                  {certificates?.length > 0 ? (
                    <ScrollArea className="h-[400px] pr-4 ">
                      {certificates?.map((cert) => (
                        <div
                          key={cert.certificateReferenceId} // Use the new unique ID
                          className="p-5 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 transition-all duration-300 shadow-md mb-4 flex flex-col space-y-2" // Enhanced styling
                          onClick={() => setSelectedCertificate(cert)}
                        >
                          <h3 className="font-extrabold text-xl text-green-700">
                            {" "}
                            {/* Stronger heading */}
                            {cert.certificationAddressedTo
                              .charAt(0)
                              .toUpperCase() +
                              cert.certificationAddressedTo.slice(1)}
                          </h3>
                          <div className="text-sm text-gray-700 flex items-center">
                            <span className="mr-2 text-green-500">📄</span>{" "}
                            {/* Document icon */}
                            <b>Certificate ID: </b>
                            <span className="font-semibold ml-1">
                              {cert.certificateReferenceId}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 flex items-center">
                            <span className="mr-2 text-green-500">🏷️</span>{" "}
                            {/* Tag icon */}
                            <b>Type: </b>
                            <span className="capitalize ml-1">
                              {cert.certificationType}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 flex items-center">
                            <span className="mr-2 text-green-500">🗓️</span>{" "}
                            {/* Calendar icon */}
                            <b>Expiry: </b>
                            <span className="ml-1">
                              {new Date(cert.expirationDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No certificates found. Register for a new certification to
                      get started.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content for "Register for Certification" tab */}
        {/* <TabsContent value="register">
          <Card className="max-w-lg mx-auto my-10">
            <CardHeader>
              <CardTitle className="text-md">
                Certification Application
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="certificationType"
                    className="text-base font-medium text-sm"
                  >
                    Certification Type
                  </Label>
                  <Select
                    value={formData.certificationType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, certificationType: value })
                    }
                    required // Make this field required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select certification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="property">Property</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-base text-sm font-medium"
                  >
                    Name for Certificate
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter name to show on certificate"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required // Make this field required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="type"
                    className="text-base text-sm font-medium"
                  >
                    Application Type
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => {
                      setFormData({ ...formData, type: value });
                    }}
                    required // Make this field required
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select application type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="renewal">Renewal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(formData.type === "renewal" || formData.type === "new") && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="renewalYears"
                      className="text-base text-sm font-medium"
                    >
                      Number of Years
                    </Label>
                    <Select
                      value={formData.nuberOfYears}
                      // onValueChange={(value) => setRenewalYears(value)}

                      onValueChange={(value) =>
                        setFormData({ ...formData, nuberOfYears: value })
                      }
                      required // Make this field required for renewal
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Year (NGN 5,000)</SelectItem>
                        <SelectItem value="2">2 Years (NGN 10,000)</SelectItem>
                        <SelectItem value="3">3 Years (NGN 15,000)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full mt-6"
                >
                  {" "}
                  {loading
                    ? "Processing certification...."
                    : "Proceed to Payment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent> */}

        {/* Content for "Certification History" tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedHistoryItem ? (
                // Display details of the selected history item
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedHistoryItem(null)}
                    >
                      Back to List
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => printReceipt(selectedHistoryItem)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Receipt
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4">
                      {selectedHistoryItem.fullName}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Reference ID</p>
                        <p className="font-semibold">
                          {selectedHistoryItem.referenceId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Gateway Reference
                        </p>
                        <p className="font-semibold">
                          {selectedHistoryItem.gatewayReference}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-semibold">
                          {selectedHistoryItem.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Profession</p>
                        <p className="font-semibold">
                          {selectedHistoryItem.profession}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <div className="mt-1">
                          {getStatusBadge(selectedHistoryItem.status)}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <p className="font-semibold capitalize">
                          {selectedHistoryItem.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Date</p>
                        <p className="font-semibold">
                          {new Date(
                            selectedHistoryItem.submittedDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Amount</p>
                        <p className="font-semibold text-green-600">
                          {selectedHistoryItem.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Registration Type
                        </p>
                        <p className="font-semibold capitalize">
                          {selectedHistoryItem.registrationType}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800">
                        <strong>Description:</strong>{" "}
                        {selectedHistoryItem.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Display the history table with filters and search
                <div className="space-y-4">
                  {/* Search and Filter Controls */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search by name, profession, reference ID, or description..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="successful">Successful</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="services">Services</SelectItem>
                          <SelectItem value="Creative & Artisanal Work">
                            Creative & Artisanal Work
                          </SelectItem>
                          <SelectItem value="Repair & Maintenance">
                            Repair & Maintenance
                          </SelectItem>
                          <SelectItem value="Event & Entertainment Services">
                            Event & Entertainment
                          </SelectItem>
                          <SelectItem value="Healthcare Services">
                            Healthcare Services
                          </SelectItem>
                          <SelectItem value="Educational Services">
                            Educational Services
                          </SelectItem>
                          <SelectItem value="Agricultural Services">
                            Agricultural Services
                          </SelectItem>
                          <SelectItem value="Transportation Services">
                            Transportation Services
                          </SelectItem>
                          <SelectItem value="Technology Services">
                            Technology Services
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* History Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Full Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Profession</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Payment Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentHistory.length > 0 ? (
                          currentHistory.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">
                                {item.fullName}
                              </TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.profession}</TableCell>
                              <TableCell className="font-semibold">
                                {item.amount}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(item.status)}
                              </TableCell>
                              <TableCell>
                                {new Date(
                                  item.submittedDate
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewHistory(item)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => printReceipt(item)}
                                    className="text-green-600 border-green-600 hover:bg-green-50"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center py-8 text-gray-500"
                            >
                              No payment history found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, filteredHistory.length)} of{" "}
                        {filteredHistory.length} entries
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </Button>
                        <div className="flex gap-1">
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                          ).map((page) => (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content for "My Submissions" tab */}
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>My Service Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by ministry, name, profession, or category..."
                      value={submissionSearchTerm}
                      onChange={(e) => setSubmissionSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={submissionStatusFilter}
                    onValueChange={setSubmissionStatusFilter}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={submissionCategoryFilter}
                    onValueChange={setSubmissionCategoryFilter}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Repair & Maintenance">
                        Repair & Maintenance
                      </SelectItem>
                      <SelectItem value="Event & Entertainment Services">
                        Event & Entertainment
                      </SelectItem>
                      <SelectItem value="Healthcare Services">
                        Healthcare Services
                      </SelectItem>
                      <SelectItem value="Educational Services">
                        Educational Services
                      </SelectItem>
                      <SelectItem value="Agricultural Services">
                        Agricultural Services
                      </SelectItem>
                      <SelectItem value="Transportation Services">
                        Transportation Services
                      </SelectItem>
                      <SelectItem value="Technology Services">
                        Technology Services
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ministry</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Profession</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSubmissions.length > 0 ? (
                      currentSubmissions.map((submission) => (
                        <TableRow key={submission._id}>
                          <TableCell className="font-medium">
                            {submission?.ministry?.name || "Not Assigned"}
                          </TableCell>
                          <TableCell>
                            {submission?.submissionId?.kyc?.fullName}
                          </TableCell>
                          <TableCell>
                            {submission?.submissionId?.profession}
                          </TableCell>
                          <TableCell>
                            {submission?.submissionId?.category}
                          </TableCell>
                          <TableCell>
                            {getSubmissionStatusBadge(submission?.status)}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              submission?.dateOfSubmission
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewSubmission(submission)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSubmission(submission)}
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-gray-500"
                        >
                          No service submissions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {submissionTotalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {submissionStartIndex + 1} to{" "}
                    {Math.min(submissionEndIndex, filteredSubmissions.length)}{" "}
                    of {filteredSubmissions.length} entries
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSubmissionPageChange(submissionCurrentPage - 1)
                      }
                      disabled={submissionCurrentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="flex gap-1">
                      {Array.from(
                        { length: submissionTotalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <Button
                          key={page}
                          variant={
                            submissionCurrentPage === page
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleSubmissionPageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleSubmissionPageChange(submissionCurrentPage + 1)
                      }
                      disabled={submissionCurrentPage === submissionTotalPages}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Comprehensive Submission View Modal */}
      {showSubmissionModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedSubmission.name}
                </h2>
                <div className="flex gap-2">
                  {getSubmissionStatusBadge(selectedSubmission.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSubmissionModal(false)}
                  >
                    ✕
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Information */}
                <div className="space-y-3">
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-blue-600" />
                      Basic Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">Full Name</p>
                          <p className="text-sm font-medium">
                            {selectedSubmission?.submissionId?.kyc?.fullName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">Address</p>
                          <p className="text-sm font-medium">
                            {selectedSubmission?.submissionId?.address?.street},{" "}
                            {selectedSubmission?.submissionId?.address?.city},{" "}
                            {selectedSubmission?.submissionId?.address?.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">Profession</p>
                          <p className="text-sm font-medium">
                            {selectedSubmission?.submissionId?.profession}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">
                            Years of Experience
                          </p>
                          <p className="text-sm font-medium">
                            {
                              selectedSubmission?.submissionId
                                ?.yearsOfExperience
                            }{" "}
                            years
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Key className="w-3 h-3 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">
                            Specialization
                          </p>
                          <p className="text-sm font-medium">
                            {selectedSubmission?.submissionId?.specialization}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h3 className="text-sm font-semibold text-green-900 mb-3 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-green-600" />
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">Email</p>
                          <p className="text-sm font-medium">
                            {selectedSubmission?.agentId?.email ||
                              "Not Available"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">Phone Number</p>
                          <p className="text-sm font-medium">
                            {selectedSubmission?.agentId?.phoneNumber ||
                              "Not Available"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Building2 className="w-3 h-3 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">Ministry</p>
                          <p className="text-sm font-medium">
                            {selectedSubmission?.ministry?.name ||
                              "Not Assigned"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-3">
                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-purple-600" />
                      Service Details
                    </h3>
                    <div className="space-y-2">
                      <div className="border border-purple-100 rounded p-3 bg-white">
                        <div className="flex items-center mb-2">
                          <Settings className="w-3 h-3 mr-2 text-gray-500" />
                          <p className="text-xs font-medium">
                            Category: {selectedSubmission.submissionId.category}
                          </p>
                        </div>
                        <div className="mb-2">
                          <p className="text-xs text-gray-600 mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedSubmission.submissionId.skills.map(
                              (skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-800 text-xs px-1 py-0.5"
                                >
                                  {skill}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                        <div className="mb-2">
                          <p className="text-xs text-gray-600 mb-1">
                            Service Areas:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {selectedSubmission.submissionId.serviceAreas.map(
                              (area, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 text-xs px-1 py-0.5"
                                >
                                  {area}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                        <div className="mb-2">
                          <p className="text-xs text-gray-600 mb-1">
                            Availability:{" "}
                            <span className="font-medium">
                              {selectedSubmission.submissionId.availability}
                            </span>
                          </p>
                        </div>
                        <div className="mb-2">
                          <p className="text-xs text-gray-600 mb-1">
                            Education Level:{" "}
                            <span className="font-medium">
                              {selectedSubmission.submissionId.educationLevels}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                    <h3 className="text-sm font-semibold text-orange-900 mb-3 flex items-center">
                      <Database className="w-4 h-4 mr-2 text-orange-600" />
                      Operating Hours
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">Weekdays</p>
                          <p className="text-sm font-medium">
                            {
                              selectedSubmission.submissionId.operatingHours
                                .weekdays.from
                            }{" "}
                            -{" "}
                            {
                              selectedSubmission.submissionId.operatingHours
                                .weekdays.to
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs text-gray-600">Weekends</p>
                          <p className="text-sm font-medium">
                            {
                              selectedSubmission.submissionId.operatingHours
                                .weekends.from
                            }{" "}
                            -{" "}
                            {
                              selectedSubmission.submissionId.operatingHours
                                .weekends.to
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Service Description
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedSubmission?.submissionId?.serviceDescription ||
                      "No description available"}
                  </p>
                </div>
              </div>

              {/* Licenses Section */}
              <div className="mt-4">
                <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50">
                  <h3 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                    Licenses & Certifications
                  </h3>
                  <div className="space-y-3">
                    {selectedSubmission?.submissionId?.licenses &&
                    selectedSubmission.submissionId.licenses.length > 0 ? (
                      selectedSubmission.submissionId.licenses.map(
                        (license, index) => (
                          <div
                            key={index}
                            className="border border-indigo-100 rounded p-3 bg-white"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-600">
                                  License Name
                                </p>
                                <p className="text-sm font-medium">
                                  {license.name || "Not Specified"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">
                                  License Number
                                </p>
                                <p className="text-sm font-medium">
                                  {license.number || "Not Specified"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">
                                  Issuing Authority
                                </p>
                                <p className="text-sm font-medium">
                                  {license.authority || "Not Specified"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">
                                  Issue Date
                                </p>
                                <p className="text-sm font-medium">
                                  {license.issued
                                    ? new Date(
                                        license.issued
                                      ).toLocaleDateString()
                                    : "Not Specified"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">
                                  Expiry Date
                                </p>
                                <p className="text-sm font-medium">
                                  {license.expires
                                    ? new Date(
                                        license.expires
                                      ).toLocaleDateString()
                                    : "Not Specified"}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">
                                  Document
                                </p>
                                <p className="text-sm font-medium">
                                  {license.document ? (
                                    <a
                                      href={license.document}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-xs"
                                    >
                                      View Document
                                    </a>
                                  ) : (
                                    "Not Available"
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-center py-3 text-gray-500 text-sm">
                        No licenses or certifications available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Portfolio Section */}
              <div className="mt-4">
                <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                  <h3 className="text-sm font-semibold text-purple-900 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-purple-600" />
                    Portfolio & Work Samples
                  </h3>
                  <div className="space-y-3">
                    {selectedSubmission?.submissionId?.portfolio &&
                    selectedSubmission.submissionId.portfolio.length > 0 ? (
                      selectedSubmission.submissionId.portfolio.map(
                        (item, index) => (
                          <div
                            key={index}
                            className="border border-purple-100 rounded p-3 bg-white"
                          >
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-gray-600">Title</p>
                                <p className="text-sm font-medium">
                                  {item.title}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">
                                  Description
                                </p>
                                <p className="text-sm text-gray-700">
                                  {item.description}
                                </p>
                              </div>
                              {item.date && (
                                <div>
                                  <p className="text-xs text-gray-600">Date</p>
                                  <p className="text-sm font-medium">
                                    {new Date(item.date).toLocaleDateString()}
                                  </p>
                                </div>
                              )}
                              {item.images && item.images.length > 0 && (
                                <div>
                                  <p className="text-xs text-gray-600 mb-2">
                                    Images
                                  </p>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {item.images.map((image, imgIndex) => (
                                      <div key={imgIndex} className="relative">
                                        <img
                                          src={image}
                                          alt={`Portfolio ${
                                            index + 1
                                          } - Image ${imgIndex + 1}`}
                                          className="w-full h-20 object-cover rounded border"
                                          onError={(e) => {
                                            e.target.src =
                                              "https://via.placeholder.com/150x100?text=Image+Not+Available";
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="text-center py-3 text-gray-500 text-sm">
                        No portfolio items available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes (if applicable) */}
              {selectedSubmission.notes && (
                <div
                  className={`mt-6 p-4 rounded-lg ${
                    selectedSubmission.status === "rejected" ||
                    selectedSubmission.status === "pending"
                      ? "bg-red-50 border border-red-200"
                      : "bg-green-50 border border-green-200"
                  }`}
                >
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      selectedSubmission.status === "rejected" ||
                      selectedSubmission.status === "pending"
                        ? "text-red-900"
                        : "text-green-900"
                    }`}
                  >
                    Notes
                  </h3>
                  <p
                    className={
                      selectedSubmission.status === "rejected" ||
                      selectedSubmission.status === "pending"
                        ? "text-red-800"
                        : "text-green-800"
                    }
                  >
                    {selectedSubmission.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowSubmissionModal(false)}
                >
                  Close
                </Button>
                {(selectedSubmission.status === "pending" ||
                  selectedSubmission.status === "rejected") && (
                  <Button
                    onClick={() => handleEditSubmission(selectedSubmission)}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Submission
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CertificationPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center text-gray-600 p-10 flex flex-col items-center justify-center">
          <svg
            className="animate-spin h-10 w-10 text-green-500 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-xl font-semibold">Loading...</p>
          <p className="text-gray-500">
            Please wait while we load the certification page
          </p>
        </div>
      }
    >
      <CertificationContent />
    </Suspense>
  );
}
