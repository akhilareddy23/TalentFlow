import { useSelector } from "react-redux";

export default function AppliedJobs() {
  const { applications, loading } = useSelector((state) => state.applications);

  if (loading) {
    return (
      <div className="text-slate-400 py-12 text-center text-sm font-semibold">
        Loading applied jobs...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
        <span className="text-4xl block mb-3">📄</span>
        You haven't applied to any jobs yet. Browse listings to apply!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-700 mb-2 flex items-center">
        <span>📄</span>
        <span className="ml-2">Your Applications ({applications.length})</span>
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
              className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-slate-300 transition-all duration-300 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">{job.title}</h3>
                <p className="text-[#0a1128] text-sm font-semibold mt-0.5">{job.company}</p>
                <div className="flex items-center space-x-3 mt-2.5 text-xs text-slate-500 font-bold">
                  <span>📍 {job.location}</span>
                  <span>•</span>
                  <span>Applied on {appliedDate}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200/50">
                  {job.jobType}
                </span>
                
                <span
                  className={`text-[9px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                    app.status === "Shortlisted"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : app.status === "Rejected"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
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
