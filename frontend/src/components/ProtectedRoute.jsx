// components/ProtectedRoute.jsx
// Wrap a page with this to make it available only to logged-in users.
// Others are sent to the Login page, and come back here after logging in.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}

export default ProtectedRoute;
