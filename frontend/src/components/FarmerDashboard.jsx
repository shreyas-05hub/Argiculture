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

// Add this helper (from AddCropAnimation)
const fmt = (n) => {
  if (isNaN(n) || n === null || n === 0) return "0";
  return Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
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

  // UPDATED: Handle savedCrop from AddCropAnimation (normalized data)
  const handleAddCropFromAnimation = async (savedCrop) => {
    // Ensure required fields (backend/local provides them)
    const cropName = savedCrop.cropName?.trim() || "";
    const location = savedCrop.location?.trim() || "";
    const quantity = Number(savedCrop.quantity) || 0;
    const description = savedCrop.description || "";
    const effectivePrice = savedCrop.priceByAI || mlResult?.predictedPrice || 0;
    const effectiveGrade = savedCrop.grade || mlResult?.grade || "N/A";

    if (!cropName || !location || !quantity || quantity <= 0) {
      alert("Please fill all required fields: Crop Name, Quantity, and Location");
      return;
    }

    try {
      // Fallback ML if no result
      let mlResult = savedCrop.mlResult;
      if (!mlResult) {
        mlResult = await callMlModel({ cropName, quantity, location });
        savedCrop.mlResult = mlResult;
      }

      // Normalize for CropCard/table (add farmerName, finalAmount)
      const newCrop = {
        id: savedCrop.id || Date.now(),
        farmerName: farmer.username,
        cropName,
        location,
        quantity,
        priceByAI: mlResult.predictedPrice || savedCrop.priceByAI || 0,
        grade: mlResult.grade || savedCrop.grade || "N/A",
        finalAmount: (mlResult.predictedPrice || savedCrop.priceByAI || 0) * quantity, // Calculate
        created_at: savedCrop.created_at || new Date().toISOString(),
        status: savedCrop.status || "ModelSuggested", // Force full
       images: savedCrop.images || [],


        description,
        mlResult, // For legacy
      };

      const updatedCrops = [...crops, newCrop];
      saveCropsToStorage(updatedCrops);

      alert(
        `Crop "${cropName}" added! AI graded it "${effectiveGrade}" with price ₹${effectivePrice}/kg`
      ); 
      setShowAddCropAnimation(false);
    } catch (err) {
      console.error("Error adding crop:", err);
      alert("Failed to add crop. Try again.");
    }
  };

  // Handle farmer agreement with AI suggestions
  const farmerAgrees = (cropId) => {
    const updatedLocal = crops.map((c) =>
      c.id === cropId ? { ...c, status: "Pending" } : c
    );
    saveCropsToStorage(updatedLocal);
    const storedRequests = JSON.parse(localStorage.getItem("cropRequests")) || [];
    const crop = updatedLocal.find((c) => c.id === cropId);
    const exists = storedRequests.find((r) => r.cropId === cropId);
    if (!exists && crop) {
      const newRequest = {
        id: Date.now(),
        cropId: crop.id,
        farmerName: crop.farmerName,
        cropName: crop.cropName,
        quantity: crop.quantity,
        price: crop.mlResult?.predictedPrice || crop.priceByAI,
        location: crop.location,
        description: crop.description,
        images: crop.images,
        grade: crop.mlResult?.grade || crop.grade,
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

  // Helper for image (returns URL for array[0])
  // const getCropImage = (crop) => {
  //   if (!crop.images || crop.images.length === 0) return "../assets/default-crop.jpg";
  //   const firstImg = crop.images[0];
  //   return getPreview(firstImg) || "../assets/default-crop.jpg";
  // };

  // Helper for image (returns full URL for array[0])
const getCropImage = (crop) => {
  if (!crop.images || crop.images.length === 0) 
    return "../assets/default-crop.jpg";

  const firstImg = crop.images[0];

  // If it's a File object (new upload)
  if (firstImg instanceof File) {
    return URL.createObjectURL(firstImg);
  }

  // If backend returned a relative path
  if (typeof firstImg === "string") {
    const backendBase = "http://127.0.0.1:8000";

    if (firstImg.startsWith("crop_images/")) {
      return `${backendBase}/media/${firstImg}`;
    }

    return firstImg; // Already full URL
  }

  return "../assets/default-crop.jpg";
};


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
      {/* Add Crop Animation Modal - Pass props for backend/fallback */}
      <AddCropAnimation
        isOpen={showAddCropAnimation}
        onClose={() => setShowAddCropAnimation(false)}
        onAddCrop={handleAddCropFromAnimation}
        callMlModel={callMlModel}
        farmerId={farmer.id}
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

      {/* RECENTLY ADDED CROPS */}
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
              .map((crop) => (
                <div className="col-xl-3 col-lg-4 col-md-6" key={crop.id}>
                  <CropCard
                    id={crop.id}
                    cropName={crop.cropName}
                    quantity={crop.quantity}
                    grade={crop.mlResult?.grade || crop.grade || "N/A"}
                    pricePerKg={fmt(crop.mlResult?.predictedPrice || crop.priceByAI || 0)}
                    totalAmount={fmt(crop.finalAmount || 0)}
                    status={crop.status}
                    description={crop.description}
                    images={crop.images}

                    userType="farmer"
                    onFarmerAgree={farmerAgrees}
                    onFarmerDecline={farmerDeclines}
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
      </div>

      {/* PROCESSING REQUESTS */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold text-warning">Processing Requests</h4>
          <span className="badge bg-warning">
            {crops.filter(
              (c) =>
                c.status === "Pending" ||
                c.status === "Rejected" ||
                c.status === "Declined"
            ).length}
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
                    id={crop.id}
                    cropName={crop.cropName}
                    quantity={crop.quantity}
                    grade={crop.mlResult?.grade || crop.grade || "N/A"}
                    pricePerKg={fmt(crop.mlResult?.predictedPrice || crop.priceByAI || 0)}
                    totalAmount={fmt(crop.finalAmount || 0)}
                    status={crop.status}
                    description={crop.description}
                    images={crop.images}

                    userType="farmer"  // Change to "admin" for admin view
                    onFarmerAgree={farmerAgrees}
                    onFarmerDecline={farmerDeclines}
                    onAdminAccept={adminAccepts}
                    onAdminReject={adminRejects}
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

      {/* PREVIOUSLY SOLD CROPS */}
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
                    id={crop.id}
                    cropName={crop.cropName}
                    quantity={crop.quantity}
                    grade={crop.mlResult?.grade || crop.grade || "N/A"}
                    pricePerKg={fmt(crop.mlResult?.predictedPrice || crop.priceByAI || 0)}
                    totalAmount={fmt(crop.finalAmount || 0)}
                    status={crop.status}
                    description={crop.description}
                    images={crop.images}

                    userType="farmer"
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