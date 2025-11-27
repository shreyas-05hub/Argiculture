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
    // Simulate API call delay
    await new Promise((res) => setTimeout(res, 1500));

    // Generate realistic AI results
    const grades = ["A", "B", "C"];
    const marketTrends = ["High Demand", "Medium Demand", "Low Demand"];

    // Base price based on crop type (simplified)
    const basePrices = {
      wheat: 2000,
      rice: 2500,
      corn: 1800,
      sugarcane: 1500,
      cotton: 3000,
      default: 2200,
    };

    const cropName = cropData.cropName.toLowerCase();
    let basePrice = basePrices.default;

    if (cropName.includes("wheat")) basePrice = basePrices.wheat;
    else if (cropName.includes("rice")) basePrice = basePrices.rice;
    else if (cropName.includes("corn")) basePrice = basePrices.corn;
    else if (cropName.includes("sugarcane")) basePrice = basePrices.sugarcane;
    else if (cropName.includes("cotton")) basePrice = basePrices.cotton;

    const grade = grades[Math.floor(Math.random() * 3)];
    const gradeMultiplier = grade === "A" ? 1.2 : grade === "B" ? 1.0 : 0.8;
    const predictedPrice = Math.round(
      basePrice * gradeMultiplier + Math.random() * 500
    );

    return {
      grade: grade,
      predictedPrice: predictedPrice,
      marketTrend: marketTrends[Math.floor(Math.random() * 3)],
      confidence: Math.round(80 + Math.random() * 20),
      qualityFactors: ["Good Color", "Proper Size", "Fresh Produce"].slice(
        0,
        2 + Math.floor(Math.random() * 2)
      ),
      improvements:
        Math.random() > 0.7 ? ["Better Packaging", "Harvest Timing"] : [],
    };
  };

  // Main function to handle crop addition from animation
  const handleAddCropFromAnimation = async (cropData) => {
    if (!cropData.cropName || !cropData.quantity || !cropData.location) {
      alert(
        "Please fill all required fields: Crop Name, Quantity, and Location"
      );
      return;
    }

    try {
      // Call AI model for analysis
      const mlResult = await callMlModel(cropData);

      // Create new crop object
      const newCrop = {
        id: Date.now(),
        farmerName: farmer.username,
        cropName: cropData.cropName,
        quantity: cropData.quantity,
        price: cropData.price || "",
        location: cropData.location,
        description: cropData.description || "",
        image: cropData.image || null,
        status: "ModelSuggested",
        mlResult: mlResult,
        reason: "",
        timestamp: Date.now(),
      };

      // Update state and localStorage
      const updatedCrops = [...crops, newCrop];
      saveCropsToStorage(updatedCrops);

      // Show success message
      alert(
        `Crop "${cropData.cropName}" added successfully! AI has graded it as ${mlResult.grade} with suggested price ₹${mlResult.predictedPrice}/kg`
      );

      // Close animation modal
      setShowAddCropAnimation(false);
    } catch (error) {
      console.error("Error adding crop:", error);
      alert("Failed to add crop. Please try again.");
    }
  };

  // Handle farmer agreement with AI suggestions
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

      alert(`Request for "${crop.cropName}" sent to admin for approval!`);
    } else {
      alert("Request already sent to admin!");
    }
  };

  // Handle farmer disagreement with AI suggestions
  const farmerDeclines = (cropId) => {
    const updatedLocal = crops.map((c) =>
      c.id === cropId ? { ...c, status: "Declined" } : c
    );
    saveCropsToStorage(updatedLocal);
    alert(
      "You've declined the AI suggestions. You can edit and resubmit the crop later."
    );
  };

  // Handle admin actions (for demo purposes)
  const adminAccepts = (cropId) => {
    const updatedLocal = crops.map((c) =>
      c.id === cropId ? { ...c, status: "Accepted" } : c
    );
    saveCropsToStorage(updatedLocal);
    alert("Admin accepted the crop request!");
  };

  const adminRejects = (cropId, reason = "Not specified") => {
    const updatedLocal = crops.map((c) =>
      c.id === cropId ? { ...c, status: "Rejected", reason: reason } : c
    );
    saveCropsToStorage(updatedLocal);
    alert("Admin rejected the crop request!");
  };

  if (!farmer) {
    return (
      <div className="container mt-5">
        <h4>No farmer details. Please login again.</h4>
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
              AI-powered crop grading, fair price suggestions, and seamless
              market access for farmers.
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
        className="card p-4 shadow-sm border-0 mb-4"
        style={{ borderRadius: "15px", background: "#f8fff5" }}
      >
        <div className="text-center">
          <h4 className="fw-bold text-success mb-3">🌾 Smart Crop Grading</h4>
          <p className="text-muted mb-4">
            Upload your crop details and get instant AI-powered quality grading
            and fair price suggestions.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              onClick={() => setShowDemo(true)}
              className="btn btn-outline-success px-4 py-2"
            >
              <i className="bi bi-play-circle me-2"></i>Watch Demo
            </button>

            {/* Main Add Crop Button with Animation */}
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(40, 167, 69, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-success px-4 py-2 position-relative pulse-button"
              onClick={() => setShowAddCropAnimation(true)}
              style={{
                background: "linear-gradient(135deg, #28a745, #20c997)",
                border: "none",
                fontWeight: "600",
                minWidth: "140px",
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
      {/* Watch Demo Modal */}
      <WatchDemoAnimation
        isOpen={showDemo}
        onClose={() => setShowDemo(false)}
      />
      {/* STATS CARDS */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center p-3 shadow-sm h-100 border-0">
            <div className="card-body">
              <i className="bi bi-basket text-success fs-4 mb-2"></i>
              <h6 className="card-title text-muted">Recently Sold</h6>
              <p className="card-text fs-5 fw-bold text-success">
                {latestSoldCrop ? latestSoldCrop.cropName : "None"}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center p-3 shadow-sm h-100 border-0">
            <div className="card-body">
              <i className="bi bi-scale text-primary fs-4 mb-2"></i>
              <h6 className="card-title text-muted">Total Sold</h6>
              <p className="card-text fs-5 fw-bold text-primary">
                {totalQuantity} kg
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center p-3 shadow-sm h-100 border-0">
            <div className="card-body">
              <i className="bi bi-clock text-warning fs-4 mb-2"></i>
              <h6 className="card-title text-muted">Pending</h6>
              <p className="card-text fs-5 fw-bold text-warning">
                {pendingRequests}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center p-3 shadow-sm h-100 border-0">
            <div className="card-body">
              <i className="bi bi-geo-alt text-info fs-4 mb-2"></i>
              <h6 className="card-title text-muted">Farm Size</h6>
              <p className="card-text fs-5 fw-bold text-info">
                {farmer.acres || "N/A"} Acres
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* NEW CROP SUGGESTIONS - Waiting for farmer approval */}
      {/* <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-success">Recently Added Crops</h4>
          <span className="badge bg-success">{crops.filter(c => c.status === "ModelSuggested").length}</span>
        </div>
        <p className="text-muted mb-3">
          Crops analyzed by AI - Review the grade and price suggestions
        </p>
        
        {crops.filter(c => c.status === "ModelSuggested").length > 0 ? (
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
                    price={crop.mlResult?.predictedPrice || "N/A"}
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
        ) : (
          <div className="text-center py-5 bg-light rounded">
            <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
            <p className="text-muted">No crop suggestions available.</p>
            <button 
              className="btn btn-outline-success"
              onClick={() => setShowAddCropAnimation(true)}
            >
              Add Your First Crop
            </button>
          </div>
        )}
      </div> */}
      {/* // In the Recently Added Crops section, update the image prop: */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-success">Recently Added Crops</h4>
          <span className="badge bg-success">
            {crops.filter((c) => c.status === "ModelSuggested").length}
          </span>
        </div>
        <p className="text-muted mb-3">
          Crops analyzed by AI - Review the grade and price suggestions
        </p>

        {crops.filter((c) => c.status === "ModelSuggested").length > 0 ? (
          <div className="row g-3">
            {crops
              .filter((c) => c.status === "ModelSuggested")
              .map((crop) => {
                // Enhanced image handling
                const getCropImage = () => {
                  if (!crop.image) return "../assets/default-crop.jpg";

                  // If it's an array of files
                  if (Array.isArray(crop.image) && crop.image.length > 0) {
                    const firstImage = crop.image[0];
                    if (firstImage instanceof File) {
                      return URL.createObjectURL(firstImage);
                    }
                    return "../assets/default-crop.jpg";
                  }

                  // If it's already a URL string
                  if (typeof crop.image === "string") {
                    return crop.image;
                  }

                  return "../assets/default-crop.jpg";
                };

                return (
                  <div className="col-xl-3 col-lg-4 col-md-6" key={crop.id}>
                    <CropCard
                      image={getCropImage()}
                      name={crop.cropName}
                      quantity={`${crop.quantity} kg`}
                      location={crop.location}
                      price={crop.mlResult?.predictedPrice || "N/A"}
                      grade={crop.mlResult?.grade || "N/A"}
                      marketTrend={crop.mlResult?.marketTrend}
                      status={crop.status}
                      onAgree={() => farmerAgrees(crop.id)}
                      onDecline={() => farmerDeclines(crop.id)}
                      reason={crop.reason}
                    />
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-5 bg-light rounded">
            <i className="bi bi-inbox fs-1 text-muted mb-3"></i>
            <p className="text-muted">No crop suggestions available.</p>
            <button
              className="btn btn-outline-success"
              onClick={() => setShowAddCropAnimation(true)}
            >
              Add Your First Crop
            </button>
          </div>
        )}
      </div>
      {/* PROCESSING REQUESTS - Waiting for admin action */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-warning">Processing Requests</h4>
          <span className="badge bg-warning">
            {
              crops.filter(
                (c) =>
                  c.status === "Pending" ||
                  c.status === "Rejected" ||
                  c.status === "Declined"
              ).length
            }
          </span>
        </div>
        <p className="text-muted mb-3">
          Crops waiting for admin approval or requiring action
        </p>

        {crops.filter(
          (c) =>
            c.status === "Pending" ||
            c.status === "Rejected" ||
            c.status === "Declined"
        ).length > 0 ? (
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
                    price={crop.mlResult?.predictedPrice || "N/A"}
                    grade={crop.mlResult?.grade || "N/A"}
                    marketTrend={crop.mlResult?.marketTrend}
                    status={crop.status}
                    onAgree={() => farmerAgrees(crop.id)}
                    onDecline={() => farmerDeclines(crop.id)}
                    onAdminAccept={() => adminAccepts(crop.id)}
                    onAdminReject={() =>
                      adminRejects(crop.id, "Quality standards not met")
                    }
                    reason={crop.reason}
                  />
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No crops in processing.</p>
          </div>
        )}
      </div>
      {/* SOLD CROPS HISTORY */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-success">Previously Sold Crops</h4>
          <span className="badge bg-success">
            {crops.filter((c) => c.status === "Accepted").length}
          </span>
        </div>
        <p className="text-muted mb-3">
          Successfully sold crops through the platform
        </p>

        {crops.filter((c) => c.status === "Accepted").length > 0 ? (
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
                    price={crop.mlResult?.predictedPrice || "N/A"}
                    grade={crop.mlResult?.grade || "N/A"}
                    status={crop.status}
                    reason={crop.reason}
                  />
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">
              No crops sold yet. Start by adding your crops above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
