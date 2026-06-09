import { useState } from "react";
import { GoogleInput } from "../common/GoogleInput";
import { validateRequired, validateNumber } from "../../utils/validation";
import { uploadResumeApi } from "../../api/profileApi";

export default function ProfileEditModal({ userProfile, onClose, onSave, loading }) {
  // Local form states
  const [title, setTitle] = useState(userProfile?.title || "");
  const [skills, setSkills] = useState(
    userProfile?.skills ? userProfile.skills.join(", ") : ""
  );
  const [college, setCollege] = useState(userProfile?.college || "");
  const [degree, setDegree] = useState(userProfile?.degree || "");
  const [currentCompany, setCurrentCompany] = useState(userProfile?.currentCompany || "");
  const [experienceYears, setExperienceYears] = useState(
    userProfile?.experienceYears !== undefined ? String(userProfile.experienceYears) : ""
  );
  const [currentCtc, setCurrentCtc] = useState(userProfile?.currentCtc || "");
  const [expectedCtc, setExpectedCtc] = useState(userProfile?.expectedCtc || "");
  const [resumeUrl, setResumeUrl] = useState(userProfile?.resumeUrl || "");

  // Error states
  const [errors, setErrors] = useState({});

  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileName, setFileName] = useState(userProfile?.resumeUrl ? "Current Resume File" : "");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, resumeUrl: "File size must be less than 10MB." }));
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setUploadingFile(true);
      setErrors((prev) => ({ ...prev, resumeUrl: null }));
      const res = await uploadResumeApi(formData);
      setResumeUrl(res.data.fileUrl);
      setFileName(file.name);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to upload file";
      setErrors((prev) => ({ ...prev, resumeUrl: errorMsg }));
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Centralized form validations
    const titleErr = validateRequired(title, "Designation");
    const skillsErr = validateRequired(skills, "Key Skills");
    const collegeErr = validateRequired(college, "College");
    const degreeErr = validateRequired(degree, "Degree");
    const resumeErr = validateRequired(resumeUrl, "Resume File");
    const expErr = validateNumber(experienceYears, "Years of Experience");
    const expectedCtcErr = validateRequired(expectedCtc, "Expected CTC");

    if (titleErr || skillsErr || collegeErr || degreeErr || resumeErr || expErr || expectedCtcErr) {
      setErrors({
        title: titleErr,
        skills: skillsErr,
        college: collegeErr,
        degree: degreeErr,
        resumeUrl: resumeErr,
        experienceYears: expErr,
        expectedCtc: expectedCtcErr,
      });
      return;
    }

    setErrors({});

    const profileData = {
      title,
      skills,
      experienceYears: Number(experienceYears) || 0,
      college,
      degree,
      currentCompany,
      currentCtc,
      expectedCtc,
      resumeUrl,
    };

    onSave(profileData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a2540]/30 backdrop-blur-[2px]">
      <div className="bg-white border border-[#e6ebf1] rounded-xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto font-sans">
        <div className="flex justify-between items-center border-b border-[#e6ebf1] pb-3 mb-5">
          <div>
            <h3 className="text-[18px] font-semibold text-[#0a2540] tracking-tight">Edit Profile Credentials</h3>
            <p className="text-[13px] text-slate-500 mt-0.5">Keep your jobseeker profile updated to attract recruiters.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 text-lg font-normal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 text-[14px] text-slate-700">
          
          <div className="grid grid-cols-2 gap-4">
            <GoogleInput
              label="Designation / Title"
              required={true}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Developer"
              error={errors.title}
            />
            <GoogleInput
              label="Key Skills (comma-separated)"
              required={true}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node, Tailwind"
              error={errors.skills}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-[#e6ebf1] pt-4">
            <GoogleInput
              label="College / University"
              required={true}
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. Stanford University"
              error={errors.college}
            />
            <GoogleInput
              label="Degree & Major"
              required={true}
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="e.g. B.S. in Computer Science"
              error={errors.degree}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-[#e6ebf1] pt-4">
            <div className="col-span-2">
              <GoogleInput
                label="Current / Last Company"
                required={false}
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
                placeholder="e.g. Microsoft (optional)"
              />
            </div>
            <GoogleInput
              label="Years of Experience"
              type="number"
              required={true}
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              placeholder="e.g. 2"
              error={errors.experienceYears}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-[#e6ebf1] pt-4">
            <GoogleInput
              label="Current CTC (Salary)"
              required={false}
              value={currentCtc}
              onChange={(e) => setCurrentCtc(e.target.value)}
              placeholder="e.g. ₹8L / yr"
            />
            <GoogleInput
              label="Expected CTC (Salary)"
              required={true}
              value={expectedCtc}
              onChange={(e) => setExpectedCtc(e.target.value)}
              placeholder="e.g. ₹12L / yr"
              error={errors.expectedCtc}
            />
          </div>

          <div className="border-t border-[#e6ebf1] pt-4 space-y-1.5">
            <label className="block text-sm font-medium text-[#4f5b66]">
              Upload Resume (PDF, DOC, DOCX)
              <span className="text-red-500 ml-1 font-medium text-xs">*</span>
            </label>
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer bg-white hover:bg-[#f6f9fc] border border-[#e6ebf1] text-[#4f5b66] hover:text-[#0a2540] px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all shadow-sm flex items-center space-x-1.5 flex-shrink-0">
                <svg className="w-4 h-4 text-[#635bff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>{uploadingFile ? "Uploading..." : "Choose File"}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploadingFile}
                />
              </label>
              <div className="flex-1 text-[13px] text-slate-500 truncate">
                {fileName ? (
                  <span className="text-[#0a2540] font-medium flex items-center space-x-1">
                    <svg className="w-4 h-4 text-[#008a6b] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="truncate">{fileName}</span>
                  </span>
                ) : (
                  "No file chosen"
                )}
              </div>
            </div>
            {errors.resumeUrl && (
              <p className="text-xs text-red-500 mt-1">{errors.resumeUrl}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#e6ebf1]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-[#e6ebf1] text-[#4f5b66] rounded-lg hover:bg-[#f6f9fc] font-medium text-[13px] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-[#635bff] hover:bg-[#0a2540] text-white font-medium rounded-lg shadow-sm disabled:opacity-50 text-[13px] transition-all"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
