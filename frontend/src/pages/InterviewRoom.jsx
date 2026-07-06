import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Send, Bot, User, Loader2, CheckCircle, HelpCircle } from "lucide-react";

export default function InterviewRoom() {
  const navigate = useNavigate();
  const applicationId = localStorage.getItem("active_application_id");
  const token = localStorage.getItem("access_token");

  // Core Pipeline Interview States
  const [status, setStatus] = useState("not_started"); // not_started, primary_questions_ready, primary_answers_submitted, followup_questions_ready, completed
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

    // Initialize real-time background tracking loop
    const interval = setInterval(() => {
      checkInterviewStatus();
    }, 4000);

    checkInterviewStatus(); // Initial pass sweep execution

    return () => clearInterval(interval); // Clear polling worker context on component unmount
  }, [applicationId, status]);

  const checkInterviewStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/status/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to pull background agent status states.");
      const data = await response.json();
      
      setStatus(data.status);
      
      // Map questions display based on structural milestone state transitions
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
        // Keep loading screen active if crews are block-processing in background
        setPolling(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    if (!answerInput.strip()) return;

    setSubmitting(true);
    setError("");

    // Determine target endpoint depending on structural state boundaries
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
      setPolling(true); // Restart processing loader block while backend reactivates Crews
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header Banner */}
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center gap-2 text-blue-400 font-bold text-xl shadow-md">
        <MessageSquare className="w-6 h-6" />
        <span>AI Autonomous Interview Assessment Room</span>
      </nav>

      {/* Primary Room Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col justify-between overflow-hidden h-[calc(100vh-80px)]">
        
        {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-xl mb-4">{error}</div>}

        {/* ──── CHAT DISPLAY AREA ──── */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-950/20 border border-slate-800 rounded-2xl mb-4 shadow-inner flex flex-col justify-center">
          
          {polling ? (
            <div className="text-center space-y-3 p-8 animate-pulse">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
              <h3 className="text-lg font-bold text-white">AI Recruiting Engine Thinking...</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                {status === "not_started" 
                  ? "Crew 1 is analyzing your uploaded CV PDF against the Job Requirements to formulate specialized test scenarios..."
                  : "Crew 2 is cross-examining your answers to detect generic claims or architectural gaps..."}
              </p>
            </div>
          ) : status === "completed" ? (
            <div className="text-center space-y-3 p-8 max-w-lg mx-auto">
              <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-bold text-white tracking-tight">Interview Completed!</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Your performance transcripts and code assertions have been securely wrapped and sent to the HR Review board. Evaluation complete.
              </p>
              <button onClick={() => navigate("/dashboard")} className="mt-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-2 px-6 rounded-xl text-sm transition-all cursor-pointer">
                Return to Job Board
              </button>
            </div>
          ) : (
            // Render active questions message stack layout
            <div className="space-y-4 flex-1 justify-end flex flex-col">
              <div className="flex gap-3 max-w-2xl bg-slate-800 p-5 rounded-2xl border border-slate-700 shadow shadow-slate-950/50 self-start">
                <div className="bg-blue-600/10 text-blue-400 p-2 rounded-xl h-fit border border-blue-500/10">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block mb-1">AI Evaluator Prompt</span>
                  <div className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed font-medium">
                    {questionsDisplay}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ──── INPUT ANSWER RESPONSE FIELD FORM ──── */}
        {(!polling && status !== "completed") && (
          <form onSubmit={handleSubmitResponse} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-xl flex gap-3 items-end">
            <div className="flex-1">
              <label htmlFor="response-text-area" className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Enter your technical response
              </label>
              <textarea 
                id="response-text-area"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                required
                disabled={submitting}
                rows={4}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                placeholder="Type your design choices, framework commands, or architectural trade-offs explicitly..."
              />
            </div>
            <button 
              type="submit" 
              disabled={submitting || !answerInput.strip()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 px-5 rounded-xl text-sm transition-all h-fit flex items-center gap-2 shadow-lg shadow-blue-600/10 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Submit Response</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </main>
    </div>
  );
}
