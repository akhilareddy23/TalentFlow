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
      <div className="bg-white border border-[#e6ebf1] rounded-xl p-12 text-center text-slate-500 shadow-sm font-sans">
        <p className="text-[14px] font-normal text-[#4f5b66]">You haven't applied to any jobs yet. Browse listings to apply!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-sans">
      <h2 className="text-[17px] font-semibold text-[#0a2540] mb-2 flex items-center">
        <span>Your Applications ({applications.length})</span>
      </h2>

      <div className="grid gap-4">
        {applications.map((app) => {
          const job = app.job;
          if (!job) return null;

          const appliedDate = new Date(app.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={app._id}
              className="bg-white border border-[#e6ebf1] p-5 rounded-xl shadow-sm hover:border-slate-350 transition-all duration-300 flex justify-between items-center"
            >
              <div>
                <h3 className="text-[16px] font-semibold text-[#0a2540] tracking-tight">{job.title}</h3>
                <p className="text-[#635bff] text-[13px] font-medium mt-0.5">{job.company}</p>
                <div className="flex items-center space-x-3 mt-2 text-[12px] text-slate-500 font-normal">
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>Applied on {appliedDate}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#f6f9fc] text-[#4f5b66] font-medium border border-[#e6ebf1]">
                  {job.jobType}
                </span>
                
                <span
                  className={`text-[11px] font-medium uppercase px-2.5 py-0.5 rounded-full border ${
                    app.status === "Shortlisted"
                      ? "bg-[#e8fbf6] text-[#008a6b] border-[#c0f5e8]"
                      : app.status === "Rejected"
                      ? "bg-rose-50 text-rose-700 border-rose-100"
                      : "bg-[#f6f9fc] text-[#4f5b66] border-[#e6ebf1]"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
