export function GoogleInput({ label, type = "text", required = false, error = "", ...props }) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold text-sm">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-4 py-3 rounded-xl bg-white border text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
    </div>
  );
}

export function GoogleTextArea({ label, required = false, error = "", ...props }) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold text-sm">*</span>}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 rounded-xl bg-white border text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
    </div>
  );
}

export function GoogleSelect({ label, required = false, error = "", children, ...props }) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-1 font-bold text-sm">*</span>}
        </label>
      )}
      <select
        className={`w-full px-4 py-3 rounded-xl bg-white border text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200"
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
    </div>
  );
}
