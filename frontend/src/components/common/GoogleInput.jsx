export function GoogleInput({ label, type = "text", required = false, error = "", ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[#4f5b66]">
          {label}
          {required && <span className="text-red-500 ml-1 font-medium text-xs">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-3.5 py-2.5 rounded-lg bg-white border text-[#0a2540] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all text-[14px] shadow-sm ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#e6ebf1]"
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function GoogleTextArea({ label, required = false, error = "", ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[#4f5b66]">
          {label}
          {required && <span className="text-red-500 ml-1 font-medium text-xs">*</span>}
        </label>
      )}
      <textarea
        className={`w-full px-3.5 py-2.5 rounded-lg bg-white border text-[#0a2540] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all text-[14px] shadow-sm ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#e6ebf1]"
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function GoogleSelect({ label, required = false, error = "", children, ...props }) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[#4f5b66]">
          {label}
          {required && <span className="text-red-500 ml-1 font-medium text-xs">*</span>}
        </label>
      )}
      <select
        className={`w-full px-3.5 py-2.5 rounded-lg bg-white border text-[#0a2540] focus:outline-none focus:ring-2 focus:ring-[#635bff]/20 focus:border-[#635bff] transition-all text-[14px] shadow-sm ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-[#e6ebf1]"
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
