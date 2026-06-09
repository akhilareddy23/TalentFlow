import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJobs, createJob } from "../redux/slices/jobSlice";
import { fetchJobApplicants, updateApplicationStatus } from "../redux/slices/applicationSlice";
import { logout } from "../redux/slices/authSlice";
import { toast } from "react-hot-toast";
import { GoogleInput, GoogleTextArea, GoogleSelect } from "../components/common/GoogleInput";
import { validateRequired } from "../utils/validation";

export default function RecruiterDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Select state
  const { user } = useSelector((state) => state.auth);
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { applicants, loading: appLoading } = useSelector((state) => state.applications);

  // Local state
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null); // For viewing applicants
  
  // Job Form state
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");

  // Validation Errors state
  const [errors, setErrors] = useState({});

  // Load jobs on mount
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Load applicants if a job is selected
  useEffect(() => {
    if (selectedJob) {
      dispatch(fetchJobApplicants(selectedJob._id));
    }
  }, [selectedJob, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    
    // Validate inputs
    const titleErr = validateRequired(title, "Job Title");
    const companyErr = validateRequired(company, "Company");
    const locationErr = validateRequired(location, "Location");
    const descErr = validateRequired(description, "Job Description");

    if (titleErr || companyErr || locationErr || descErr) {
      setErrors({
        title: titleErr,
        company: companyErr,
        location: locationErr,
        description: descErr,
      });
      return;
    }

    setErrors({});

    // Parse skills as array
    const skillsArray = skills.split(",").map((s) => s.trim()).filter((s) => s);

    const jobData = {
      title,
      company,
      location,
      salary,
      jobType,
      skills: skillsArray,
      description,
    };

    dispatch(
      createJob(jobData, (err) => {
        if (err) {
          toast.error("Failed to post job. Please try again.");
        } else {
          toast.success("Job posted successfully!");
          setShowPostModal(false);
          // Reset fields
          setTitle("");
          setCompany("");
          setLocation("");
          setSalary("");
          setSkills("");
          setDescription("");
        }
      })
    );
  };

  const handleStatusUpdate = (appId, newStatus) => {
    if (!selectedJob) return;
    dispatch(updateApplicationStatus(appId, newStatus, selectedJob._id));
  };

  // Filter jobs posted by this recruiter
  const recruiterJobs = jobs.filter((job) => {
    const creatorId = job.createdBy?._id || job.createdBy;
    const currentUserId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;
    return creatorId === currentUserId;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-[#15234d] bg-[#0a1128] px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">💼</span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Recruiter Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-300 text-sm font-semibold hidden md:inline">Logged in as {user?.name || "Recruiter"}</span>
          <button
            onClick={handleLogout}
            className="py-1.5 px-4 bg-red-950/35 hover:bg-red-900/40 text-red-300 border border-red-900/20 rounded-xl font-bold transition-all duration-200 text-xs"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-slate-200 p-6 rounded-2xl mb-8 gap-4 shadow-sm">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage Your Job Postings</h2>
            <p className="text-slate-500 mt-1 text-sm font-semibold">Post new opportunities, review applicants, and find top talent.</p>
          </div>
          <button
            onClick={() => {
              setErrors({});
              setShowPostModal(true);
            }}
            className="py-2.5 px-5 bg-[#0a1128] hover:bg-[#15234d] text-white font-extrabold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center space-x-2 text-sm active:scale-95"
          >
            <span>+ Post a New Job</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Posted Jobs List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-700 mb-3 flex items-center">
              <span>📋</span>
              <span className="ml-2">Your Listings ({recruiterJobs.length})</span>
            </h3>

            {jobsLoading ? (
              <div className="text-slate-400 py-8 text-center font-semibold text-sm">Loading your job listings...</div>
            ) : recruiterJobs.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
                <span className="text-4xl block mb-3">📁</span>
                No jobs posted yet. Click "+ Post a New Job" to get started!
              </div>
            ) : (
              <div className="grid gap-4">
                {recruiterJobs.map((job) => (
                  <div
                    key={job._id}
                    className={`bg-white border p-5 rounded-2xl shadow-sm transition-all duration-300 ${
                      selectedJob?._id === job._id ? "border-[#0a1128] shadow-md" : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 tracking-tight">{job.title}</h4>
                        <p className="text-[#0a1128] text-sm font-semibold mt-0.5">{job.company} • {job.location}</p>
                        <div className="flex flex-wrap gap-2 mt-3 text-xs font-bold">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{job.jobType}</span>
                          {job.salary && <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold">💰 {job.salary}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedJob(job)}
                        className={`py-2 px-4 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                          selectedJob?._id === job._id
                            ? "bg-[#0a1128] text-white"
                            : "bg-slate-100 hover:bg-slate-250 text-slate-700"
                        }`}
                      >
                        View Applicants
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applicants Queue */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl h-fit shadow-sm">
            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center border-b border-slate-100 pb-3">
              <span>👥</span>
              <span className="ml-2">Applicants Queue</span>
            </h3>

            {!selectedJob ? (
              <div className="text-center py-12 text-slate-400 text-sm font-semibold">
                <span className="text-3xl block mb-2">👈</span>
                Select a job from your listings to view candidates.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-4">
                  <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Currently Viewing</span>
                  <span className="font-extrabold text-[#0a1128]">{selectedJob.title}</span>
                </div>

                {appLoading ? (
                  <div className="text-slate-400 py-6 text-center text-sm font-semibold">Loading applicants...</div>
                ) : applicants.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl font-bold">
                    No applications submitted yet for this job.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {applicants.map((app) => (
                      <div key={app._id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 shadow-sm">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{app.applicantName || app.applicant?.name || "Anonymous"}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{app.applicant?.email}</div>
                          </div>
                          
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            app.applicantType === "Student"
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}>
                            {app.applicantType}
                          </span>
                        </div>

                        {/* Candidate Details */}
                        <div className="text-xs text-slate-600 space-y-1 bg-white border border-slate-100 p-2.5 rounded-lg font-medium shadow-sm">
                          {app.applicantType === "Student" ? (
                            <>
                              <div>🏫 <span className="font-bold text-slate-800">College:</span> {app.college}</div>
                              <div>🎓 <span className="font-bold text-slate-800">Degree:</span> {app.degree}</div>
                              <div>💰 <span className="font-bold text-slate-800">Exp. Salary:</span> {app.expectedCtc}</div>
                            </>
                          ) : (
                            <>
                              <div>🏢 <span className="font-bold text-slate-800">Company:</span> {app.currentCompany}</div>
                              <div>⏳ <span className="font-bold text-slate-800">Experience:</span> {app.experienceYears} yrs</div>
                              <div>💰 <span className="font-bold text-slate-800">Curr. Salary:</span> {app.currentCtc}</div>
                              <div>💰 <span className="font-bold text-slate-800">Exp. Salary:</span> {app.expectedCtc}</div>
                            </>
                          )}
                        </div>

                        {/* Resume Link */}
                        {app.resumeUrl && (
                          <div>
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-center block text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg transition-all"
                            >
                              📄 View Resume URL
                            </a>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            app.status === "Shortlisted"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : app.status === "Rejected"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {app.status}
                          </span>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(app._id, "Shortlisted")}
                              disabled={app.status === "Shortlisted"}
                              className="text-[10px] font-bold bg-green-50 hover:bg-green-100/80 text-green-700 px-2.5 py-1 rounded-lg border border-green-200 disabled:opacity-40"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(app._id, "Rejected")}
                              disabled={app.status === "Rejected"}
                              className="text-[10px] font-bold bg-rose-50 hover:bg-rose-100/80 text-rose-700 px-2.5 py-1 rounded-lg border border-rose-200 disabled:opacity-40"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Post a Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white border border-slate-200/80 rounded-3xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Post a New Job Opening</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} noValidate className="space-y-4 text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <GoogleInput
                  label="Job Title"
                  required={true}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Frontend Engineer"
                  error={errors.title}
                />
                <GoogleInput
                  label="Company Name"
                  required={true}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google"
                  error={errors.company}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <GoogleInput
                  label="Location"
                  required={true}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Remote / New York"
                  error={errors.location}
                />
                <GoogleInput
                  label="Salary Range"
                  required={false}
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. $100k - $120k"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <GoogleSelect
                  label="Job Type"
                  required={true}
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </GoogleSelect>
                <GoogleInput
                  label="Required Skills (comma-separated)"
                  required={false}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, Node, Tailwind"
                />
              </div>

              <GoogleTextArea
                label="Job Description"
                required={true}
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed job description..."
                error={errors.description}
              />

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0a1128] hover:bg-[#15234d] text-white font-bold rounded-xl shadow-sm"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}