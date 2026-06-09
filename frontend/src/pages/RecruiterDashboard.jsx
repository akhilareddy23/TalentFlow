import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJobs, deleteJob } from "../redux/slices/jobSlice";
import { fetchRecruiterApplications } from "../redux/slices/applicationSlice";
import { logout } from "../redux/slices/authSlice";
import { toast } from "react-hot-toast";

// Recruiter Components
import RecruiterSidebar from "../components/recruiter/RecruiterSidebar";
import RecruiterJobCard from "../components/recruiter/RecruiterJobCard";
import PostJobForm from "../components/recruiter/PostJobForm";
import CandidatesManager from "../components/recruiter/CandidatesManager";

export default function RecruiterDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for tabs and filters
  const [activeTab, setActiveTab] = useState("listings");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // State to filter applicants by job from dashboard card clicks
  const [selectedJobId, setSelectedJobId] = useState("All");

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [knownAppIds, setKnownAppIds] = useState([]);
  const dropdownRef = useRef(null);

  // Select Redux state
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { recruiterApplications } = useSelector((state) => state.applications);

  // Polling for jobs and recruiter applications every 15 seconds
  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchRecruiterApplications());

    const interval = setInterval(() => {
      dispatch(fetchJobs());
      dispatch(fetchRecruiterApplications());
    }, 15000);

    return () => clearInterval(interval);
  }, [dispatch]);

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Monitor recruiterApplications array changes to identify new candidate applications
  useEffect(() => {
    if (recruiterApplications && recruiterApplications.length > 0) {
      const currentIds = recruiterApplications.map((app) => app._id);
      if (knownAppIds.length > 0) {
        const newApps = recruiterApplications.filter((app) => !knownAppIds.includes(app._id));
        if (newApps.length > 0) {
          const newNotifs = newApps.map((app) => ({
            id: app._id,
            title: `new application: ${(app.applicantName || app.applicant?.name || "candidate").toLowerCase()}`,
            desc: `applied for: ${(app.job?.title || "job opening").toLowerCase()}`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: false,
          }));

          setTimeout(() => {
            setNotifications((prev) => [...newNotifs, ...prev]);
            setUnreadCount((prev) => prev + newNotifs.length);
          }, 0);

          newApps.forEach((app) => {
            toast.success(`new application: ${(app.applicantName || app.applicant?.name || "candidate").toLowerCase()} for ${(app.job?.title || "").toLowerCase()}`);
          });
        }
      }
      setTimeout(() => {
        setKnownAppIds(currentIds);
      }, 0);
    }
  }, [recruiterApplications, knownAppIds]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Filter jobs posted by this recruiter
  const recruiterJobs = jobs.filter((job) => {
    const creatorId = job.createdBy?._id || job.createdBy;
    const currentUserId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;
    return creatorId === currentUserId;
  });

  // Filter recruiter jobs based on search query and selected type
  const filteredRecruiterJobs = recruiterJobs.filter((job) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      (job.domain && job.domain.toLowerCase().includes(query)) ||
      (job.description && job.description.toLowerCase().includes(query)) ||
      (job.skills && job.skills.some((s) => s.toLowerCase().includes(query)));

    const matchesType = selectedType === "All" || job.jobType === selectedType;

    return matchesSearch && matchesType;
  });

  const handleViewCandidatesFromCard = (job) => {
    setSelectedJobId(job._id);
    setActiveTab("applicants");
  };

  const handleDeleteJob = (jobId) => {
    dispatch(
      deleteJob(jobId, (err) => {
        if (!err) {
          toast.success("Job posting deleted");
          dispatch(fetchRecruiterApplications());
        }
      })
    );
  };

  return (
    <div className="flex h-screen bg-[#f6f9fc] text-[#0a2540] font-sans overflow-hidden">
      {/* Sidebar */}
      <RecruiterSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header - Height set to h-20 to perfectly align with sidebar logo border */}
        <header
          className="h-20 px-8 flex-shrink-0 flex justify-between items-center relative border-b border-white/10"
          style={{ background: "linear-gradient(135deg, #0f1f3d 0%, #1a2f5a 60%, #2a1a6e 100%)" }}
        >
          <div>
            <h1 className="text-[18px] font-bold text-white tracking-tight">
              {activeTab === "listings"
                ? "manage your listings"
                : activeTab === "post-job"
                ? "post a new opening"
                : "candidates ats queue"}
            </h1>
            <p className="text-[13px] text-white/50 mt-0.5 font-normal">
              {activeTab === "listings"
                ? "monitor job post statistics, application rates, and open roles."
                : activeTab === "post-job"
                ? "publish opportunities and find candidates."
                : "review resumes, shortlists, and filter applicants."}
            </p>
          </div>

          {/* Notifications, Profile and Logout */}
          <div className="flex items-center space-x-4">
            
            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setUnreadCount(0);
                }}
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all relative focus:outline-none flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#a78bfa] rounded-full border-2 border-[#1a2f5a]"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#e6ebf1] rounded-lg shadow-xl py-2 z-50 font-sans">
                  <div className="px-4 py-2 border-b border-[#e6ebf1] flex justify-between items-center">
                    <span className="text-[13px] font-semibold text-[#0a2540]">notifications</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[11px] text-[#635bff] hover:underline"
                      >
                        clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-slate-400 text-[12px]">
                        no new notifications.
                      </div>
                    ) : (
                      notifications.map((notif, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-[#f6f9fc] border-b border-slate-50 last:border-b-0 cursor-pointer text-left"
                        >
                          <div className="text-[12px] font-medium text-[#0a2540]">{notif.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{notif.desc}</div>
                          <div className="text-[9px] text-slate-400 mt-1 text-right">{notif.time}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Badge */}
            <div className="flex items-center space-x-2 border-l border-white/15 pl-4">
              <div className="w-8 h-8 rounded-full bg-[#635bff] text-white flex items-center justify-center font-bold text-[13px] shadow-lg shadow-[#635bff]/40">
                {user?.name?.charAt(0).toUpperCase() || "R"}
              </div>
              <span className="text-[13px] font-semibold text-white hidden md:inline">
                {(user?.name || "recruiter").toLowerCase()}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 rounded-lg font-medium transition-all duration-200 text-xs"
            >
              sign out
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Render tab content */}
            {activeTab === "listings" && (
              <>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 bg-white border border-[#e6ebf1] p-4 rounded-xl shadow-sm">
                  {/* Search Input */}
                  <div className="flex-1 relative text-[14px]">
                    <span className="absolute left-3.5 top-3.5 text-slate-400">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="search jobs by title, company, location, domain, or skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-[#e6ebf1] rounded-lg pl-10 pr-4 py-2.5 text-[#0a2540] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all text-[14px] font-normal shadow-sm"
                    />
                  </div>

                  {/* Job Type Dropdown */}
                  <div className="w-full md:w-48 text-[14px]">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-white border border-[#e6ebf1] rounded-lg px-3 py-2.5 text-[#0a2540] focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all text-[14px] font-medium shadow-sm"
                    >
                      <option value="All">all job types</option>
                      <option value="Full Time">full time</option>
                      <option value="Part Time">part time</option>
                      <option value="Internship">internship</option>
                      <option value="Remote">remote</option>
                    </select>
                  </div>
                </div>

                {/* Job Cards */}
                {jobsLoading && recruiterJobs.length === 0 ? (
                  <div className="text-slate-400 py-12 text-center text-[14px] font-normal font-sans">
                    loading your listings...
                  </div>
                ) : filteredRecruiterJobs.length === 0 ? (
                  <div className="bg-white border border-[#e6ebf1] rounded-2xl p-12 text-center text-slate-500 shadow-sm font-sans">
                    <svg className="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-[14px] font-semibold text-[#0a2540]">no job listings found</p>
                    <p className="text-[13px] text-slate-400 mt-1">
                      {recruiterJobs.length === 0
                        ? "you haven't posted any jobs yet. switch to the 'post new job' tab to start recruiting."
                        : "try adjusting your search query or filters."}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {filteredRecruiterJobs.map((job) => (
                      <RecruiterJobCard
                        key={job._id}
                        job={job}
                        onViewCandidatesClick={handleViewCandidatesFromCard}
                        onDeleteClick={handleDeleteJob}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "post-job" && (
              <PostJobForm onSuccess={() => setActiveTab("listings")} />
            )}

            {activeTab === "applicants" && (
              <CandidatesManager
                recruiterJobs={recruiterJobs}
                selectedJobId={selectedJobId}
                setSelectedJobId={setSelectedJobId}
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}