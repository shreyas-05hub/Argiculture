import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AddCropAnimation.css";

const AddCropAnimation = ({ isOpen, onClose, onAddCrop }) => {
  const [phase, setPhase] = useState("form");
  const [formData, setFormData] = useState({
    cropName: "",
    location: "",
    quantity: "",
    description: "",
    image: [],
  });
  
  const [aiResult, setAiResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const handleFileChange = (files) => {
    if (!files || files.length === 0) return;
    const selectedFiles = Array.from(files).slice(0, 5);
    const previews = selectedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
    setFormData(prev => ({
      ...prev,
      image: selectedFiles
    }));
  };

  const simulateAIProcessing = async () => {
    setIsSubmitting(true);
    setPhase("analyzing");

    await delay(1500);
    setPhase("grading");
    await delay(1200);

    setPhase("marketAnalysis");
    await delay(1000);

    const result = {
      grade: ["A", "B", "C"][Math.floor(Math.random() * 3)],
      predictedPrice: Math.round(1800 + Math.random() * 1200),
      marketTrend: ["High Demand", "Medium Demand", "Low Demand"][Math.floor(Math.random() * 3)],
      confidence: Math.round(85 + Math.random() * 15),
      qualityFactors: ["Good Color", "Proper Size", "Fresh Produce"],
      improvements: ["Better Packaging", "Harvest Timing"]
    };

    setAiResult(result);
    setPhase("results");
    setIsSubmitting(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddCrop = () => {
    const finalPayload = {
      ...formData,
      mlResult: aiResult
    };

    // ✅ FULL DETAILS including description printed in console
    console.log("FINAL CROP DATA:", finalPayload);

    if (onAddCrop) {
      onAddCrop(finalPayload);
    }
    onClose();
  };

  const resetForm = () => {
    setFormData({
      cropName: "",
      location: "",
      quantity: "",
      description: "",
      image: []
    });
    setImagePreviews([]);
    setAiResult(null);
    setPhase("form");
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return '#28a745';
      case 'B': return '#ffc107';
      case 'C': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getGradeDescription = (grade) => {
    switch(grade) {
      case 'A': return 'Premium Quality - Best Market Price';
      case 'B': return 'Good Quality - Competitive Price';
      case 'C': return 'Standard Quality - Fair Price';
      default: return 'Not Graded';
    }
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
                  {phase === "analyzing" && "🔍 Analyzing Your Crop"}
                  {phase === "grading" && "📊 Quality Grading"}
                  {phase === "marketAnalysis" && "📈 Market Analysis"}
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
                          onClick={() => document.getElementById('cropImage').click()}
                        >
                          <i className="bi bi-cloud-arrow-up fs-1 text-muted"></i>
                          <p className="mt-2 mb-1">Click to upload crop images</p>
                          <small className="text-muted">
                            Max 5 images • JPG, PNG formats • Clear photos preferred
                          </small>
                          <input
                            type="file"
                            id="cropImage"
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
                          value={formData.cropName}
                          onChange={(e) => handleInputChange('cropName', e.target.value)}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Location *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g., Maharashtra"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Quantity (kg) *</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g., 500"
                          value={formData.quantity}
                          onChange={(e) => handleInputChange('quantity', e.target.value)}
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Expected Price (₹)</label>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Optional - AI will suggest"
                          onChange={(e) => handleInputChange('price', e.target.value)}
                        />
                        <small className="text-muted">Leave empty for AI price suggestion</small>
                      </div>

                      {/* DESCRIPTION INCLUDED */}
                      <div className="col-12">
                        <label className="form-label fw-semibold">Description *</label>
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Describe crop quality, growing methods, special features..."
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                        ></textarea>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* PROCESSING PHASE */}
                {(phase === "analyzing" || phase === "grading" || phase === "marketAnalysis") && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="processing-phase text-center py-4"
                  >
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                        scale: { duration: 1, repeat: Infinity }
                      }}
                      className="mb-4"
                    >
                      <i className="bi bi-cpu fs-1 text-primary"></i>
                    </motion.div>

                    <h5 className="text-primary mb-3">
                      {phase === "analyzing" && "Analyzing Crop Images..."}
                      {phase === "grading" && "Determining Quality Grade..."}
                      {phase === "marketAnalysis" && "Analyzing Market Trends..."}
                    </h5>

                    <div className="progress mb-3" style={{ height: "8px" }}>
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated bg-success"
                        style={{ 
                          width: phase === "analyzing" ? "33%" : 
                                 phase === "grading" ? "66%" : "100%" 
                        }}
                      ></div>
                    </div>
                  </motion.div>
                )}

                {/* RESULTS PHASE */}
                {phase === "results" && aiResult && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="results-phase"
                  >
                    <div className="text-center mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="success-icon"
                      >
                        <i className="bi bi-check-circle-fill text-success fs-1"></i>
                      </motion.div>
                      <h5 className="text-success">Analysis Complete!</h5>
                    </div>

                    <div className="row g-3">

                      {/* GRADE CARD */}
                      <div className="col-md-6">
                        <div
                          className="card border-0 shadow-sm h-100"
                          style={{ borderLeft: `4px solid ${getGradeColor(aiResult.grade)}` }}
                        >
                          <div className="card-body text-center">
                            <h6 className="card-title text-muted">CROP GRADE</h6>
                            <div 
                              className="fs-2 fw-bold mb-2"
                              style={{ color: getGradeColor(aiResult.grade) }}
                            >
                              {aiResult.grade}
                            </div>
                            <p className="small text-muted mb-0">
                              {getGradeDescription(aiResult.grade)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* PRICE CARD */}
                      <div className="col-md-6">
                        <div
                          className="card border-0 shadow-sm h-100"
                          style={{ borderLeft: "4px solid #28a745" }}
                        >
                          <div className="card-body text-center">
                            <h6 className="card-title text-muted">SUGGESTED PRICE</h6>
                            <div className="fs-2 fw-bold text-success mb-2">
                              ₹{aiResult.predictedPrice}
                            </div>
                            <p className="small text-muted mb-0">
                              Per kilogram • {aiResult.marketTrend}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="card border-0 bg-light">
                          <div className="card-body">
                            <h6 className="card-title">Analysis Details</h6>
                            <div className="row">
                              <div className="col-md-6">
                                <strong>Confidence:</strong> {aiResult.confidence}%
                              </div>
                              <div className="col-md-6">
                                <strong>Market Trend:</strong> {aiResult.marketTrend}
                              </div>
                              <div className="col-12 mt-2">
                                <strong>Quality Factors:</strong> {aiResult.qualityFactors.join(", ")}
                              </div>
                              <div className="col-12 mt-2">
                                <strong>Improvements:</strong> {aiResult.improvements.join(", ")}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

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
                      onClick={simulateAIProcessing}
                      disabled={!formData.cropName || !formData.location || !formData.quantity}
                    >
                      <i className="bi bi-robot me-2"></i>
                      Analyze with AI
                    </button>
                  </>
                )}

                {/* RESULTS BUTTONS */}
                {phase === "results" && (
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

                {/* LOADING BUTTON */}
                {(phase === "analyzing" || phase === "grading" || phase === "marketAnalysis") && (
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
