import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, User, Send, FileText, UploadCloud, 
  HelpCircle, ShieldCheck, CheckCircle2, Sparkles, LogOut, ChevronRight
} from "lucide-react";

export default function InterviewRoom() {
  const [status, setStatus] = useState("NOT_STARTED");
  const [primaryQuestions, setPrimaryQuestions] = useState("");
  const [followupQuestions, setFollowupQuestions] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [jobProfile, setJobProfile] = useState({ title: "AI Systems Engineering Suite", company: "TalentCore Analytics" });
  
  const token = localStorage.getItem("access_token") || localStorage.getItem("token") || "";
  const applicationId = localStorage.getItem("active_application_id") || "";
  const API_BASE = "http://localhost:8000/api";

  // ... Keep all your existing polling loops and submission fetch functions identical here ...

  return (
    <div className="min-h-screen bg-[#090d16] bg-radial-gradient flex flex-col font-sans antialiased text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* BACKGROUND ABSTRACT LUMINESCENT GLOW MARKERS */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. HIGH-END FROSTED GLASS NAVIGATION STRIP HEADER */}
      <header className="bg-slate-950/60 backdrop-blur-md border-b border-slate-900 px-6 py-4 sticky top-0 z-40 flex items-center justify-between shadow-lg shadow-slate-950/20">
        <div className="flex items-center gap-3.5">
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
              TalentCore Candidate Pod
              <span className="text-[9px] tracking-widest font-black uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-900/50 px-1.5 py-0.5 rounded-md">LIVE</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400">Autonomous Cognitive Screening & Consultation Suite</p>
          </div>
        </div>

        {/* ACCOUNT STATUS AND DISCONNECT RIGGING */}
        <div className="flex items-center gap-4">
          <div className="text-right border-r border-slate-800 pr-4">
            <p className="text-xs font-bold text-slate-200">{localStorage.getItem("user_name") || "Verified Candidate"}</p>
            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">{jobProfile.title}</p>
          </div>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 py-1.5 px-3 rounded-xl border border-slate-800 hover:border-rose-900/50 text-xs font-bold transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>
      {/* 2. CHIEF INTERACTIVE SECTOR WORKSPACE CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 flex flex-col justify-center relative z-10">
        
        {/* CONDITIONAL BLOCK A: INITIAL NOT_STARTED WELCOME WELVIEW DESK */}
        {status === "NOT_STARTED" && (
          <div className="bg-slate-950/40 border border-slate-900 rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center gap-8 max-w-3xl mx-auto animate-fade-in">
            
            {/* LINKED ROBOTIC AI AGENT WORKSPACE ILLUSTRATION EMBED FROM THE WEB */}
            <div className="w-48 h-48 md:w-56 md:h-56 shrink-0 relative flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner group">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <img 
                src="https://unsplash.com" 
                alt="AI Agent" 
                className="w-full h-full object-cover rounded-xl shadow-md mix-blend-screen opacity-85 filter brightness-110 contrast-105"
              />
            </div>

            {/* SCREENING OVERVIEW TEXT FIELDS PANEL */}
            <div className="flex-1 text-left space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 animate-spin-slow" /> Security Authorization Valid
                </span>
                <h2 className="text-xl font-black text-white tracking-tight">Initialize Your Assessment Portfolio</h2>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">
                  Welcome to your screening gateway. Our background multi-agent framework will cross-examine your uploaded profile matrices to tailor custom real-time scenario queries.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-[11px] text-slate-300 font-medium leading-relaxed">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3 Contextual Core Architectural Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>2 Deep-Dive Scenario Inquiries Based on Gaps</span>
                </div>
              </div>

              {/* DOCKER RESUME FILE TRACK UPLOADER TRIGGER BOX */}
              <div className="border border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-950/80 p-5 rounded-2xl text-center cursor-pointer transition-all group shadow-inner">
                <UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-emerald-400 mx-auto mb-2 transition-colors duration-200" />
                <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">Drag and drop your technical CV PDF</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Standard structural matrix text layers preferred</p>
              </div>
            </div>
          </div>
        )}
        {/* CONDITIONAL BLOCK B: CONVERSATIONAL CHAT SCREEN ENGINE (PRIMARY & FOLLOWUP QUEUES) */}
        {status !== "NOT_STARTED" && (
          <div className="flex-1 flex flex-col md:flex-row gap-6 items-stretch h-[76vh] animate-fade-in">
            
            {/* LEFT CONTAINER: STABLE CHAT MESSAGES LOG VIEWPORT LANE */}
            <div className="flex-1 bg-slate-950/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden relative">
              
              {/* CHAT MESSAGES PANEL DISPLAY VIEW (Scrolls independently) */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 select-none">
                
                {/* SYSTEM BOT MESSAGE STREAM CELL */}
                <div className="flex items-start gap-3 text-left">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white p-2 rounded-xl border border-emerald-400/20 shadow-md shadow-emerald-500/10 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 max-w-2xl text-xs font-medium text-slate-200 leading-relaxed shadow-xs">
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Core Agent Inquiry Report
                    </div>
                    {status === "PRIMARY_QUESTIONS_READY" || status === "PRIMARY_ANSWERS_SUBMITTED" ? primaryQuestions : followupQuestions}
                  </div>
                </div>

                {/* CONDITIONAL RENDER: SHOW CANDIDATE RESPONSES IF ARCHIVED */}
                {status === "FOLLOWUP_QUESTIONS_READY" && (
                  <div className="flex items-start gap-3 justify-end text-right">
                    <div className="bg-emerald-600/10 border border-emerald-500/20 text-emerald-200 rounded-2xl p-4 max-w-xl text-xs font-medium leading-relaxed shadow-2xs">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Your Defense Response Matrix</div>
                      Verified parameters submitted to database.
                    </div>
                    <div className="bg-slate-800 border border-slate-700 text-white p-2 rounded-xl mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}
              </div>

              {/* TEXT FIELD INPUT DIALOGUE BOX CONTROL FOOTER STRIP */}
              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-2">
                <input 
                  type="text" 
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Formulate your detailed technical defense statement..." 
                  className="flex-1 bg-slate-950/60 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 shadow-inner"
                />
                <button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white p-2.5 rounded-xl border border-emerald-500/20 shadow-md shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT CONTAINER: DYNAMIC PROCESSING VECTOR ORB MONITOR PANEL */}
            <div className="w-[300px] bg-slate-950/40 border border-slate-900 rounded-3xl p-6 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center shrink-0 overflow-hidden relative group">
              
              {/* ORB HEADER DESCRIPTION CONTAINER */}
              <div className="absolute top-6 text-center w-full px-4">
                <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase block">Telemetry Monitor</span>
                <span className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-wide flex items-center justify-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${loading ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
                  {loading ? "Agent Processing Matrix" : "System Core Synchronized"}
                </span>
              </div>

              {/* PREMIUM CORE PULSING CUSTOM WEB ORB SHAPE COMPONENT */}
              <div className="relative w-36 h-36 flex items-center justify-center select-none">
                <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${loading ? "bg-purple-500/20 animate-pulse" : "bg-emerald-500/15"}`} />
                <div className={`w-28 h-28 rounded-full border border-white/5 bg-gradient-to-tr transition-all duration-500 ${
                  loading 
                    ? "from-purple-900/60 via-indigo-950 to-fuchsia-900/40 animate-spin border-purple-500/30 scale-[1.04]" 
                    : "from-emerald-950/60 via-slate-950 to-teal-900/40 animate-pulse border-emerald-500/20"
                } flex items-center justify-center shadow-2xl`}>
                  <Bot className={`w-8 h-8 transition-colors ${loading ? "text-purple-400 animate-bounce" : "text-emerald-400"}`} />
                </div>
              </div>

              {/* ORB FOOTER DATA TRANSCRIPTS TEXT BLOCK */}
              <div className="absolute bottom-6 text-center w-full px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed max-w-[220px]">
                {loading ? "Crunching token structural vectors..." : "Awaiting input fields responses..."}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
