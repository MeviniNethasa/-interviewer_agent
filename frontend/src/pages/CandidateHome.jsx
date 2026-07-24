import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, FileText, UploadCloud, Briefcase, Award, Loader2, Sparkles, Bot } from "lucide-react";

export default function CandidateHome() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name") || "Candidate";
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const ipAddress = ["127", "0", "0", "1"].join(".");
  const API_BASE = "http://" + ipAddress + ":8000/api";

  useEffect(() => { fetchActiveJobs(); }, []);

  const fetchActiveJobs = async () => {
    try {
      const response = await fetch(`${API_BASE}/jobs`);
      if (!response.ok) throw new Error("Failed to fetch job campaigns.");
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      setError("");
    } else {
      setError("Please select a valid text-based PDF file asset.");
      setCvFile(null);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJob || !cvFile) return;

    setSubmitting(true);
    setError("");

    const token = localStorage.getItem("access_token") || localStorage.getItem("token") || "";
    const formData = new FormData();
    formData.append("file", cvFile);

    try {
      const response = await fetch(`${API_BASE}/interviews/apply/${selectedJob.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Application process failed.");

      localStorage.setItem("active_application_id", data.application_id);
      navigate("/interview-room");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col font-sans antialiased text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-300 relative overflow-x-hidden">
      
      {/* BACKGROUND LUMINESCENT NEON GLOW BLUR LABELS */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. HIGH-END FROSTED GLASS NAVIGATION STRIP HEADER */}
      <nav className="bg-slate-950/60 backdrop-blur-md border-b border-slate-900/80 px-8 py-4 sticky top-0 z-40 flex justify-between items-center shadow-lg shadow-slate-950/20">
        <div className="flex items-center gap-3 text-emerald-400 font-extrabold text-xl tracking-tight">
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-1.5 rounded-lg shadow-md shadow-emerald-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-white text-base font-black tracking-tight flex items-center gap-1.5">
            TalentCore Recruitment Hub
            <span className="text-[9px] font-black uppercase text-emerald-400 bg-emerald-950 border border-emerald-900/50 px-1.5 py-0.5 rounded-md">Candidate Portal</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-xs font-semibold">Profile: <strong className="text-emerald-400 font-bold">{userName}</strong></span>
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="flex items-center gap-1.5 bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-900/50 text-slate-400 hover:text-rose-400 text-xs font-bold py-1.5 px-3.5 rounded-xl transition-all duration-200 cursor-pointer shadow-sm">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* 2. CHIEF PLACEMENT CAMPAIGNS MONITOR CANVAS */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10 overflow-hidden">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" /> Available Corporate Placements
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    className={`p-6 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? "border-emerald-500 bg-gradient-to-b from-emerald-950/20 to-slate-950/40 ring-1 ring-emerald-500/30 shadow-xl shadow-emerald-950/30 scale-[1.01]" 
                        : "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-950/80 shadow-md"
                    }`}
                  >
                    <div>
                      <h3 className={`text-sm font-black mb-2 tracking-tight transition-colors ${isSelected ? "text-emerald-400" : "text-white"}`}>{job.title}</h3>
                      <p className="text-slate-400 text-[11px] line-clamp-4 leading-relaxed font-medium mt-1">{job.description}</p>
                    </div>
                    {isSelected && (
                      <div className="text-[9px] font-black text-emerald-400 uppercase tracking-wider mt-4 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 animate-pulse" /> Active Selection Track
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* RIGHT HAND SIDEBAR: SUBMISSION GATEWAY WITH WEB AI AGENT EMBED GRAPHIC */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Submission Uplink Gateway</h2>
          <div className="bg-slate-950/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-900 shadow-2xl flex flex-col h-fit relative group">
            
            {selectedJob ? (
              <form onSubmit={handleApply} className="space-y-5">
                <div>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-2">Target Executive Assignment</span>
                  <div className="bg-slate-950/90 border border-slate-900 rounded-xl p-3.5 font-bold text-slate-200 text-xs shadow-inner">
                    {selectedJob.title}
                  </div>
                </div>

                {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-xl text-left">{error}</div>}

                <div>
                  <label htmlFor="cv-file-input" className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Initialize Profile Upload (PDF)</label>
                  <div className="border border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-900/40 relative shadow-inner">
                    <input id="cv-file-input" type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    <UploadCloud className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                    {cvFile ? (
                      <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-[11px] bg-emerald-500/10 py-1.5 px-3 rounded-xl border border-emerald-500/20">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[160px]">{cvFile.name}</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-[11px] font-semibold">
                        <span className="text-emerald-400 font-extrabold">Browse local directory</span> or drop file
                      </div>
                    )}
                  </div>
                </div>

                <button type="submit" disabled={submitting || !cvFile} className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-600 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/5 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border border-emerald-500/10">
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Initialize Consultation Suite</span>}
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-4 space-y-5">
                
                {/* CYBERPUNK INTEGRATED FRIENDLY ROBOTIC AI AGENT WORKSPACE ASSET FROM THE WEB */}
                <div className="w-full h-40 relative rounded-xl border border-slate-900/80 bg-slate-950/60 p-2 overflow-hidden shadow-inner flex items-center justify-center">
                  <div className="absolute inset-0 bg-emerald-500/5 blur-md rounded-xl pointer-events-none" />
                  <img 
                    src="https://unsplash.com" 
                    alt="AI Recruitment Agent" 
                    className="w-full h-full object-cover rounded-lg mix-blend-screen opacity-80 filter brightness-110 contrast-105"
                  />
                </div>

                <p className="text-slate-500 font-bold text-[11px] leading-relaxed max-w-[240px] mx-auto uppercase tracking-wider">
                  Select a placement profile parameter out of the corporate registry to unfreeze the uplink gateway.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
