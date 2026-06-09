import JobCard from "./JobCard";

export default function JobList({ jobs, onApplyClick }) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
        <span className="text-4xl block mb-3">🔍</span>
        No jobs match your search queries.
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