import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Home.css";
import { Link } from "react-router-dom";


const Home = () => {
  const [stats, setStats] = useState({
    farmers: 0,
    customers: 0,
    trades: 0,
  });

  useEffect(() => {
    // Animate statistics
    const animateCount = (target, key) => {
      let count = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
          count = target;
          clearInterval(timer);
        }
        setStats((prev) => ({ ...prev, [key]: Math.floor(count) }));
      }, 30);
    };

    animateCount(5000, "farmers");
    animateCount(3000, "customers");
    animateCount(12000, "trades");

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

    return () => observer.disconnect();
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section */}
      <header
        className="hero-section text-center text-white d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: "url('../assets/home-section.gif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <div className="hero-content">
          <div className="hero-badge mb-2">
            <span className="badge bg-success-soft px-3 py-1 ">
              🚀 AI-Powered Agricultural Marketplace
            </span>
          </div>
          <h1 className="hero-title mb-3">
            Transform Agriculture with
            <span className="gradient-text d-block">Intelligent Trading</span>
          </h1>
          <p className="hero-subtitle mb-4 fw-bold">
            Connect farmers directly with customers through AI-driven crop
            analysis, fair pricing, and smart matching. Join the future of
            agricultural commerce.
          </p>
          <div className="hero-cta">
            <Link
              to="/signup?role=farmer"
              className="btn btn-hero btn-primary btn-lg m-1"
            >
              <span>Join as Farmer</span>
              <i className="ms-1">🌾</i>
            </Link>
            <Link
              to="/signup?role=enduser"
              className="btn btn-hero btn-outline-light btn-lg m-1"
            >
              <span>Join as Customer</span>
              <i className="ms-1">🛒</i>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="hero-stats mt-4">
            <div className="row g-4 justify-content-center">
              <div className="col-auto">
                <div className="stat-item">
                  <div className="stat-number">
                    {stats.farmers.toLocaleString()}+
                  </div>
                  <div className="stat-label">Active Farmers</div>
                </div>
              </div>
              <div className="col-auto">
                <div className="stat-item">
                  <div className="stat-number">
                    {stats.customers.toLocaleString()}+
                  </div>
                  <div className="stat-label">Trusted Customers</div>
                </div>
              </div>
              <div className="col-auto">
                <div className="stat-item">
                  <div className="stat-number">
                    {stats.trades.toLocaleString()}+
                  </div>
                  <div className="stat-label">Successful Trades</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Problem & Solution Section */}
      <section className="py-5 problem-solution-section animate">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="section-badge mb-3">❌ The Problem</div>
              <h2 className="section-title mb-4">
                Agriculture Faces Critical Challenges
              </h2>
              <div className="problem-list">
                <div className="problem-item">
                  <div className="problem-icon">💸</div>
                  <div>
                    <h5>Unfair Pricing</h5>
                    <p>
                      Farmers lose up to 40% of crop value due to middlemen and
                      lack of market transparency
                    </p>
                  </div>
                </div>
                <div className="problem-item">
                  <div className="problem-icon">❓</div>
                  <div>
                    <h5>Quality Verification</h5>
                    <p>
                      Customers struggle to verify crop quality before purchase,
                      leading to distrust
                    </p>
                  </div>
                </div>
                <div className="problem-item">
                  <div className="problem-icon">⏰</div>
                  <div>
                    <h5>Delayed Payments</h5>
                    <p>
                      Long payment cycles and intermediaries delay farmer
                      compensation
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-badge mb-3">✅ Our Solution</div>
              <h2 className="section-title mb-4">
                AI-Powered Direct Trade Platform
              </h2>
              <div className="solution-card">
                <div className="solution-item">
                  <div className="solution-number">01</div>
                  <div>
                    <h5>AI Crop Analysis</h5>
                    <p>
                      Deep learning instantly grades crop quality from photos
                      with 95%+ accuracy
                    </p>
                  </div>
                </div>
                <div className="solution-item">
                  <div className="solution-number">02</div>
                  <div>
                    <h5>Fair Price Prediction</h5>
                    <p>
                      ML algorithms analyze market trends to suggest optimal,
                      fair prices
                    </p>
                  </div>
                </div>
                <div className="solution-item">
                  <div className="solution-number">03</div>
                  <div>
                    <h5>Smart Matching</h5>
                    <p>
                      AI connects farmers and customers based on location,
                      quality, and preferences
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="workflow" className="py-5 workflow-section animate">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-badge mb-3">⚡ Simple Process</div>
            <h2 className="section-title">How AgriBuy AI Works</h2>
            <p className="section-subtitle">
              Three simple steps to revolutionize your agricultural trading
            </p>
          </div>

          <div className="workflow-container">
            <div className="workflow-card">
              <div className="workflow-number">1</div>
              <div className="workflow-icon">📸</div>
              <h4>Upload Crop Details</h4>
              <p>
                Farmers upload crop information and photos through our
                easy-to-use interface
              </p>
              <ul className="workflow-features">
                <li>Multiple crop photos</li>
                <li>Quantity & location</li>
                <li>Harvest date</li>
              </ul>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-card">
              <div className="workflow-number">2</div>
              <div className="workflow-icon">🤖</div>
              <h4>AI Analysis & Pricing</h4>
              <p>
                Our AI engine analyzes crop quality and predicts fair market
                prices instantly
              </p>
              <ul className="workflow-features">
                <li>Quality grading</li>
                <li>Price prediction</li>
                <li>Market insights</li>
              </ul>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-card">
              <div className="workflow-number">3</div>
              <div className="workflow-icon">🤝</div>
              <h4>Smart Matching</h4>
              <p>
                Customers find verified crops and connect directly with farmers
                for seamless trade
              </p>
              <ul className="workflow-features">
                <li>Direct communication</li>
                <li>Secure transactions</li>
                <li>Fast delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 features-section animate">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-badge mb-3">✨ Powerful Features</div>
            <h2 className="section-title">Why Choose AgriBuy AI</h2>
            <p className="section-subtitle">
              Advanced AI technology meets agricultural expertise
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="feature-card">
                <div className="feature-icon bg-primary">🧠</div>
                <h4>CropVisionNet</h4>
                <p className="feature-description">
                  Advanced deep learning model identifies crop types and grades
                  quality with exceptional accuracy
                </p>
                <div className="feature-stats">
                  <span className="badge bg-primary-soft">95%+ Accuracy</span>
                  <span className="badge bg-primary-soft">50+ Crop Types</span>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="feature-card">
                <div className="feature-icon bg-success">📊</div>
                <h4>PricePredictNet</h4>
                <p className="feature-description">
                  ML-powered price prediction using real-time market data,
                  weather patterns, and demand forecasts
                </p>
                <div className="feature-stats">
                  <span className="badge bg-success-soft">Real-time Data</span>
                  <span className="badge bg-success-soft">Fair Pricing</span>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="feature-card">
                <div className="feature-icon bg-warning">🤝</div>
                <h4>MatchMakerNet</h4>
                <p className="feature-description">
                  Intelligent matching algorithm connects farmers and customers
                  based on multiple factors
                </p>
                <div className="feature-stats">
                  <span className="badge bg-warning-soft">Smart Matching</span>
                  <span className="badge bg-warning-soft">Location-based</span>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="feature-card">
                <div className="feature-icon bg-info">🔒</div>
                <h4>Secure Transactions</h4>
                <p className="feature-description">
                  End-to-end encrypted payments with escrow protection for both
                  parties
                </p>
                <div className="feature-stats">
                  <span className="badge bg-info-soft">
                    Bank-grade Security
                  </span>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="feature-card">
                <div className="feature-icon bg-danger">📱</div>
                <h4>Mobile-First Design</h4>
                <p className="feature-description">
                  Access anywhere, anytime with our responsive web platform
                  optimized for mobile
                </p>
                <div className="feature-stats">
                  <span className="badge bg-danger-soft">24/7 Access</span>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="feature-card">
                <div className="feature-icon bg-purple">📈</div>
                <h4>Analytics Dashboard</h4>
                <p className="feature-description">
                  Comprehensive insights and reports to track performance and
                  market trends
                </p>
                <div className="feature-stats">
                  <span className="badge bg-purple-soft">Data-driven</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5 testimonial-section animate">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-badge mb-3">💬 Success Stories</div>
            <h2 className="section-title">Trusted by Thousands</h2>
            <p className="section-subtitle">
              See how AgriBuy AI is transforming lives
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="testimonial-card">
                <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">
                  "AgriBuy AI helped me get 30% better prices for my rice
                  harvest. The AI quality check gave customers confidence to buy
                  directly from me."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">👨‍🌾</div>
                  <div>
                    <div className="author-name">Rajesh Kumar</div>
                    <div className="author-role">Farmer, Punjab</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="testimonial-card">
                <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">
                  "As a restaurant owner, I now source fresh vegetables directly
                  from farmers. The quality verification is spot-on and saves me
                  time."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">👩‍💼</div>
                  <div>
                    <div className="author-name">Priya Sharma</div>
                    <div className="author-role">Restaurant Owner, Delhi</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="testimonial-card">
                <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
                <p className="testimonial-text">
                  "The platform is so easy to use! I sold my entire wheat crop
                  in just 2 days at a fair price. No middlemen, no hassle."
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">👨‍🌾</div>
                  <div>
                    <div className="author-name">Mohan Patel</div>
                    <div className="author-role">Farmer, Gujarat</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 cta-section animate">
        <div className="container">
          <div className="cta-card">
            <div className="row align-items-center g-4">
              <div className="col-lg-8">
                <h2 className="cta-title mb-3">
                  Ready to Transform Your Agricultural Business?
                </h2>
                <p className="cta-text mb-4">
                  Join thousands of farmers and customers already benefiting
                  from AI-powered trading. Get started today and experience
                  fair, transparent, and efficient agricultural commerce.
                </p>
                <div className="cta-features">
                  <span>✓ Free to join</span>
                  <span>✓ No hidden fees</span>
                  <span>✓ 24/7 support</span>
                </div>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link
                  to="/signup?role=farmer"
                  className="btn btn-cta btn-light btn-lg d-block d-sm-inline-block mb-3"
                >
                  Join as Farmer →
                </Link>
                <Link
                  to="/signup?role=enduser"
                  className="btn btn-cta btn-outline-light btn-lg d-block d-sm-inline-block"
                >
                  Join as Customer →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
