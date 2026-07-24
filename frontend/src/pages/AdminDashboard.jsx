import React, { useState, useEffect } from "react";
import { 
  Briefcase, Users, FileText, CheckCircle2, AlertCircle, XCircle,
  Search, ShieldCheck, Database, Cpu, LogOut, ArrowRight, Sparkles
} from "lucide-react";
import ScorecardView from "./ScorecardView";

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scorecard, setScorecard] = useState("");
  const [loadingAudit, setLoadingAudit] = useState(false);
  const token = localStorage.getItem("access_token") || localStorage.getItem("token") || "";
  const API_BASE = "http://localhost:8000/api";

  // 1. Initial boot loop: Scan active corporate job placement profiles
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE}/jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (err) {
        console.error("Connection link failure to jobs matrix:", err);
      }
    };
    fetchJobs();
  }, [token]);

  // 2. Click controller: Pull associated candidate funnel rows with secure authorization headers
  const handleJobSelect = async (job) => {
    setSelectedJob(job);
    setSelectedApplicant(null);
    setScorecard("");
    try {
      const res = await fetch(`${API_BASE}/interviews/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplicants(data.filter(app => app.job_id === job.id));
      }
    } catch (err) {
      console.error("Connection failure fetching applicants:", err);
    }
  };

  // 3. Click controller: Fetch verified multi-agent evaluation scorecards with secure authorization headers
  const handleApplicantSelect = async (app) => {
    setSelectedApplicant(app);
    setLoadingAudit(true);
    try {
      const res = await fetch(`${API_BASE}/interviews/status/${app.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setScorecard(data.final_scorecard || "");
      }
    } catch (err) {
      console.error("Connection failure fetching scorecard:", err);
    } finally {
      setLoadingAudit(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans antialiased text-slate-950 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. HIGH-END DEEP TECH TOP WORKSPACE NAVIGATION STRIP HEADER */}
      <header className="bg-slate-900 border-b border-slate-950 px-6 py-4 sticky top-0 z-40 flex items-center justify-between shadow-md shadow-slate-900/10">
        <div className="flex items-center gap-3.5">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
              TalentCore Operations Suite 
              <span className="text-[10px] tracking-widest font-black uppercase text-indigo-400 bg-indigo-950 border border-indigo-900/50 px-1.5 py-0.5 rounded-md">v2.1</span>
            </h1>
            <p className="text-[11px] font-medium text-slate-400">Internal HR Governance & Quality Audit Hub</p>
          </div>
        </div>

        {/* RECRUITER RUNTIME ENVIRONMENTAL METRIC CHANNELS */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5 border-r border-slate-800 pr-5 text-[11px] font-bold tracking-wide">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-900/50 shadow-inner">
              <Database className="w-3 h-3 text-emerald-400" /> DB Connect
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded-lg border border-indigo-900/50 shadow-inner">
              <Cpu className="w-3 h-3 text-indigo-400" /> Core Active
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-white tracking-wide">{localStorage.getItem("user_name") || "Operations Admin"}</p>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">HR Audit Lead</p>
            </div>
            <button 
              onClick={() => { localStorage.clear(); window.location.href = "/"; }}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 py-1.5 px-3.5 rounded-xl border border-slate-700/60 hover:border-rose-900/50 text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>
      {/* 2. MAIN OPERATIONS INTERACTION CANVAS */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR OPERATIONAL LANE: RICH NAVY SUB-PANELS */}
        <aside className="w-[430px] bg-slate-900 border-r border-slate-950 flex flex-col shrink-0 z-10 shadow-xl shadow-slate-950/50">
          
          {/* SECTION A: PREMIUM GRADIENT SEARCH INDEX BLOCK */}
          <div className="p-4 bg-gradient-to-b from-slate-900 to-slate-900/90 border-b border-slate-950/60 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                <Briefcase className="w-3 h-3 text-indigo-400" /> Active Placement Profiles
              </span>
              <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/60 text-[10px] font-black px-2 py-0.5 rounded-md shadow-inner">{jobs.length} OPEN</span>
            </div>
            
            <div className="relative mt-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
              <input 
                type="text" 
                placeholder="Filter corporate pipeline openings..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950/60 border border-slate-800 text-white rounded-xl text-xs placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200 shadow-inner"
              />
            </div>
          </div>

          {/* ACTIVE PLACEMENTS DEEP CARD FEED (Scrolls independently) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 select-none bg-slate-900/40">
            {jobs
              .filter((job) => {
                const query = searchQuery.toLowerCase().trim();
                if (!query) return true;
                return job.title.toLowerCase().includes(query) || job.description.toLowerCase().includes(query);
              })
              .map((job) => {
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => handleJobSelect(job)}
                    className={`p-3.5 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? "bg-gradient-to-r from-indigo-950/80 to-indigo-900/40 border-indigo-500 shadow-md shadow-indigo-950/40 translate-x-1" 
                        : "bg-slate-950/30 border-slate-800/40 hover:bg-slate-950/60 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl border mt-0.5 transition-colors ${isSelected ? "bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/20" : "bg-slate-950 border-slate-800 text-slate-400"}`}>
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-black tracking-tight transition-colors ${isSelected ? "text-white" : "text-slate-200"}`}>{job.title}</p>
                        <p className="text-[11px] text-slate-400 font-medium truncate mt-1">{job.description}</p>
                      </div>
                      {isSelected && <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 self-center animate-pulse" />}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* SECTION B: CASCADING CANDIDATES FUNNEL SUB-PANEL */}
          <div className="border-t border-slate-950 bg-slate-950/40 flex flex-col h-[42%]">
            <div className="p-3.5 bg-slate-950/20 border-b border-slate-950/60 flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                <Users className="w-3 h-3 text-indigo-400" /> Live Evaluation Funnel
              </span>
              {selectedJob && (
                <span className="text-[10px] bg-indigo-950 text-indigo-400 border border-indigo-900/60 font-black px-2 py-0.5 rounded-md shadow-inner">
                  {applicants.length} IN QUEUE
                </span>
              )}
            </div>

            {/* CANDIDATES CARDS CAROUSEL FEED (Scrolls independently) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-900/20">
              {!selectedJob ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed max-w-[240px]">Select a placement profile above to sync active talent pipelines.</p>
                </div>
              ) : applicants.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-[11px] font-bold text-slate-500 leading-relaxed max-w-[240px]">No candidate assessment profiles found in this campaign.</p>
                </div>
              ) : (
                applicants.map((app) => {
                  const isAppSelected = selectedApplicant?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => handleApplicantSelect(app)}
                      className={`p-3 rounded-xl border transition-all duration-200 text-left cursor-pointer flex items-center justify-between ${
                        isAppSelected 
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/10 scale-[1.01]" 
                          : "bg-slate-950/40 border-slate-800/60 hover:bg-slate-950/80 hover:border-slate-800 text-slate-200"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className={`text-xs font-extrabold tracking-tight ${isAppSelected ? "text-white" : "text-slate-100"}`}>{app.name}</p>
                        <p className={`text-[10px] font-medium truncate mt-0.5 ${isAppSelected ? "text-indigo-200" : "text-slate-400"}`}>{app.email}</p>
                      </div>
                      <div className="shrink-0 pl-2">
                        {app.status === "COMPLETED" || app.status === "completed" ? (
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${isAppSelected ? "bg-white text-indigo-700 border-white shadow-sm" : "bg-emerald-950 text-emerald-400 border-emerald-900/50"}`}>READY</span>
                        ) : (
                          <span className="text-[9px] font-black bg-amber-950 text-amber-400 border border-amber-900/50 px-2 py-0.5 rounded-md uppercase tracking-wider animate-pulse">RUNNING</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
        {/* COMPLIANCE WORKBENCH WORKSPACE PANELS */}
        <section className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
          
          {/* HIGH-END VECTOR MATRIX ARCHITECTURE BLUEPRINT GRAPHIC OVERLAY */}
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none" 
               style={{ backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

          {/* DYNAMIC SCREEN CONDITIONAL RENDER TRACKS */}
          {!selectedApplicant ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
              <div className="bg-white border border-slate-200/80 p-5 rounded-2xl text-slate-400 mb-4 shadow-sm">
                <FileText className="w-7 h-7 text-indigo-500" />
              </div>
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Audit Workbench Idle</h3>
              <p className="text-[11px] font-bold text-slate-400 max-w-sm mt-1.5 leading-relaxed">
                Please select a candidate entry row loop parameter from your operations funnel to synthesize the comprehensive multi-agent evaluation analytics dashboard.
              </p>
            </div>
          ) : loadingAudit ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
              <div className="w-6 h-6 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4" />
              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest animate-pulse">Compiling Multi-Agent Compliance Records...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden z-10 animate-fade-in">
              
              {/* WORKBENCH ROW PLATFORM HEADER STRIP CONTAINER */}
              <div className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl border border-indigo-100 shadow-sm shadow-indigo-500/5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-black tracking-wider text-slate-800 uppercase">
                      Technical Scorecard Audit: <span className="text-indigo-600 normal-case font-black tracking-normal ml-1">{selectedApplicant.name}</span>
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">Verified Identity Transcripts Matrix Verification</p>
                  </div>
                </div>

                {/* DYNAMIC HIGH-END DECISION ACTION SYSTEM & AUTOMATED EMAILING ENGINES */}
                {scorecard && (
                  <div className="flex items-center gap-3 animate-fade-in">
                    
                    {/* ACCENT A: VERDICT PASS BENCHMARK DETECTED (STRONG HIRE) */}
                    {scorecard.includes("STRONG HIRE") && (
                      <>
                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Verdict: Strong Hire</span>
                        </div>
                        <button
                          onClick={async () => {
                            const res = await fetch(`${API_BASE}/interviews/notify-candidate/${selectedApplicant.id}`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ type: "advance" })
                            });
                            if (res.ok) alert(`Success: Next round confirmation notification queued for ${selectedApplicant.name}!`);
                          }}
                          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl border border-indigo-700 shadow-md shadow-indigo-600/10 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                          <span>Advance to Next Round</span>
                        </button>
                      </>
                    )}

                    {/* ACCENT B: COMPLIANCE DROPOUT TRIGGERED (NO HIRE) */}
                    {scorecard.includes("NO HIRE") && (
                      <>
                        <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider shadow-2xs">
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          <span>Verdict: No Hire</span>
                        </div>
                        <button
                          onClick={async () => {
                            const res = await fetch(`${API_BASE}/interviews/notify-candidate/${selectedApplicant.id}`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                              body: JSON.stringify({ type: "reject" })
                            });
                            if (res.ok) alert(`Notice sent: Rejection update letter pushed out to ${selectedApplicant.name}.`);
                          }}
                          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl border border-rose-700 shadow-md shadow-rose-600/10 hover:scale-[1.01] transition-all duration-200 cursor-pointer"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-rose-200" />
                          <span>Send Rejection Notice</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* DETAILED SCORECARD DISPLAY PANEL CANVAS (Scrolls independently with clean typography boundaries) */}
              <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <ScorecardView scorecard={scorecard} applicantName={selectedApplicant.name} />
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
