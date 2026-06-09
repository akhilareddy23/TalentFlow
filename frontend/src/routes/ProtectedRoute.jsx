import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  // ❌ role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // ✅ allowed
  return children;
}