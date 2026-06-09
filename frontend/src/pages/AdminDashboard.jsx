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
      <header
        className="h-20 px-8 flex-shrink-0 flex justify-between items-center relative border-b border-white/10"
        style={{ background: "linear-gradient(135deg, #0f1f3d 0%, #1a2f5a 60%, #2a1a6e 100%)" }}
      >
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <h1 className="text-[18px] font-bold text-white tracking-tight">
            Admin control center
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 rounded-lg font-medium transition-all duration-200 text-xs"
        >
          Sign out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-[#0a2540] mb-6">System overview</h2>

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
                <div className="text-[#4f5b66] text-[13px] font-medium">Total candidates</div>
                <div className="text-3xl font-semibold text-[#0a2540] mt-2">{stats?.users || 0}</div>
              </div>

              <div className="p-6 bg-white border border-[#e6ebf1] rounded-xl shadow-sm hover:border-slate-300 transition-all duration-200">
                <div className="text-[#4f5b66] text-[13px] font-medium">Total recruiters</div>
                <div className="text-3xl font-semibold text-[#635bff] mt-2">{stats?.recruiters || 0}</div>
              </div>

              <div className="p-6 bg-white border border-[#e6ebf1] rounded-xl shadow-sm hover:border-slate-300 transition-all duration-200">
                <div className="text-[#4f5b66] text-[13px] font-medium">Active jobs</div>
                <div className="text-3xl font-semibold text-[#008a6b] mt-2">{stats?.jobs || 0}</div>
              </div>

              <div className="p-6 bg-white border border-[#e6ebf1] rounded-xl shadow-sm hover:border-slate-300 transition-all duration-200">
                <div className="text-[#4f5b66] text-[13px] font-medium">Applications submitted</div>
                <div className="text-3xl font-semibold text-[#0a2540] mt-2">{stats?.applications || 0}</div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}