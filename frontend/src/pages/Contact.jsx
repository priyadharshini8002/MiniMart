// pages/Contact.jsx
// Contact details and a message form.
// MiniMart has no mail server, so "Send Message" opens the visitor's own email app
// with the message already filled in (a mailto: link).

import { useState } from "react";
import { isValidEmail } from "../utils/format";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (form.name.trim().length < 2) newErrors.name = "Enter your name";
    if (!isValidEmail(form.email)) newErrors.email = "Enter a valid email address";
    if (form.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const subject = encodeURIComponent(`MiniMart enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} (${form.email})`);
    window.location.href = `mailto:support@minimart.in?subject=${subject}&body=${body}`;
  };

  return (
    <div className="page">
      <h1 className="page-title">Contact Us</h1>

      <div className="cart-layout">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <h3>Send us a message</h3>

          <label>
            Your Name
            <input name="name" value={form.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label>
            Your Email
            <input type="email" name="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label>
            Message
            <textarea name="message" rows="5" value={form.message} onChange={handleChange}></textarea>
            {errors.message && <span className="field-error">{errors.message}</span>}
          </label>

          <button className="btn">Send Message</button>
          <p className="tax-note">This opens your email app with the message ready to send.</p>
        </form>

        <aside className="summary-box">
          <h3>Our Details</h3>
          <p>📍 12, Gandhi Road, Chennai, Tamil Nadu - 600001</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ support@minimart.in</p>
          <p>🕘 Monday to Saturday, 9:00 am to 6:00 pm</p>
        </aside>
      </div>
    </div>
  );
}

export default Contact;
