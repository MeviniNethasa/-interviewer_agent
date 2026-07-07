import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send, Bot, User, Loader2, CheckCircle, ArrowRight } from "lucide-react";

export default function InterviewRoom() {
  const navigate = useNavigate();
  const applicationId = localStorage.getItem("active_application_id");
  const token = localStorage.getItem("access_token");

  // Core Pipeline Interview States
  const [status, setStatus] = useState("not_started"); 
  const [questionsDisplay, setQuestionsDisplay] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  
  // Operational UI Load States
  const [polling, setPolling] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const ipAddress = ["127", "0", "0", "1"].join(".");
  const API_BASE = "http://" + ipAddress + ":8000/api/interviews";

  useEffect(() => {
    if (!applicationId) {
      setError("No active recruitment application reference index found.");
      setPolling(false);
      return;
    }

    const interval = setInterval(() => {
      checkInterviewStatus();
    }, 4000);

    checkInterviewStatus(); 

    return () => clearInterval(interval); 
  }, [applicationId, status]);

  const checkInterviewStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/status/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to pull background agent status states.");
      const data = await response.json();
      
      setStatus(data.status);
      
      if (data.status === "primary_questions_ready") {
        setQuestionsDisplay(data.primary_questions);
        setPolling(false);
      } else if (data.status === "followup_questions_ready") {
        setQuestionsDisplay(data.followup_questions);
        setPolling(false);
      } else if (data.status === "completed") {
        setQuestionsDisplay("");
        setPolling(false);
      } else {
        setPolling(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!answerInput.trim()) return;

    setSubmitting(true);
    setError("");

    const targetEndpoint = status === "primary_questions_ready" 
      ? `${API_BASE}/submit-primary/${applicationId}`
      : `${API_BASE}/submit-followup/${applicationId}`;

    try {
      const response = await fetch(targetEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ answers: answerInput })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Failed to submit responses forward.");
      
      setAnswerInput("");
      setPolling(true); 
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header Banner */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center gap-2 text-blue-400 font-bold text-xl shadow-md">
        <MessageSquare className="w-6 h-6" />
        <span>AI Recruitment Platform — Interactive Interview Room</span>
      </nav>

      {/* Primary Room Body Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-6 h-[calc(100vh-80px)]">
        
        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-xl shadow-sm">{error}</div>}

        {/* CHAT CONTAINER FRAME */}
        <div className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-center min-h-[400px]">
          
          {polling ? (
            <div className="text-center space-y-4 max-w-sm mx-auto p-4 animate-fade-in">
              <div className="relative flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin absolute" />
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-white pt-2">Deep Profile Analysis Active</h3>
              
              <div className="bg-slate-950/50 border border-slate-700/60 rounded-xl p-4 text-left space-y-3 font-mono text-[11px] text-slate-400 shadow-inner">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">●</span>
                  <span className={status === "not_started" ? "text-blue-400 font-bold animate-pulse" : "text-slate-500 line-through"}>
                    [Crews] Executing PDF text vector sweeps...
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={status === "not_started" ? "text-slate-700" : "text-emerald-400"}>●</span>
                  <span className={status === "not_started" ? "text-slate-500" : "text-blue-400 font-bold animate-pulse"}>
                    [Crews] Mapping context-aware testing parameters...
                  </span>
                </div>
              </div>
              <p className="text-slate-500 text-xs italic">Parsing typically concludes within 30 seconds.</p>
            </div>
          ) : status === "completed" ? (
            <div className="text-center space-y-4 max-w-md mx-auto p-4 animate-fade-in">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto drop-shadow-md" />
              <h3 className="text-2xl font-bold text-white tracking-tight">Interview Lifecycle Completed!</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your technical code assertions and response records have been wrapped and transmitted to the executive corporate dashboard registry.
              </p>
              <button onClick={() => navigate("/dashboard")} className="mt-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-xl text-sm shadow-md transition-colors cursor-pointer inline-flex items-center gap-1.5">
                <span>Return to Workspace Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            // ACTIVE SCENARIO LAYOUT PROMPTS VIEWPORT
            <div className="w-full flex-1 flex flex-col justify-start overflow-y-auto space-y-4 animate-fade-in">
              <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl max-w-3xl flex gap-3 shadow-md shadow-slate-950/20">
                <div className="bg-blue-500/10 text-blue-400 p-2.5 rounded-xl h-fit border border-blue-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Live AI Evaluator Prompt</span>
                  <div className="text-slate-200 text-sm font-sans font-medium whitespace-pre-wrap leading-relaxed">
                    {questionsDisplay}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TEXT AREA SUBMISSION TERMINAL FOOTER */}
        {(!polling && status !== "completed") && (
          <form onSubmit={handleSubmitResponse} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl flex flex-col md:flex-row gap-4 items-end animate-fade-in">
            <div className="flex-1 w-full">
              <label htmlFor="user-defense-input" className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Your Technical Defense Statement
              </label>
              <textarea 
                id="user-defense-input"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                required
                disabled={submitting}
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none shadow-inner"
                placeholder="Detail design trade-offs, transactions isolation models, or query optimization paths explicitly..."
              />
            </div>
            <button 
              type="submit" 
              disabled={submitting || !answerInput.trim()}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 px-6 rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 h-fit cursor-pointer uppercase tracking-wider font-bold"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <span>Submit response</span>
              )}
            </button>
          </form>
        )}

      </main>
    </div>
  );
}
