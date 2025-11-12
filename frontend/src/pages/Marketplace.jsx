import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaFilter, FaShoppingCart, FaRobot } from "react-icons/fa";

const Marketplace = () => {
  // Dummy data
  const products = [
    { id: 1, name: "Wheat", price: 1200, location: "Pune", image: "/assets/wheat.jpg" },
    { id: 2, name: "Tomato", price: 800, location: "Nashik", image: "/assets/tomato.jpg" },
    { id: 3, name: "Rice", price: 1500, location: "Kolhapur", image: "/assets/rice.jpg" },
    { id: 4, name: "Onion", price: 700, location: "Ahmednagar", image: "/assets/onion.jpg" },
  ];

  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState([]);

  const toggleFilters = () => setShowFilters(!showFilters);
  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  return (
    <div className="container py-4">
      {/* --- Header --- */}
      <div className="text-center mb-4">
        <h2 className="fw-bold text-success">AgriBuy Marketplace</h2>
        <p className="text-muted">
          Connecting farmers and buyers directly through fair trade.
        </p>
      </div>

      {/* --- Filter Toggle Button --- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-success" onClick={toggleFilters}>
          <FaFilter className="me-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Cart button */}
        <button
          className="btn btn-success position-relative"
          data-bs-toggle="offcanvas"
          data-bs-target="#cartSidebar"
        >
          <FaShoppingCart />
          {cart.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* --- Filter Panel --- */}
      {showFilters && (
        <div className="card p-3 mb-4 animate__animated animate__slideInDown">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Crop Type</label>
              <select className="form-select">
                <option>All</option>
                <option>Wheat</option>
                <option>Rice</option>
                <option>Tomato</option>
                <option>Onion</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Region</label>
              <select className="form-select">
                <option>All</option>
                <option>Pune</option>
                <option>Nashik</option>
                <option>Kolhapur</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Price Range</label>
              <input type="range" className="form-range" min="500" max="2000" />
            </div>
          </div>
        </div>
      )}

      {/* --- Product Grid --- */}
      <div className="row">
        {products.map((product) => (
          <div
            key={product.id}
            className="col-md-3 mb-4 d-flex align-items-stretch"
          >
            <div
              className="card shadow-sm border-0 w-100 h-100"
              style={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 1px 5px rgba(0, 0, 0, 0.1)";
              }}
            >
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                style={{ height: "160px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title text-success">{product.name}</h5>
                <p className="text-muted mb-1">📍 {product.location}</p>
                <p className="fw-bold">₹{product.price} / quintal</p>
                <button
                  className="btn btn-outline-success mt-auto"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Cart Sidebar (Offcanvas) --- */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="cartSidebar"
        aria-labelledby="cartSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 id="cartSidebarLabel">🛒 Your Cart</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body">
          {cart.length === 0 ? (
            <p className="text-muted">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="d-flex justify-content-between mb-3">
                <div>
                  <p className="mb-0 fw-bold">{item.name}</p>
                  <small className="text-muted">₹{item.price}</small>
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
          {cart.length > 0 && (
            <button className="btn btn-success w-100 mt-3">
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>

      {/* --- Floating AI Button --- */}
      <a
        href="/modelhub"
        className="btn btn-success rounded-circle position-fixed"
        style={{
          bottom: "30px",
          right: "30px",
          width: "55px",
          height: "55px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        <FaRobot className="fs-4" />
      </a>
    </div>
  );
};

export default Marketplace;
