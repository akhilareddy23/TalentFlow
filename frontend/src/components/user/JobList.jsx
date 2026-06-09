import JobCard from "./JobCard";

export default function JobList({ jobs, onApplyClick }) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-[#e6ebf1] rounded-xl p-12 text-center text-slate-500 shadow-sm font-sans">
        <p className="text-[14px] font-normal text-[#4f5b66]">No jobs match your search queries.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} onApplyClick={onApplyClick} />
      ))}
    </div>
  );
}