import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import CropCard from "./CropCard";
import WatchDemoAnimation from "./WatchDemoAnimation";
import AddCropAnimation from "./AddCropAnimation";

const getPreview = (img) => {
  if (!img) return null;
  if (img instanceof File) return URL.createObjectURL(img);
  return img;
};

const FarmerDashboard = () => {
  const [showAddCropAnimation, setShowAddCropAnimation] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [crops, setCrops] = useState([]);
  const [farmer, setFarmer] = useState(null);

  const [showDemo, setShowDemo] = useState(false);

  // Calculate stats
  const latestSoldCrop = crops
    .filter((c) => c.status === "Accepted")
    .slice(-1)[0];
  const totalQuantity = crops
    .filter((c) => c.status === "Accepted")
    .reduce((sum, crop) => sum + (Number(crop.quantity) || 0), 0);
  const pendingRequests = crops.filter((c) => c.status === "Pending").length;

  useEffect(() => {
    const logged = JSON.parse(localStorage.getItem("loggedInUser"));
    if (logged && logged.role === "farmer") {
      setFarmer(logged);
    }

    const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
    if (logged) {
      const myCrops = storedCrops.filter(
        (c) => c.farmerName === (logged.username || "")
      );
      setCrops(myCrops);
    }
  }, []);

  const saveCropsToStorage = (allCrops) => {
    setCrops(allCrops);
    const storedAll = JSON.parse(localStorage.getItem("crops")) || [];
    const others = storedAll.filter(
      (c) => c.farmerName !== (farmer?.username || "")
    );
    const merged = [...others, ...allCrops];
    localStorage.setItem("crops", JSON.stringify(merged));
  };

  const callMlModel = async (cropData) => {
    // mock: emulate call latency
    await new Promise((res) => setTimeout(res, 500));

    return {
      grade: ["A", "B", "C"][Math.floor(Math.random() * 3)],
      predictedPrice: Math.round(2000 + Math.random() * 1000),
      marketTrend: ["High Demand", "Medium Demand", "Low Demand"][
        Math.floor(Math.random() * 3)
      ],
    };
  };

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

    if (name === "image") {
      let newFiles = Array.from(files);

      if (newFiles.length > 5) {
        alert("Max 5 images allowed.");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      for (let file of newFiles) {
        if (!allowedTypes.includes(file.type)) {
          alert("Only JPG, JPEG, PNG allowed.");
          return;
        }
      }

      setFormData((prev) => ({
        ...prev,
        image: newFiles,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdd = async () => {
    if (!formData.cropName || !formData.quantity) {
      alert("Enter crop name & quantity");
      return;
    }

    const ml = await callMlModel(formData);

    const newCrop = {
      id: Date.now(),
      farmerName: farmer.username,
      cropName: formData.cropName,
      quantity: formData.quantity,
      price: formData.price,
      location: formData.location,
      description: formData.description,
      image: formData.image,
      status: "ModelSuggested",
      mlResult: ml,
      reason: "",
      timestamp: Date.now(),
    };

    const updated = [...crops, newCrop];
    saveCropsToStorage(updated);

    alert(
      "Crop added successfully! Check the AI suggestions in your crop list."
    );

    // Open the Add Crop Animation modal briefly if you want
    setShowAddCropAnimation(true);

    // Reset form
    setFormData({
      farmerName: farmer.username,
      cropName: "",
      quantity: "",
      price: "",
      location: "",
      description: "",
      image: null,
    });

    setShowForm(false);
  };

  // top-level click handler for Add Crop button (was previously nested incorrectly)
  const handleAddCropClick = () => {
    setShowAddCropAnimation(true);
  };

  // callback expected by AddCropAnimation (keep simple — you can expand later)
  const handleAddCropFromAnimation = async (payload) => {
    // If AddCropAnimation gives form data via payload, you could use it.
    // For now we'll just close the animation modal and (optionally) open the add form.
    setShowAddCropAnimation(false);
    // If you want to open the form instead:
    // setShowForm(true);
    // If payload contains immediate crop details to add, you could call handleAdd() variant here.
  };

  const farmerAgrees = (cropId) => {
    const updatedLocal = crops.map((c) =>
      c.id === cropId ? { ...c, status: "Pending" } : c
    );
    saveCropsToStorage(updatedLocal);

    const storedRequests =
      JSON.parse(localStorage.getItem("cropRequests")) || [];
    const crop = updatedLocal.find((c) => c.id === cropId);

    // Check if request already exists
    const exists = storedRequests.find((r) => r.cropId === cropId);

    if (!exists && crop) {
      const newRequest = {
        id: Date.now(),
        cropId: crop.id,
        farmerName: crop.farmerName,
        cropName: crop.cropName,
        quantity: crop.quantity,
        price: crop.mlResult?.predictedPrice || crop.price,
        location: crop.location,
        description: crop.description,
        image: crop.image,
        grade: crop.mlResult?.grade,
        marketTrend: crop.mlResult?.marketTrend,
        status: "Pending",
        reason: "",
        timestamp: Date.now(),
      };

      storedRequests.push(newRequest);
      localStorage.setItem("cropRequests", JSON.stringify(storedRequests));
    }

    alert("Request sent to admin for approval");
  };

  const farmerDeclines = (cropId) => {
    const updatedLocal = crops.map((c) =>
      c.id === cropId ? { ...c, status: "Declined" } : c
    );
    saveCropsToStorage(updatedLocal);
  };

  if (!farmer) {
    return (
      <div className="container mt-5">
        <h4>No farmer details. Login again.</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 mb-4">
      {/* HERO SECTION */}
      <div
        className="container-fluid p-4 mb-4"
        style={{
          background: "linear-gradient(to right, #80f57cff,  #428742ff)",

          borderRadius: "15px",
        }}
      >
        <div className="row align-items-center">
          <div className="col-md-6">
            <h1 className="fw-bold text-white">
              Smart Agro Grading & Marketplace
            </h1>
            <p className="mt-3 text-white fs-5">
              Our platform helps farmers by grading their crops, providing
              accurate price suggestions, and pickup from doorstep.
            </p>
          </div>

          <div className="col-md-6 text-center">
            <img
              src="../assets/hero-section-gif.gif"
              alt="Farmer"
              className="img-fluid rounded"
              style={{ maxHeight: "200px" }}
            />
          </div>
        </div>
      </div>

      {/* SMART CROP GRADING CARD */}
      <div
        className="card p-3 shadow-sm border-0 mb-4"
        style={{ borderRadius: "15px", background: "#f8fff5" }}
      >
        <div className="text-center">
          <h4 className="fw-bold text-success mb-3">🌾 Smart Crop Grading</h4>
          <p className="text-muted mb-3">
            AI analyzes your crop and suggests best market price.
          </p>

          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => setShowDemo(true)}
              className="btn btn-outline-success"
            >
              <i className="bi bi-play-circle me-2"></i>Watch Demo
            </button>

            {/* Updated Add Crop Button with Animation */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-success px-4 position-relative"
              onClick={handleAddCropClick}
              style={{
                background: "linear-gradient(135deg, #28a745, #20c997)",
                border: "none",
                fontWeight: "600",
              }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="me-2"
              >
                🌱
              </motion.span>
              Add Crop
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="position-absolute top-0 start-100 translate-middle p-1 bg-warning border border-light rounded-circle"
              >
                <span className="visually-hidden">New</span>
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Add Crop Animation Modal */}
      <AddCropAnimation
        isOpen={showAddCropAnimation}
        onClose={() => setShowAddCropAnimation(false)}
        onAddCrop={handleAddCropFromAnimation}
      />

      {/* Watch Demo Modal (single instance) */}
      <WatchDemoAnimation
        isOpen={showDemo}
        onClose={() => setShowDemo(false)}
      />

      {/* Quick Add Crop button (opens form) */}
      <div className="mb-4">
        <button
          className="btn btn-success px-4"
          onClick={() => setShowForm(true)}
        >
          + Add Crop
        </button>
      </div>

      {/* ADD CROP FORM */}
      {showForm && (
        <div className="card p-4 shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Add New Crop</h5>
            <button
              className="btn-close"
              onClick={() => setShowForm(false)}
            ></button>
          </div>

          <div className="row">
            <div className="col-md-6">
              <input
                type="file"
                name="image"
                className="form-control mb-3"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={handleCropChange}
              />

              <input
                type="text"
                name="cropName"
                placeholder="Crop Name"
                className="form-control mb-3"
                value={formData.cropName}
                onChange={handleCropChange}
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                className="form-control mb-3"
                value={formData.location}
                onChange={handleCropChange}
              />
            </div>

            <div className="col-md-6">
              <input
                type="number"
                name="quantity"
                placeholder="Quantity (kg)"
                className="form-control mb-3"
                value={formData.quantity}
                onChange={handleCropChange}
              />

              <textarea
                name="description"
                placeholder="Description"
                className="form-control mb-3"
                rows="3"
                value={formData.description}
                onChange={handleCropChange}
              ></textarea>
            </div>
          </div>

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

      {/* STATS CARDS */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center p-3 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Recently Sold Crop</h6>
              <p className="card-text fs-5 fw-bold text-success">
                {latestSoldCrop ? latestSoldCrop.cropName : "None"}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center p-3 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Total Quantity Sold</h6>
              <p className="card-text fs-5 fw-bold text-primary">
                {totalQuantity} kg
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center p-3 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Pending Requests</h6>
              <p className="card-text fs-5 fw-bold text-warning">
                {pendingRequests}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center p-3 shadow-sm h-100">
            <div className="card-body">
              <h6 className="card-title">Total Acres</h6>
              <p className="card-text fs-5 fw-bold text-info">
                {farmer.acres || "N/A"} Acres
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW CROPS - Only ModelSuggested status */}
      <div className="mb-4">
        <h4 className="fw-bold mb-3">New Crop Suggestions</h4>
        <p className="text-muted mb-3">Crops waiting for your approval</p>
        <div className="row g-3">
          {crops
            .filter((c) => c.status === "ModelSuggested")
            .map((crop) => (
              <div className="col-xl-3 col-lg-4 col-md-6" key={crop.id}>
                <CropCard
                  image={
                    crop.image
                      ? Array.isArray(crop.image)
                        ? getPreview(crop.image[0])
                        : getPreview(crop.image)
                      : "../assets/default-crop.jpg"
                  }
                  name={crop.cropName}
                  quantity={`${crop.quantity} kg`}
                  location={crop.location}
                  price={crop.mlResult?.predictedPrice || crop.price || "N/A"}
                  grade={crop.mlResult?.grade || "N/A"}
                  marketTrend={crop.mlResult?.marketTrend}
                  status={crop.status}
                  onAgree={() => farmerAgrees(crop.id)}
                  onDecline={() => farmerDeclines(crop.id)}
                  reason={crop.reason}
                />
              </div>
            ))}
        </div>
        {crops.filter((c) => c.status === "ModelSuggested").length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted">No new crop suggestions available.</p>
          </div>
        )}
      </div>

      {/* PENDING & PROCESSING CROPS - All non-ModelSuggested, non-Accepted crops */}
      <div className="mb-4">
        <h4 className="fw-bold mb-3">Processing Requests</h4>
        <p className="text-muted mb-3">
          Crops waiting for admin approval or action
        </p>
        <div className="row g-3">
          {crops
            .filter(
              (c) =>
                c.status === "Pending" ||
                c.status === "Rejected" ||
                c.status === "Declined"
            )
            .map((crop) => (
              <div className="col-xl-3 col-lg-4 col-md-6" key={crop.id}>
                <CropCard
                  image={
                    crop.image
                      ? Array.isArray(crop.image)
                        ? getPreview(crop.image[0])
                        : getPreview(crop.image)
                      : "../assets/default-crop.jpg"
                  }
                  name={crop.cropName}
                  quantity={`${crop.quantity} kg`}
                  location={crop.location}
                  price={crop.mlResult?.predictedPrice || crop.price || "N/A"}
                  grade={crop.mlResult?.grade || "N/A"}
                  marketTrend={crop.mlResult?.marketTrend}
                  status={crop.status}
                  reason={crop.reason}
                />
              </div>
            ))}
        </div>
        {crops.filter(
          (c) =>
            c.status === "Pending" ||
            c.status === "Rejected" ||
            c.status === "Declined"
        ).length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted">No crops in processing.</p>
          </div>
        )}
      </div>

      {/* PREVIOUSLY SOLD CROPS - Only Accepted status */}
      <div className="mb-4">
        <h4 className="fw-bold mb-3">Sold Crops History</h4>
        <p className="text-muted mb-3">
          Crops successfully sold through the platform
        </p>
        <div className="row g-3">
          {crops
            .filter((c) => c.status === "Accepted")
            .map((crop) => (
              <div className="col-xl-3 col-lg-4 col-md-6" key={crop.id}>
                <CropCard
                  image={
                    crop.image
                      ? Array.isArray(crop.image)
                        ? getPreview(crop.image[0])
                        : getPreview(crop.image)
                      : "../assets/default-crop.jpg"
                  }
                  name={crop.cropName}
                  quantity={`${crop.quantity} kg`}
                  location={crop.location}
                  price={crop.mlResult?.predictedPrice || crop.price || "N/A"}
                  grade={crop.mlResult?.grade || "N/A"}
                  status={crop.status}
                  reason={crop.reason}
                />
              </div>
            ))}
        </div>
        {crops.filter((c) => c.status === "Accepted").length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted">No crops sold yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
