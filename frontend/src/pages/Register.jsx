import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../redux/actions/authActions";
import { GoogleInput, GoogleSelect } from "../components/common/GoogleInput";
import { validateEmail, validatePassword, validateRequired } from "../utils/validation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validate inputs
    const nameError = validateRequired(name, "Full Name");
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const roleError = validateRequired(role, "Role");

    if (nameError || emailError || passwordError || roleError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        role: roleError,
      });
      return;
    }

    setErrors({});
    dispatch(registerUser(name, email, password, role, navigate));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a1128] px-4">
      <div className="bg-white border border-slate-200 p-8 rounded-2xl w-full max-w-md shadow-2xl transition-all duration-300">
        
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-[#0a1128] tracking-tight pb-1">
            Join TalentFlow
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Create your account to start your journey
          </p>
        </div>

        <form onSubmit={handleRegister} noValidate className="space-y-4">
          <GoogleInput
            label="Full Name"
            required={true}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            error={errors.name}
          />

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

          <GoogleSelect
            label="I want to join as a"
            required={true}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            error={errors.role}
          >
            <option value="user">Applicant (Job Seeker)</option>
            <option value="recruiter">Recruiter (Employer)</option>
          </GoogleSelect>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-[#0a1128] hover:bg-[#15234d] text-white font-bold rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-slate-500 text-sm font-medium">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500 font-semibold transition-all duration-150 underline decoration-blue-600/20"
          >
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}