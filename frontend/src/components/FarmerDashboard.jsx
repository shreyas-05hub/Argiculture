import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FarmerDashboard=()=> {
  const [showForm, setShowForm] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const [crops, setCrops] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    quantity: "",
    amount: "",
    description: "",
    image: null,
  });

  const farmer = {
    name: "Ravi Kumar",
    acres: 25,
    contact: "9876543210",
    address: "Anantapur, Andhra Pradesh",
    image: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? URL.createObjectURL(files[0]) : value,
    });
  };

  const handleAdd = () => {
    setCrops([...crops, formData]);
    setFormData({
      type: "",
      name: "",
      quantity: "",
      amount: "",
      description: "",
      image: null,
    });
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      {/* Hero Section */}
      <div className="card p-3 shadow-sm">
        <div className="row align-items-center">
          <div className="col-md-2 text-center">
            <img
              src={farmer.image}
              alt="farmer"
              className="rounded-circle img-fluid"
              style={{ width: "100px" }}
            />
          </div>
          <div className="col-md-6">
            <h4>{farmer.name}</h4>
            <p>
              <strong>Contact:</strong> {farmer.contact} <br />
              <strong>Address:</strong> {farmer.address} <br />
              <strong>Acres:</strong> {farmer.acres} Acres
            </p>
          </div>
          <div className="col-md-4 text-end">
            <button
              className="btn btn-success me-2"
              onClick={() => setShowForm(true)}
            >
              + Add Crop
            </button>
            <button
              className="btn btn-outline-success"
              onClick={() => setShowPrevious(!showPrevious)}
            >
              {showPrevious ? "Hide" : "Previous Crops"}
            </button>
          </div>
        </div>
      </div>

      {/* Add Crop Modal */}
      {showForm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Add Crop to Marketplace</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowForm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-2">
                  <label>Crop Type</label>
                  <select
                    className="form-control"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">Select Type</option>
                    <option value="Millets">Millets</option>
                    <option value="Grains">Grains</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                  </select>
                </div>
                <input
                  className="form-control mb-2"
                  placeholder="Crop Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Quantity (kg)"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Expected Amount (₹)"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                />
                <input
                  type="file"
                  className="form-control mb-2"
                  name="image"
                  onChange={handleChange}
                />
                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={handleAdd}>
                  Add
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3 m-2">
            <h5>Recently Sold Crop</h5>
            <p>Wheat (2024)</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3 m-2">
            <h5>Total Acres</h5>
            <p>{farmer.acres} Acres</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3 m-2">
            <h5>Quantity Sold</h5>
            <p>4500 kg</p>
          </div>
        </div>
      </div>

      {/* Crops Section */}
      <div className="mt-4">
        <h5>{showPrevious ? "Previous Crops" : "Newly Added Crops"}</h5>
        <div className="row">
          {crops.map((crop, index) => (
            <div key={index} className="col-md-3 mt-3">
              <div className="card shadow-sm">
                {crop.image && (
                  <img
                    src={crop.image}
                    className="card-img-top"
                    style={{ height: "150px", objectFit: "cover" }}
                    alt={crop.name}
                  />
                )}
                <div className="card-body">
                  <h6>{crop.name}</h6>
                  <p className="m-2">
                    <strong>Type:</strong> {crop.type}
                  </p>
                  <p className="m-2">
                    <strong>Quantity:</strong> {crop.quantity} kg
                  </p>
                  <p className="m-2">
                    <strong>Price:</strong> ₹{crop.amount}
                  </p>
                  <p className="small">{crop.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default FarmerDashboard;
