import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles, Shield, Mail } from "lucide-react";

export default function AgentSignupSuccess() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute bottom-40 right-10 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-lg w-full border border-white/20">
          {/* Success Icon with Animation */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-full shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
              Account Created Successfully!
            </h1>
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-600 font-medium">Welcome Onboard!</span>
            </div>
          </div>

          {/* Info Cards */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 text-sm">Ministry Approval Required</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Your account will be reviewed by the ministry you selected for approval.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-100">
              <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900 text-sm">Confirmation Email</h3>
                <p className="text-green-700 text-sm mt-1">
                  You'll receive a confirmation email once your account is approved.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <Link 
              href="/login" 
              className="group inline-flex items-center justify-center w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <p className="text-xs text-gray-500 mt-4">
              You can also check your email for further instructions
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 text-green-400 opacity-20">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="absolute bottom-10 left-10 text-blue-400 opacity-20">
          <CheckCircle className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
} 