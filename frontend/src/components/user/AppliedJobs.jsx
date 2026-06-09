import { useSelector } from "react-redux";

export default function AppliedJobs() {
  const { applications, loading } = useSelector((state) => state.applications);

  if (loading) {
    return (
      <div className="text-slate-400 py-12 text-center text-[14px] font-normal font-sans">
        Loading applied jobs...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white border border-[#e6ebf1] rounded-2xl p-12 text-center text-slate-500 shadow-sm font-sans">
        <svg className="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-[14px] font-semibold text-[#0a2540]">No applications yet</p>
        <p className="text-[13px] text-slate-400 mt-1">Browse listings and start applying to track your progress here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[17px] font-bold text-[#0a2540] tracking-tight">
          Your Applications
        </h2>
        <span className="text-[11px] font-semibold text-[#635bff] bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
          {applications.length} Total
        </span>
      </div>

      <div className="grid gap-4">
        {applications.map((app) => {
          const job = app.job;
          if (!job) return null;

          const appliedDate = new Date(app.createdAt).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          const statusConfig = {
            Shortlisted: {
              cls: "bg-[#e8fbf6] text-[#008a6b] border-[#c0f5e8]",
              icon: (
                <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                </svg>
              ),
            },
            Rejected: {
              cls: "bg-rose-50 text-rose-700 border-rose-200",
              icon: (
                <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              ),
            },
            Applied: {
              cls: "bg-[#f6f9fc] text-[#4f5b66] border-[#e6ebf1]",
              icon: (
                <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
            },
          };
          const status = statusConfig[app.status] || statusConfig.Applied;

          return (
            <div
              key={app._id}
              className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm hover:shadow-md hover:border-[#635bff]/20 transition-all duration-300 overflow-hidden group"
            >
              {/* Top accent line based on status */}
              <div className={`h-0.5 w-full ${
                app.status === "Shortlisted" ? "bg-[#008a6b]" :
                app.status === "Rejected" ? "bg-rose-400" : "bg-[#635bff]"
              }`} />

              <div className="p-5 flex justify-between items-start gap-4">
                {/* Left: Job Info */}
                <div className="flex-1 min-w-0">
                  {/* Domain (if available) */}
                  {job.domain && (
                    <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full mb-2">
                      <svg className="w-2.5 h-2.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                      </svg>
                      {job.domain}
                    </span>
                  )}

                  <h3 className="text-[16px] font-bold text-[#0a2540] tracking-tight">{job.title}</h3>

                  {/* Company */}
                  <div className="flex items-center mt-1 space-x-1.5">
                    <svg className="w-3.5 h-3.5 text-[#635bff] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-[#635bff] text-[13px] font-semibold">{job.company}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-3 mt-2.5 text-[12px] text-slate-500">
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span className="text-slate-200">|</span>
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 text-slate-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Applied on {appliedDate}
                    </span>
                  </div>
                </div>

                {/* Right: Type & Status */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {/* Job Type */}
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#f6f9fc] text-[#4f5b66] font-medium border border-[#e6ebf1] flex items-center">
                    <svg className="w-3 h-3 text-slate-400 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {job.jobType}
                  </span>

                  {/* Status Badge */}
                  <span className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full border flex items-center ${status.cls}`}>
                    {status.icon}
                    {app.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
