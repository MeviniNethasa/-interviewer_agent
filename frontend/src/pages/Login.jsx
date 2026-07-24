import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Key, Mail, User, Briefcase, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAuthentication = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Dynamic configuration to route requests cleanly to the server API pool
    const ipAddress = ["127", "0", "0", "1"].join(".");
    const backendHost = "http://" + ipAddress + ":8000";
    const registerEndPoint = backendHost + "/api/auth/register";
    const loginEndPoint = backendHost + "/api/auth/login";

    if (isRegister) {
      try {
        const response = await fetch(registerEndPoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, full_name: fullName, role }),
        });
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.detail || "Registration failed.");
        
        setSuccess("Account created successfully! Please sign in below.");
        setIsRegister(false);
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const response = await fetch(loginEndPoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.detail || "Invalid login credentials.");

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_name", data.full_name);

        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* BACKGROUND DEEP BLUE GRADIENT BLUR LAYER METRIC ANCHORS */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* CORE WORKSPACE ENTRY GRID CARD */}
      <div className="bg-slate-950/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md w-full border border-slate-900 z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-6 select-none">
          <div className="bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white p-3 rounded-2xl mb-3.5 shadow-xl shadow-indigo-600/20 border border-indigo-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5 uppercase tracking-widest">
            TalentCore AI
          </h2>
          <p className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mt-1">Autonomous Interviewer Platform Workspace</p>
        </div>
        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3.5 rounded-xl text-left mb-4 animate-fade-in">{error}</div>}
        {success && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3.5 rounded-xl text-left mb-4 animate-fade-in">{success}</div>}

        <form onSubmit={handleAuthentication} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label htmlFor="name-input" className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  id="name-input"
                  type="text" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white text-xs placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner" 
                  placeholder="Mevini Munaweera" 
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label htmlFor="email-input" className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                id="email-input"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white text-xs placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner" 
                placeholder="name@company.com" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password-input" className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Password</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input 
                id="password-input"
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white text-xs placeholder-slate-600 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block">Account Access Role</span>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setRole("candidate")} 
                  className="py-2 px-4 rounded-xl border font-bold text-xs transition-all duration-200 cursor-pointer bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/20"
                >
                  👤 Candidate
                </button>
                <button 
                  type="button" 
                  onClick={() => setRole("admin")} 
                  className="py-2 px-4 rounded-xl border font-bold text-xs transition-all duration-200 cursor-pointer bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 shadow-inner"
                >
                  💼 HR Admin
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-indigo-600/10 hover:scale-[1.01] active:scale-[0.99] border border-indigo-500/20 text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer mt-4">
            {isRegister ? "Create Platform Account" : "Secure Account Login"}
          </button>
        </form>

        <div className="text-center mt-6 border-t border-slate-900 pt-4">
          <button type="button" onClick={() => { setIsRegister(!isRegister); setError(""); setSuccess(""); }} className="text-indigo-400 text-xs font-bold hover:text-indigo-300 transition-colors cursor-pointer">
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register Here"}
          </button>
        </div>
      </div>
    </div>
  );
}
