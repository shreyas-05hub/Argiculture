// import React, { useEffect, useState } from "react";
// import AdminLayout from "../components/AdminLayout";

// const MarketManagement = () => {
//   const [requests, setRequests] = useState([]);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [rejectForId, setRejectForId] = useState(null);
//   const [rejectReason, setRejectReason] = useState("");

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
//     setRequests(stored);
//   }, []);

//   const refresh = () => {
//     const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
//     setRequests(stored);
//   };

//   const acceptRequest = (reqId) => {
//     const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
//     const updated = stored.map((r) =>
//       r.id === reqId ? { ...r, status: "Accepted", timestamp: Date.now() } : r
//     );
//     localStorage.setItem("cropRequests", JSON.stringify(updated));

//     const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
//     const reconciled = storedCrops.map((c) =>
//       c.id === stored.find((s) => s.id === reqId)?.cropId
//         ? { ...c, status: "Accepted", reason: "" }
//         : c
//     );
//     localStorage.setItem("crops", JSON.stringify(reconciled));

//     refresh();
//     alert("Request accepted.");
//   };

//   const openRejectModal = (reqId) => {
//     setRejectForId(reqId);
//     setRejectReason("");
//     setShowRejectModal(true);
//   };

//   const submitReject = () => {
//     if (!rejectReason.trim()) {
//       alert("Please enter a reason for rejection.");
//       return;
//     }

//     const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
//     const updated = stored.map((r) =>
//       r.id === rejectForId
//         ? {
//             ...r,
//             status: "Rejected",
//             reason: rejectReason,
//             timestamp: Date.now(),
//           }
//         : r
//     );
//     localStorage.setItem("cropRequests", JSON.stringify(updated));

//     const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
//     const targetReq = updated.find((u) => u.id === rejectForId);

//     const reconciled = storedCrops.map((c) =>
//       c.id === targetReq.cropId
//         ? { ...c, status: "Rejected", reason: rejectReason }
//         : c
//     );
//     localStorage.setItem("crops", JSON.stringify(reconciled));

//     setShowRejectModal(false);
//     setRejectForId(null);
//     setRejectReason("");
//     refresh();
//     alert("Request rejected.");
//   };

//   const removeRequest = (reqId) => {
//     const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
//     const updated = stored.filter((r) => r.id !== reqId);
//     localStorage.setItem("cropRequests", JSON.stringify(updated));
//     refresh();
//   };

//   return (
//     <AdminLayout>
//       <div
//         className="container-fluid p-4"
//         style={{
//           height: "100vh",
//           background: "linear-gradient(90deg, #b3e6b1 0%, #b3e6b1 88%)",
//         }}
//       >
//         <h2>Crop Requests</h2>

//         <div className="user-table mt-3">
//           <div className="table-responsive">
//             <table className="table table-striped table-bordered">
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Farmer</th>
//                   <th>Crop</th>
//                   <th>Qty (kg)</th>
//                   <th>Price (₹)</th>
//                   <th>Location</th>
//                   <th>Status</th>
//                   <th>Reason</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {requests.length > 0 ? (
//                   requests.map((r, idx) => (
//                     <tr key={r.id}>
//                       <td>{idx + 1}</td>
//                       <td>{r.farmerName}</td>
//                       <td>{r.cropName}</td>
//                       <td>{r.quantity}</td>
//                       <td>{r.price}</td>
//                       <td>{r.location || "—"}</td>
//                       <td>{r.status}</td>

//                       <td style={{ maxWidth: "200px", wordBreak: "break-word" }}>
//                         {r.status === "Rejected" ? r.reason : "—"}
//                       </td>

//                       <td>
//                         {r.status === "Pending" && (
//                           <>
//                             <button
//                               className="btn btn-success btn-sm me-2"
//                               onClick={() => acceptRequest(r.id)}
//                             >
//                               Accept
//                             </button>

//                             <button
//                               className="btn btn-danger btn-sm"
//                               onClick={() => openRejectModal(r.id)}
//                             >
//                               Reject
//                             </button>
//                           </>
//                         )}

//                         {r.status === "Accepted" && (
//                           <span className="badge bg-success">Accepted</span>
//                         )}

