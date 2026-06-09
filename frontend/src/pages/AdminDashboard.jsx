import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "../redux/actions/adminActions";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f6f9fc] text-[#0a2540] flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-[#15234d] bg-[#0a1128] px-6 py-4 flex items-center justify-between text-white">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          Admin Control Center
        </h1>
        <button
          onClick={handleLogout}
          className="py-1.5 px-4 bg-red-950/35 hover:bg-red-900/40 text-red-300 border border-red-900/20 rounded-xl font-bold transition-all duration-200 text-xs"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-[#0a2540] mb-6">System Overview</h2>

          {loading ? (
            <div className="flex items-center space-x-3 text-slate-500 font-normal">
              <svg className="animate-spin h-5 w-5 text-[#635bff]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-[14px]">Loading admin stats...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 bg-white border border-[#e6ebf1] rounded-xl shadow-sm hover:border-slate-300 transition-all duration-200">
                <div className="text-[#4f5b66] text-[13px] font-medium">Total Candidates</div>
                <div className="text-3xl font-semibold text-[#0a2540] mt-2">{stats?.users || 0}</div>
              </div>

              <div className="p-6 bg-white border border-[#e6ebf1] rounded-xl shadow-sm hover:border-slate-300 transition-all duration-200">
                <div className="text-[#4f5b66] text-[13px] font-medium">Total Recruiters</div>
                <div className="text-3xl font-semibold text-[#635bff] mt-2">{stats?.recruiters || 0}</div>
              </div>

              <div className="p-6 bg-white border border-[#e6ebf1] rounded-xl shadow-sm hover:border-slate-300 transition-all duration-200">
                <div className="text-[#4f5b66] text-[13px] font-medium">Active Jobs</div>
                <div className="text-3xl font-semibold text-[#008a6b] mt-2">{stats?.jobs || 0}</div>
              </div>

              <div className="p-6 bg-white border border-[#e6ebf1] rounded-xl shadow-sm hover:border-slate-300 transition-all duration-200">
                <div className="text-[#4f5b66] text-[13px] font-medium">Applications Submitted</div>
                <div className="text-3xl font-semibold text-[#0a2540] mt-2">{stats?.applications || 0}</div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}