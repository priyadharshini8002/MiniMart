// pages/Profile.jsx
// View and edit the user's name, phone and address. Email cannot be changed.

import { useState } from "react";
import api, { getErrorMessage } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { INDIAN_STATES } from "../utils/constants";
import { isValidPhone, isValidPincode } from "../utils/format";

function Profile() {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: user.name,
    phone: user.phone,
    address: user.address || "",
    city: user.city || "",
    state: user.state || "",
    pincode: user.pincode || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name";
    if (!isValidPhone(form.phone)) e.phone = "Enter a valid 10-digit mobile number";
    if (form.pincode && !isValidPincode(form.pincode)) e.pincode = "Enter a valid 6-digit PIN code";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", form);
      setUser(data.user); // update the name shown in the navbar
      showToast("Profile saved successfully");
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
    setSaving(false);
  };

  return (
    <div className="page">
      <h1 className="page-title">My Profile</h1>

      <form className="form-card profile-card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <label>
            Full Name
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label>
            Email (cannot be changed)
            <input value={user.email} disabled />
          </label>

          <label>
            Phone Number
            <div className="phone-input">
              <span>+91</span>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} maxLength={13} />
            </div>
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </label>

          <label>
            Address
            <input name="address" value={form.address} onChange={handleChange} placeholder="House number, street" />
          </label>

          <label>
            City
            <input name="city" value={form.city} onChange={handleChange} />
          </label>

          <label>
            State
            <select name="state" value={form.state} onChange={handleChange}>
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          <label>
            PIN Code
            <input name="pincode" value={form.pincode} onChange={handleChange} maxLength={6} />
            {errors.pincode && <span className="field-error">{errors.pincode}</span>}
          </label>
        </div>

        <button className="btn" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default Profile;
