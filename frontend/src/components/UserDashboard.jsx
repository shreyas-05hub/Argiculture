import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/UserDashboard.css"; // We'll add mobile tweaks here

const UserDashboard = () => {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");

  const user = {
    name: "Suresh Reddy",
    address: "Hyderabad, Telangana",
    contact: "9876543210",
    image: "https://cdn-icons-png.flaticon.com/512/2922/2922522.png",
  };

  const crops = [
    { id: 1, name: "Wheat", type: "Grains", price: 40, image: "https://cdn.pixabay.com/photo/2017/03/07/20/24/wheat-2128908_640.jpg" },
    { id: 2, name: "Tomato", type: "Vegetables", price: 25, image: "https://cdn.pixabay.com/photo/2018/07/09/10/16/tomatoes-3520004_640.jpg" },
    { id: 3, name: "Banana", type: "Fruits", price: 50, image: "https://cdn.pixabay.com/photo/2018/03/06/22/01/bananas-3208105_640.jpg" },
    { id: 4, name: "Ragi", type: "Millets", price: 45, image: "https://cdn.pixabay.com/photo/2022/01/04/17/56/millet-6916151_640.jpg" },
    { id: 5, name: "Rice", type: "Grains", price: 60, image: "https://cdn.pixabay.com/photo/2016/11/29/04/00/rice-1864649_640.jpg" },
  ];

  const filteredCrops = crops.filter(
    (crop) =>
      (category === "All" || crop.type === category) &&
      crop.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (crop) => {
    if (!cart.find((item) => item.id === crop.id)) {
      setCart([...cart, crop]);
    }
  };

  return (
    <div className="container mt-4 user-dashboard">
      {/* Header */}
      <div className="card p-3 shadow-sm user-header d-flex flex-md-row flex-column align-items-center justify-content-between">
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <img
            src={user.image}
            alt="User"
            className="rounded-circle me-3"
            style={{ width: "70px" }}
          />
          <div>
            <h5>{user.name}</h5>
            <p className="mb-0">{user.address}</p>
            <small>📞 {user.contact}</small>
          </div>
        </div>

        <div className="d-flex align-items-center flex-wrap gap-2 justify-content-center">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search crops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="btn btn-success cart-btn">
            🛒 Cart <span className="badge bg-light text-dark ms-2">{cart.length}</span>
          </div>
        </div>
      </div>

      {/* Category Buttons */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
        {["All", "Millets", "Grains", "Vegetables", "Fruits"].map((cat) => (
          <button
            key={cat}
            className={`btn ${category === cat ? "btn-success" : "btn-outline-success"}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Crop Cards */}
      <div className="row mt-3">
        {filteredCrops.map((crop) => (
          <div key={crop.id} className="col-lg-3 col-md-4 col-sm-6 col-12 mt-3">
            <div className="card h-100 shadow-sm crop-card">
              <img
                src={crop.image}
                className="card-img-top"
                alt={crop.name}
                style={{ height: "150px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h6>{crop.name}</h6>
                <p className="text-muted mb-1">{crop.type}</p>
                <p className="fw-bold mb-2">₹{crop.price}/kg</p>
                <button className="btn btn-success w-100" onClick={() => addToCart(crop)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Section */}
      {cart.length > 0 && (
        <div className="card mt-4 p-3 shadow-sm">
          <h5>Your Cart</h5>
          {cart.map((item) => (
            <div key={item.id} className="d-flex align-items-center border-bottom py-2 flex-wrap">
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "60px", borderRadius: "6px", marginRight: "15px" }}
              />
              <div className="flex-grow-1">
                <h6>{item.name}</h6>
                <small>₹{item.price}/kg</small>
              </div>
              <button
                className="btn btn-sm btn-danger mt-2 mt-sm-0"
                onClick={() => setCart(cart.filter((c) => c.id !== item.id))}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-end mt-2">
            <strong>
              Total: ₹{cart.reduce((total, item) => total + item.price, 0)}
            </strong>
            <br />
            <button className="btn btn-success mt-2 w-100 w-md-auto">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
