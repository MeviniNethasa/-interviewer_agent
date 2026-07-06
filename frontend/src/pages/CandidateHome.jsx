import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, FileText, UploadCloud, Briefcase, Award, Loader2, Play } from "lucide-react";

export default function CandidateHome() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name") || "Candidate";
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const ipAddress = ["127", "0", "0", "1"].join(".");
  const API_BASE = "http://" + ipAddress + ":8000/api";

  useEffect(() => {
    fetchActiveJobs();
  }, []);

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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
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
    setMessage("");

    const token = localStorage.getItem("access_token");
    const formData = new FormData();
    formData.append("file", cvFile);

    try {
      const response = await fetch(`${API_BASE}/interviews/apply/${selectedJob.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Application process failed.");

      setMessage("🚀 Application and CV logged successfully! Directing to AI Interview Room...");
      localStorage.setItem("active_application_id", data.application_id);
      
      setTimeout(() => {
        navigate("/interview-room");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2 text-blue-400 font-bold Jack-font text-xl">
          <Briefcase className="w-6 h-6" />
          <span>AI Recruitment Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-300 text-sm font-medium">Welcome, <strong className="text-white">{userName}</strong></span>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium py-1.5 px-3 rounded-lg border border-slate-600 transition-colors cursor-pointer">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* Main Content Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column: Available Job Openings */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-blue-500" /> Current Job Opportunities
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 text-center text-slate-400">
              No active job campaigns found. Access the Admin documentation to post roles!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div 
                  key={job.id} 
                  onClick={() => setSelectedJob(job)}
                  className={`bg-slate-800 p-5 rounded-xl border cursor-pointer transition-all ${
                    selectedJob?.id === job.id 
                      ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg" 
                      : "border-slate-700 hover:border-slate-600 hover:bg-slate-750 shadow"
                  }`}
                >
                  <h3 className="text-lg font-bold text-white mb-2">{job.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-4 leading-relaxed">{job.description}</p>
                  <div className="mt-4 text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                    <span>Click to view and apply</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Application Submission Dropzone Panel */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">Application Terminal</h2>
          
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl flex flex-col h-fit">
            {selectedJob ? (
              <form onSubmit={handleApply} className="space-y-5">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Target Selection</span>
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 font-semibold text-white text-sm">
                    {selectedJob.title}
                  </div>
                </div>

                {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg">{error}</div>}
                {message && <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3 rounded-lg">{message}</div>}

                <div>
                  <label htmlFor="cv-upload-field" className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Upload CV Resume (PDF only)</label>
                  <div className="border-2 border-dashed border-slate-600 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors relative bg-slate-900/50">
                    <input 
                      id="cv-upload-field"
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                    {cvFile ? (
                      <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium text-sm">
                        <FileText className="w-4 h-4" />
                        <span className="truncate max-w-[200px]">{cvFile.name}</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-sm">
                        <span className="text-blue-400 font-semibold">Click to browse</span> or drag file here
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting || !cvFile}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deploying AI Screening Crews...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Submit & Launch AI Interview</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-12 text-slate-400 text-sm leading-relaxed">
                Select an active position profile from the grid on the left to initialize the submission gateway.
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
