export default function RecruiterSidebar({ activeTab, setActiveTab }) {
  const navItems = [
    {
      key: "listings",
      label: "Manage Listings",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      key: "post-job",
      label: "Post New Job",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: "applicants",
      label: "Candidates ATS",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="w-64 flex flex-col h-screen sticky top-0 flex-shrink-0 font-sans"
      style={{
        background: "linear-gradient(160deg, #0f1f3d 0%, #1a2f5a 55%, #2a1a6e 100%)",
      }}
    >
      {/* Logo / Brand */}
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center space-x-2.5">
          <svg className="w-6 h-6 text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <div>
            <h2 className="text-[15px] font-bold text-white tracking-tight leading-none">TalentFlow</h2>
            <p className="text-[10px] text-white/40 font-medium tracking-wide mt-0.5">Recruiter console</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-6 space-y-1.5">
        <p className="text-[10px] font-semibold tracking-wide text-white/30 px-2 mb-3">Recruiter menu</p>
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 text-left ${
                isActive
                  ? "bg-white/15 text-white shadow-inner border border-white/20"
                  : "text-white/55 hover:bg-white/8 hover:text-white/90"
              }`}
            >
              <span className={`${isActive ? "text-[#a78bfa]" : "text-white/40"} transition-colors`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer decoration */}
      <div className="px-6 py-5 border-t border-white/10">
        <p className="text-[10px] text-white/25 font-normal text-center">Powered by AI · v1.0</p>
      </div>
    </div>
  );
}