//                         {r.status === "Rejected" && (
//                           <>
//                             <span className="badge bg-danger me-2">
//                               Rejected
//                             </span>
//                             <button
//                               className="btn btn-outline-danger btn-sm"
//                               onClick={() => removeRequest(r.id)}
//                             >
//                               Remove
//                             </button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="9" className="text-center">
//                       No requests found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Reject Modal */}
//         {showRejectModal && (
//           <div
//             className="modal fade show d-block"
//             style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
//           >
//             <div className="modal-dialog">
//               <div className="modal-content p-3">
//                 <div className="modal-header">
//                   <h5 className="modal-title">Reject Request</h5>
//                   <button
//                     className="btn-close"
//                     onClick={() => {
//                       setShowRejectModal(false);
//                       setRejectForId(null);
//                       setRejectReason("");
//                     }}
//                   />
//                 </div>

//                 <div className="modal-body">
//                   <textarea
//                     className="form-control"
//                     placeholder="Enter reason for rejection"
//                     value={rejectReason}
//                     onChange={(e) => setRejectReason(e.target.value)}
//                   />
//                 </div>

//                 <div className="modal-footer">
//                   <button className="btn btn-danger" onClick={submitReject}>
//                     Submit Reject
//                   </button>
//                   <button
//                     className="btn btn-secondary"
//                     onClick={() => {
//                       setShowRejectModal(false);
//                       setRejectForId(null);
//                       setRejectReason("");
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// };

// export default MarketManagement;

import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

