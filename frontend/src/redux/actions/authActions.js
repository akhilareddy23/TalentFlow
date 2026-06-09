import API from "../../api/axios";
import { authStart, authSuccess, authFail } from "../slices/authSlice";
import { toast } from "react-hot-toast";

export const loginUser =
  (email, password, navigate) => async (dispatch) => {
    try {
      dispatch(authStart());

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      dispatch(authSuccess(res.data));

      const role = res.data.user.role;

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      toast.success(`Welcome back, ${res.data.user.name || "User"}!`);

      if (role === "admin") {
        navigate("/admin");
      } else if (role === "recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/user");
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      dispatch(authFail(errorMsg));
      toast.error(errorMsg);
    }
  };


  export const registerUser =
  (name, email, password, role, navigate) => async (dispatch) => {
    try {
      dispatch(authStart());

      await API.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      // Reset loading state and keep user as logged out
      dispatch(authSuccess({ user: null, token: null }));

      toast.success("Registration successful! Please login.");

      // Redirect to login page and pass the email to prefill it
      navigate("/login", { state: { email } });

    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      dispatch(authFail(errorMsg));
      toast.error(errorMsg);
    }
  };