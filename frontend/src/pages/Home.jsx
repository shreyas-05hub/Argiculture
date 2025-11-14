import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Home.css";

const Home = () => {
  useEffect(() => {
    // Trigger animations when scrolling into view
    const sections = document.querySelectorAll(".animate");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );
    sections.forEach((sec) => observer.observe(sec));
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <header className="hero-section text-center text-white d-flex align-items-center justify-content-center animate">
        <div className="hero-content">
          <h1 className="fw-bold display-3">AgriBuy AI</h1>
          <p className="lead">
            The Intelligent Marketplace for <strong>Farmers</strong> &{" "}
            <strong>Customers</strong> powered by Artificial Intelligence.
          </p>
          <div className="mt-4">
            <button className="btn btn-light btn-lg m-2">Join as Farmer 👨‍🌾</button>
            <button className="btn btn-outline-light btn-lg m-2">
              Join as Customer 🧑‍💼
            </button>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-5 bg-light animate">
        <div className="container text-center">
          <h2 className="fw-bold mb-4 text-success">About AgriBuy AI</h2>
          <p className="text-muted fs-5">
            AgriBuy AI is an AI-powered digital marketplace that connects farmers
            and Customers directly by analyzing crop quality and predicting market
            prices using advanced AI models.
          </p>
          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <div className="card p-4 shadow-sm border-success">
                <h5>🚜 Problem We Solve</h5>
                <p>
                  Farmers often face unfair pricing, delayed payments, and lack of
                  visibility, while traders find it hard to verify crop quality or
                  find trusted farmers.
                </p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card p-4 shadow-sm border-success">
                <h5>🎯 Our Mission</h5>
                <p>
                  To use Deep Learning and Machine Learning to ensure fair trade,
                  transparency, and intelligent matchmaking between farmers and
                  Customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-5 animate">
        <div className="container text-center">
          <h2 className="fw-bold mb-5 text-success">🔗 How AgriBuy AI Works</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="workflow-step p-4 border border-success rounded shadow-sm">
                <h5>👨‍🌾 Step 1: Farmer Uploads</h5>
                <p>Crop details & photo are uploaded to the system.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="workflow-step p-4 border border-success rounded shadow-sm">
                <h5>🤖 Step 2: AI Analysis</h5>
                <p>
                  Deep Learning grades the crop; ML predicts fair price using market
                  data.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="workflow-step p-4 border border-success rounded shadow-sm">
                <h5>🧑‍💼 Step 3: Customer Matching</h5>
                <p>
                  AI engine matches farmers and traders based on price, location,
                  and crop quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light animate">
        <div className="container text-center">
          <h2 className="fw-bold mb-5 text-success">✨ Core Features</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card p-4 shadow-sm border-0 border-top border-4 border-success">
                <h5>🧠 Deep Learning (CropVisionNet)</h5>
                <p>
                  Identifies crop type and quality grade from farmer-uploaded images.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 shadow-sm border-0 border-top border-4 border-success">
                <h5>📊 Machine Learning (PricePredictNet)</h5>
                <p>
                  Predicts fair market prices using crop details and market trends.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 shadow-sm border-0 border-top border-4 border-success">
                <h5>🤝 AI MatchMakerNet</h5>
                <p>
                  Connects farmers and traders intelligently for efficient,
                  transparent trading.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Users Section */}
      <section id="users" className="py-5 animate">
        <div className="container text-center">
          <h2 className="fw-bold mb-5 text-success">👥 System Users</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card p-4 shadow-sm border-success">
                <h5>👨‍🌾 Farmer</h5>
                <p>
                  Upload crop info, receive AI grading, and view fair price
                  predictions instantly.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 shadow-sm border-success">
                <h5>🧑‍💼 Customer</h5>
                <p>
                  Browse and filter crops, check AI-verified details, and directly
                  connect with farmers.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-4 shadow-sm border-success">
                <h5>🛠️ Admin</h5>
                <p>
                  Monitor trades, manage users, and ensure fair marketplace
                  operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 text-center bg-success text-white animate">
        <div className="container">
          <h2 className="fw-bold mb-3">Start Trading Smarter with AgriBuy AI</h2>
          <p className="mb-4">
            Join thousands of farmers and customers using AI to grow profits and
            build trust in agriculture.
          </p>
          <button className="btn btn-light btn-lg m-2">Join as Farmer</button>
          <button className="btn btn-outline-light btn-lg m-2">
            Join as Customer
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
