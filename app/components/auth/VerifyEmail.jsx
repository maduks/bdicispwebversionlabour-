"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MailCheck, Loader2 } from "lucide-react";

export default function VerifyEmail({ onVerify, onResend, email, loading }) {
  const [code, setCode] = useState(["", "", "", ""]);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const inputs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    let newCode = [...code];
    if (val === "") {
      newCode[i] = "";
      setCode(newCode);
      setError("");
      return;
    }
    newCode[i] = val[0];
    setCode(newCode);
    if (i < 3 && val) {
      inputs[i + 1].current.focus();
    }
    setError("");
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputs[i - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.some((c) => c === "")) {
      setError("Please enter the 4-digit code.");
      return;
    }
    setError("");
    try {
      await onVerify(code.join(""));
    } catch (err) {
      setError("Invalid code. Please try again.");
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    try {
      await onResend();
    } catch (err) {
      setError("Failed to resend code. Try again.");
    }
    setResendLoading(false);
  };

  return (
    <div
      style={{
        backgroundImage: `
          linear-gradient(rgba(28, 162, 96, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(28, 162, 96, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 flex flex-col items-center">
        <MailCheck className="w-12 h-12 text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Verify your email
        </h2>
        <p className="text-gray-600 text-center mb-6">
          We sent a 4-digit code to{" "}
          <span className="font-medium text-gray-900">
            {email || "your email"}
          </span>
          .<br />
          Please enter it below to verify your account.
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <div className="flex gap-3 mb-4">
            {code.map((digit, i) => (
              <input
                key={i}
                ref={inputs[i]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-12 text-2xl text-center
                 border border-gray-300
                  rounded-lg 
                 focus:outline-none
                 focus:ring-2
                 bg-white
                 focus:ring-green-500 transition"
                autoFocus={i === 0}
              />
            ))}
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg mb-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 mx-auto" />
            ) : (
              "Verify"
            )}
          </Button>
        </form>
        <div className="text-sm text-gray-600 mt-4">
          Didn&apos;t get the code?{" "}
          <button
            onClick={handleResend}
            className="text-green-600 hover:underline font-medium"
            disabled={resendLoading}
            type="button"
          >
            {resendLoading ? "Resending..." : "Resend"}
          </button>
        </div>
      </div>
    </div>
  );
}
