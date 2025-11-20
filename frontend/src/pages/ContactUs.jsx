import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  // const [toast, setToast] = useState({ type: "", message: "" });

  // Auto-fill if logged in user exists
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedUser) {
      setFormData((prev) => ({
        ...prev,
        name: loggedUser.username,
        email: loggedUser.email,
      }));
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // 🚫 Condition: If user is not logged in → block submission
    if (!loggedUser) {
      toast.info("⚠️ You must be logged in to send a message.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("✅ Message sent successfully!");
        setFormData({
          name: loggedUser.username,
          email: loggedUser.email,
          subject: "",
          message: "",
        });
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch (error) {
      toast.error("❌ Server not responding.");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* TOAST NOTIFICATION */}
      {toast.message && (
        <div
          className={`toast align-items-center text-white position-fixed top-0 end-0 m-3 show ${
            toast.type === "success" ? "bg-success" : "bg-danger"
          }`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body fw-semibold">{toast.message}</div>
          </div>
        </div>
      )}

      {/* ===== Banner Section ===== */}
      <section
        className="text-center text-white d-flex align-items-center justify-content-center position-relative"
        style={{
          backgroundImage: "url('../assets/images.jpg')",
          height: "50vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        ></div>
        <div className="position-relative p-3">
          <h1 className="display-4 fw-bold">Contact Us</h1>
          <p className="lead mt-2">
            We’re here to answer your questions and help grow your success.
          </p>
        </div>
      </section>

      {/* ===== Contact Section ===== */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 shadow-lg p-4 rounded bg-white">
            {/* Left: Contact Form */}
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3 text-success">Get In Touch</h2>
              <p className="text-muted mb-4">
                Have questions about our agricultural platform? We’d love to assist you.
              </p>

              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    disabled
                  />
                  <small className="text-muted">Auto-filled after login</small>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled
                  />
                  <small className="text-muted">Auto-filled after login</small>
                </div>

                {/* Subject */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter the subject"
                    required
                  />
                </div>

                {/* Message */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea
                    className="form-control"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message..."
                    required
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-success px-4 fw-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></div>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>

            {/* Right: Info + Map */}
            <div className="col-lg-6 text-center">
              <h4 className="fw-bold text-success mb-4">Reach Us</h4>
              <p className="mb-2 fw-semibold">Social Prachar Office</p>
              <p className="mb-2">Kukatpally Housing Board Colony</p>
              <p className="mb-2">Hyderabad, Telangana 500072</p>
              <p className="mb-2">📞 +91-9876543210</p>
              <p className="mb-4">✉️ support@agribuyai.in</p>

              <div className="ratio ratio-4x3 border rounded shadow-sm">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15220.125134707886!2d78.3975765!3d17.49508545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b97b6928e4e11e5%3A0xf670d8a599b58402!2sBhagya%20Nagar%20Colony%2C%20Kukatpally%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700466453673!5m2!1sen!2sin" title="Google Map" allowFullScreen loading="lazy" style={{ border: 0, borderRadius: "10px" }} ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
