import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../redux/slices/jobSlice";

export default function Jobs() {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jobs</h1>

      {loading && <p>Loading...</p>}

      {jobs.map((job) => (
        <div key={job._id} className="p-4 bg-white shadow rounded mb-3">
          <h2 className="font-bold">{job.title}</h2>
          <p>{job.company}</p>
          <p>{job.location}</p>
        </div>
      ))}
    </div>
  );
}