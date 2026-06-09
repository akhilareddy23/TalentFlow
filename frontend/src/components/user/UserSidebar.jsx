export default function UserSidebar({ activeTab, setActiveTab }) {
  const navItems = [
    {
      key: "browse",
      label: "Browse Jobs",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      key: "recommended",
      label: "Recommended",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      key: "applied",
      label: "Applied Jobs",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: "ai",
      label: "Meta AI",
      icon: (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
            <p className="text-[10px] text-white/40 font-medium tracking-wide mt-0.5">AI platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-6 space-y-1.5">
        <p className="text-[10px] font-semibold tracking-wide text-white/30 px-2 mb-3">Menu</p>
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