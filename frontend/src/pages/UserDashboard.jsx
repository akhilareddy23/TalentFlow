import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserSidebar from "../components/user/UserSidebar";
import JobList from "../components/user/JobList";
import AppliedJobs from "../components/user/AppliedJobs";
import { fetchJobs } from "../redux/slices/jobSlice";
import { fetchMyApplications, applyToJob } from "../redux/slices/applicationSlice";
import { GoogleInput } from "../components/common/GoogleInput";
import { validateRequired, validateUrl, validateNumber } from "../utils/validation";

export default function UserDashboard() {
  const dispatch = useDispatch();

  // Local state for tabs and filters
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

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

  // Select Redux state
  const { jobs } = useSelector((state) => state.jobs);
  const { loading: submittingApp } = useSelector((state) => state.applications);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchJobs());
    dispatch(fetchMyApplications());
  }, [dispatch]);

  // Update default name if user loaded late
  useEffect(() => {
    if (user?.name && !applicantName) {
      setApplicantName(user.name);
    }
  }, [user, applicantName]);

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
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!jobToApply) return;

    // Validate inputs using centralized validation
    const nameErr = validateRequired(applicantName, "Full Name");
    const resumeErr = validateUrl(resumeUrl, "Resume Link");
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

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <UserSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white px-8 py-5 flex-shrink-0 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0a1128] tracking-tight">
              {activeTab === "browse" ? "Find Your Dream Job" : "Track Your Applications"}
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {activeTab === "browse"
                ? "Search and apply for jobs suited to your skills."
                : "Monitor the review process of your submitted applications."}
            </p>
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Show Filters only if browsing */}
            {activeTab === "browse" && (
              <div className="flex flex-col md:flex-row gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                {/* Search Input */}
                <div className="flex-1 relative text-sm font-semibold">
                  <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by title, company, location, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0a1128]/10 focus:border-[#0a1128] transition-all text-sm font-medium"
                  />
                </div>

                {/* Job Type Dropdown */}
                <div className="w-full md:w-48 text-sm">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0a1128]/10 focus:border-[#0a1128] transition-all text-sm font-semibold"
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
              <JobList jobs={filteredJobs} onApplyClick={handleOpenApplyModal} />
            ) : (
              <AppliedJobs />
            )}

          </div>
        </main>
      </div>

      {/* Detailed Application Modal */}
      {showApplyModal && jobToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Apply for Position</h3>
                <p className="text-xs text-slate-500 mt-0.5">{jobToApply.title} at {jobToApply.company}</p>
              </div>
              <button
                onClick={handleCloseApplyModal}
                className="text-slate-400 hover:text-slate-900 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} noValidate className="space-y-4 text-sm text-slate-700">
              
              <div className="grid grid-cols-2 gap-4">
                <GoogleInput
                  label="Full Name"
                  required={true}
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. John Doe"
                  error={errors.applicantName}
                />
                <GoogleInput
                  label="Resume Link (URL)"
                  type="url"
                  required={true}
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="e.g. https://drive.google.com/resume"
                  error={errors.resumeUrl}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Candidate Profile Status
                  <span className="text-red-500 ml-1 font-bold text-sm">*</span>
                </label>
                <div className="flex space-x-4 mt-1">
                  <label className="flex items-center space-x-2 cursor-pointer font-bold">
                    <input
                      type="radio"
                      name="applicantType"
                      value="Student"
                      checked={applicantType === "Student"}
                      onChange={() => setApplicantType("Student")}
                      className="text-[#0a1128] focus:ring-[#0a1128]"
                    />
                    <span>Student / Fresh Graduate</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer font-bold">
                    <input
                      type="radio"
                      name="applicantType"
                      value="Experienced"
                      checked={applicantType === "Experienced"}
                      onChange={() => setApplicantType("Experienced")}
                      className="text-[#0a1128] focus:ring-[#0a1128]"
                    />
                    <span>Experienced Professional</span>
                  </label>
                </div>
              </div>

              {/* Conditional: Student Fields */}
              {applicantType === "Student" && (
                <div className="space-y-4 border-t border-slate-100 pt-4">
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
                <div className="space-y-4 border-t border-slate-100 pt-4">
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
                    placeholder="e.g. $90,000 / yr"
                    error={errors.currentCtc}
                  />
                </div>
              )}

              {/* Expected CTC (Shared) */}
              <div className="border-t border-slate-100 pt-4">
                <GoogleInput
                  label="Expected CTC (Salary)"
                  required={true}
                  value={expectedCtc}
                  onChange={(e) => setExpectedCtc(e.target.value)}
                  placeholder="e.g. $110,000 / yr"
                  error={errors.expectedCtc}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseApplyModal}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingApp}
                  className="px-5 py-2 bg-[#0a1128] hover:bg-[#15234d] text-white font-bold rounded-xl shadow-sm disabled:opacity-50"
                >
                  {submittingApp ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}