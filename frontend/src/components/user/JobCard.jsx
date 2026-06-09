import { useSelector } from "react-redux";

export default function JobCard({ job, userProfile, onApplyClick }) {
  const { applications } = useSelector((state) => state.applications);

  const existingApp = applications.find(
    (app) => app.job?._id === job._id || app.job === job._id
  );

  const handleApplyClick = () => {
    if (onApplyClick) onApplyClick(job);
  };

  const userSkills = userProfile?.skills || [];
  const cleanUserSkills = userSkills.map((s) => s.toLowerCase().trim()).filter((s) => s);
  const jobSkills = job.skills || [];
  const matchingSkills = jobSkills.filter((js) =>
    cleanUserSkills.some(
      (us) => us.includes(js.toLowerCase().trim()) || js.toLowerCase().trim().includes(us)
    )
  );
  const missingSkills = jobSkills.filter((js) => !matchingSkills.includes(js));
  const matchPercentage = jobSkills.length > 0 ? Math.round((matchingSkills.length / jobSkills.length) * 100) : 0;

  const matchColor =
    matchPercentage >= 70
      ? "text-[#008a6b] bg-[#e8fbf6] border-[#c0f5e8]"
      : matchPercentage >= 40
      ? "text-amber-700 bg-amber-50 border-amber-200"
      : "text-rose-700 bg-rose-50 border-rose-200";

  const matchBarColor =
    matchPercentage >= 70 ? "bg-[#008a6b]" : matchPercentage >= 40 ? "bg-amber-400" : "bg-rose-400";

  return (
    <div className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm hover:shadow-lg hover:border-[#635bff]/30 transition-all duration-300 font-sans overflow-hidden group">
      {/* Accent top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#635bff] via-[#a78bfa] to-[#38bdf8] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
          {/* Left: Job Info */}
          <div className="flex-1 min-w-0">

            {/* Domain (if available) */}
            {job.domain && (
              <div className="mb-2">
                <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                  <svg className="w-2.5 h-2.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                  {job.domain}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-[17px] font-bold text-[#0a2540] tracking-tight leading-snug">{job.title}</h2>

            {/* Company */}
            <div className="flex items-center mt-1 space-x-1.5">
              <svg className="w-3.5 h-3.5 text-[#635bff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-[#635bff] text-[13px] font-semibold">{job.company}</p>
            </div>

            {/* Meta badges: Location, Type, Salary */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[12px] font-normal">
              <span className="flex items-center bg-[#f6f9fc] text-[#4f5b66] border border-[#e6ebf1] px-2.5 py-1 rounded-lg">
                <svg className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
              <span className="flex items-center bg-[#f6f9fc] text-[#4f5b66] border border-[#e6ebf1] px-2.5 py-1 rounded-lg">
                <svg className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {job.jobType}
              </span>
              {job.salary && (
                <span className="flex items-center bg-[#e8fbf6] text-[#008a6b] border border-[#c0f5e8] px-2.5 py-1 rounded-lg font-semibold">
                  <span className="mr-1 text-[13px] font-bold">₹</span>
                  {job.salary}
                </span>
              )}
            </div>

            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-[#4f5b66] mb-2 flex items-center">
                  <svg className="w-3.5 h-3.5 mr-1.5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Required Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="text-[11px] bg-white text-[#635bff] border border-[#635bff]/25 px-2 py-0.5 rounded-md font-medium hover:bg-[#635bff]/5 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {job.description && (
              <p className="text-[13px] text-slate-500 mt-4 line-clamp-2 leading-relaxed font-normal">{job.description}</p>
            )}

            {/* Skill Match Panel */}
            {userSkills.length > 0 && jobSkills.length > 0 && (
              <div className="mt-5 rounded-xl border border-[#e6ebf1] overflow-hidden bg-[#fafbfc]">
                {/* Match Score Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[#e6ebf1]">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-[#635bff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                    <span className="text-[12px] font-bold text-[#0a2540]">Profile Match</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${matchColor}`}>
                    {matchPercentage}% Match
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="h-1 w-full bg-slate-100">
                  <div className={`h-full ${matchBarColor} transition-all duration-700`} style={{ width: `${matchPercentage}%` }} />
                </div>
                {/* Two-column: Matched & Missing */}
                <div className="grid grid-cols-2 divide-x divide-[#e6ebf1]">
                  {/* Matched Skills */}
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#008a6b] mb-2 flex items-center">
                      <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Matched Skills
                    </p>
                    {matchingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {matchingSkills.map((skill, i) => (
                          <span key={i} className="text-[10px] text-[#008a6b] font-medium bg-[#e8fbf6] px-1.5 py-0.5 rounded border border-[#c0f5e8]">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No matches yet</span>
                    )}
                  </div>
                  {/* Missing Skills */}
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-2 flex items-center">
                      <svg className="w-3 h-3 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Missing Skills
                    </p>
                    {missingSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {missingSkills.map((skill, i) => (
                          <span key={i} className="text-[10px] text-[#4f5b66] font-normal bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#008a6b] font-medium">All skills matched!</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Action */}
          <div className="flex items-end justify-end md:self-stretch flex-shrink-0">
            {existingApp ? (
              <span
                className={`text-[12px] font-semibold px-4 py-2 rounded-xl border ${
                  existingApp.status === "Shortlisted"
                    ? "bg-[#e8fbf6] text-[#008a6b] border-[#c0f5e8]"
                    : existingApp.status === "Rejected"
                    ? "bg-rose-50 text-rose-700 border-rose-100"
                    : "bg-[#f6f9fc] text-[#4f5b66] border-[#e6ebf1]"
                }`}
              >
                {existingApp.status === "Applied" ? "Applied" : existingApp.status}
              </span>
            ) : (
              <button
                onClick={handleApplyClick}
                className="bg-[#635bff] hover:bg-[#0a2540] text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}