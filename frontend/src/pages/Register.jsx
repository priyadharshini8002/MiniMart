// pages/Register.jsx
// Registration form with validation.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../services/api";
import { isValidEmail, isValidPhone } from "../utils/format";

function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (form.name.trim().length < 2) newErrors.name = "Enter your full name";
    if (!isValidEmail(form.email)) newErrors.email = "Enter a valid email address";
    if (!isValidPhone(form.phone)) newErrors.phone = "Enter a valid 10-digit mobile number";
    if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form);
      showToast("Account created. Welcome to MiniMart!");
      navigate("/");
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Create Account</h1>
        <p className="page-subtitle">Join MiniMart and start shopping</p>

        {serverError && <p className="error-box">{serverError}</p>}

        <label>
          Full Name
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ravi Kumar" />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label>
          Phone Number
          <div className="phone-input">
            <span>+91</span>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="98765 43210" maxLength={13} />
          </div>
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </label>

        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="At least 6 characters" />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <label>
          Confirm Password
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Type password again" />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
        </label>

        <button className="btn btn-block" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
