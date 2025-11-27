import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/AboutUs.css";


const AboutUs =()=> {
  const targetStats = [
    { label: "Farmers Connected", value: 50000, icon: "bi-people-fill" },
    { label: "Active Traders", value: 1200, icon: "bi-briefcase-fill" },
    { label: "AI Models Deployed", value: 12, icon: "bi-robot" },
    { label: "States Covered", value: 18, icon: "bi-geo-alt-fill" },
  ];

  const [stats, setStats] = useState(
    targetStats.map((stat) => ({ ...stat, current: 0 }))
  );

  useEffect(() => {
    let startTime;
    const duration = 2000;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setStats(
        targetStats.map((stat) => ({
          ...stat,
          current: Math.floor(stat.value * progress),
        }))
      );
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const features = [
    {
      title: "AI-Powered Crop Advisory",
      desc: "Our AI models analyze soil, weather, and crop data to suggest best farming practices.",
      icon: "bi bi-cpu",
      color: "#22c55e",
    },
    {
      title: "Smart Market Price Predictor",
      desc: "Predicts fair crop prices using machine learning on real-time market data.",
      icon: "bi bi-graph-up-arrow",
      color: "#3b82f6",
    },
    {
      title: "Digital Trading Platform",
      desc: "Farmers can sell directly to buyers through verified, transparent digital contracts.",
      icon: "bi bi-cart-check",
      color: "#f59e0b",
    },
    {
      title: "Quality Grading System",
      desc: "Uses image recognition to classify crops into grades for fair valuation.",
      icon: "bi bi-award",
      color: "#8b5cf6",
    },
    {
      title: "Agri Supply Chain Analytics",
      desc: "Tracks produce logistics from farm to buyer with real-time analytics dashboards.",
      icon: "bi bi-bar-chart-line",
      color: "#ec4899",
    },
    {
      title: "Weather & Soil Monitoring",
      desc: "IoT sensors and AI give insights on soil health and climate patterns.",
      icon: "bi bi-cloud-sun",
      color: "#06b6d4",
    },
  ];

  const team = [
    {
      name: "Muneendra",
      role: "Data Science Lead",
      bio: "Pioneering AI applications in AgriTech with 10+ years of ML experience.",
      img: "../assets/muneendra.jpg",
      linkedin: "https://www.linkedin.com/in/veresi-muneendra-b86790295/",
      email: "vmunendra63@gmail.com",
    },
    {
      name: "Nithin",
      role: "Data Science",
      bio: "Designs predictive models for market intelligence and price optimization.",
      img: "../assets/nithin.jpg",
      linkedin: "www.linkedin.com/in/nithin-bathala-78b933392",
      email: "nithinbathala@gmail.com",
    },
    {
      name: "Rajitha",
      role: "Data Science",
      bio: "Designs predictive models for market intelligence and price optimization.",
      img: "../assets/rajitha.jpg",
      linkedin: "https://www.linkedin.com/in/pathuri-rajitha-0aa005254",
      email: "pathurirajitha76@gmail.com",
    },
    {
      name: "Shreyas",
      role: "Full Stack",
      bio: "Builds scalable cloud-based solutions for seamless farmer-trader interactions.",
      img: "../assets/shreyas.jpg",
      linkedin: "https://www.linkedin.com/in/shreyas-kandekar",
      email: "",
    },
    {
      name: "Mohan",
      role: "Full Stack",
      bio: "Architects secure APIs and data pipelines for high-volume Agri data.",
      img: "../assets/mohan.jpg",
      linkedin:
        "https://www.linkedin.com/in/tippa-mohan-siva-sri-maruthi-0b9b2535a/",
      email: "tippamohan580@gmail.com",
    },
    {
      name: "Prudhvi",
      role: "Full Stack",
      bio: "Designs intuitive and responsive interfaces for users across all devices.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
      linkedin: "",
      email: "",
    },
  ];

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />
      <main className="bg-light">
        {/* Hero Section */}
        <section className="hero-section position-relative overflow-hidden">
          <div className="hero-overlay"></div>
          <div className="container position-relative" style={{ zIndex: 2 }}>
            <div className="row min-vh-100 align-items-center py-5">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="col-lg-8 mx-auto text-center text-white"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="mb-4"
                >
                  <i className="bi bi-flower3 display-1"></i>
                </motion.div>
                <h1 className="fw-bold display-3 mb-4">
                  Empowering Farmers with AI
                </h1>
                <p className="lead fs-4 mb-5 px-lg-5">
                  AgriBuy AI bridges farmers, traders, and industries using deep
                  learning to ensure fair trade, crop intelligence, and
                  profitable agriculture.
                </p>
                <div className="d-flex gap-3 justify-content-center flex-wrap">
                  <a
                    href="#features"
                    className="btn btn-light btn-lg text-success fw-semibold px-5 py-3 rounded-pill shadow-lg"
                  >
                    <i className="bi bi-rocket-takeoff me-2"></i>
                    Explore Features
                  </a>
                  <a
                    href="#team"
                    className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill"
                  >
                    <i className="bi bi-people me-2"></i>
                    Meet Our Team
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="hero-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          className="stats-section py-5 position-relative"
          style={{ marginTop: "-80px", zIndex: 3 }}
        >
          <div className="container">
            <div className="row g-4">
              {stats.map((s, idx) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="col-md-6 col-lg-3"
                >
                  <div className="stat-card bg-white rounded-4 shadow-lg p-4 text-center h-100">
                    <div className="stat-icon mb-3">
                      <i className={`bi ${s.icon} text-success display-4`}></i>
                    </div>
                    <h2 className="fw-bold text-success mb-2">
                      {s.current.toLocaleString()}+
                    </h2>
                    <p className="text-muted mb-0 fw-semibold">{s.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-5 my-5">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-5"
            >
              <h2 className="fw-bold display-5 mb-3">Our Key Features</h2>
              <p className="lead text-muted mb-0 px-lg-5">
                Advanced AI and IoT-based solutions that transform agriculture
                into a data-driven, transparent industry.
              </p>
            </motion.div>
            <div className="row g-4">
              {features.map((f, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="col-md-6 col-lg-4"
                >
                  <div className="feature-card h-100 bg-white border-0 shadow rounded-4 p-4">
                    <div
                      className="feature-icon mb-4"
                      style={{ color: f.color }}
                    >
                      <i className={`${f.icon} display-3`}></i>
                    </div>
                    <h5 className="fw-bold mb-3">{f.title}</h5>
                    <p className="text-muted mb-0">{f.desc}</p>
                    <div
                      className="feature-decoration mt-3"
                      style={{ backgroundColor: f.color }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="mv-section py-5 my-5 bg-gradient">
          <div className="container">
            <div className="row align-items-center g-5">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="col-lg-6"
              >
                <div className="mission-content">
                  <div className="mb-5">
                    <div className="d-flex align-items-center mb-3">
                      <div className="mission-icon me-3">
                        <i className="bi bi-bullseye text-success display-5"></i>
                      </div>
                      <h2 className="fw-bold mb-0">Our Mission</h2>
                    </div>
                    <p className="lead">
                      To empower every farmer with smart AI tools that enhance
                      yield, reduce costs, and open direct access to profitable
                      markets.
                    </p>
                  </div>
                  <div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="vision-icon me-3">
                        <i className="bi bi-eye text-success display-5"></i>
                      </div>
                      <h2 className="fw-bold mb-0">Our Vision</h2>
                    </div>
                    <p className="lead">
                      To build a future-ready agricultural ecosystem where
                      technology and trust drive sustainability and growth.
                    </p>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="col-lg-6"
              >
                <div className="impact-card bg-white shadow-lg rounded-4 p-5">
                  <h3 className="fw-bold mb-4 text-center">
                    <i className="bi bi-graph-up-arrow text-success me-2"></i>
                    Our Impact in 2025
                  </h3>
                  <div className="row g-3">
                    {stats.map((s, idx) => (
                      <div className="col-6" key={s.label}>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          viewport={{ once: true }}
                          className="impact-stat p-3 rounded-3 text-center"
                          style={{
                            background:
                              "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                          }}
                        >
                          <i
                            className={`bi ${s.icon} text-white fs-3 mb-2 d-block`}
                          ></i>
                          <h4 className="fw-bold text-white mb-1">
                            {s.current.toLocaleString()}+
                          </h4>
                          <small className="text-white-50 fw-semibold">
                            {s.label}
                          </small>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-5 my-5">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-5"
            >
              <h2 className="fw-bold display-5 mb-3">Meet Our Team</h2>
              <p className="lead text-muted">
                Passionate experts driving agricultural innovation
              </p>
            </motion.div>
            <div className="row g-4 justify-content-center">
              {team.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="col-sm-6 col-md-4 col-lg-4"
                >
                  <div className="team-card bg-white border-0 shadow rounded-4 overflow-hidden h-100">
                    <div className="team-img-wrapper position-relative">
                      <img
                        src={member.img}
                        alt={member.name}
                        className="w-100"
                        style={{ height: "300px", objectFit: "cover" }}
                      />
                      <div className="team-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                        <div className="social-links">
                          <a
                            href={member.linkedin}
                            target="_blank"
                            className="btn btn-light btn-sm rounded-circle me-2"
                          >
                            <i className="bi bi-linkedin"></i>
                          </a>
                          <a
                            href={`mailto:${member.email}`}
                            className="btn btn-light btn-sm rounded-circle"
                          >
                            <i className="bi bi-envelope"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h5 className="fw-bold mb-1">{member.name}</h5>
                      <p className="text-success mb-2 fw-semibold">
                        <i className="bi bi-briefcase me-1"></i>
                        {member.role}
                      </p>
                      <p className="text-muted small mb-0">{member.bio}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section py-5 my-5">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="cta-card bg-success text-white rounded-4 shadow-lg p-5 text-center"
            >
              <i className="bi bi-rocket-takeoff display-3 mb-4"></i>
              <h2 className="fw-bold display-5 mb-3">
                Ready to Transform Agriculture?
              </h2>
              <p className="lead mb-4 px-lg-5">
                Join thousands of farmers already benefiting from our AI-powered
                platform
              </p>
              <button className="btn btn-light btn-lg text-success fw-semibold px-5 py-3 rounded-pill">
                Get Started Today <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </motion.div>
          </div>
        </section>


      </main>
    </>
  );
};

export default AboutUs;
