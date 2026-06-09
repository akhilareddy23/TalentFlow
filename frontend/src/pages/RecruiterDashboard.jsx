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
    <div className="min-h-screen bg-[#f6f9fc] text-[#0a2540] flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-[#15234d] bg-[#0a1128] px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h1 className="text-xl font-semibold text-white tracking-tight">
            Recruiter Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-300 text-[13px] font-normal hidden md:inline">Logged in as {user?.name || "Recruiter"}</span>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white border border-[#e6ebf1] p-6 rounded-xl mb-8 gap-4 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-[#0a2540] tracking-tight">Manage Your Job Postings</h2>
            <p className="text-slate-500 mt-1 text-[13px] font-normal">Post new opportunities, review applicants, and find top talent.</p>
          </div>
          <button
            onClick={() => {
              setErrors({});
              setShowPostModal(true);
            }}
            className="py-2 px-4 bg-[#635bff] hover:bg-[#0a2540] text-white font-medium rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center space-x-2 text-[13px] active:scale-95"
          >
            <span>+ Post a New Job</span>
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Posted Jobs List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-[15px] font-semibold text-[#4f5b66] mb-3 flex items-center">
              <span>Your Listings ({recruiterJobs.length})</span>
            </h3>

            {jobsLoading ? (
              <div className="text-slate-400 py-8 text-center font-normal text-[14px]">Loading your job listings...</div>
            ) : recruiterJobs.length === 0 ? (
              <div className="bg-white border border-[#e6ebf1] rounded-xl p-12 text-center text-slate-500 shadow-sm">
                <p className="text-[14px] font-normal text-[#4f5b66]">No jobs posted yet. Click "+ Post a New Job" to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {recruiterJobs.map((job) => (
                  <div
                    key={job._id}
                    className={`bg-white border p-5 rounded-xl shadow-sm transition-all duration-300 ${
                      selectedJob?._id === job._id ? "border-[#635bff] shadow-sm" : "border-[#e6ebf1] hover:border-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-[16px] font-semibold text-[#0a2540] tracking-tight">{job.title}</h4>
                        <p className="text-[#635bff] text-[13px] font-medium mt-0.5">{job.company} • {job.location}</p>
                        <div className="flex flex-wrap gap-2 mt-3 text-[11px] font-normal">
                          <span className="px-2 py-0.5 rounded-md bg-[#f6f9fc] text-[#4f5b66] border border-[#e6ebf1]">{job.jobType}</span>
                          {job.salary && <span className="px-2 py-0.5 rounded-md bg-[#e8fbf6] text-[#008a6b] border border-[#c0f5e8] font-medium">{job.salary}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedJob(job)}
                        className={`py-2 px-3.5 rounded-lg text-[12px] font-medium transition-all active:scale-95 border ${
                          selectedJob?._id === job._id
                            ? "bg-[#635bff] text-white border-[#635bff] shadow-sm"
                            : "bg-[#f6f9fc] hover:bg-[#e6ebf1] text-[#4f5b66] border-[#e6ebf1]"
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
          <div className="bg-white border border-[#e6ebf1] p-6 rounded-xl h-fit shadow-sm">
            <h3 className="text-[15px] font-semibold text-[#0a2540] mb-4 flex items-center border-b border-[#e6ebf1] pb-3">
              <span>Applicants Queue</span>
            </h3>

            {!selectedJob ? (
              <div className="text-center py-12 text-slate-400 text-[14px] font-normal">
                Select a job from your listings to view candidates.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mb-4">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">Currently Viewing</span>
                  <span className="font-semibold text-[#0a2540] text-[15px]">{selectedJob.title}</span>
                </div>

                {appLoading ? (
                  <div className="text-slate-400 py-6 text-center text-[14px] font-normal">Loading applicants...</div>
                ) : applicants.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-[13px] border border-dashed border-[#e6ebf1] rounded-lg font-normal">
                    No applications submitted yet for this job.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {applicants.map((app) => (
                      <div key={app._id} className="bg-[#f6f9fc] border border-[#e6ebf1] p-4 rounded-lg space-y-3 shadow-sm">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="font-semibold text-[#0a2540] text-[14px]">{app.applicantName || app.applicant?.name || "Anonymous"}</div>
                            <div className="text-[12px] text-slate-500 mt-0.5">{app.applicant?.email}</div>
                          </div>
                          
                          <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-md border ${
                            app.applicantType === "Student"
                              ? "bg-purple-50/60 text-purple-700 border-purple-200"
                              : "bg-blue-50/60 text-blue-700 border-blue-200"
                          }`}>
                            {app.applicantType}
                          </span>
                        </div>

                        {/* Candidate Details */}
                        <div className="text-[12px] text-slate-600 space-y-1 bg-white border border-[#e6ebf1] p-2.5 rounded-md font-normal shadow-sm">
                          {app.applicantType === "Student" ? (
                            <>
                              <div><span className="font-medium text-slate-500">College:</span> {app.college}</div>
                              <div><span className="font-medium text-slate-500">Degree:</span> {app.degree}</div>
                              <div><span className="font-medium text-slate-500">Expected CTC:</span> {app.expectedCtc}</div>
                            </>
                          ) : (
                            <>
                              <div><span className="font-medium text-slate-500">Company:</span> {app.currentCompany}</div>
                              <div><span className="font-medium text-slate-500">Experience:</span> {app.experienceYears} yrs</div>
                              <div><span className="font-medium text-slate-500">Current CTC:</span> {app.currentCtc}</div>
                              <div><span className="font-medium text-slate-500">Expected CTC:</span> {app.expectedCtc}</div>
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
                              className="w-full text-center block text-[12px] font-medium bg-white hover:bg-[#f6f9fc] text-[#4f5b66] border border-[#e6ebf1] px-3 py-1.5 rounded-md transition-all shadow-sm"
                            >
                              View Resume URL
                            </a>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-1 border-t border-[#e6ebf1]">
                          <span className={`text-[11px] font-medium uppercase px-2 py-0.5 rounded-md border ${
                            app.status === "Shortlisted"
                              ? "bg-[#e8fbf6] text-[#008a6b] border-[#c0f5e8]"
                              : app.status === "Rejected"
                              ? "bg-rose-50 text-rose-700 border-rose-100"
                              : "bg-[#f6f9fc] text-[#4f5b66] border-[#e6ebf1]"
                          }`}>
                            {app.status}
                          </span>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleStatusUpdate(app._id, "Shortlisted")}
                              disabled={app.status === "Shortlisted"}
                              className="text-[11px] font-medium bg-[#e8fbf6] hover:bg-[#c0f5e8] text-[#008a6b] px-2.5 py-1 rounded-md border border-[#c0f5e8] disabled:opacity-40"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(app._id, "Rejected")}
                              disabled={app.status === "Rejected"}
                              className="text-[11px] font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 px-2.5 py-1 rounded-md border border-rose-200 disabled:opacity-40"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a2540]/30 backdrop-blur-[2px]">
          <div className="bg-white border border-[#e6ebf1] rounded-xl w-full max-w-lg p-8 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center border-b border-[#e6ebf1] pb-3 mb-5">
              <h3 className="text-[18px] font-semibold text-[#0a2540] tracking-tight">Post a New Job Opening</h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-slate-400 hover:text-slate-900 text-lg font-normal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateJob} noValidate className="space-y-4 text-[14px] text-slate-700">
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
                  className="px-4 py-2 border border-[#e6ebf1] text-[#4f5b66] rounded-lg hover:bg-[#f6f9fc] font-medium text-[13px] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#635bff] hover:bg-[#0a2540] text-white text-[13px] font-medium rounded-lg shadow-sm transition-all"
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