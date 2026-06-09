import { useState, useRef, useEffect } from "react";
import { sendAIChatMessageApi } from "../../api/aiApi";
import JobCard from "./JobCard";
import { toast } from "react-hot-toast";

export default function MetaAIChat({ jobs, userProfile, onApplyClick }) {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "hello! i am your Meta ai assistant. how can i help you today? you can ask me to find job listings related to your profile, match your skills, or answer career questions.",
      recommendedJobIds: [],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || inputValue;
    if (!queryText.trim()) return;

    if (!textToSend) {
      setInputValue("");
    }

    // Append user message
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: queryText,
        recommendedJobIds: [],
      },
    ]);

    setIsSending(true);

    try {
      const res = await sendAIChatMessageApi(queryText);
      const data = res.data;

      // Append AI response
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.reply || "i could not process that message. please try again.",
          recommendedJobIds: data.recommendedJobIds || [],
        },
      ]);
    } catch (err) {
      console.error(err);
      toast.error("failed to connect to assistant.");
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "sorry, i encountered an error connecting to my server. please make sure the backend is running and try again.",
          recommendedJobIds: [],
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick prompt suggestions
  const suggestions = [
    "show me jobs related my profile",
    "what roles match my skills?",
    "how can i improve my resume?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white border border-[#e6ebf1] rounded-2xl shadow-sm overflow-hidden font-sans">
      {/* Chat header */}
      <div className="px-6 py-4 border-b border-[#e6ebf1] bg-[#fafbfc] flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#635bff] to-[#a78bfa] flex items-center justify-center text-white shadow-md">
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-[#0a2540] tracking-tight">Meta ai assistant</h2>
          <p className="text-[11px] text-[#008a6b] font-medium flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008a6b] mr-1.5 animate-pulse" />
            online and ready to help
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 p-6 overflow-y-auto bg-[#fafbfc] space-y-4">
        {messages.map((msg, index) => {
          const isAI = msg.sender === "ai";
          return (
            <div
              key={index}
              className={`flex ${isAI ? "justify-start" : "justify-end"} gap-3 items-start`}
            >
              {isAI && (
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[#635bff] border border-[#e6ebf1] flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              )}

              <div className="space-y-3 max-w-[80%]">
                {/* Text bubble */}
                <div
                  className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm font-normal ${
                    isAI
                      ? "bg-white border border-[#e6ebf1] text-[#0a2540] rounded-tl-none"
                      : "bg-[#635bff] text-white rounded-tr-none"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Recommended jobs list inside chat */}
                {isAI && msg.recommendedJobIds && msg.recommendedJobIds.length > 0 && (
                  <div className="space-y-3 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 block tracking-wider">
                      Matching jobs
                    </span>
                    <div className="grid gap-3 w-full">
                      {msg.recommendedJobIds.map((jobId) => {
                        const matchedJob = jobs.find((j) => j._id === jobId);
                        if (!matchedJob) return null;
                        return (
                          <div key={jobId} className="w-full scale-[0.98] origin-left shadow-sm">
                            <JobCard
                              job={matchedJob}
                              userProfile={userProfile}
                              onApplyClick={onApplyClick}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isSending && (
          <div className="flex justify-start gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[#635bff] border border-[#e6ebf1] flex-shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white border border-[#e6ebf1] rounded-tl-none shadow-sm flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="px-6 py-3 border-t border-[#e6ebf1] bg-[#fafbfc] flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-bold text-slate-400 tracking-wider mr-1">Suggestions</span>
          {suggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sug)}
              className="text-[12px] bg-white hover:bg-[#f6f9fc] text-[#635bff] border border-[#e6ebf1] hover:border-[#635bff]/40 px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              {sug}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-[#e6ebf1] bg-white flex items-center space-x-3">
        <textarea
          rows="1"
          placeholder="Ask Meta AI anything..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSending}
          className="flex-1 bg-[#f6f9fc] border border-[#e6ebf1] rounded-xl px-4 py-3 text-[13px] text-[#0a2540] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] resize-none max-h-24 shadow-inner"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isSending || !inputValue.trim()}
          className="bg-[#635bff] hover:bg-[#0a2540] text-white p-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 active:scale-95 flex items-center justify-center"
        >
          <svg className="w-4 h-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
