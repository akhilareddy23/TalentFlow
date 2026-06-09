import { useState } from "react";
import { useDispatch } from "react-redux";
import { createJob } from "../../redux/slices/jobSlice";
import { toast } from "react-hot-toast";
import { GoogleInput, GoogleTextArea, GoogleSelect } from "../common/GoogleInput";
import { validateRequired } from "../../utils/validation";

export default function PostJobForm({ onSuccess }) {
  const dispatch = useDispatch();

  // Form state
  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate inputs
    const titleErr = validateRequired(title, "Job Title");
    const companyErr = validateRequired(company, "Company");
    const locationErr = validateRequired(location, "Location");
    const descErr = validateRequired(description, "Job Description");

    if (titleErr || companyErr || locationErr || descErr) {
      setErrors({
        title: titleErr,
        company: companyErr,
        location: locationErr,
        description: descErr,
      });
      return;
    }

    setErrors({});
    setSubmitting(true);

    // Parse skills as array
    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    const jobData = {
      title,
      domain,
      company,
      location,
      salary,
      jobType,
      skills: skillsArray,
      description,
    };

    dispatch(
      createJob(jobData, (err) => {
        setSubmitting(false);
        if (err) {
          toast.error("Failed to post job. Please try again.");
        } else {
          toast.success("Job posted successfully!");
          
          // Reset form fields
          setTitle("");
          setDomain("");
          setCompany("");
          setLocation("");
          setSalary("");
          setSkills("");
          setDescription("");

          if (onSuccess) onSuccess();
        }
      })
    );
  };

  return (
    <div className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm p-6 md:p-8 font-sans max-w-3xl mx-auto">
      <div className="border-b border-[#e6ebf1] pb-4 mb-6">
        <h2 className="text-[18px] font-bold text-[#0a2540] tracking-tight">post a new job opening</h2>
        <p className="text-[13px] text-slate-400 mt-1">Provide clear specifications to attract the most suitable candidates.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6 text-[14px] text-slate-700">
        
        {/* Section: Job Identity */}
        <div>
          <p className="text-[11px] font-bold text-[#635bff] mb-3">job details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GoogleInput
              label="Job Title"
              required={true}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Engineer"
              error={errors.title}
            />
            <GoogleSelect
              label="Job Type"
              required={true}
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </GoogleSelect>
          </div>
        </div>

        {/* Section: Organization Details */}
        <div className="border-t border-[#e6ebf1] pt-6">
          <p className="text-[11px] font-bold text-[#635bff] mb-3">organization details</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GoogleInput
              label="Company Name"
              required={true}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Google"
              error={errors.company}
            />
            <GoogleSelect
              label="Industry Domain"
              required={false}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              <option value="">Select Domain (optional)</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Finance & Banking">Finance &amp; Banking</option>
              <option value="Healthcare">Healthcare</option>
              <option value="E-Commerce">E-Commerce</option>
              <option value="Education">Education</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Consulting">Consulting</option>
              <option value="Media & Entertainment">Media &amp; Entertainment</option>
              <option value="Logistics">Logistics</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Other">Other</option>
            </GoogleSelect>
          </div>
        </div>

        {/* Section: Location & Compensation */}
        <div className="border-t border-[#e6ebf1] pt-6">
          <p className="text-[11px] font-bold text-[#635bff] mb-3">location &amp; compensation</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GoogleInput
              label="Location"
              required={true}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Remote / Mumbai"
              error={errors.location}
            />
            <GoogleInput
              label="Salary Range (CTC)"
              required={false}
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. ₹8L – ₹12L / yr"
            />
          </div>
        </div>

        {/* Section: Skills & Description */}
        <div className="border-t border-[#e6ebf1] pt-6">
          <p className="text-[11px] font-bold text-[#635bff] mb-3">candidate requirements</p>
          <div className="space-y-4">
            <GoogleInput
              label="Required Skills (comma-separated)"
              required={false}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, Tailwind CSS"
            />
            <GoogleTextArea
              label="Job Description"
              required={true}
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the role, responsibilities, and qualifications..."
              error={errors.description}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#e6ebf1]">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#635bff] hover:bg-[#0a2540] text-white text-[13px] font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? "publishing..." : "publish job opening"}
          </button>
        </div>
      </form>
    </div>
  );
}
