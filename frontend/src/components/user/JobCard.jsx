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
    <div className="bg-white border border-[#e6ebf1] p-6 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 font-sans">
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
        <div>
          <h2 className="text-[17px] font-semibold text-[#0a2540] tracking-tight">{job.title}</h2>
          <p className="text-slate-500 text-[14px] mt-0.5 font-normal">{job.company}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3 text-[12px] text-slate-500 font-normal">
            <span className="flex items-center bg-[#f6f9fc] text-[#4f5b66] border border-[#e6ebf1] px-2.5 py-1 rounded-md">
              {job.location}
            </span>
            <span className="flex items-center bg-[#f6f9fc] text-[#4f5b66] border border-[#e6ebf1] px-2.5 py-1 rounded-md">
              {job.jobType}
            </span>
            {job.salary && (
              <span className="flex items-center bg-[#e8fbf6] text-[#008a6b] border border-[#c0f5e8] px-2.5 py-1 rounded-md font-medium">
                {job.salary}
              </span>
            )}
          </div>

          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {job.skills.map((skill, index) => (
                <span key={index} className="text-[11px] bg-white text-[#635bff] border border-[#e6ebf1] px-2 py-0.5 rounded-md font-medium">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {job.description && (
            <p className="text-[13px] text-slate-500 mt-4 line-clamp-2 leading-relaxed font-normal">{job.description}</p>
          )}
        </div>

        <div className="flex items-end justify-end md:self-stretch flex-shrink-0">
          {existingApp ? (
            <span
              className={`text-[12px] font-medium px-4 py-2 rounded-lg border ${
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
              className="bg-[#635bff] hover:bg-[#0a2540] text-white text-[13px] font-medium px-4 py-2.5 rounded-lg transition-all shadow-sm active:scale-95"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}