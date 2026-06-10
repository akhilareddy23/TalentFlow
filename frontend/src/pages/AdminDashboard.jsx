import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";
import { toast } from "react-hot-toast";
import AdminSidebar from "../components/admin/AdminSidebar";
import {
  fetchAdminStats,
  fetchAdminUsers,
  fetchAdminJobs,
  fetchAdminApplications,
  deleteAdminUser,
  deleteAdminJob,
} from "../redux/actions/adminActions";

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, bg }) {
  return (
    <div className="bg-white border border-[#e6ebf1] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
        <span className={color}>{icon}</span>
      </div>
      <div>
        <p className="text-[12px] text-[#4f5b66] font-medium">{label}</p>
        <p className="text-2xl font-bold text-[#0a2540] mt-0.5">{value ?? 0}</p>
      </div>
    </div>
  );
}

// ── Role Badge ─────────────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const styles = {
    admin: "bg-red-50 text-red-600 border-red-200",
    recruiter: "bg-purple-50 text-purple-600 border-purple-200",
    user: "bg-blue-50 text-blue-600 border-blue-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles[role] || styles.user}`}>
      {role}
    </span>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    pending:  "bg-yellow-50 text-yellow-600 border-yellow-200",
    reviewed: "bg-blue-50 text-blue-600 border-blue-200",
    shortlisted: "bg-purple-50 text-purple-600 border-purple-200",
    rejected: "bg-red-50 text-red-600 border-red-200",
    hired:    "bg-green-50 text-green-600 border-green-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${styles[status] || styles.pending}`}>
      {status || "pending"}
    </span>
  );
}

