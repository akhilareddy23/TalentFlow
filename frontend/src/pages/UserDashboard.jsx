import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../components/user/UserSidebar";
import JobList from "../components/user/JobList";
import AppliedJobs from "../components/user/AppliedJobs";
import { fetchJobs } from "../redux/slices/jobSlice";
import { fetchMyApplications, applyToJob } from "../redux/slices/applicationSlice";
import { GoogleInput } from "../components/common/GoogleInput";
import { validateRequired, validateNumber } from "../utils/validation";
import { logout } from "../redux/slices/authSlice";
import { toast } from "react-hot-toast";
import ProfileWidget from "../components/user/ProfileWidget";
import ProfileEditModal from "../components/user/ProfileEditModal";
import { fetchUserProfile, updateUserProfile } from "../redux/slices/profileSlice";
import { uploadResumeApi } from "../api/profileApi";
import MetaAIChat from "../components/user/MetaAIChat";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local state for tabs and filters
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [knownJobIds, setKnownJobIds] = useState([]);
  
  const dropdownRef = useRef(null);

  // Local state for Application Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [jobToApply, setJobToApply] = useState(null);

  // Form Fields & Errors
  const { user } = useSelector((state) => state.auth);
  const [applicantName, setApplicantName] = useState(user?.name || "");
  const [resumeUrl, setResumeUrl] = useState("");
  const [applicantType, setApplicantType] = useState("Student"); // "Student" or "Experienced"
  
  // Student fields
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  
  // Experienced fields
  const [currentCompany, setCurrentCompany] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [currentCtc, setCurrentCtc] = useState("");
  
  // Shared expected CTC
  const [expectedCtc, setExpectedCtc] = useState("");

  // Validation Errors state
  const [errors, setErrors] = useState({});

  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileName, setFileName] = useState("");

  // Select Redux state
  const { jobs } = useSelector((state) => state.jobs);
  const { applications, loading: submittingApp } = useSelector((state) => state.applications);
  const { userProfile, profileStrength, loading: profileLoading } = useSelector((state) => state.profile);

  const [showProfileModal, setShowProfileModal] = useState(false);

  // Polling for jobs every 15 seconds
  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchMyApplications());
    dispatch(fetchUserProfile());

    const interval = setInterval(() => {
      dispatch(fetchJobs());
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

  // Monitor jobs array changes to identify newly posted recruiter jobs
  useEffect(() => {
    if (jobs && jobs.length > 0) {
      const currentIds = jobs.map((j) => j._id);
      if (knownJobIds.length > 0) {
        const newJobs = jobs.filter((j) => !knownJobIds.includes(j._id));
        if (newJobs.length > 0) {
          const newNotifs = newJobs.map((job) => ({
            id: job._id,
            title: `New job posted: ${job.title}`,
            desc: `${job.company} - ${job.location}`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            read: false,
          }));

          setTimeout(() => {
            setNotifications((prev) => [...newNotifs, ...prev]);
            setUnreadCount((prev) => prev + newNotifs.length);
          }, 0);

          newJobs.forEach((job) => {
            toast.success(`New job posted: ${job.title} at ${job.company}`);
          });
        }
      }
      setTimeout(() => {
        setKnownJobIds(currentIds);
      }, 0);
    }
  }, [jobs, knownJobIds]);

  // Filter jobs based on search and selected type
  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      (job.description && job.description.toLowerCase().includes(query)) ||
      (job.skills && job.skills.some((s) => s.toLowerCase().includes(query)));

    const matchesType = selectedType === "All" || job.jobType === selectedType;

    return matchesSearch && matchesType;
  });

  const handleOpenApplyModal = (job) => {
    setJobToApply(job);
    
    // Prefill fields from userProfile if available
    setApplicantName(userProfile?.name || user?.name || "");
    setResumeUrl(userProfile?.resumeUrl || "");
    setFileName(userProfile?.resumeUrl ? "Profile Resume File" : "");
    
    if (userProfile?.currentCompany || userProfile?.experienceYears > 0) {
      setApplicantType("Experienced");
      setCurrentCompany(userProfile.currentCompany || "");
      setExperienceYears(userProfile.experienceYears !== undefined ? String(userProfile.experienceYears) : "");
      setCurrentCtc(userProfile.currentCtc || "");
    } else {
      setApplicantType("Student");
      setCollege(userProfile?.college || "");
      setDegree(userProfile?.degree || "");
    }
    setExpectedCtc(userProfile?.expectedCtc || "");

    setShowApplyModal(true);
  };

  const handleCloseApplyModal = () => {
    setShowApplyModal(false);
    setJobToApply(null);
    setErrors({});
    setCollege("");
    setDegree("");
    setCurrentCompany("");
    setExperienceYears("");
    setCurrentCtc("");
    setExpectedCtc("");
    setFileName("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resumeUrl: "File size must be less than 10MB." }));
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setUploadingFile(true);
      setErrors((prev) => ({ ...prev, resumeUrl: null }));
      const res = await uploadResumeApi(formData);
      setResumeUrl(res.data.fileUrl);
      setFileName(file.name);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to upload file";
      setErrors((prev) => ({ ...prev, resumeUrl: errorMsg }));
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!jobToApply) return;

    // Validate inputs using centralized validation
    const nameErr = validateRequired(applicantName, "Full Name");
    const resumeErr = validateRequired(resumeUrl, "Resume File");
    let collegeErr = null;
    let degreeErr = null;
    let companyErr = null;
    let expErr = null;
    let currentCtcErr = null;
    const expectedCtcErr = validateRequired(expectedCtc, "Expected CTC");

    if (applicantType === "Student") {
      collegeErr = validateRequired(college, "College");
      degreeErr = validateRequired(degree, "Degree");
    } else {
      companyErr = validateRequired(currentCompany, "Company");
      expErr = validateNumber(experienceYears, "Years of Experience");
      currentCtcErr = validateRequired(currentCtc, "Current CTC");
    }

    if (nameErr || resumeErr || collegeErr || degreeErr || companyErr || expErr || currentCtcErr || expectedCtcErr) {
      setErrors({
        applicantName: nameErr,
        resumeUrl: resumeErr,
        college: collegeErr,
        degree: degreeErr,
        currentCompany: companyErr,
        experienceYears: expErr,
        currentCtc: currentCtcErr,
        expectedCtc: expectedCtcErr,
      });
      return;
    }

    setErrors({});

    const applicationData = {
      applicantName,
      resumeUrl,
      applicantType,
      college: applicantType === "Student" ? college : undefined,
      degree: applicantType === "Student" ? degree : undefined,
      currentCompany: applicantType === "Experienced" ? currentCompany : undefined,
      experienceYears: applicantType === "Experienced" ? Number(experienceYears) : undefined,
      currentCtc: applicantType === "Experienced" ? currentCtc : undefined,
      expectedCtc,
    };

    dispatch(
      applyToJob(jobToApply._id, applicationData, (err) => {
        if (!err) {
          handleCloseApplyModal();
        }
      })
    );
  };

  const handleSaveProfile = (profileData) => {
    dispatch(
      updateUserProfile(profileData, (err) => {
        if (!err) {
          setShowProfileModal(false);
        }
      })
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#f6f9fc] text-[#0a2540] font-sans overflow-hidden">
      {/* Sidebar */}
      <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header
          className="h-20 px-8 flex-shrink-0 flex justify-between items-center relative border-b border-white/10"
          style={{ background: "linear-gradient(135deg, #0f1f3d 0%, #1a2f5a 60%, #2a1a6e 100%)" }}
        >
          <div>
            <h1 className="text-[18px] font-bold text-white tracking-tight">
              {activeTab === "browse"
                ? "Find your dream job"
                : activeTab === "recommended"
                ? "Recommended for you"
                : activeTab === "ai"
                ? "Meta ai assistant"
                : "Track your applications"}
            </h1>
            <p className="text-[13px] text-white/50 mt-0.5 font-normal">
              {activeTab === "browse"
                ? "Search and apply for jobs suited to your skills."
                : activeTab === "recommended"
                ? "Job openings matching your profile and key skills."
                : activeTab === "ai"
                ? "Ask our intelligent assistant to find matching jobs or answer career questions."
                : "Monitor the review process of your submitted applications."}
            </p>
          </div>

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
                    <span className="text-[13px] font-semibold text-[#0a2540]">Notifications</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[11px] text-[#635bff] hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-slate-400 text-[12px]">
                        No new notifications.
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
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-[13px] font-semibold text-white hidden md:inline">
                {user?.name || "Applicant"}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 rounded-lg font-medium transition-all duration-200 text-xs"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {activeTab === "ai" ? (
              <MetaAIChat
                jobs={jobs}
                userProfile={userProfile}
                onApplyClick={handleOpenApplyModal}
              />
            ) : (
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Column: Job Lists and Filters */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Show Filters only if browsing */}
                  {activeTab === "browse" && (
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
                          placeholder="Search by title, company, location, or skills..."
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
                          <option value="All">All Job Types</option>
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                          <option value="Internship">Internship</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Tab content */}
                  {activeTab === "browse" ? (
                    <JobList jobs={filteredJobs} userProfile={userProfile} onApplyClick={handleOpenApplyModal} />
                  ) : activeTab === "recommended" ? (
                    (() => {
                      if (!userProfile?.skills || userProfile.skills.length === 0) {
                        return (
                          <div className="bg-white border border-[#e6ebf1] rounded-xl p-8 text-center shadow-sm font-sans space-y-4">
                            <div className="mx-auto w-12 h-12 rounded-full bg-[#635bff]/10 text-[#635bff] flex items-center justify-center">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-base font-semibold text-[#0a2540]">Add your skills for recommendations</h3>
                              <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
                                We match job requirements against your profile skills. Edit your profile credentials to get started.
                              </p>
                            </div>
                            <button
                              onClick={() => setShowProfileModal(true)}
                              className="inline-block text-[13px] font-medium bg-[#635bff] hover:bg-[#0a2540] text-white px-4 py-2 rounded-lg transition-all shadow-sm"
                            >
                              Add Skills Now
                            </button>
                          </div>
                        );
                      }

                      const uSkills = userProfile.skills.map(s => s.toLowerCase().trim()).filter(s => s);
                      const recommendedJobs = jobs.filter((job) => {
                        const jSkills = (job.skills || []).map(s => s.toLowerCase().trim()).filter(s => s);
                        return jSkills.some(js => uSkills.some(us => us.includes(js) || js.includes(us)));
                      });

                      if (recommendedJobs.length === 0) {
                        return (
                          <div className="bg-white border border-[#e6ebf1] rounded-xl p-8 text-center shadow-sm font-sans space-y-4">
                            <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-base font-semibold text-[#0a2540]">No matching jobs found</h3>
                              <p className="text-[13px] text-slate-500 max-w-sm mx-auto">
                                None of the active job postings match your current skills: <span className="font-medium text-slate-700">{userProfile.skills.join(", ")}</span>.
                              </p>
                            </div>
                          </div>
                        );
                      }

                      return <JobList jobs={recommendedJobs} userProfile={userProfile} onApplyClick={handleOpenApplyModal} />;
                    })()
                  ) : (
                    <AppliedJobs />
                  )}
                </div>

                {/* Right Column: Profile widget */}
                <div className="sticky top-6 space-y-6">
                  <ProfileWidget
                    userProfile={userProfile}
                    profileStrength={profileStrength}
                    applications={applications}
                    onEditClick={() => setShowProfileModal(true)}
                  />
                </div>
            </div>
          )}
        </div>
      </main>
    </div>

      {/* Detailed Application Modal */}
      {showApplyModal && jobToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a2540]/30 backdrop-blur-[2px]">
          <div className="bg-white border border-[#e6ebf1] rounded-xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center border-b border-[#e6ebf1] pb-3 mb-5">
              <div>
                <h3 className="text-[18px] font-semibold text-[#0a2540] tracking-tight">Apply for Position</h3>
                <p className="text-[13px] text-slate-500 mt-0.5">{jobToApply.title} at {jobToApply.company}</p>
              </div>
              <button
                onClick={handleCloseApplyModal}
                className="text-slate-400 hover:text-slate-900 text-lg font-normal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} noValidate className="space-y-4 text-[14px] text-slate-700">
              
              <div className="grid grid-cols-2 gap-4">
                <GoogleInput
                  label="Full Name"
                  required={true}
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. John Doe"
                  error={errors.applicantName}
                />
                <div className="w-full space-y-1.5">
                  <label className="block text-sm font-medium text-[#4f5b66]">
                    Upload Resume (PDF, DOC, DOCX)
                    <span className="text-red-500 ml-1 font-medium text-xs">*</span>
                  </label>
                  <div className="flex items-center space-x-3">
                    <label className="cursor-pointer bg-white hover:bg-[#f6f9fc] border border-[#e6ebf1] text-[#4f5b66] hover:text-[#0a2540] px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all shadow-sm flex items-center space-x-1.5 flex-shrink-0">
                      <svg className="w-4 h-4 text-[#635bff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>{uploadingFile ? "Uploading..." : "Choose File"}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploadingFile}
                      />
                    </label>
                    <div className="flex-1 text-[13px] text-slate-500 truncate">
                      {fileName ? (
                        <span className="text-[#0a2540] font-medium flex items-center space-x-1">
                          <svg className="w-4 h-4 text-[#008a6b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">{fileName}</span>
                        </span>
                      ) : (
                        "No file chosen"
                      )}
                    </div>
                  </div>
                  {errors.resumeUrl && (
                    <p className="text-xs text-red-500 mt-1">{errors.resumeUrl}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4f5b66] mb-1.5">
                  Candidate Profile Status
                  <span className="text-red-500 ml-1 font-medium">*</span>
                </label>
                <div className="flex space-x-4 mt-1">
                  <label className="flex items-center space-x-2 cursor-pointer font-normal text-[14px] text-slate-700">
                    <input
                      type="radio"
                      name="applicantType"
                      value="Student"
                      checked={applicantType === "Student"}
                      onChange={() => setApplicantType("Student")}
                      className="text-[#635bff] focus:ring-[#635bff] border-[#e6ebf1]"
                    />
                    <span>Student / Fresh Graduate</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer font-normal text-[14px] text-slate-700">
                    <input
                      type="radio"
                      name="applicantType"
                      value="Experienced"
                      checked={applicantType === "Experienced"}
                      onChange={() => setApplicantType("Experienced")}
                      className="text-[#635bff] focus:ring-[#635bff] border-[#e6ebf1]"
                    />
                    <span>Experienced Professional</span>
                  </label>
                </div>
              </div>

              {/* Conditional: Student Fields */}
              {applicantType === "Student" && (
                <div className="space-y-4 border-t border-[#e6ebf1] pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <GoogleInput
                      label="College / University"
                      required={true}
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. Stanford University"
                      error={errors.college}
                    />
                    <GoogleInput
                      label="Degree & Major"
                      required={true}
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                      error={errors.degree}
                    />
                  </div>
                </div>
              )}

              {/* Conditional: Experienced Fields */}
              {applicantType === "Experienced" && (
                <div className="space-y-4 border-t border-[#e6ebf1] pt-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <GoogleInput
                        label="Current/Last Company"
                        required={true}
                        value={currentCompany}
                        onChange={(e) => setCurrentCompany(e.target.value)}
                        placeholder="e.g. Microsoft"
                        error={errors.currentCompany}
                      />
                    </div>
                    <GoogleInput
                      label="Years of Exp."
                      type="number"
                      required={true}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      placeholder="e.g. 3"
                      error={errors.experienceYears}
                    />
                  </div>

                  <GoogleInput
                    label="Current CTC (Salary)"
                    required={true}
                    value={currentCtc}
                    onChange={(e) => setCurrentCtc(e.target.value)}
                    placeholder="e.g. ₹8L / yr"
                    error={errors.currentCtc}
                  />
                </div>
              )}

              <div className="border-t border-[#e6ebf1] pt-4">
                <GoogleInput
                  label="Expected CTC (Salary)"
                  required={true}
                  value={expectedCtc}
                  onChange={(e) => setExpectedCtc(e.target.value)}
                  placeholder="e.g. ₹12L / yr"
                  error={errors.expectedCtc}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-[#e6ebf1]">
                <button
                  type="button"
                  onClick={handleCloseApplyModal}
                  className="px-4 py-2 border border-[#e6ebf1] text-[#4f5b66] rounded-lg hover:bg-[#f6f9fc] font-medium text-[13px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-5 py-2 bg-[#635bff] hover:bg-[#0a2540] text-white font-medium rounded-lg shadow-sm disabled:opacity-50 text-[13px] transition-all"
                >
                  {submittingApp ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && (
        <ProfileEditModal
          userProfile={userProfile}
          loading={profileLoading}
          onClose={() => setShowProfileModal(false)}
          onSave={handleSaveProfile}
        />
      )}

    </div>
  );
}