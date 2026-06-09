export default function ProfileWidget({ userProfile, profileStrength, onEditClick, applications = [] }) {
  // Generate profile enhancement suggestions
  const getSuggestions = () => {
    const list = [];
    if (!userProfile?.title) list.push({ text: "Add your designation", points: 15 });
    if (!userProfile?.skills || userProfile.skills.length === 0) list.push({ text: "Add your key skills", points: 15 });
    if (!userProfile?.college || !userProfile?.degree) list.push({ text: "Add your education details", points: 15 });
    if (!userProfile?.resumeUrl) list.push({ text: "Upload your resume", points: 20 });
    if (!userProfile?.currentCompany && !userProfile?.experienceYears) list.push({ text: "Add work experience", points: 15 });
    return list;
  };

  const suggestions = getSuggestions();

  // Map application status to display label + style
  const getStatusStyle = (status) => {
    if (status === "Shortlisted") return { label: "Reviewed", cls: "bg-[#e8fbf6] text-[#008a6b] border-[#c0f5e8]" };
    if (status === "Rejected")    return { label: "Rejected", cls: "bg-rose-50 text-rose-600 border-rose-200" };
    return                               { label: "Pending",  cls: "bg-amber-50 text-amber-700 border-amber-200" };
  };

  // Last 3 applications for the recent list
  const recentApps = [...applications].reverse().slice(0, 3);

  return (
    <div className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm font-sans overflow-hidden">

      {/* Profile Strength Header — dark gradient matching sidebar/header */}
      <div
        className="px-5 pt-5 pb-5"
        style={{ background: "linear-gradient(135deg, #0f1f3d 0%, #1a2f5a 60%, #2a1a6e 100%)" }}
      >
        <div className="flex justify-between items-center text-[13px] mb-3">
          <span className="font-semibold text-white">Profile strength</span>
          <span className="font-bold text-[#a78bfa]">{profileStrength}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#a78bfa] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${profileStrength}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-white/10 border border-white/15 rounded-xl p-3 text-center">
            <div className="text-[11px] font-medium text-white/50">Search appearances</div>
            <div className="text-[20px] font-bold text-white mt-0.5">{userProfile?.searchAppearances || 0}</div>
          </div>
          <div className="bg-white/10 border border-white/15 rounded-xl p-3 text-center">
            <div className="text-[11px] font-medium text-white/50">Profile views</div>
            <div className="text-[20px] font-bold text-[#a78bfa] mt-0.5">{userProfile?.profileViews || 0}</div>
          </div>
        </div>
      </div>

      {/* Body sections */}
      <div className="px-5 pb-5 space-y-5 pt-4">

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-[12px] font-semibold text-[#0a2540]">Improve your profile strength</p>
            <ul className="space-y-1.5">
              {suggestions.slice(0, 2).map((s, i) => (
                <li key={i} className="flex justify-between items-center text-[12px] text-slate-600 bg-[#f6f9fc] border border-[#e6ebf1] rounded-lg px-3 py-2">
                  <span className="font-normal">{s.text}</span>
                  <span className="text-[#635bff] font-semibold ml-2">+{s.points}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent Applications */}
        {recentApps.length > 0 && (
          <div className="space-y-2 border-t border-[#e6ebf1] pt-4">
            <p className="text-[12px] font-semibold text-[#0a2540]">Recent applications</p>
            <ul className="space-y-2">
              {recentApps.map((app) => {
                const job = app.job;
                if (!job) return null;
                const { label, cls } = getStatusStyle(app.status);
                return (
                  <li key={app._id} className="flex items-center justify-between bg-[#f6f9fc] border border-[#e6ebf1] rounded-xl px-3 py-2.5">
                    <div className="min-w-0 flex-1 mr-2">
                      <p className="text-[12px] font-semibold text-[#0a2540] truncate">{job.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{job.company}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${cls}`}>
                      {label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <div className={recentApps.length > 0 || suggestions.length > 0 ? "border-t border-[#e6ebf1] pt-4" : ""}>
          <button
            onClick={onEditClick}
            className="w-full text-center text-[13px] font-semibold bg-[#635bff] hover:bg-[#0a2540] text-white py-2.5 rounded-xl transition-all shadow-sm"
          >
            Edit profile credentials
          </button>
        </div>
      </div>
    </div>
  );
}