// ── Overview Tab ───────────────────────────────────────────────────────────────
function OverviewTab({ stats, users, jobs, applications }) {
  const recentUsers = [...users].slice(0, 5);
  const recentJobs  = [...jobs].slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Total Candidates"
          value={stats?.users}
          bg="bg-blue-50"
          color="text-blue-600"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
        />
        <StatCard
          label="Total Recruiters"
          value={stats?.recruiters}
          bg="bg-purple-50"
          color="text-purple-600"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <StatCard
          label="Active Jobs"
          value={stats?.jobs}
          bg="bg-green-50"
          color="text-green-600"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
        />
        <StatCard
          label="Applications"
          value={stats?.applications}
          bg="bg-orange-50"
          color="text-orange-600"
          icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
      </div>

      {/* Recent Users + Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e6ebf1] flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[#0a2540]">Recent Users</h3>
            <span className="text-[11px] text-slate-400">{users.length} total</span>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {recentUsers.length === 0 ? (
              <p className="text-center text-slate-400 text-[13px] py-8">No users yet</p>
            ) : recentUsers.map((u) => (
              <div key={u._id} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#635bff] text-white flex items-center justify-center font-bold text-[12px]">
                    {u.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#0a2540]">{u.name}</p>
                    <p className="text-[11px] text-slate-400">{u.email}</p>
                  </div>
                </div>
                <RoleBadge role={u.role} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e6ebf1] flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[#0a2540]">Recent Jobs</h3>
            <span className="text-[11px] text-slate-400">{jobs.length} total</span>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {recentJobs.length === 0 ? (
              <p className="text-center text-slate-400 text-[13px] py-8">No jobs yet</p>
            ) : recentJobs.map((j) => (
              <div key={j._id} className="px-6 py-3.5 flex items-center justify-between hover:bg-[#fafbfc] transition-colors">
                <div>
                  <p className="text-[13px] font-medium text-[#0a2540]">{j.title}</p>
                  <p className="text-[11px] text-slate-400">{j.company} · {j.location}</p>
                </div>
                <span className="text-[11px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                  {j.jobType || "Full Time"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Status Summary */}
      {applications.length > 0 && (
        <div className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm p-6">
          <h3 className="text-[14px] font-semibold text-[#0a2540] mb-4">Application Status Breakdown</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {["pending", "reviewed", "shortlisted", "rejected", "hired"].map((s) => {
              const count = applications.filter((a) => (a.status || "pending") === s).length;
              return (
                <div key={s} className="text-center bg-[#f8fafc] rounded-xl p-3 border border-[#e6ebf1]">
                  <p className="text-xl font-bold text-[#0a2540]">{count}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 capitalize">{s}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Users Tab ──────────────────────────────────────────────────────────────────
function UsersTab({ users, onDelete }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [confirmId, setConfirmId] = useState(null);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-4 bg-white border border-[#e6ebf1] p-4 rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <span className="absolute left-3.5 top-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#e6ebf1] rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-[#0a2540] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all shadow-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full md:w-44 bg-white border border-[#e6ebf1] rounded-lg px-3 py-2.5 text-[14px] text-[#0a2540] focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all shadow-sm"
        >
          <option value="All">All Roles</option>
          <option value="user">Candidates</option>
          <option value="recruiter">Recruiters</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e6ebf1]">
          <h3 className="text-[14px] font-semibold text-[#0a2540]">
            All Users <span className="ml-2 text-slate-400 font-normal text-[12px]">({filtered.length})</span>
          </h3>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <p className="text-slate-400 text-[13px]">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e6ebf1]">
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Email</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
                  <th className="text-right px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#635bff] text-white flex items-center justify-center font-bold text-[12px] flex-shrink-0">
                          {u.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <span className="font-medium text-[#0a2540]">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{u.email}</td>
                    <td className="px-6 py-3.5"><RoleBadge role={u.role} /></td>
                    <td className="px-6 py-3.5 text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {u.role !== "admin" && (
                        confirmId === u._id ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button onClick={() => { onDelete(u._id); setConfirmId(null); }} className="text-[11px] bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-medium transition-all">Confirm</button>
                            <button onClick={() => setConfirmId(null)} className="text-[11px] border border-[#e6ebf1] text-slate-500 px-3 py-1 rounded-lg font-medium hover:bg-[#f6f9fc] transition-all">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmId(u._id)} className="text-[11px] text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg font-medium transition-all">Delete</button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Jobs Tab ───────────────────────────────────────────────────────────────────
function JobsTab({ jobs, onDelete }) {
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase();
    return j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q) || j.location?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#e6ebf1] p-4 rounded-xl shadow-sm">
        <div className="relative">
          <span className="absolute left-3.5 top-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Search by title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#e6ebf1] rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-[#0a2540] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e6ebf1]">
          <h3 className="text-[14px] font-semibold text-[#0a2540]">
            All Jobs <span className="ml-2 text-slate-400 font-normal text-[12px]">({filtered.length})</span>
          </h3>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <p className="text-slate-400 text-[13px]">No jobs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e6ebf1]">
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Job Title</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Company</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Posted By</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                  <th className="text-right px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filtered.map((j) => (
                  <tr key={j._id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-6 py-3.5 font-medium text-[#0a2540]">{j.title}</td>
                    <td className="px-6 py-3.5 text-slate-500">{j.company}<span className="text-slate-300 mx-1">·</span>{j.location}</td>
                    <td className="px-6 py-3.5">
                      <span className="text-[11px] bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full font-semibold">{j.jobType || "Full Time"}</span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{j.createdBy?.name || "—"}</td>
                    <td className="px-6 py-3.5 text-slate-400">
                      {j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {confirmId === j._id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => { onDelete(j._id); setConfirmId(null); }} className="text-[11px] bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-medium transition-all">Confirm</button>
                          <button onClick={() => setConfirmId(null)} className="text-[11px] border border-[#e6ebf1] text-slate-500 px-3 py-1 rounded-lg font-medium hover:bg-[#f6f9fc] transition-all">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmId(j._id)} className="text-[11px] text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1 rounded-lg font-medium transition-all">Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Applications Tab ───────────────────────────────────────────────────────────
function ApplicationsTab({ applications }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = applications.filter((a) => {
    const q = search.toLowerCase();
    const name = (a.applicantName || a.applicant?.name || "").toLowerCase();
    const job  = (a.job?.title || "").toLowerCase();
    const matchSearch = name.includes(q) || job.includes(q);
    const matchStatus = statusFilter === "All" || (a.status || "pending") === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row gap-4 bg-white border border-[#e6ebf1] p-4 rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <span className="absolute left-3.5 top-3 text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input
            type="text"
            placeholder="Search by applicant or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[#e6ebf1] rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-[#0a2540] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 bg-white border border-[#e6ebf1] rounded-lg px-3 py-2.5 text-[14px] text-[#0a2540] focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all shadow-sm"
        >
          <option value="All">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
      </div>

      <div className="bg-white border border-[#e6ebf1] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e6ebf1]">
          <h3 className="text-[14px] font-semibold text-[#0a2540]">
            All Applications <span className="ml-2 text-slate-400 font-normal text-[12px]">({filtered.length})</span>
          </h3>
        </div>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-10 h-10 text-slate-200 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-slate-400 text-[13px]">No applications found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e6ebf1]">
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Applicant</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Job</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filtered.map((a) => (
                  <tr key={a._id} className="hover:bg-[#fafbfc] transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 rounded-full bg-[#635bff]/10 text-[#635bff] flex items-center justify-center font-bold text-[11px] flex-shrink-0">
                          {(a.applicantName || a.applicant?.name || "A").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-[#0a2540]">{a.applicantName || a.applicant?.name || "—"}</p>
                          <p className="text-[11px] text-slate-400">{a.applicant?.email || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="text-[#0a2540] font-medium">{a.job?.title || "—"}</p>
                      <p className="text-[11px] text-slate-400">{a.job?.company || ""}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-[11px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                        {a.applicantType || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5"><StatusBadge status={a.status} /></td>
                    <td className="px-6 py-3.5 text-slate-400">
                      {a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Admin Dashboard ───────────────────────────────────────────────────────
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, users, jobs, applications, loading } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminJobs());
    dispatch(fetchAdminApplications());
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const tabTitles = {
    overview:     { title: "System Overview",   sub: "Monitor platform health, users, and activity at a glance." },
    users:        { title: "Manage Users",       sub: "View, search, and remove platform users and recruiters." },
    jobs:         { title: "All Job Listings",   sub: "Oversee every job posted across the platform." },
    applications: { title: "All Applications",   sub: "Track and audit every candidate application." },
  };

  return (
    <div className="flex h-screen bg-[#f6f9fc] text-[#0a2540] font-sans overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Header */}
        <header
          className="h-20 px-8 flex-shrink-0 flex justify-between items-center border-b border-white/10"
          style={{ background: "linear-gradient(135deg, #0f1f3d 0%, #1a2f5a 60%, #2a1a6e 100%)" }}
        >
          <div>
            <h1 className="text-[18px] font-bold text-white tracking-tight">{tabTitles[activeTab]?.title}</h1>
            <p className="text-[13px] text-white/50 mt-0.5 font-normal">{tabTitles[activeTab]?.sub}</p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all relative focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#e6ebf1] rounded-lg shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#e6ebf1]">
                    <span className="text-[13px] font-semibold text-[#0a2540]">Notifications</span>
                  </div>
                  <div className="px-4 py-6 text-center text-slate-400 text-[12px]">No new notifications.</div>
                </div>
              )}
            </div>

            {/* Admin Badge */}
            <div className="flex items-center space-x-2 border-l border-white/15 pl-4">
              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-[13px] shadow-lg shadow-red-500/40">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hidden md:block">
                <p className="text-[13px] font-semibold text-white leading-none">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-red-300 font-medium mt-0.5">Administrator</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 rounded-lg font-medium transition-all duration-200 text-xs"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {loading && activeTab === "overview" ? (
              <div className="flex items-center space-x-3 text-slate-500">
                <svg className="animate-spin h-5 w-5 text-[#635bff]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="text-[14px]">Loading dashboard...</span>
              </div>
            ) : (
              <>
                {activeTab === "overview"     && <OverviewTab stats={stats} users={users} jobs={jobs} applications={applications} />}
                {activeTab === "users"        && <UsersTab users={users} onDelete={(id) => dispatch(deleteAdminUser(id))} />}
                {activeTab === "jobs"         && <JobsTab jobs={jobs} onDelete={(id) => dispatch(deleteAdminJob(id))} />}
                {activeTab === "applications" && <ApplicationsTab applications={applications} />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}