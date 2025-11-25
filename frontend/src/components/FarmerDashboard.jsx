import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FarmerDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const [crops, setCrops] = useState([]);

  const [farmer, setFarmer] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const latestCrop = crops.length > 0 ? crops[crops.length - 1] : null;
  const recentQuantity = crops.length > 0 ? Number(crops[crops.length - 1].quantity) : 0;


  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem("loggedInUser"));
    if (logged && logged.role === "farmer") {
      setFarmer(logged);
    }
  }, []);

  useEffect(() => {
    const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
    if (farmer) {
      const myCrops = storedCrops.filter(
        (c) => c.farmerName === (farmer.username || "")
      );
      setCrops(myCrops);
    } else {
      setCrops([]);
    }
  }, [farmer]);

  const [formData, setFormData] = useState({
    farmerName: "",
    cropName: "",
    quantity: "",
    price: "",
    location: "",
    description: "",
    image: null,
  });

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
    const storedAll = JSON.parse(localStorage.getItem("crops")) || [];
    const others = storedAll.filter(
      (c) => c.farmerName !== (farmer?.username || "")
    );
    const merged = [...others, ...allCrops];
    localStorage.setItem("crops", JSON.stringify(merged));
  };

  const handleAdd = () => {
    const newCrop = {
      id: Date.now(),
      farmerName: formData.farmerName,
      cropName: formData.cropName,
      quantity: formData.quantity,
      price: formData.price,
      location: formData.location,
      description: formData.description,
      image: formData.image,
      status: "Draft",
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

  const sendRequest = (cropId) => {
    const updatedLocal = crops.map((c) =>
      c.id === cropId ? { ...c, status: "Pending" } : c
    );
    setCrops(updatedLocal);
    saveCropsToStorage(updatedLocal);

    const storedRequests =
      JSON.parse(localStorage.getItem("cropRequests")) || [];
    const existing = storedRequests.find((r) => r.cropId === cropId);

    if (existing) {
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

    alert("Request sent. Status: Pending");
  };

  if (!farmer) {
    return (
      <div className="container mt-5">
        <h4>No farmer details found. Please login again.</h4>
      </div>
    );
  }

  return (
    <div
      className="container-fluid mt-4 mb-4 "
      style={{
        background: " #b3e6b1",
        background:
          "linear-gradient(90deg, rgba(179, 230, 177, 1) 0%, rgba(179, 230, 177, 1) 88%)",
      }}
    >
      {/* HERO SECTION */}
      <div
        className="container-fluid p-5 mt-4 mb-4"
        style={{
          background: "linear-gradient(to right, #80f57cff,  #428742ff)",

          borderRadius: "0 0 20px 20px",
        }}
      >
        <div className="row align-items-center">
          {/* LEFT SIDE - TEXT */}
          <div className="col-md-6">
            <h1 className="fw-bold">Smart Agro Grading & Marketplace</h1>

            <p className="mt-3 fs-5">
              Our platform helps farmers by grading their crops, providing
              accurate market price suggestions, and collecting the products
              directly from their doorstep. We ensure farmers receive fair value
              without middlemen, making the entire process simple, transparent,
              and profitable.
            </p>

            <ul
              className="fs-6 mt-3"
              style={{
                listStyleType: "none",
              }}
            >
              <li>✔ AI-based crop grading for accuracy</li>
              <li>✔ Real-time price recommendations</li>
              <li>✔ Doorstep pickup of farmer products</li>
              <li>✔ Transparent and farmer-friendly system</li>
            </ul>
          </div>

          {/* RIGHT SIDE - IMAGE */}
          <div className="col-md-6 text-center">
            <img
              src="../assets/hero-section-gif.gif"
              alt="Farmer"
              className="img-fluid"
            />
          </div>
        </div>
      </div>

      <div
        className="card p-4 shadow-lg border-0"
        style={{ borderRadius: "18px", background: "#f8fff5" }}
      >
        {/* HEADER + DESCRIPTION */}
        <div className="text-center mb-4">
          <h3 className="fw-bold text-success" style={{ fontSize: "28px" }}>
            🌾 Smart Crop Grading & Pricing Assistant
          </h3>
          <p className="text-muted fw-bold" style={{ fontSize: "20px" }}>
            Our AI system instantly analyzes your crop, assigns a grade, and
            suggests the best market price. Empowering farmers with technology
            for smarter, faster decisions.
          </p>
        </div>

        {/* YOUTUBE-STYLE VIDEO BUTTON */}
        <div className="d-flex justify-content-center mb-4">
          <button
            onClick={() => setShowVideo(true)}
            className="btn shadow-lg d-flex justify-content-center align-items-center"
            style={{
              borderRadius: "50%",
              background: "white",
              border: "2px solid #28a745",
            }}
          >
            <span
              style={{
                fontSize: "28px",
                color: "#28a745",
                marginLeft: "5px",
                marginTop: "0px",
                fontWeight: "bold",
              }}
            >
              <i class="bi bi-caret-right-fill"></i>
            </span>
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-success px-4 py-2 me-2 shadow-sm"
            style={{ borderRadius: "12px", fontSize: "16px" }}
            onClick={() => {
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
            className="btn btn-outline-success px-4 py-2 shadow-sm"
            style={{ borderRadius: "12px", fontSize: "16px" }}
            onClick={() => setShowPrevious(!showPrevious)}
          >
            {showPrevious ? "Hide" : "Previous Crops"}
          </button>
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

      {/* CROPS TABLE */}
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

      {/* STATS */}
      <div className="row mt-4">
        {/* RECENTLY SOLD CROP */}
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3 m-2">
            <h5>Recently Sold Crop</h5>
            <p>{latestCrop ? latestCrop.cropName : "No crops added yet"}</p>
          </div>
        </div>

        {/* TOTAL ACRES */}
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3 m-2">
            <h5>Total Acres</h5>
            <p>{farmer.acres || "N/A"} Acres</p>
          </div>
        </div>

        {/* TOTAL QUANTITY SOLD */}
        <div className="col-md-4">
          <div className="card text-center shadow-sm p-3 m-2">
            <h5>Total Quantity Sold</h5>
            <p>{recentQuantity} kg</p>
          </div>
        </div>
      </div>

      {/* PREVIOUS / NEWLY ADDED CROPS */}
      <div className="mt-4 mb-4 p-5">
        <h5>{showPrevious ? "Previous Crops" : "Newly Added Crops"}</h5>
        <div className="row">
          {showPrevious
            ? crops
                .filter((c) => c.status === "Accepted")
                .map((crop) => (
                  <div key={crop.id} className="col-md-3 mt-3">
                    <div className="card shadow-sm">
                      {crop.image && (
                        <img
                          src={crop.image}
                          className="card-img-top"
                          style={{ height: "150px", objectFit: "cover" }}
                        />
                      )}
                    </div>
                  </div>
                ))
            : crops
                .filter((c) => c.status !== "Accepted")
                .map((crop) => (
                  <div key={crop.id} className="col-md-3 mt-3">
                    <div className="card shadow-sm">
                      {crop.image && (
                        <img
                          src={crop.image}
                          className="card-img-top"
                          style={{ height: "150px", objectFit: "cover" }}
                        />
                      )}
                      <div className="card-body">
                        <h6>{crop.cropName}</h6>
                        <p>
                          <strong>Qty:</strong> {crop.quantity} kg
                        </p>
                        <p>
                          <strong>Price:</strong> ₹{crop.price}
                        </p>
                        <p className="small">{crop.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
        </div>
      </div>
      {/* VIDEO MODAL */}
      {showVideo && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.7)", zIndex: 9999 }}
        >
          <div
            className="position-relative bg-dark p-2 rounded"
            style={{ width: "70%", maxWidth: "800px" }}
          >
            {/* CLOSE BUTTON */}
            <button
              className="btn btn-danger position-absolute"
              style={{ top: "-15px", right: "-15px", borderRadius: "50%" }}
              onClick={() => setShowVideo(false)}
            >
              ✕
            </button>

            {/* VIDEO */}
            <video
              controls
              autoPlay
              className="w-100 rounded"
              style={{ maxHeight: "450px", objectFit: "cover" }}
            >
              <source src="YOUR_VIDEO_URL.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
