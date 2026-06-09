import { useSelector } from "react-redux";

export default function RecruiterJobCard({ job, onViewCandidatesClick, onDeleteClick }) {
  const { recruiterApplications } = useSelector((state) => state.applications);

  // Filter applications for this specific job
  const jobApps = recruiterApplications.filter(
    (app) => (app.job?._id || app.job) === job._id
  );

  const totalCount = jobApps.length;
  const shortlistedCount = jobApps.filter((app) => app.status === "Shortlisted").length;
  const rejectedCount = jobApps.filter((app) => app.status === "Rejected").length;
  const pendingCount = jobApps.filter((app) => app.status === "Applied").length;

  const handleViewCandidates = () => {
    if (onViewCandidatesClick) onViewCandidatesClick(job);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the job listing for "${job.title}"?`)) {
      if (onDeleteClick) onDeleteClick(job._id);
    }
  };

  return (
    <div className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm hover:shadow-lg hover:border-[#635bff]/30 transition-all duration-300 font-sans overflow-hidden group">
      {/* Accent top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#635bff] via-[#a78bfa] to-[#38bdf8] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          
          {/* Left: Job Identity & Metadata */}
          <div className="flex-1 min-w-0">
            {/* Domain (if available) */}
            {job.domain && (
              <div className="mb-2">
                <span className="inline-flex items-center text-[10px] font-semibold text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                  <svg className="w-2.5 h-2.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                  {job.domain.toLowerCase()}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-[17px] font-bold text-[#0a2540] tracking-tight leading-snug">{job.title.toLowerCase()}</h2>

            {/* Company */}
            <div className="flex items-center mt-1 space-x-1.5">
              <svg className="w-3.5 h-3.5 text-[#635bff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-[#635bff] text-[13px] font-semibold">{job.company.toLowerCase()}</p>
            </div>

            {/* Meta badges: Location, Type, Salary */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[12px] font-normal">
              <span className="flex items-center bg-[#f6f9fc] text-[#4f5b66] border border-[#e6ebf1] px-2.5 py-1 rounded-lg">
                <svg className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location.toLowerCase()}
              </span>
              <span className="flex items-center bg-[#f6f9fc] text-[#4f5b66] border border-[#e6ebf1] px-2.5 py-1 rounded-lg">
                <svg className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {job.jobType.toLowerCase()}
              </span>
              {job.salary && (
                <span className="flex items-center bg-[#e8fbf6] text-[#008a6b] border border-[#c0f5e8] px-2.5 py-1 rounded-lg font-semibold">
                  <span className="mr-1 text-[13px] font-bold">₹</span>
                  {job.salary.toLowerCase()}
                </span>
              )}
            </div>

            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-[#4f5b66] mb-2 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Target skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="text-[11px] bg-white text-[#635bff] border border-[#635bff]/25 px-2 py-0.5 rounded-md font-medium">
                      {skill.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Candidate Statistics Panel */}
            <div className="mt-5 rounded-xl border border-[#e6ebf1] overflow-hidden bg-[#fafbfc]">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#e6ebf1]">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-[#635bff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                  <span className="text-[12px] font-bold text-[#0a2540]">Application funnel</span>
                </div>
                <span className="text-[11px] font-bold bg-[#f6f9fc] text-[#4f5b66] border border-[#e6ebf1] px-2 py-0.5 rounded-full">
                  {totalCount} total candidates
                </span>
              </div>

              {/* Stats Columns */}
              <div className="grid grid-cols-3 divide-x divide-[#e6ebf1]">
                {/* Shortlisted */}
                <div className="p-3 text-center">
                  <p className="text-[10px] font-bold text-[#008a6b] mb-1 flex items-center justify-center">
                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                    </svg>
                    Shortlisted
                  </p>
                  <span className="text-base font-bold text-[#008a6b]">{shortlistedCount}</span>
                </div>

                {/* Pending Review */}
                <div className="p-3 text-center">
                  <p className="text-[10px] font-bold text-amber-600 mb-1 flex items-center justify-center">
                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                    </svg>
                    New applications
                  </p>
                  <span className="text-base font-bold text-amber-600">{pendingCount}</span>
                </div>

                {/* Rejected */}
                <div className="p-3 text-center">
                  <p className="text-[10px] font-bold text-rose-600 mb-1 flex items-center justify-center">
                    <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Rejected
                  </p>
                  <span className="text-base font-bold text-rose-600">{rejectedCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex flex-row md:flex-col items-end justify-between md:justify-start gap-3 flex-shrink-0">
            <button
              onClick={handleViewCandidates}
              className="bg-[#635bff] hover:bg-[#0a2540] text-white text-[12px] font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 text-center w-full"
            >
              View candidates
            </button>
            <button
              onClick={handleDelete}
              className="bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 text-[12px] font-semibold px-4 py-2.5 rounded-xl transition-all border border-[#e6ebf1] hover:border-rose-200 active:scale-95 text-center w-full flex items-center justify-center space-x-1.5"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete job</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
