import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AddCropAnimation.css";

/**
 * AddCropAnimation.jsx
 * - Connects to Django backend POST /predict/
 * - Sends fields: cropName, location, quantity, price, description
 * - Sends files as "files" (multipart/form-data), supports up to 5 images
 * - Expects JSON response { crop, grade, price, submitted_* } (as in your backend)
 *
 * Usage:
 * <AddCropAnimation isOpen={isOpen} onClose={closeFn} onAddCrop={handleAddCrop} />
 */

const inputStyle = {
  backgroundColor: "#f8f9fa",
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.03)",
  borderRadius: "6px",
  border: "1px solid rgba(0,0,0,0.08)",
};

const fmt = (n) => {
  if (isNaN(n) || n === null) return "0.00";
  return Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getGradeColor = (grade) => {
  switch (grade) {
    case "A":
      return "#28a745";
    case "B":
      return "#ffc107";
    case "C":
      return "#dc3545";
    default:
      return "#6c757d";
  }
};

const getGradeDescription = (grade) => {
  switch (grade) {
    case "A":
      return "Premium Quality - Best Market Price";
    case "B":
      return "Good Quality - Competitive Price";
    case "C":
      return "Standard Quality - Fair Price";
    default:
      return "Not Graded";
  }
};

const AddCropAnimation = ({ isOpen, onClose, onAddCrop }) => {
  const [phase, setPhase] = useState("form"); // form | uploading | processing | results
  const [formData, setFormData] = useState({
    cropName: "",
    location: "",
    quantity: "",
    description: "",
    imageFiles: [],
    price: "", // optional expected price
  });

  const [imagePreviews, setImagePreviews] = useState([]); // object URLs
  const [backendResult, setBackendResult] = useState({});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef(null);

  // Cleanup object URLs on unmount or when previews change
  useEffect(() => {
    return () => {
      imagePreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imagePreviews]);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      cropName: "",
      location: "",
      quantity: "",
      description: "",
      imageFiles: [],
      price: "",
    });
    imagePreviews.forEach((u) => URL.revokeObjectURL(u));
    setImagePreviews([]);
    setBackendResult();
    setError(null);
    setPhase("form");
    setIsSubmitting(false);
  };

  const handleFileChange = (files) => {
    if (!files) return;
    const selected = Array.from(files).slice(0, 5); // limit to 5
    // revoke old previews
    imagePreviews.forEach((u) => URL.revokeObjectURL(u));
    const previews = selected.map((f) => URL.createObjectURL(f));
    setImagePreviews(previews);
    setFormData((prev) => ({ ...prev, imageFiles: selected }));
  };

  const validateBeforeUpload = () => {
    if (!formData.cropName.trim())
      return "Please enter Crop Name.";
    if (!formData.location.trim())
      return "Please enter Location.";
    if (!formData.quantity || Number(formData.quantity) <= 0)
      return "Please enter a valid Quantity (kg).";
    if (!formData.description.trim())
      return "Please add a short description.";
    if (!formData.imageFiles || formData.imageFiles.length === 0)
      return "Please upload 1 to 5 images.";
    if (formData.imageFiles.length > 5)
      return "You can upload up to 5 images.";
    return null;
  };

  const uploadToBackend = async () => {
    setError(null);
    const vErr = validateBeforeUpload();
    if (vErr) {
      setError(vErr);
      return;
    }

    setIsSubmitting(true);
    setPhase("uploading");

    try {
      const payload = new FormData();
      payload.append("cropName", formData.cropName);
      payload.append("location", formData.location);
      payload.append("quantity", formData.quantity);
      payload.append("price", formData.price || "");
      payload.append("description", formData.description);

      // Append files under key "files" — Django view expects request.FILES.getlist("files")
      formData.imageFiles.forEach((file) => {
        payload.append("files", file, file.name);
      });

      // POST to /predict/ (relative). Adjust if backend path differs.
      setPhase("processing"); // switch UI to processing animations while request is in flight

      const response = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        body: payload,
      });

      // parse response
      const data = await response.json();

      if (!response.ok) {
        // show error message from backend if provided
        const msg = data?.error || "Server error while predicting. Please try again.";
        throw new Error(msg);
      }

      // expected fields: crop, grade, price (ai_price)
      setBackendResult({
        crop: data.crop,
        grade: data.grade,
        pricePerKg: Number(data.price),
        submitted: {
          cropName: data.submitted_cropName,
          location: data.submitted_location,
          quantity: Number(data.submitted_quantity || formData.quantity),
          expectedPrice: data.submitted_price || formData.price,
          description: data.submitted_description || formData.description,
        },
      });

      setPhase("results");
      setIsSubmitting(false);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Unknown error");
      setPhase("form");
      setIsSubmitting(false);
    }
  };

  // const handleAddCrop = () => {
  //   // return a payload to parent if needed
  //   const finalPayload = {
  //     ...formData,
  //     mlResult: backendResult,
  //   };
  //   if (onAddCrop) onAddCrop(finalPayload);
  //   onClose();
  // };

