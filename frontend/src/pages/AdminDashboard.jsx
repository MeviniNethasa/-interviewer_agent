import React, { useState, useEffect } from "react";
import { 
  Briefcase, Users, FileText, CheckCircle2, 
  Search, ShieldCheck, Database, Cpu, LogOut, ArrowRight 
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
        headers: { Authorization: `Bearer ${token}` } // ◄── FIXED: Auth header injected
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
        headers: { Authorization: `Bearer ${token}` } // ◄── FIXED: Auth header injected
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-100">
      
      {/* ENTERPRISE MAIN NAVIGATION STRIP HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-40 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-xl shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900">TalentCore Operations Suite</h1>
            <p className="text-[11px] font-medium text-slate-500">Internal HR Governance & Quality Audit Hub</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-5 text-[11px] font-semibold tracking-wide">
            <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Database className="w-3 h-3" /> DB Connect
            </span>
            <span className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              <Cpu className="w-3 h-3" /> Core Active
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">{localStorage.getItem("user_name") || "Operations Admin"}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">HR Audit Lead</p>
            </div>
            <button 
              onClick={() => { localStorage.clear(); window.location.href = "/"; }}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>
      {/* MAIN TWO-PANE WORKSPACE FRAME */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* SIDEBAR PANEL: CONSOLIDATED RECRUITMENT CAMPAIGNS AND APP FUNNELS */}
        <aside className="w-[420px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-10 shadow-sm">
          
          {/* SECTION A: CAMPAIGN OPENINGS INDEX TRACKER */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Briefcase className="w-3 h-3" /> Active Placement Profiles
              </span>
              <span className="bg-slate-200/80 text-slate-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">{jobs.length} open</span>
            </div>
            
            <div className="relative mt-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
              placeholder="Filter corporate pipeline openings..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="w-full pl-8 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-blue-500 focus:ring-1 placeholder:text-slate-400 shadow-2xs focus:ring-blue-500/20"
              />

            </div>
          </div>

                    {/* ACTIVE PLACEMENTS STREAM (Scrolls independently) */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1 select-none">
            {jobs
              .filter((job) => {
                const query = searchQuery.toLowerCase().trim();
                if (!query) return true; // Show all openings if the search input box is empty
                return (
                  job.title.toLowerCase().includes(query) || 
                  job.description.toLowerCase().includes(query)
                );
              })
              .map((job) => {
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    onClick={() => handleJobSelect(job)}
                    className={`p-3 rounded-xl cursor-pointer text-left transition-all ${
                      isSelected ? "bg-blue-50/80 border border-blue-200/60" : "hover:bg-slate-50/80 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg border mt-0.5 ${isSelected ? "bg-white border-blue-200 text-blue-600" : "bg-slate-50 border-slate-200"}`}>
                        <Briefcase className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate tracking-tight">{job.title}</p>
                        <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{job.description}</p>
                      </div>
                      {isSelected && <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0 self-center" />}
                    </div>
                  </div>
                );
              })}
          </div>


          {/* SECTION B: APP FUNNEL STREAM SECTOR */}
          <div className="border-t border-slate-200 bg-slate-50 flex flex-col h-[42%]">
            <div className="p-3 border-b border-slate-200/60 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                <Users className="w-3 h-3" /> Live Evaluation Funnel
              </span>
              {selectedJob && (
                <span className="text-[10px] bg-blue-100 text-blue-700 border border-blue-200 font-bold px-1.5 py-0.5 rounded-full">
                  {applicants.length} registered
                </span>
              )}
            </div>

            {/* CANDIDATES ITERATION CONTAINER (Scrolls independently) */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {!selectedJob ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-[11px] font-semibold text-slate-400">Select a placement profile to load candidates.</p>
                </div>
              ) : applicants.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <p className="text-[11px] font-semibold text-slate-400">No active applicants currently in queue.</p>
                </div>
              ) : (
                applicants.map((app) => {
                  const isAppSelected = selectedApplicant?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => handleApplicantSelect(app)}
                      className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer flex items-center justify-between ${
                        isAppSelected ? "bg-white border-blue-500 ring-1 ring-blue-500/10 shadow-xs" : "bg-white border-slate-200 hover:bg-slate-50/50 shadow-2xs"
                      }`}
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 tracking-tight">{app.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{app.email}</p>
                      </div>
                      <div className="shrink-0 pl-2">
                        {app.status === "COMPLETED" || app.status === "completed" ? (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Ready</span>
                        ) : (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md uppercase tracking-wider animate-pulse">Running</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
        {/* MAIN COMPLIANCE WORKBENCH: DETAILED TECHNICAL SCORECARD AUDIT DESK */}
        <section className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
          
          {/* CORPORATE SUBTLE WATERMARK BLUEPRINT LAYER */}
          <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
               style={{ backgroundImage: "radial-gradient(#0f172a 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

          {/* VIEWPORT CONTROLLER CONDITIONAL RENDER TREES */}
          {!selectedApplicant ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
              <div className="bg-slate-200/60 p-4 rounded-full text-slate-400 mb-3 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Audit Console Standby</h3>
              <p className="text-[11px] font-medium text-slate-400 max-w-xs mt-1 leading-relaxed">
                Select an active candidate registry stream row index from the operations funnel to populate the evaluation report window.
              </p>
            </div>
          ) : loadingAudit ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
              <div className="w-5 h-5 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-3" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Compiling Report Matrices...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden z-10 animate-fade-in">
              
              {/* COMPLIANCE WORKBENCH HEADER LAYER */}
              <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="bg-slate-100 text-slate-700 p-1.5 rounded-lg border border-slate-200">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Multi-Agent Audit Report: <span className="text-blue-600 normal-case font-extrabold">{selectedApplicant.name}</span>
                    </h2>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">Verified via deterministic token evidence logs</p>
                  </div>
                </div>

                                {/* DYNAMIC CORPORATE PLACEMENT VERDICT & COMMUNICATION ENGINE BUTTONS */}
                {scorecard && (
                  <div className="flex items-center gap-3">
                    
                    {/* OPTION A: CANDIDATE MEETS RECRUITMENT BENCHMARKS (STRONG HIRE) */}
                    {scorecard.includes("STRONG HIRE") && (
                      <>
                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-2xs">
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
                          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-blue-700 transition-all cursor-pointer shadow-2xs"
                        >
                          <span>Advance to Next Round</span>
                        </button>
                      </>
                    )}

                    {/* OPTION B: CANDIDATE COMPLIANCE DRIFT DETECTED (NO HIRE) */}
                    {scorecard.includes("NO HIRE") && (
                      <>
                        <div className="flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200/80 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-2xs">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
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
                          className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg border border-rose-700 transition-all cursor-pointer shadow-2xs"
                        >
                          <span>Send Rejection Notice</span>
                        </button>
                      </>
                    )}
                  </div>
                )}

              </div>

              {/* DYNAMIC SCROLLABLE DATA FIELD CANVAS */}
              <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
                <ScorecardView scorecard={scorecard} applicantName={selectedApplicant.name} />
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
