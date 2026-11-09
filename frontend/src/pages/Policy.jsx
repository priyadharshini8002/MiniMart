// pages/Policy.jsx
// One component for both the Privacy Policy and Terms pages.
// The "type" prop decides which text to show (see App.jsx).

function Policy({ type }) {
  if (type === "privacy") {
    return (
      <div className="page">
        <h1 className="page-title">Privacy Policy</h1>
        <div className="text-card">
          <p>MiniMart collects only the details needed to run your account and deliver your orders: name, email, phone number and delivery address.</p>
          <p>Passwords are stored in a hashed form and are never visible to us. Online payments are handled by Razorpay; MiniMart does not store your card or UPI details.</p>
          <p>We do not sell your personal information. You can update your details at any time from your Profile page.</p>
          <p><em>This is a sample policy written for a student internship project.</em></p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Terms and Conditions</h1>
      <div className="text-card">
        <p>By using MiniMart you agree to provide correct information when you register and place orders.</p>
        <p>Prices are shown in Indian Rupees (₹) and include taxes. Delivery is free on orders of ₹499 or more, otherwise a delivery charge of ₹40 applies.</p>
        <p>Orders depend on stock availability. Cash on Delivery orders must be paid when the parcel is delivered.</p>
        <p><em>This is a sample document written for a student internship project.</em></p>
      </div>
    </div>
  );
}

export default Policy;
