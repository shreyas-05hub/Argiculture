import React, { useState } from "react";



const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlert("✅ Your message has been sent successfully!");
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setAlert(null), 4000);
  };

  return (
    <div>
      {/* ===== Banner Section ===== */}
      <section
        className="text-center text-white d-flex align-items-center justify-content-center position-relative"
        style={{
          backgroundImage: "url('/assets/Contact.jpg')",
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
            We’re here to answer your questions and help grow your agricultural success.
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
                Have questions about our agricultural services? We’d love to assist you.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Your Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

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

                <button type="submit" className="btn btn-success px-4 fw-semibold">
                  Send Message
                </button>
              </form>

              {alert && (
                <div className="alert alert-success mt-4 fw-semibold text-center">
                  {alert}
                </div>
              )}
            </div>

            {/* Right: Info + Map */}
            <div className="col-lg-6 text-center">
              <h4 className="fw-bold text-success mb-4">Reach Us</h4>
              <p className="mb-2 fw-semibold">Green Fields Office</p>
              <p className="mb-2">Agro Tech Farm, Kukatpally,</p>
              <p className="mb-2">Hyderabad, Telangana 500072</p>
              <p className="mb-2">📞 +91-9876543210</p>
              <p className="mb-4">✉️ support@agroservices.com</p>

              <p className="fw-bold mb-3">Find Us on the Map:</p>
              <div className="ratio ratio-4x3 border rounded shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15220.125134707886!2d78.3975765!3d17.49508545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b97b6928e4e11e5%3A0xf670d8a599b58402!2sBhagya%20Nagar%20Colony%2C%20Kukatpally%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700466453673!5m2!1sen!2sin"
                  title="Google Map"
                  allowFullScreen
                  loading="lazy"
                  style={{ border: 0, borderRadius: "10px" }}
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Agriculture FAQ Section ===== */}
      {/* <section className="py-5 bg-white border-top">
        <div className="container" style={{ maxWidth: "850px" }}>
          <h2 className="text-center fw-bold mb-5 text-success">
            Frequently Asked Questions – Agriculture
          </h2>

          <div className="accordion" id="faqAccordion">
            {[
              {
                q: "What types of crops do you provide support for?",
                a: "We offer guidance and technical support for a wide range of crops including cereals, pulses, vegetables, and fruits.",
              },
              {
                q: "Do you assist farmers with soil testing?",
                a: "Yes, we provide soil testing and fertility analysis to help farmers improve crop productivity.",
              },
              {
                q: "How can I get government subsidies for farm equipment?",
                a: "We guide farmers through the application process for various agricultural subsidy schemes offered by the government.",
              },
              {
                q: "Do you offer training or workshops for farmers?",
                a: "Absolutely! We conduct regular workshops on sustainable farming, irrigation methods, and modern agricultural technology.",
              },
              {
                q: "Can I purchase organic fertilizers and seeds from you?",
                a: "Yes, we supply high-quality organic fertilizers, seeds, and crop protection products to support eco-friendly farming.",
              },
            ].map((item, index) => (
              <div className="accordion-item mb-3" key={index}>
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button
                    className={`accordion-button fw-semibold ${
                      index !== 0 ? "collapsed" : ""
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded={index === 0 ? "true" : "false"}
                    aria-controls={`collapse${index}`}
                  >
                    {item.q}
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className={`accordion-collapse collapse ${
                    index === 0 ? "show" : ""
                  }`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Contact;