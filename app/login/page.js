"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { login, googleLogin } from "@/services/auth";
import { auth } from "@/services/firebase"; // Required for route protection
import { onAuthStateChanged } from "firebase/auth"; // Required to listen to auth state
import { 
  Mail, 
  Lock, 
  LogIn, 
  Loader2, 
  Eye, 
  EyeOff, 
  ArrowRight 
} from "lucide-react";

export default function Login() {
  // Form State
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  
  // UI States
  const [loading, setLoading] = useState(false); // For button clicks
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // For initial page load
  const [error, setError] = useState("");

  const router = useRouter();

  // 🛡️ Route Protection: Redirect if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated, skip login page
        router.push("/dashboard");
      } else {
        // No user found, allow them to see the login form
        setIsCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleAuth = async (type = "email") => {
    setError("");
    setLoading(true);

    try {
      if (type === "email") {
        if (!formData.email || !formData.password) {
          throw new Error("Please fill in all fields");
        }
        await login(formData.email, formData.password);
      } else {
        await googleLogin();
      }
      // Success! Move to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Authentication failed. Try again.");
      setLoading(false); // Stop loading only if there's an error so user can retry
    }
  };

  // While we check the Firebase session, show loading screen
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="text-slate-400 text-sm font-medium animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden px-4 font-sans">
      {/* Dynamic Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-500 mb-4 shadow-lg shadow-blue-500/20">
              <LogIn className="text-white h-7 w-7" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 mt-2 text-sm">Please enter your details to sign in</p>
          </div>

          {/* Error Banner */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs mb-6 flex items-center gap-2 overflow-hidden"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white transition-all placeholder:text-slate-600"
                onChange={handleChange}
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white transition-all placeholder:text-slate-600"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {/* Main Action Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAuth("email")}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <span className="flex items-center gap-2 font-bold">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-8">
            <div className="w-full border-t border-white/5"></div>
            <span className="absolute px-4 bg-[#111c2e] text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">
              Continue with
            </span>
          </div>

          {/* Social Auth */}
          <button
            onClick={() => handleAuth("google")}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-slate-300 font-medium group"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          <p className="text-center text-sm text-slate-500 mt-8">
            New here?{" "}
            <span 
              onClick={() => router.push("/signup")} 
              className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 transition-colors"
            >
              Create an account
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}