const MarketManagement = () => {
  const [requests, setRequests] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectForId, setRejectForId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: 'Grains',
    location: '',
    stock: '',
    organic: false,
    image: '🌾',
    image_url: '',
    rating: 4.5,
    reviews: 0
  });

  // Load data on component mount
  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem("cropRequests")) || [];
    setRequests(storedRequests);
    
    const storedProducts = JSON.parse(localStorage.getItem("marketplaceProducts")) || [];
    setProducts(storedProducts);
  }, []);

  const refreshData = () => {
    const storedRequests = JSON.parse(localStorage.getItem("cropRequests")) || [];
    setRequests(storedRequests);
    
    const storedProducts = JSON.parse(localStorage.getItem("marketplaceProducts")) || [];
    setProducts(storedProducts);
  };

  // Request Management Functions
  const acceptRequest = (reqId) => {
    const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
    const updated = stored.map((r) =>
      r.id === reqId ? { ...r, status: "Accepted", timestamp: Date.now() } : r
    );
    localStorage.setItem("cropRequests", JSON.stringify(updated));

    const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
    const reconciled = storedCrops.map((c) =>
      c.id === stored.find((s) => s.id === reqId)?.cropId
        ? { ...c, status: "Accepted", reason: "" }
        : c
    );
    localStorage.setItem("crops", JSON.stringify(reconciled));

    refreshData();
    alert("Request accepted.");
  };

  const openRejectModal = (reqId) => {
    setRejectForId(reqId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      alert("Please enter a reason for rejection.");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
    const updated = stored.map((r) =>
      r.id === rejectForId
        ? {
            ...r,
            status: "Rejected",
            reason: rejectReason,
            timestamp: Date.now(),
          }
        : r
    );
    localStorage.setItem("cropRequests", JSON.stringify(updated));

    const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
    const targetReq = updated.find((u) => u.id === rejectForId);

    const reconciled = storedCrops.map((c) =>
      c.id === targetReq.cropId
        ? { ...c, status: "Rejected", reason: rejectReason }
        : c
    );
    localStorage.setItem("crops", JSON.stringify(reconciled));

    setShowRejectModal(false);
    setRejectForId(null);
    setRejectReason("");
    refreshData();
    alert("Request rejected.");
  };

  const removeRequest = (reqId) => {
    const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
    const updated = stored.filter((r) => r.id !== reqId);
    localStorage.setItem("cropRequests", JSON.stringify(updated));
    refreshData();
  };

  // Product Management Functions
  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    const newProduct = {
      id: editingProduct ? editingProduct.id : Date.now(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      originalPrice: formData.original_price ? parseFloat(formData.original_price) : parseFloat(formData.price),
      category: formData.category,
      location: formData.location,
      rating: parseFloat(formData.rating),
      reviews: parseInt(formData.reviews),
      stock: parseInt(formData.stock),
      organic: formData.organic,
      discount: formData.original_price ? 
        Math.round(((parseFloat(formData.original_price) - parseFloat(formData.price)) / parseFloat(formData.original_price)) * 100) : 0,
      image: formData.image,
      image_url: formData.image_url,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const updatedProducts = editingProduct 
      ? products.map(p => p.id === editingProduct.id ? newProduct : p)
      : [...products, newProduct];

    localStorage.setItem("marketplaceProducts", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    setShowProductForm(false);
    setEditingProduct(null);
    resetForm();
    
    alert(editingProduct ? "Product updated successfully!" : "Product added to marketplace!");
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      original_price: product.originalPrice || '',
      category: product.category,
      location: product.location,
      stock: product.stock,
      organic: product.organic || false,
      image: product.image,
      image_url: product.image_url || '',
      rating: product.rating,
      reviews: product.reviews
    });
    setShowProductForm(true);
  };

  const toggleProductStatus = (productId) => {
    const updatedProducts = products.map(product =>
      product.id === productId 
        ? { ...product, isActive: !product.isActive }
        : product
    );
    localStorage.setItem("marketplaceProducts", JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const deleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter(product => product.id !== productId);
      localStorage.setItem("marketplaceProducts", JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      alert("Product deleted successfully!");
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      category: 'Grains',
      location: '',
      stock: '',
      organic: false,
      image: '🌾',
      image_url: '',
      rating: 4.5,
      reviews: 0
    });
  };

  const openAddProductForm = () => {
    setEditingProduct(null);
    resetForm();
    setShowProductForm(true);
  };

  // Filter requests and products
  const pendingRequests = requests.filter(req => req.status === "Pending");
  const activeProducts = products.filter(product => product.isActive);
  const inactiveProducts = products.filter(product => !product.isActive);

  return (
    <AdminLayout>
      <div
        className="container-fluid p-4"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(90deg, #b3e6b1 0%, #b3e6b1 88%)",
        }}
      >
        <div className="row">
          {/* Header */}
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h3 text-dark fw-bold">Market Management</h1>
              <button 
                className="btn btn-success"
                onClick={openAddProductForm}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Product
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="col-12 mb-4">
            <div className="row">
              <div className="col-md-3 mb-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h5 className="card-title">Pending Requests</h5>
                    <h2 className="mb-0">{pendingRequests.length}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">Active Products</h5>
                    <h2 className="mb-0">{activeProducts.length}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-warning text-white">
                  <div className="card-body">
                    <h5 className="card-title">Inactive Products</h5>
                    <h2 className="mb-0">{inactiveProducts.length}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card bg-info text-white">
                  <div className="card-body">
                    <h5 className="card-title">Total Products</h5>
                    <h2 className="mb-0">{products.length}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Requests Section */}
          <div className="col-12 mb-5">
            <div className="card">
              <div className="card-header bg-warning">
                <h5 className="card-title mb-0 text-white">
                  <i className="bi bi-clock-history me-2"></i>
                  Pending Crop Requests
                </h5>
              </div>
              <div className="card-body">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-check-circle display-4 text-muted"></i>
                    <p className="text-muted mt-2">No pending requests</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Crop Name</th>
                          <th>Farmer</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Location</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRequests.map((request) => (
                          <tr key={request.id}>
                            <td>
                              <strong>{request.cropName}</strong>
                            </td>
                            <td>{request.farmerName}</td>
                            <td>{request.quantity} kg</td>
                            <td>₹{request.price}/kg</td>
                            <td>{request.location}</td>
                            <td>
                              <div className="btn-group">
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => acceptRequest(request.id)}
                                >
                                  <i className="bi bi-check-lg"></i> Accept
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => openRejectModal(request.id)}
                                >
                                  <i className="bi bi-x-lg"></i> Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Products Section */}
          <div className="col-12 mb-5">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  Active Marketplace Products ({activeProducts.length})
                </h5>
              </div>
              <div className="card-body">
                {activeProducts.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="bi bi-grid display-4 text-muted"></i>
                    <p className="text-muted mt-2">No active products in marketplace</p>
                    <button className="btn btn-primary" onClick={openAddProductForm}>
                      Add Your First Product
                    </button>
                  </div>
                ) : (
                  <div className="row">
                    {activeProducts.map((product) => (
                      <div key={product.id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <span className="fs-1">{product.image}</span>
                              <div className="dropdown">
                                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" 
                                        type="button" data-bs-toggle="dropdown">
                                  <i className="bi bi-three-dots"></i>
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button className="dropdown-item" onClick={() => editProduct(product)}>
                                      <i className="bi bi-pencil me-2"></i>Edit
                                    </button>
                                  </li>
                                  <li>
                                    <button className="dropdown-item" onClick={() => toggleProductStatus(product.id)}>
                                      <i className="bi bi-pause-circle me-2"></i>Deactivate
                                    </button>
                                  </li>
                                  <li>
                                    <button className="dropdown-item text-danger" onClick={() => deleteProduct(product.id)}>
                                      <i className="bi bi-trash me-2"></i>Delete
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <h6 className="card-title">{product.name}</h6>
                            <div className="mb-2">
                              <span className="fw-bold text-success">₹{product.price}</span>
                              {product.originalPrice > product.price && (
                                <span className="text-muted text-decoration-line-through ms-2">
                                  ₹{product.originalPrice}
                                </span>
                              )}
                              {product.discount > 0 && (
                                <span className="badge bg-danger ms-2">{product.discount}% OFF</span>
                              )}
                            </div>
                            <div className="d-flex justify-content-between text-muted small mb-2">
                              <span>
                                <i className="bi bi-geo-alt"></i> {product.location}
                              </span>
                              <span>
                                <i className="bi bi-star-fill text-warning"></i> {product.rating}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span className={`badge ${
                                product.stock > 50 ? 'bg-success' : 
                                product.stock > 20 ? 'bg-warning' : 'bg-danger'
                              }`}>
                                Stock: {product.stock} kg
                              </span>
                              {product.organic && (
                                <span className="badge bg-success">🌿 Organic</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inactive Products Section */}
          {inactiveProducts.length > 0 && (
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-secondary text-white">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-pause-circle me-2"></i>
                    Inactive Products ({inactiveProducts.length})
                  </h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inactiveProducts.map((product) => (
                          <tr key={product.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="me-2 fs-5">{product.image}</span>
                                <div>
                                  <strong>{product.name}</strong>
                                  <br />
                                  <small className="text-muted">{product.location}</small>
                                </div>
                              </div>
                            </td>
                            <td>{product.category}</td>
                            <td>₹{product.price}</td>
                            <td>{product.stock} kg</td>
                            <td>
                              <span className="badge bg-secondary">Inactive</span>
                            </td>
                            <td>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() => toggleProductStatus(product.id)}
                              >
                                <i className="bi bi-play-circle"></i> Activate
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => deleteProduct(product.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Product Modal */}
        {showProductForm && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingProduct ? 'Edit Product' : 'Add New Product to Marketplace'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setShowProductForm(false)}
                  ></button>
                </div>
                <form onSubmit={handleProductSubmit}>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Product Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Product description..."
                          />
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className="mb-3">
                              <label className="form-label">Selling Price (₹) *</label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="mb-3">
                              <label className="form-label">Original Price (₹)</label>
                              <input
                                type="number"
                                step="0.01"
                                className="form-control"
                                value={formData.original_price}
                                onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                                placeholder="For discount calculation"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Stock Quantity (kg) *</label>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.stock}
                            onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Category *</label>
                          <select
                            className="form-select"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                          >
                            <option value="Grains">Grains</option>
                            <option value="Vegetables">Vegetables</option>
                            <option value="Fruits">Fruits</option>
                            <option value="Dairy">Dairy</option>
                            <option value="Spices">Spices</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Location *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            required
                          />
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <div className="mb-3">
                              <label className="form-label">Rating</label>
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="5"
                                className="form-control"
                                value={formData.rating}
                                onChange={(e) => setFormData({...formData, rating: e.target.value})}
                              />
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="mb-3">
                              <label className="form-label">Reviews Count</label>
                              <input
                                type="number"
                                className="form-control"
                                value={formData.reviews}
                                onChange={(e) => setFormData({...formData, reviews: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Image (Emoji or URL)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                            placeholder="🌾 or image URL"
                          />
                        </div>
                        <div className="form-check mb-3">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.organic}
                            onChange={(e) => setFormData({...formData, organic: e.target.checked})}
                          />
                          <label className="form-check-label">Mark as Organic Product</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowProductForm(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success">
                      {editingProduct ? 'Update Product' : 'Add to Marketplace'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reject Crop Request</h5>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={() => setShowRejectModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Reason for Rejection *</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Please provide a reason for rejecting this request..."
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowRejectModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger"
                    onClick={submitReject}
                  >
                    Reject Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bootstrap Icons */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />
    </AdminLayout>
  );
};

export default MarketManagement;