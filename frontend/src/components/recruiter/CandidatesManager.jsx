import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateApplicationStatus } from "../../redux/slices/applicationSlice";

export default function CandidatesManager({ recruiterJobs, selectedJobId, setSelectedJobId }) {
  const dispatch = useDispatch();
  const { recruiterApplications, loading } = useSelector((state) => state.applications);

  // Local filter states
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusUpdate = (appId, newStatus, jobId) => {
    dispatch(updateApplicationStatus(appId, newStatus, jobId));
  };

  // Filter the applications
  const filteredApplications = recruiterApplications.filter((app) => {
    const job = app.job;
    if (!job) return false;

    // Filter by Job
    const matchesJob = selectedJobId === "All" || job._id === selectedJobId;

    // Filter by Status
    const matchesStatus = selectedStatus === "All" || app.status === selectedStatus;

    // Filter by Search Query (Applicant name, email, skills, college, company, or job title)
    const query = searchQuery.toLowerCase().trim();
    const applicantName = (app.applicantName || app.applicant?.name || "").toLowerCase();
    const applicantEmail = (app.applicant?.email || "").toLowerCase();
    const jobTitle = (job.title || "").toLowerCase();
    
    const candidateTypeDetails = app.applicantType === "Student" 
      ? (app.college || "") + " " + (app.degree || "")
      : (app.currentCompany || "");

    const skillsStr = (app.applicant?.skills || []).join(" ").toLowerCase();

    const matchesSearch =
      query === "" ||
      applicantName.includes(query) ||
      applicantEmail.includes(query) ||
      jobTitle.includes(query) ||
      candidateTypeDetails.toLowerCase().includes(query) ||
      skillsStr.includes(query);

    return matchesJob && matchesStatus && matchesSearch;
  });

  return (
    <div className="font-sans space-y-6">
      
      {/* ATS Header & Filters */}
      <div className="bg-white border border-[#e6ebf1] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#e6ebf1] pb-4">
          <div>
            <h2 className="text-[17px] font-bold text-[#0a2540] tracking-tight">candidates ats</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">filter, search, and update candidate statuses in real time.</p>
          </div>
          <span className="text-[11px] font-semibold text-[#635bff] bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full self-start md:self-auto">
            {filteredApplications.length} candidates found
          </span>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Job Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#4f5b66]">filter by job</label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full bg-white border border-[#e6ebf1] rounded-lg px-3 py-2.5 text-[#0a2540] focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] text-[13px] font-medium shadow-sm"
            >
              <option value="All">all job openings ({recruiterJobs.length})</option>
              {recruiterJobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title.toLowerCase()} ({job.company.toLowerCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#4f5b66]">filter by status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white border border-[#e6ebf1] rounded-lg px-3 py-2.5 text-[#0a2540] focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] text-[13px] font-medium shadow-sm"
            >
              <option value="All">all statuses</option>
              <option value="Applied">applied (new)</option>
              <option value="Shortlisted">shortlisted</option>
              <option value="Rejected">rejected</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#4f5b66]">search candidates</label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-slate-400">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="name, email, college, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#e6ebf1] rounded-lg pl-9 pr-4 py-2 text-[#0a2540] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] text-[13px] shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Grid */}
      {loading && recruiterApplications.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-[14px]">Loading candidates...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white border border-[#e6ebf1] rounded-2xl p-12 text-center text-slate-500 shadow-sm">
          <svg className="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
          </svg>
          <p className="text-[14px] font-semibold text-[#0a2540]">no candidates found</p>
          <p className="text-[13px] text-slate-400 mt-1">try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredApplications.map((app) => {
            const job = app.job;
            if (!job) return null;

            return (
              <div
                key={app._id}
                className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Top decorative bar */}
                <div className={`h-1 w-full ${
                  app.status === "Shortlisted" ? "bg-[#008a6b]" :
                  app.status === "Rejected" ? "bg-rose-400" : "bg-amber-400"
                }`} />

                {/* Card Main Body */}
                <div className="p-5 space-y-4 flex-1">
                  
                  {/* Name and Type */}
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-[16px] font-bold text-[#0a2540] tracking-tight">
                        {(app.applicantName || app.applicant?.name || "anonymous").toLowerCase()}
                      </h3>
                      <p className="text-[12px] text-slate-400">{app.applicant?.email}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      app.applicantType === "Student"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}>
                      {app.applicantType.toLowerCase()}
                    </span>
                  </div>

                  {/* Applied Job Banner */}
                  <div className="bg-[#f6f9fc] border border-[#e6ebf1] p-2.5 rounded-xl text-[12px] text-slate-600">
                    <span className="font-semibold text-slate-400 text-[9px] block">job applied for</span>
                    <span className="font-bold text-[#0a2540]">{job.title.toLowerCase()}</span>
                    <span className="text-slate-400 ml-1.5">• {job.company.toLowerCase()}</span>
                  </div>

                  {/* Profile Details */}
                  <div className="text-[12px] text-slate-600 space-y-2 border border-[#e6ebf1] p-3.5 rounded-xl bg-[#fafbfc]">
                    {app.applicantType === "Student" ? (
                      <>
                        <div className="flex items-center">
                          <svg className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                          <span className="font-semibold text-slate-500 mr-1.5">college:</span>
                          <span className="text-[#0a2540] font-medium">{app.college.toLowerCase()}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="font-semibold text-slate-500 mr-1.5">degree:</span>
                          <span className="text-[#0a2540] font-medium">{app.degree.toLowerCase()}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <svg className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <span className="font-semibold text-slate-500 mr-1.5">last company:</span>
                          <span className="text-[#0a2540] font-medium">{app.currentCompany.toLowerCase()}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold text-slate-500 mr-1.5">experience:</span>
                          <span className="text-[#0a2540] font-medium">{app.experienceYears} yrs</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                          </svg>
                          <span className="font-semibold text-slate-500 mr-1.5">current salary:</span>
                          <span className="text-[#0a2540] font-semibold">{app.currentCtc.toLowerCase()}</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center">
                      <svg className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1" />
                      </svg>
                      <span className="font-semibold text-slate-500 mr-1.5">expected salary:</span>
                      <span className="text-[#0a2540] font-semibold">{app.expectedCtc.toLowerCase()}</span>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  {app.applicant?.skills && app.applicant.skills.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 block">candidate skills</span>
                      <div className="flex flex-wrap gap-1">
                        {app.applicant.skills.map((skill, index) => {
                          const isMatch = (job.skills || []).some(
                            (js) => js.toLowerCase().trim() === skill.toLowerCase().trim()
                          );
                          return (
                            <span
                              key={index}
                              className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${
                                isMatch
                                  ? "bg-[#e8fbf6] text-[#008a6b] border-[#c0f5e8]"
                                  : "bg-white text-slate-500 border-slate-200"
                              }`}
                            >
                              {skill.toLowerCase()}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: Status & Actions */}
                <div className="px-5 py-4 border-t border-[#e6ebf1] bg-[#fdfdfe] flex flex-col sm:flex-row justify-between items-center gap-3">
                  
                  {/* Left: Status Badge & Resume */}
                  <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-between sm:justify-start">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                      app.status === "Shortlisted"
                        ? "bg-[#e8fbf6] text-[#008a6b] border-[#c0f5e8]"
                        : app.status === "Rejected"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                      {app.status.toLowerCase()}
                    </span>

                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] font-semibold text-[#635bff] hover:text-[#0a2540] transition-colors flex items-center space-x-1"
                      >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>view resume</span>
                      </a>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex space-x-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleStatusUpdate(app._id, "Shortlisted", job._id)}
                      disabled={app.status === "Shortlisted"}
                      className="flex-1 sm:flex-none text-[11px] font-semibold bg-[#e8fbf6] hover:bg-[#c0f5e8] text-[#008a6b] px-3 py-1.5 rounded-lg border border-[#c0f5e8] disabled:opacity-40 transition-all text-center"
                    >
                      shortlist
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app._id, "Rejected", job._id)}
                      disabled={app.status === "Rejected"}
                      className="flex-1 sm:flex-none text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg border border-rose-200 disabled:opacity-40 transition-all text-center"
                    >
                      reject
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
