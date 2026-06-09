import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { toast } from "react-hot-toast";

export default function UserSidebar({ activeTab, setActiveTab }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="w-64 bg-[#0a1128] border-r border-[#15234d] text-white p-6 flex flex-col justify-between min-h-screen flex-shrink-0 font-sans">
      <div>
        <h2 className="text-2xl font-extrabold text-white mb-8 pb-1 tracking-tight">
          TalentFlow AI
        </h2>

        <ul className="space-y-2 text-sm font-bold">
          <li
            onClick={() => setActiveTab("browse")}
            className={`cursor-pointer flex items-center space-x-3 p-3 rounded-xl transition-all ${
              activeTab === "browse"
                ? "bg-[#15234d] text-white border-l-4 border-white rounded-l-none"
                : "text-slate-300 hover:bg-[#111d40] hover:text-white"
            }`}
          >
            <span className="text-base">💼</span>
            <span>Browse Jobs</span>
          </li>
          <li
            onClick={() => setActiveTab("applied")}
            className={`cursor-pointer flex items-center space-x-3 p-3 rounded-xl transition-all ${
              activeTab === "applied"
                ? "bg-[#15234d] text-white border-l-4 border-white rounded-l-none"
                : "text-slate-300 hover:bg-[#111d40] hover:text-white"
            }`}
          >
            <span className="text-base">📄</span>
            <span>Applied Jobs</span>
          </li>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-2.5 px-4 bg-red-950/35 hover:bg-red-900/40 text-red-300 border border-red-900/20 rounded-xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 text-xs"
      >
        <span>Logout</span>
      </button>
    </div>
  );
}