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

  // ==========================
  // ⭐ LOAD CROPS (local)
  // Stored key: "crops" (array of crop objects)
  // Each crop: { id, farmerName, cropName, quantity, price, location, description, image, status, reason }
  // status: "Draft" | "Pending" | "Accepted" | "Rejected"
  // ==========================
  useEffect(() => {
    const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
    // Show only crops belonging to current farmer (by farmer.username or farmer.email). We rely on farmerName field.
    if (farmer) {
      const myCrops = storedCrops.filter(
        (c) => c.farmerName === (farmer.username || "")
      );
      setCrops(myCrops);
    } else {
      setCrops([]);
    }
  }, [farmer]);

  // Handle land form input
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
    farmerName: "",
    cropName: "",
    quantity: "",
    price: "",
    location: "",
    description: "",
    image: null,
  });

  // When farmer is loaded, prefill farmerName in form
  useEffect(() => {
    if (farmer) {
      setFormData((f) => ({ ...f, farmerName: farmer.username || "" }));
    }
  }, [farmer]);

  const handleCropChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? URL.createObjectURL(files[0]) : value,
    });
  };

  const saveCropsToStorage = (allCrops) => {
    // Merge with existing stored crops, replacing any with same id
    const storedAll = JSON.parse(localStorage.getItem("crops")) || [];
    // Remove crops belonging to this farmer from storedAll (we will re-add from allCrops)
    const others = storedAll.filter(
      (c) => c.farmerName !== (farmer?.username || "")
    );
    const merged = [...others, ...allCrops];
    localStorage.setItem("crops", JSON.stringify(merged));
  };

  const handleAdd = () => {
    const newCrop = {
      id: Date.now(),
      farmerName: formData.farmerName || farmer?.username || "",
      cropName: formData.cropName,
      quantity: formData.quantity,
      price: formData.price,
      location: formData.location,
      description: formData.description,
      image: formData.image,
      status: "Draft", // initial state
      reason: "",
    };

    const updated = [...crops, newCrop];
    setCrops(updated);
    saveCropsToStorage(updated);

    setFormData({
      farmerName: farmer?.username || "",
      cropName: "",
      quantity: "",
      price: "",
      location: "",
      description: "",
      image: null,
    });
    setShowForm(false);
  };

  // Send Request: create or update request in localStorage.cropRequests
  const sendRequest = (cropId) => {
    // Update crop status in local crops and in global storage
    const updatedLocal = crops.map((c) =>
      c.id === cropId ? { ...c, status: "Pending" } : c
    );
    setCrops(updatedLocal);
    saveCropsToStorage(updatedLocal);

    // Create request entry
    const storedRequests =
      JSON.parse(localStorage.getItem("cropRequests")) || [];
    // check if already exists
    const existing = storedRequests.find((r) => r.cropId === cropId);
    if (existing) {
      // update status
      const updatedRequests = storedRequests.map((r) =>
        r.cropId === cropId
          ? { ...r, status: "Pending", timestamp: Date.now() }
          : r
      );
      localStorage.setItem("cropRequests", JSON.stringify(updatedRequests));
    } else {
      const crop = updatedLocal.find((c) => c.id === cropId);
      const newRequest = {
        id: Date.now(),
        cropId: crop.id,
        farmerName: crop.farmerName,
        cropName: crop.cropName,
        quantity: crop.quantity,
        price: crop.price,
        location: crop.location,
        description: crop.description,
        image: crop.image,
        status: "Pending",
        reason: "",
        timestamp: Date.now(),
      };
      localStorage.setItem(
        "cropRequests",
        JSON.stringify([...storedRequests, newRequest])
      );
    }

    // Notify user by simple alert (you can replace with toast)
    alert("Request sent. Status: Pending");
  };

  // Helper to refresh local crops state from global storage (useful after admin action)
  const refreshMyCropsFromStorage = () => {
    const stored = JSON.parse(localStorage.getItem("crops")) || [];
    const myCrops = stored.filter(
      (c) => c.farmerName === (farmer?.username || "")
    );
    setCrops(myCrops);
  };

  // Poll for updates (so that when admin acts on requests, farmer sees changes)
  useEffect(() => {
    const id = setInterval(() => {
      // Reconcile requests with crops
      const storedRequests =
        JSON.parse(localStorage.getItem("cropRequests")) || [];
      const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
      let changed = false;

      const reconciled = storedCrops.map((c) => {
        const req = storedRequests.find((r) => r.cropId === c.id);
        if (req && c.status !== req.status) {
          changed = true;
          return { ...c, status: req.status, reason: req.reason || "" };
        }
        return c;
      });

      if (changed) {
        localStorage.setItem("crops", JSON.stringify(reconciled));
        if (farmer) {
          const my = reconciled.filter(
            (c) => c.farmerName === (farmer.username || "")
          );
          setCrops(my);
        }
      }
    }, 1000); // every 1s - lightweight

    return () => clearInterval(id);
  }, [farmer]);

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
                <button
                  className="btn-close"
                  onClick={() => setLandModal(false)}
                />
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
                <button
                  className="btn btn-secondary"
                  onClick={() => setLandModal(false)}
                >
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
              style={{ width: "100px", height: "100px" }}
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
            <button
              className="btn btn-success me-2"
              onClick={() => {
                // ensure farmerName is set when opening form
                setFormData((f) => ({
                  ...f,
                  farmerName: farmer.username || "",
                }));
                setShowForm(true);
              }}
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

      {/* ADD CROP FORM */}
      {showForm && (
        <div className="card p-3 mt-4 shadow-sm">
          <h5>Add New Crop</h5>

          <input
            type="text"
            name="farmerName"
            placeholder="Farmer Name"
            className="form-control mb-2"
            value={formData.farmerName}
            onChange={handleCropChange}
          />

          <input
            type="file"
            name="image"
            className="form-control mb-2"
            onChange={handleCropChange}
          />

          <input
            type="text"
            name="cropName"
            placeholder="Crop Name"
            className="form-control mb-2"
            value={formData.cropName}
            onChange={handleCropChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            className="form-control mb-2"
            value={formData.location}
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
            name="price"
            placeholder="Price (₹)"
            className="form-control mb-2"
            value={formData.price}
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
            <button
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CROPS TABLE SECTION (shows newly added crops with Send Request button) */}
      <div className="user-table mt-4">
        <h4>Your Crops</h4>

        <div className="table-responsive mt-3">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Crop</th>
                <th>Quantity (kg)</th>
                <th>Price (₹)</th>
                <th>Location</th>
                <th>Status</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {crops.length > 0 ? (
                crops.map((c, index) => (
                  <tr key={c.id}>
                    <td>{index + 1}</td>
                    <td>{c.cropName}</td>
                    <td>{c.quantity}</td>
                    <td>{c.price}</td>
                    <td>{c.location || "—"}</td>
                    <td>{c.status}</td>
                    <td style={{ maxWidth: "200px", wordBreak: "break-word" }}>
                      {c.status === "Rejected" ? c.reason || "—" : "—"}
                    </td>
                    <td>
                      {c.status === "Draft" && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => sendRequest(c.id)}
                        >
                          Send Request
                        </button>
                      )}

                      {c.status === "Pending" && (
                        <span className="badge bg-warning text-dark">
                          Pending
                        </span>
                      )}

                      {c.status === "Accepted" && (
                        <span className="badge bg-success">Accepted</span>
                      )}

                      {c.status === "Rejected" && (
                        <span className="badge bg-danger">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No crops added.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                <strong>Years of Farming:</strong> {landDetails.yearsFarming}{" "}
                <br />
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

      {/* Previous / Accepted Crops Cards */}
      <div className="mt-4">
        <h5>{showPrevious ? "Previous Crops" : "Newly Added Crops"}</h5>
        <div className="row">
          {showPrevious
            ? // show only accepted crops
              crops
                .filter((c) => c.status === "Accepted")
                .map((crop, index) => (
                  <div key={crop.id} className="col-md-3 mt-3">
                    <div className="card shadow-sm">
                      {crop.image && (
                        <img
                          src={crop.image}
                          className="card-img-top"
                          style={{ height: "150px", objectFit: "cover" }}
                          alt={crop.cropName}
                        />
                      )}
                      <div className="card-body">
                        <h6>{crop.cropName}</h6>
                        <p className="m-2">
                          <strong>Qty:</strong> {crop.quantity} kg
                        </p>
                        <p className="m-2">
                          <strong>Price:</strong> ₹{crop.price}
                        </p>
                        <p className="small">{crop.description}</p>
                      </div>
                    </div>
                  </div>
                ))
            : // show all (non-accepted) as newly added
              crops
                .filter((c) => c.status !== "Accepted")
                .map((crop, index) => (
                  <div key={crop.id} className="col-md-3 mt-3">
                    <div className="card shadow-sm">
                      {crop.image && (
                        <img
                          src={crop.image}
                          className="card-img-top"
                          style={{ height: "150px", objectFit: "cover" }}
                          alt={crop.cropName}
                        />
                      )}
                      <div className="card-body">
                        <h6>{crop.cropName}</h6>
                        <p className="m-2">
                          <strong>Qty:</strong> {crop.quantity} kg
                        </p>
                        <p className="m-2">
                          <strong>Price:</strong> ₹{crop.price}
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
