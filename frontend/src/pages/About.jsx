import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AboutUs() {
  const targetStats = [
    { label: "Farmers Connected", value: 50000 },
    { label: "Active Traders", value: 1200 },
    { label: "AI Models Deployed", value: 12 },
    { label: "States Covered", value: 18 },
  ];

  const [stats, setStats] = useState(
    targetStats.map((stat) => ({ ...stat, current: 0 }))
  );

  useEffect(() => {
    let startTime;
    const duration = 20000;
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
    },
    {
      title: "Smart Market Price Predictor",
      desc: "Predicts fair crop prices using machine learning on real-time market data.",
      icon: "bi bi-graph-up-arrow",
    },
    {
      title: "Digital Trading Platform",
      desc: "Farmers can sell directly to buyers through verified, transparent digital contracts.",
      icon: "bi bi-cart-check",
    },
    {
      title: "Quality Grading System",
      desc: "Uses image recognition to classify crops into grades for fair valuation.",
      icon: "bi bi-award",
    },
    {
      title: "Agri Supply Chain Analytics",
      desc: "Tracks produce logistics from farm to buyer with real-time analytics dashboards.",
      icon: "bi bi-bar-chart-line",
    },
    {
      title: "Weather & Soil Monitoring",
      desc: "IoT sensors and AI give insights on soil health and climate patterns.",
      icon: "bi bi-cloud-sun",
    },
  ];

  const team = [
    {
      name: "Muneendra",
      role: "Data Science Lead",
      bio: "Pioneering AI applications in AgriTech with 10+ years of ML experience.",
      img: "https://images.unsplash.com",
    },
    {
      name: "Nithin",
      role: "Data Science",
      bio: "Designs predictive models for market intelligence and price optimization.",
      img: "https://images.unsplash.com/photo-1603415526960-f7e0328a2c3b?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Rajhitha",
      role: "Data Science",
      bio: "Designs predictive models for market intelligence and price optimization.",
      img: "https://images.unsplash.com/photo-1603415526960-f7e0328a2c3b?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Shreyas",
      role: "Full stack",
      bio: "Builds scalable cloud-based solutions for seamless farmer-trader interactions.",
      img: "https://images.unsplash.com/photo-1614289379988-2a3b0d4d8f85?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Mohan",
      role: "Full Stack",
      bio: "Architects secure APIs and data pipelines for high-volume Agri data.",
      img: "https://images.unsplash.com/photo-1502767089025-6572583495b4?auto=format&fit=crop&w=500&q=80",
    },
    {
      name: "Prudhvi",
      role: "Full Stack",
      bio: "Designs intuitive and responsive interfaces for users across all devices.",
      img: "https://images.unsplash.co",
    },
  ];

  return (
    <main className="bg-light text-dark">
      {/* Hero Section */}
      <section className="py-5 bg-success text-white">
        <div className="container">
          <div className="row align-items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="col-lg-6"
            >
              <h1 className="fw-bold display-4">Empowering Farmers with AI</h1>
              <p className="mt-3 fs-5">
                AgriBuy AI bridges farmers, traders, and industries using deep
                learning to ensure fair trade, crop intelligence, and profitable
                agriculture.
              </p>
              <div className="mt-4 d-flex gap-3">
                <a href="#features" className="btn btn-light text-success fw-semibold px-4 rounded-pill">
                  Explore Features
                </a>
                <a href="#team" className="btn btn-outline-light px-4 rounded-pill">
                  Meet Our Team
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="col-lg-6 text-center mt-4 mt-lg-0"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhTEeFElMjyriI4kl7RjRv6XXfELjpIWhldw&s         "
                alt="Farm AI"
                className="img-fluid rounded-4 shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Our Key Features</h2>
          <p className="text-secondary mb-5">
            Advanced AI and IoT-based solutions that transform agriculture into
            a data-driven, transparent industry.
          </p>
          <div className="row g-4">
            {features.map((f, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="col-md-6 col-lg-4"
              >
                <div className="card h-100 border-0 shadow-lg rounded-4 p-3 feature-card">
                  <div className="card-body">
                    <i className={`${f.icon} text-success fs-1 mb-3`}></i>
                    <h5 className="fw-bold">{f.title}</h5>
                    <p className="text-muted">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="fw-semibold mb-3">Our Mission</h2>
              <p className="text-secondary">
                To empower every farmer with smart AI tools that enhance yield,
                reduce costs, and open direct access to profitable markets.
              </p>
              <h3 className="fw-semibold mt-4 mb-3">Our Vision</h3>
              <p className="text-secondary">
                To build a future-ready agricultural ecosystem where technology
                and trust drive sustainability and growth.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="card shadow-lg border-0 rounded-4">
                <div className="card-body p-4">
                  <h4 className="fw-semibold mb-4">Impact (as of 2025)</h4>
                  <div className="row mt-4 g-3">
                    {stats.map((s) => (
                      <div className="col-6" key={s.label}>
                        <div className="p-3 bg-success bg-opacity-10 rounded text-center shadow-sm">
                          <h5 className="fw-bold text-success mb-0">
                            {s.current.toLocaleString()}
                          </h5>
                          <small className="text-muted">{s.label}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">Meet Our Team</h2>
          <div className="row g-4 justify-content-center">
            {team.map((member) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="col-md-4 col-lg-3"
              >
                <div className="card border-0 shadow-lg h-100 rounded-4 overflow-hidden team-card">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="card-img-top"
                    style={{
                      height: "250px",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold">{member.name}</h5>
                    <p className="text-success mb-1 fw-semibold">
                      {member.role}
                    </p>
                    <p className="text-muted small">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CSS Enhancements */}
      <style>{`
        .feature-card:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease-in-out;
        }
        .team-card:hover img {
          transform: scale(1.08);
        }
      `}</style>
    </main>
  );
}
