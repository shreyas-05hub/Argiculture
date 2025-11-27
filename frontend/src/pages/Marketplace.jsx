import React, { useState, useEffect } from "react";
import "../styles/Marketplace.css";

const Marketplace = () => {
  const [products,setProducts]=useState([]);

  useEffect(()=>{
    const fetchProducts =async () => {
      try{
        const res = await fetch("http://localhost:5000/marketplace/crops");
        const data = await res.json();
        setProducts(data);
      }catch (err){
        console.error(err);
      }
    };
    fetchProducts();
  },[]);

  // const products = [
  //   {
  //     id: 1,
  //     name: "Premium Wheat",
  //     price: 120,
  //     originalPrice: 150,
  //     location: "Pune",
  //     category: "Grains",
  //     rating: 4.5,
  //     reviews: 128,
  //     stock: 50,
  //     organic: true,
  //     discount: 20,
  //     image: "🌾",
  //   },
  //   {
  //     id: 2,
  //     name: "Fresh Tomato",
  //     price: 50,
  //     originalPrice: 70,
  //     location: "Nashik",
  //     category: "Vegetables",
  //     rating: 4.8,
  //     reviews: 95,
  //     stock: 100,
  //     organic: true,
  //     discount: 16,
  //     image: "🍅",
  //   },
  //   {
  //     id: 3,
  //     name: "Basmati Rice",
  //     price: 150,
  //     originalPrice: 180,
  //     location: "Kolhapur",
  //     category: "Grains",
  //     rating: 4.7,
  //     reviews: 203,
  //     stock: 30,
  //     organic: false,
  //     discount: 17,
  //     image: "🍚",
  //   },
  //   {
  //     id: 4,
  //     name: "Red Onion",
  //     price: 70,
  //     originalPrice: 85,
  //     location: "Ahmednagar",
  //     category: "Vegetables",
  //     rating: 4.3,
  //     reviews: 76,
  //     stock: 80,
  //     organic: false,
  //     discount: 18,
  //     image: "🧅",
  //   },
  //   {
  //     id: 5,
  //     name: "Golden Corn",
  //     price: 90,
  //     originalPrice: 100,
  //     location: "Pune",
  //     category: "Grains",
  //     rating: 4.6,
  //     reviews: 142,
  //     stock: 60,
  //     organic: true,
  //     discount: 18,
  //     image: "🌽",
  //   },
  //   {
  //     id: 6,
  //     name: "Green Chili",
  //     price: 60,
  //     originalPrice: 75,
  //     location: "Nashik",
  //     category: "Vegetables",
  //     rating: 4.4,
  //     reviews: 88,
  //     stock: 90,
  //     organic: true,
  //     discount: 20,
  //     image: "🌶️",
  //   },
  //   {
  //     id: 7,
  //     name: "Brown Rice",
  //     price: 130,
  //     originalPrice: 160,
  //     location: "Mumbai",
  //     category: "Grains",
  //     rating: 4.6,
  //     reviews: 156,
  //     stock: 45,
  //     organic: true,
  //     discount: 19,
  //     image: "🍚",
  //   },
  //   {
  //     id: 8,
  //     name: "Potato",
  //     price: 50,
  //     originalPrice: 65,
  //     location: "Pune",
  //     category: "Vegetables",
  //     rating: 4.2,
  //     reviews: 210,
  //     stock: 120,
  //     organic: false,
  //     discount: 23,
  //     image: "🥔",
  //   },
  // ];

  const categories = ["All", "Grains", "Vegetables", "Organic", "Discounted"];

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);

  /** ADDED NEW STATE FOR MOBILE SIDEBAR */
  const [showSidebar, setShowSidebar] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(2000);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      title: "Mega Harvest Sale",
      subtitle: "Up to 30% OFF on Premium Grains",
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      bgImage: "../assets/megaharvestsale.jpg",
    },
    {
      title: "Fresh Farm Produce",
      subtitle: "Direct from Farmers to You",
      bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      bgImage: "../assets/freshfarmproduce.jpg"
    },
    {
      title: "Organic Collection",
      subtitle: "100% Chemical Free Products",
      bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      bgImage: "../assets/organicproducts.jpg"
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  const toggleWishlist = (product) => {
    if (wishlist.find((item) => item.id === product.id)) {
      setWishlist(wishlist.filter((item) => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  const getFilteredProducts = () => {
    let filtered = products.filter((p) => {
      const matchSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchPrice = p.price <= priceRange;

      let matchCategory = true;

      if (selectedCategory === "Organic") matchCategory = p.organic;
      else if (selectedCategory === "Discounted")
        matchCategory = p.discount > 0;
      else if (selectedCategory !== "All")
        matchCategory = p.category === selectedCategory;

      return matchSearch && matchPrice && matchCategory;
    });

    if (sortBy === "priceLow") filtered.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") filtered.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);
    if (sortBy === "discount") filtered.sort((a, b) => b.discount - a.discount);

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const savedAmount = cart.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );

  return (
    <div style={{ backgroundColor: "#f1f3f6" }}>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold fs-3">🌾 AgriBuy</a>

          <div className="d-flex align-items-center gap-3 order-lg-2">
            <button
              className="btn btn-light position-relative d-flex align-items-center gap-2"
              onClick={() => setShowCart(true)}
            >
              <i className="bi bi-cart3 fs-5"></i>
              {cartCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cartCount}
                </span>
              )}
            </button>

            <button className="btn btn-light position-relative d-flex align-items-center gap-2">
              <i className="bi bi-heart fs-5"></i>
              {wishlist.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>

          <div className="collapse navbar-collapse order-lg-1" id="navbarNav">
            <div
              className="input-group mx-lg-4 my-3 my-lg-0"
              style={{ maxWidth: "600px" }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-light">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Banner */}
      <div className="container my-4">
        <div className="banner-carousel custom-shadow">
          {banners.map((banner, index) => (
            <div
              key={index}
              className={`banner-slide ${
                index === currentSlide ? "active" : ""
              }`}
              style={{
                background: banner.bg,
                backgroundImage: `url(${banner.bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <h1 className="display-4 fw-bold mb-3">{banner.title}</h1>
              <p className="fs-4">{banner.subtitle}</p>
              <button className="btn btn-light btn-lg mt-3 fw-bold">
                Shop Now
              </button>
            </div>
          ))}

          <div className="banner-indicators">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`banner-dot ${
                  index === currentSlide ? "active" : ""
                }`}
                onClick={() => setCurrentSlide(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="container my-4">
        <div className="row g-3">
          <div className="col-6 col-md-3">
            <div className="trust-badge">
              <i className="bi bi-shield-check text-primary fs-1 mb-2"></i>
              <h6 className="fw-bold mb-1">100% Authentic</h6>
              <small className="text-muted">Verified Farmers</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="trust-badge">
              <i className="bi bi-truck text-success fs-1 mb-2"></i>
              <h6 className="fw-bold mb-1">Fast Delivery</h6>
              <small className="text-muted">24-48 Hours</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="trust-badge">
              <i className="bi bi-award text-warning fs-1 mb-2"></i>
              <h6 className="fw-bold mb-1">Best Quality</h6>
              <small className="text-muted">Premium Selection</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="trust-badge">
              <i className="bi bi-cash-coin text-danger fs-1 mb-2"></i>
              <h6 className="fw-bold mb-1">Fair Prices</h6>
              <small className="text-muted">Direct Trade</small>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BUTTON (MOBILE) */}
      <div className="container my-4 d-lg-none">
        <button
          className="btn btn-custom-primary w-100"
          onClick={() => setShowSidebar(true)}
        >
          <i className="bi bi-filter me-2"></i> Filters
        </button>
      </div>

      {/* OVERLAY when sidebar is open */}
      <div
        className={`sidebar-overlay ${showSidebar ? "show" : ""}`}
        onClick={() => setShowSidebar(false)}
      ></div>

      {/* MOBILE SIDEBAR */}
      {/* MOBILE SIDEBAR */}
      <div className={`category-sidebar-mobile ${showSidebar ? "show" : ""}`}>
        <div className="sidebar-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="fw-bold mb-0">Filters</h5>
          <button
            className="btn btn-sm btn-light"
            onClick={() => setShowSidebar(false)}
          >
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        <div className="p-3">
          {/* Categories */}
          <h6 className="fw-bold mb-2">Categories</h6>
          <div className="d-flex flex-column gap-2 mb-3">
            {categories.map((cat) => (
              <div
                key={cat}
                className={`category-chip-sidebar ${
                  selectedCategory === cat ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(cat);
                }}
              >
                {cat}
              </div>
            ))}
          </div>

          <hr />

          {/* Price Range */}
          <h6 className="fw-bold mb-2">Price Range</h6>
          <label className="text-muted small">₹0 - ₹{priceRange}</label>
          <input
            type="range"
            className="form-range"
            min="500"
            max="2000"
            step="100"
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          />

          <hr />

          {/* Sort By */}
          <h6 className="fw-bold mb-2">Sort By</h6>
          <select
            className="form-select mb-3"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="rating">Rating</option>
            <option value="discount">Discount</option>
          </select>

          <hr />

          {/* Reset Button */}
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => {
              setSelectedCategory("All");
              setPriceRange(2000);
              setSortBy("featured");
              setSearchQuery("");
              setShowSidebar(false);
            }}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Reset Filters
          </button>
        </div>
      </div>

      {/* DESKTOP SIDEBAR + PRODUCT GRID */}
      <div className="container mb-5">
        <div className="row">
          {/* DESKTOP SIDEBAR */}
          {/* DESKTOP SIDEBAR */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="category-sidebar-desktop custom-shadow">
              <h5 className="fw-bold p-3 border-bottom">Filters</h5>

              <div className="p-3">
                {/* Category Section */}
                <h6 className="fw-bold mb-2">Categories</h6>
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={`category-chip-sidebar ${
                      selectedCategory === cat ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </div>
                ))}

                <hr />

                {/* Price Range Section */}
                <h6 className="fw-bold mt-3 mb-2">Price Range</h6>
                <label className="text-muted small">₹0 - ₹{priceRange}</label>
                <input
                  type="range"
                  className="form-range"
                  min="500"
                  max="2000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                />

                <hr />

                {/* Sort By Section */}
                <h6 className="fw-bold mt-3 mb-2">Sort By</h6>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="discount">Discount</option>
                </select>

                <hr />

                {/* Reset Button */}
                <button
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceRange(2000);
                    setSortBy("featured");
                    setSearchQuery("");
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="col-lg-9">
            <h2 className="fw-bold mb-4">
              {selectedCategory === "All" ? "All Products" : selectedCategory}
            </h2>

            {/* PRODUCT CARDS */}
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-6 col-md-4 col-lg-4">
                  <div className="card h-100 border-0 custom-shadow custom-shadow-hover">
                    <div className="position-relative">
                      <div className="product-img-wrapper">
                        <span>{product.image}</span>
                        {product.organic && (
                          <div className="organic-badge">🌿 ORGANIC</div>
                        )}
                      </div>

                      <button
                        className={`wishlist-btn ${
                          wishlist.find((item) => item.id === product.id)
                            ? "wishlist-active"
                            : ""
                        }`}
                        onClick={() => toggleWishlist(product)}
                      >
                        <i
                          className={`bi ${
                            wishlist.find((item) => item.id === product.id)
                              ? "bi-heart-fill"
                              : "bi-heart"
                          } fs-5`}
                        ></i>
                      </button>

                      {product.discount > 0 && (
                        <div className="badge-corner">
                          <div className="discount-badge">
                            {product.discount}% OFF
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h6 className="card-title fw-bold mb-2 text-truncate">
                        {product.name}
                      </h6>

                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="rating-badge">
                          {product.rating} <i className="bi bi-star-fill"></i>
                        </span>
                        <small className="text-muted">
                          ({product.reviews})
                        </small>
                      </div>

                      <div className="mb-2">
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className="price-current">
                            ₹{product.price}
                          </span>
                          <span className="price-original">
                            ₹{product.originalPrice}
                          </span>
                          <span className="price-discount">
                            {product.discount}% off
                          </span>
                        </div>
                        <small className="text-muted">per kg</small>
                      </div>

                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="bi bi-geo-alt-fill text-danger"></i>{" "}
                          {product.location}
                        </small>
                        <br />
                        <small
                          className={`stock-badge ${
                            product.stock > 50
                              ? "text-success"
                              : product.stock > 20
                              ? "text-warning"
                              : "text-danger"
                          }`}
                        >
                          {product.stock > 50
                            ? "✓ In Stock"
                            : product.stock > 20
                            ? "⚠ Limited Stock"
                            : "⚡ Only Few Left"}
                        </small>
                      </div>

                      <button
                        className="btn btn-custom-primary w-100 mt-auto"
                        onClick={() => addToCart(product)}
                      >
                        <i className="bi bi-cart-plus me-2"></i>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CART SIDEBAR */}
      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}></div>
      )}

      <div className={`cart-sidebar ${showCart ? "show" : ""}`}>
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-light sticky-top">
          <h4 className="mb-0 fw-bold">My Cart ({cartCount})</h4>
          <button
            className="btn-close"
            onClick={() => setShowCart(false)}
          ></button>
        </div>

        <div className="p-4">
          {cart.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
              <h5 className="text-muted">Your cart is empty</h5>
              <p className="text-muted">Add items to get started!</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="card mb-3 border">
                  <div className="card-body">
                    <div className="d-flex gap-3">
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          background:
                            "linear-gradient(135deg, #667eea22 0%, #764ba233 100%)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "40px",
                        }}
                      >
                        {item.image}
                      </div>

                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-1">{item.name}</h6>

                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="fw-bold text-dark">
                            ₹{item.price}
                          </span>
                          <span className="text-muted text-decoration-line-through small">
                            ₹{item.originalPrice}
                          </span>
                          <span className="text-success small fw-bold">
                            {item.discount}% off
                          </span>
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <div className="quantity-control">
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <i className="bi bi-dash"></i>
                            </button>

                            <div className="quantity-value">
                              {item.quantity}
                            </div>

                            <button
                              className="quantity-btn"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>

                          <button
                            className="btn btn-sm btn-link text-danger"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <i className="bi bi-trash"></i> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="border-top pt-4 mt-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-bold">₹{cartTotal}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery</span>
                  <span className="text-success fw-bold">FREE</span>
                </div>

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">You Saved</span>
                  <span className="text-success fw-bold">₹{savedAmount}</span>
                </div>

                <div className="d-flex justify-content-between border-top pt-3 mb-4">
                  <h5 className="mb-0 fw-bold">Total Amount</h5>
                  <h5 className="mb-0 fw-bold text-success">₹{cartTotal}</h5>
                </div>

                <button className="btn btn-custom-primary w-100 py-3 fs-5">
                  <i className="bi bi-lightning-fill me-2"></i>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
