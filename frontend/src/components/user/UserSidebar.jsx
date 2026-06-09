export default function UserSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-white border-r border-[#e6ebf1] text-[#0a2540] p-6 flex flex-col h-screen sticky top-0 flex-shrink-0 font-sans">
      <div>
        <h2 className="text-xl font-semibold text-[#0a2540] mb-8 pb-1 tracking-tight">
          TalentFlow AI
        </h2>

        <ul className="space-y-1 text-[14px] font-medium">
          <li
            onClick={() => setActiveTab("browse")}
            className={`cursor-pointer flex items-center space-x-3 p-2.5 rounded-lg transition-all ${
              activeTab === "browse"
                ? "bg-[#f6f9fc] text-[#635bff] border-l-4 border-[#635bff] rounded-l-none font-semibold"
                : "text-[#4f5b66] hover:bg-[#f6f9fc] hover:text-[#0a2540]"
            }`}
          >
            <svg className="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Browse Jobs</span>
          </li>
          <li
            onClick={() => setActiveTab("applied")}
            className={`cursor-pointer flex items-center space-x-3 p-2.5 rounded-lg transition-all ${
              activeTab === "applied"
                ? "bg-[#f6f9fc] text-[#635bff] border-l-4 border-[#635bff] rounded-l-none font-semibold"
                : "text-[#4f5b66] hover:bg-[#f6f9fc] hover:text-[#0a2540]"
            }`}
          >
            <svg className="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Applied Jobs</span>
          </li>
        </ul>
      </div>
    </div>
  );
}