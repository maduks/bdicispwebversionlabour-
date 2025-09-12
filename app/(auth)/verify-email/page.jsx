"use client";

import { useRouter, useSearchParams } from "next/navigation";
import VerifyEmail from "@/components/auth/VerifyEmail";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
// Client component that uses useSearchParams
function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const userId = searchParams.get("userID") || "";
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [verifying, setVerifying] = useState(false);
  const handleVerify = async (code) => {
    setVerifying(true);
    axios
      .post("https://ministryoflabourbackend.vercel.app/api/v1/users/verify", {
        userID: userId,
        veri_code: code,
      })
      .then((res) => {
        console.log(res.data.message);
        if (res.data.message === "Account verified sucessfully!") {
          setVerifying(false);
          setSuccess(true);
          setMessage("Email verified successfully!");
          // Check if there's a redirect URL stored
          const redirectUrl = sessionStorage.getItem(
            "redirectAfterVerification"
          );
          if (redirectUrl) {
            sessionStorage.removeItem("redirectAfterVerification");
            setTimeout(() => router.push(redirectUrl), 1500);
          } else {
            setTimeout(() => router.push("/login"), 1500);
          }
          return;
        }
        setMessage("Invalid Code!!");
        console.log;
      })
      .catch((err) => {
        console.log(err);
        setMessage("Couldn't verify email!, check code and try again");
      });
  };

  const handleResend = async () => {
    await new Promise((res) => setTimeout(res, 1000));
    setMessage("A new code has been sent to your email.");
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Success!</h2>
          <p className="text-gray-700 text-center mb-6">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <VerifyEmail
      email={email}
      loading={verifying}
      onVerify={handleVerify}
      onResend={handleResend}
    />
  );
}

// Loading fallback component
function VerifyEmailLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailLoading />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
