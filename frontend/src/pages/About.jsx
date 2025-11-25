import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const AboutUs = () => {
  return (
    <div
      style={{
        background:
          "linear-gradient(90deg, rgba(179,230,177,1) 0%, rgba(179,230,177,1) 88%)",
        minHeight: "100vh",
      }}
    >
      {/* Banner */}
      <section
        className="text-center text-white d-flex align-items-center justify-content-center position-relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80')",
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
          <h1 className="display-4 fw-bold">About Us</h1>
          <p className="lead mt-2">Empowering agriculture with technology.</p>
        </div>
      </section>

      {/* Company Info */}
      <div className="container py-5">
        <h2 className="fw-bold text-success mb-4">Who We Are</h2>
        <p className="text-muted fs-5">
          We are committed to transforming the agricultural ecosystem by
          connecting farmers, buyers, and technology. Our platform provides smart
          tools, real‑time insights, and easy access to markets.
        </p>
      </div>

      {/* Team Section */}
      <section
        className="py-5"
        style={{ background: "linear-gradient(to right, #80f57c, #428742)" }}
      >
        <div className="container text-white">
          <h2 className="fw-bold mb-4 text-center">Our Team</h2>

          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="card text-center shadow-lg p-3">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=600&q=80"
                  alt="team"
                  className="card-img-top rounded"
                />
                <div className="card-body">
                  <h5 className="fw-bold">Shreyas Kandekar</h5>
                  <p className="text-muted">Founder & Developer</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-center shadow-lg p-3">
                <img
                  src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80"
                  alt="team"
                  className="card-img-top rounded"
                />
                <div className="card-body">
                  <h5 className="fw-bold">Team Member</h5>
                  <p className="text-muted">Support & Operations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
