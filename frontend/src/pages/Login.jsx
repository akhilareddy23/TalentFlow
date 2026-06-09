import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { loginUser } from "../redux/actions/authActions";
import { GoogleInput } from "../components/common/GoogleInput";
import { validateEmail, validateRequired } from "../utils/validation";

export default function Login() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validate inputs
    const emailError = validateEmail(email);
    const passwordError = validateRequired(password, "Password");

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({});
    dispatch(loginUser(email, password, navigate));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f9fc] px-4 font-sans">
      <div className="bg-white border border-[#e6ebf1] p-10 rounded-xl w-full max-w-md shadow-xl transition-all duration-300">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-[#0a2540] tracking-tight pb-1">
            TalentFlow AI
          </h2>
          <p className="text-slate-500 mt-2 text-[14px]">
            Sign in to access your job portal
          </p>
        </div>

        <form onSubmit={handleLogin} noValidate className="space-y-5">
          <GoogleInput
            label="Email Address"
            type="email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            error={errors.email}
          />

          <GoogleInput
            label="Password"
            type="password"
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            error={errors.password}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 bg-[#635bff] hover:bg-[#0a2540] text-white font-medium rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-[14px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-500 text-[14px]">
          New user?{" "}
          <Link
            to="/register"
            className="text-[#635bff] hover:text-[#0a2540] font-medium transition-all duration-150 underline decoration-[#635bff]/20"
          >
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}