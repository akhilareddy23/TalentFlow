import { useSelector } from "react-redux";

export default function JobCard({ job, onApplyClick }) {
  const { applications } = useSelector((state) => state.applications);
  
  const existingApp = applications.find(
    (app) => app.job?._id === job._id || app.job === job._id
  );

  const handleApplyClick = () => {
    if (onApplyClick) {
      onApplyClick(job);
    }
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-slate-300 hover:shadow-md transition-all duration-200 font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{job.title}</h2>
          <p className="text-slate-500 font-semibold mt-0.5">{job.company}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500 font-bold">
            <span className="flex items-center bg-slate-100 px-2.5 py-1 rounded-lg">
              📍 {job.location}
            </span>
            <span className="flex items-center bg-slate-100 px-2.5 py-1 rounded-lg">
              💼 {job.jobType}
            </span>
            {job.salary && (
              <span className="flex items-center bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-bold">
                💰 {job.salary}
              </span>
            )}
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {job.skills.map((skill, index) => (
                <span key={index} className="text-[10px] bg-slate-100 text-[#0a1128] border border-slate-250 px-2 py-0.5 rounded-md font-bold">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {job.description && (
            <p className="text-sm text-slate-500 mt-4 line-clamp-2 leading-relaxed font-medium">{job.description}</p>
          )}
        </div>

        <div className="flex items-end justify-end md:self-stretch flex-shrink-0">
          {existingApp ? (
            <span
              className={`text-xs font-bold px-5 py-2.5 rounded-xl border ${
                existingApp.status === "Shortlisted"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : existingApp.status === "Rejected"
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              }`}
            >
              {existingApp.status === "Applied" ? "Applied" : existingApp.status}
            </span>
          ) : (
            <button
              onClick={handleApplyClick}
              className="bg-[#0a1128] hover:bg-[#15234d] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}