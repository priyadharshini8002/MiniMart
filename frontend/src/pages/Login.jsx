// pages/Login.jsx
// Login form. After a successful login the user goes back to the page they came from.

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../services/api";
import { isValidEmail } from "../utils/format";

function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const goBackTo = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!isValidEmail(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.password) newErrors.password = "Enter your password";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast("Welcome back! Login successful");
      navigate(goBackTo, { replace: true });
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Login</h1>
        <p className="page-subtitle">Welcome back to MiniMart</p>

        {serverError && <p className="error-box">{serverError}</p>}

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Your password" />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <button className="btn btn-block" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-switch">
          New to MiniMart? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
