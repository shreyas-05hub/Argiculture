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

  // Auto-fill logged in user info
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

    if (!loggedUser) {
      toast.info("⚠️ You must be logged in to send a message.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          user_id: loggedUser.id,     // Send user ID
          role: loggedUser.role,      // Send role
        }),
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
        toast.error(data.error || "Something went wrong!");
      }
    } catch (error) {
      toast.error("❌ Server not responding!");
    }

    setLoading(false);
  };

  return (
    <div>
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

      {/* ===== Contact Form Section ===== */}
      <section
        className=" bg-light py-5"
        style={{
          background: " #b3e6b1",
          background:
            "linear-gradient(90deg, rgba(179, 230, 177, 1) 0%, rgba(179, 230, 177, 1) 88%)",
        }}
      >
        <div className="container">
          <div className="row g-4 shadow-lg p-4 rounded bg-white">
            {/* Contact Form */}
            <div className="col-lg-6">
              <h2 className="fw-bold mb-3 text-success">Get In Touch</h2>
              <p className="text-muted mb-4">
                Have questions about our agricultural platform? We’d love to
                assist you.
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
                    disabled
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    disabled
                  />
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
                    required
                  ></textarea>
                </div>

                <button
                  className="btn btn-success px-4 fw-semibold"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Right Section */}
            <div className="col-lg-6 text-center">
              <h4 className="fw-bold text-success mb-4">Reach Us</h4>
              <p className="mb-2 fw-semibold">Social Prachar Office</p>
              <p className="mb-2">Kukatpally Housing Board Colony</p>
              <p className="mb-2">Hyderabad, Telangana 500072</p>
              <p className="mb-2">📞 +91-9876543210</p>
              <p className="mb-4">✉️ support@agribuyai.in</p>

              <div
                className="ratio ratio-4x3 border rounded shadow-sm"
                style={{ height: "300px", overflow: "hidden" }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18..."
                  allowFullScreen
                  loading="lazy"
                  style={{ border: 0, borderRadius: "10px" }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