const handleAddCrop = async () => {
  if (!backendResult) return;

  const { cropName, location, quantity, imageFiles } = formData;

  // Your backend fields MUST match exactly these:
  const priceByAI = backendResult.pricePerKg;   // correct field
  const grade = backendResult.grade;
  const finalAmount = Number(quantity) * Number(priceByAI); // compute finalAmount

  // Validate
  if (!priceByAI || !grade || !finalAmount) {
    console.error("Missing ML fields", backendResult);
    return;
  }

  const form = new FormData();
  form.append("cropName", cropName);
  form.append("location", location);
  form.append("quantity", quantity);
  form.append("priceByAI", priceByAI);
  form.append("grade", grade);
  form.append("finalAmount", finalAmount);

  if (imageFiles) {
    Array.from(imageFiles).slice(0, 5).forEach((file) => {
      form.append("images", file);
    });
  }

  const res = await fetch("http://localhost:8000/save-crop/", {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  console.log("Saved:", data);

  onClose();
};


  // derived calculations for UI (GST / transport)
  const renderPriceBreakdown = () => {
    if (!backendResult) return null;
    const quantity = Number(backendResult.submitted.quantity || formData.quantity) || 0;
    const pricePerKg = Number(backendResult.pricePerKg) || 0;
    const totalBaseAmount = quantity * pricePerKg;

    const gstPercentage = 5; // fixed 5%
    const gstAmount = (totalBaseAmount * gstPercentage) / 100;

    const transportCharge = totalBaseAmount * 0.02; // 2% total transport
    const companyTransport = transportCharge * 0.5;
    const farmerTransport = transportCharge * 0.5;

    // final payout as: final = base - gst - (transport / 2)  (farmer pays half transport)
    const finalAmount = totalBaseAmount - gstAmount - farmerTransport;

    return (
      <div className="card border-0 bg-light">
        <div className="card-body">
          <h6 className="card-title">Price Breakdown</h6>

          <div className="d-flex justify-content-between my-1">
            <span>
              Base Amount ({quantity} kg × ₹{fmt(pricePerKg)}):
            </span>
            <strong>₹{fmt(totalBaseAmount)}</strong>
          </div>

          <div className="d-flex justify-content-between my-1">
            <span>GST ({gstPercentage}%):</span>
            <strong>₹{fmt(gstAmount)}</strong>
          </div>

          <div className="d-flex justify-content-between my-1">
            <span>Transport Charge (2%):</span>
            <strong>₹{fmt(transportCharge)}</strong>
          </div>

          <div className="d-flex justify-content-between small text-muted">
            <span>• Company Pays 50%:</span>
            <span>₹{fmt(companyTransport)}</span>
          </div>

          <div className="d-flex justify-content-between small text-muted mb-2">
            <span>• Farmer Pays 50%:</span>
            <span>₹{fmt(farmerTransport)}</span>
          </div>

          <hr />

          <div className="d-flex justify-content-between fs-5">
            <span>Final Payout to Farmer:</span>
            <strong className="text-success">₹{fmt(finalAmount)}</strong>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="modal-dialog modal-lg modal-dialog-centered"
          >
            <div className="modal-content border-0 shadow-lg">
              {/* Header */}
              <div className="modal-header bg-success text-white border-0">
                <h5 className="modal-title">
                  {phase === "form" && "🌾 Add New Crop"}
                  {phase === "uploading" && "⤴️ Uploading Images"}
                  {phase === "processing" && "🔍 Processing on AI"}
                  {phase === "results" && "✅ AI Analysis Complete"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={onClose}
                  disabled={isSubmitting}
                ></button>
              </div>

              <div className="modal-body p-4">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                {/* FORM PHASE */}
                {phase === "form" && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="form-phase"
                  >
                    <div className="row g-3">
                      {/* IMAGE UPLOAD */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">Crop Images</label>
                        <div
                          className="image-upload-area border rounded p-4 text-center cursor-pointer"
                          onClick={() => document.getElementById("cropImage").click()}
                        >
                          <i className="bi bi-cloud-arrow-up fs-1 text-muted"></i>
                          <p className="mt-2 mb-1">Click to upload crop images</p>
                          <small className="text-muted">
                            Max 5 images • JPG, PNG formats • Clear photos preferred
                          </small>
                          <input
                            type="file"
                            id="cropImage"
                            ref={inputRef}
                            className="d-none"
                            multiple
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e.target.files)}
                          />

                          {imagePreviews.length > 0 && (
                            <div className="image-previews mt-3">
                              <div className="d-flex gap-2 flex-wrap justify-content-center">
                                {imagePreviews.map((preview, index) => (
                                  <div key={index} className="image-preview">
                                    <img
                                      src={preview}
                                      alt={`Preview ${index + 1}`}
                                      className="preview-img"
                                      style={{ borderRadius: 6, maxHeight: 80 }}
                                    />
                                  </div>
                                ))}
                              </div>
                              <small className="text-muted mt-2">
                                {imagePreviews.length} image(s) selected
                              </small>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Crop Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Organic Wheat"
                          style={inputStyle}
                          value={formData.cropName}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, cropName: e.target.value }))
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Location *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Maharashtra"
                          style={inputStyle}
                          value={formData.location}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, location: e.target.value }))
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Quantity (kg) *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g., 500"
                          style={inputStyle}
                          value={formData.quantity}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, quantity: e.target.value }))
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Expected Price (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Optional - AI will suggest"
                          style={inputStyle}
                          value={formData.price}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, price: e.target.value }))
                          }
                        />
                        <small className="text-muted">Leave empty for AI price suggestion</small>
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold">Description *</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Describe crop quality, growing methods, special features..."
                          style={{ ...inputStyle, paddingTop: 10 }}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, description: e.target.value }))
                          }
                        ></textarea>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* UPLOADING / PROCESSING PHASE */}
                {(phase === "uploading" || phase === "processing") && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="processing-phase text-center py-4"
                  >
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.06, 1],
                      }}
                      transition={{
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1.2, repeat: Infinity },
                      }}
                      className="mb-4"
                    >
                      <i className="bi bi-cpu fs-1 text-primary"></i>
                    </motion.div>

                    <h5 className="text-primary mb-3">
                      {phase === "uploading" && "Uploading images..."}
                      {phase === "processing" && "Analyzing images & market data..."}
                    </h5>

                    <div className="progress mb-3" style={{ height: "8px" }}>
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                        style={{ width: phase === "uploading" ? "40%" : "100%" }}
                      ></div>
                    </div>
                  </motion.div>
                )}

                {/* RESULTS PHASE */}
                {phase === "results" && backendResult && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="results-phase"
                  >
                    <div className="text-center mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 220 }}
                        className="success-icon"
                      >
                        <i className="bi bi-check-circle-fill text-success fs-1"></i>
                      </motion.div>
                      <h5 className="text-success">AI Price Calculation Ready!</h5>
                    </div>

                    <div className="row g-3">
                      <div className="col-md-6">
                        <div
                          className="card border-0 shadow-sm h-100"
                          style={{ borderLeft: `4px solid ${getGradeColor(backendResult.grade)}` }}
                        >
                          <div className="card-body text-center">
                            <h6 className="card-title text-muted">CROP GRADE</h6>
                            <div
                              className="fs-2 fw-bold mb-2"
                              style={{ color: getGradeColor(backendResult.grade) }}
                            >
                              {backendResult.grade}
                            </div>
                            <p className="small text-muted mb-0">
                              {getGradeDescription(backendResult.grade)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div
                          className="card border-0 shadow-sm h-100"
                          style={{ borderLeft: "4px solid #28a745" }}
                        >
                          <div className="card-body text-center">
                            <h6 className="card-title text-muted">SUGGESTED PRICE (₹/kg)</h6>
                            <div className="fs-2 fw-bold text-success mb-2">
                              ₹{fmt(backendResult.pricePerKg)}
                            </div>
                            <p className="small text-muted mb-0">Price per kilogram • from AI</p>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">{renderPriceBreakdown()}</div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="modal-footer border-0">
                {/* FORM BUTTONS */}
                {phase === "form" && (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-success px-4"
                      onClick={uploadToBackend}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-robot me-2"></i>
                      Analyze with AI
                    </button>
                  </>
                )}

                {/* RESULTS BUTTONS */}
                {phase === "results" && backendResult && (
                  <>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setPhase("form")}
                    >
                      Edit Details
                    </button>
                    <button
                      type="button"
                      className="btn btn-success px-4"
                      onClick={handleAddCrop}
                    >
                      <i className="bi bi-check-lg me-2"></i>
                      Add Crop with Suggestions
                    </button>
                  </>
                )}

                {/* UPLOADING / PROCESSING BUTTON */}
                {(phase === "uploading" || phase === "processing") && (
                  <button type="button" className="btn btn-secondary" disabled>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Processing...
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddCropAnimation;
