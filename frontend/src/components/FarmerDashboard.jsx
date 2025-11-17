import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FarmerDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const [crops, setCrops] = useState([]);

  const [landModal, setLandModal] = useState(false);
  const [landDetails, setLandDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [landForm, setLandForm] = useState({
    landImage: "",
    landSize: "",
    yearsFarming: "",
    landAddress: "",
    cropTypes: "",
    landDesc: "",
  });

  // ==========================
  // ⭐ LOAD FARMER DETAILS
  // ==========================
  const [farmer, setFarmer] = useState(null);

  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem("loggedInUser"));
    if (logged && logged.role === "farmer") {
      setFarmer(logged);
    }
  }, []);

  // ==========================
  // ⭐ LOAD LAND DETAILS
  // ==========================
  useEffect(() => {
    const stored = localStorage.getItem("landDetails");
    if (stored) setLandDetails(JSON.parse(stored));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setLandForm({
      ...landForm,
      [name]: files ? URL.createObjectURL(files[0]) : value,
    });
  };

  const saveLand = () => {
    localStorage.setItem("landDetails", JSON.stringify(landForm));
    setLandDetails(landForm);
    setLandModal(false);
  };

  const deleteLand = () => {
    localStorage.removeItem("landDetails");
    setLandDetails(null);
    setLandModal(false);
  };

  const editLand = () => {
    setLandForm(landDetails);
    setEditMode(true);
    setLandModal(true);
  };

  // ==========================
  // ⭐ CROP FORM
  // ==========================
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    quantity: "",
    amount: "",
    description: "",
    image: null,
  });

  const handleCropChange = (e) => {
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

  // ==========================
  // ⛔ Before render
  // ==========================
  if (!farmer) {
    return (
      <div className="container mt-5">
        <h4>No farmer details found. Please login again.</h4>
      </div>
    );
  }

  // ==========================
  // ⭐ AVATAR / PROFILE IMAGE
  // ==========================
  const avatar = farmer.profileImage
    ? farmer.profileImage
    : `https://ui-avatars.com/api/?name=${farmer.username[0]}&background=0D8ABC&color=fff`;

  return (
    <div className="container mt-4">

      {/* Add Land Floating Button */}
      {!landDetails && (
        <button
          onClick={() => setLandModal(true)}
          className="btn btn-success"
          style={{
            position: "fixed",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 999,
          }}
        >
          + Add Land Details
        </button>
      )}

      {/* Land Modal */}
      {landModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? "Edit Land Details" : "Add Land Details"}
                </h5>
                <button className="btn-close" onClick={() => setLandModal(false)} />
              </div>

              <div className="modal-body">
                <input
                  type="file"
                  name="landImage"
                  className="form-control mb-2"
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Land Size (Acres)"
                  name="landSize"
                  value={landForm.landSize}
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Years of Farming"
                  name="yearsFarming"
                  value={landForm.yearsFarming}
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Land Address"
                  name="landAddress"
                  value={landForm.landAddress}
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-2"
                  placeholder="Types of Crops"
                  name="cropTypes"
                  value={landForm.cropTypes}
                  onChange={handleChange}
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  name="landDesc"
                  value={landForm.landDesc}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="modal-footer">
                <button className="btn btn-success" onClick={saveLand}>
                  {editMode ? "Update" : "Add"}
                </button>
                {editMode && (
                  <button className="btn btn-danger" onClick={deleteLand}>
                    Delete
                  </button>
                )}
                <button className="btn btn-secondary" onClick={() => setLandModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* ⭐ HERO SECTION — unchanged structure */}
      <div className="card p-3 shadow-sm">
        <div className="row align-items-center">
          <div className="col-md-2 text-center">
            <img
              src={avatar}
              alt="farmer"
              className="rounded-circle img-fluid"
              style={{ width: "100px", height:"100px" }}
            />
          </div>

          <div className="col-md-6">
            <h4>{farmer.username}</h4>
            <p>
              <strong>Email:</strong> {farmer.email} <br />
              <strong>Address:</strong> {farmer.address} <br />
              <strong>Acres:</strong> {farmer.acres || "N/A"} Acres <br />
              <strong>Experience:</strong> {farmer.years || "N/A"} years
            </p>
          </div>

          <div className="col-md-4 text-end">
            <button className="btn btn-success me-2" onClick={() => setShowForm(true)}>
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

            {/* ADD CROP FORM */}
{showForm && (
  <div className="card p-3 mt-4 shadow-sm">
    <h5>Add New Crop</h5>

    <input
      type="file"
      name="image"
      className="form-control mb-2"
      onChange={handleCropChange}
    />

    <input
      type="text"
      name="name"
      placeholder="Crop Name"
      className="form-control mb-2"
      value={formData.name}
      onChange={handleCropChange}
    />

    <input
      type="text"
      name="type"
      placeholder="Crop Type"
      className="form-control mb-2"
      value={formData.type}
      onChange={handleCropChange}
    />

    <input
      type="number"
      name="quantity"
      placeholder="Quantity (kg)"
      className="form-control mb-2"
      value={formData.quantity}
      onChange={handleCropChange}
    />

    <input
      type="number"
      name="amount"
      placeholder="Price (₹)"
      className="form-control mb-2"
      value={formData.amount}
      onChange={handleCropChange}
    />

    <textarea
      name="description"
      placeholder="Description"
      className="form-control mb-2"
      value={formData.description}
      onChange={handleCropChange}
    ></textarea>

    <div className="text-end">
      <button className="btn btn-success me-2" onClick={handleAdd}>
        Add Crop
      </button>
      <button className="btn btn-secondary" onClick={() => setShowForm(false)}>
        Cancel
      </button>
    </div>
  </div>
)}

      {/* LAND DETAILS SECTION */}
      {landDetails && (
        <div className="card shadow-sm p-3 mt-3">
          <div className="row align-items-center">
            <div className="col-md-4 text-center">
              <img
                src={landDetails.landImage}
                className="img-fluid rounded"
                style={{ height: "200px", width: "100%", objectFit: "cover" }}
              />
            </div>

            <div className="col-md-8">
              <h4>Land Details</h4>
              <p>
                <strong>Land Size:</strong> {landDetails.landSize} Acres <br />
                <strong>Years of Farming:</strong> {landDetails.yearsFarming} <br />
                <strong>Address:</strong> {landDetails.landAddress} <br />
                <strong>Crops Grown:</strong> {landDetails.cropTypes}
              </p>

              <p>{landDetails.landDesc}</p>

              <button className="btn btn-warning me-2" onClick={editLand}>
                Edit
              </button>

              <button className="btn btn-danger" onClick={deleteLand}>
                Delete
              </button>
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
            <p>{farmer.acres || "N/A"} Acres</p>
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
};

export default FarmerDashboard;
