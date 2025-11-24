import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WatchDemoAnimation = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState("intro");
  const [cropName, setCropName] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Upload crop images (max 5, JPG/PNG only)",
    "Enter crop name and location",
    "Specify quantity in kilograms",
    "Add description (optional)",
    "Submit for AI grading"
  ];

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  const type = async (text, setter) => {
    setter("");
    for (let i = 0; i <= text.length; i++) {
      setter(text.slice(0, i));
      await delay(40);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setPhase("intro");
      setCurrentStep(0);
      setCropName("");
      setLocation("");
      setQuantity("");
      setDescription("");
      return;
    }

    const runDemo = async () => {
      setPhase("intro");
      await delay(1500);

      // Step 1: File Upload Explanation
      setPhase("fileUpload");
      setCurrentStep(0);
      await delay(2000);

      // Step 2: Crop Name & Location
      setPhase("basicInfo");
      setCurrentStep(1);
      await delay(1000);
      await type("Organic Wheat", setCropName);
      await delay(800);
      await type("Punjab Farms", setLocation);
      await delay(1500);

      // Step 3: Quantity
      setPhase("quantity");
      setCurrentStep(2);
      await delay(1000);
      await type("500", setQuantity);
      await delay(1500);

      // Step 4: Description
      setPhase("description");
      setCurrentStep(3);
      await delay(1000);
      await type("High-quality organic wheat harvested this season. Grown with natural fertilizers and proper irrigation.", setDescription);
      await delay(2000);

      // Step 5: Submission
      setPhase("submission");
      setCurrentStep(4);
      await delay(2000);

      // Step 6: AI Processing
      setPhase("aiProcessing");
      await delay(2500);

      // Step 7: Results
      setPhase("results");
      await delay(3000);

      // Loop back to start
      setPhase("intro");
      setCurrentStep(0);
      setCropName("");
      setLocation("");
      setQuantity("");
      setDescription("");
    };

    if (isOpen) {
      runDemo();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">🌾 How to Add Your Crop - Demo</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            {/* Progress Steps */}
            <div className="demo-progress mb-4">
              <div className="steps-container">
                {steps.map((step, index) => (
                  <div key={index} className="step-item">
                    <div className={`step-number ${currentStep >= index ? 'active' : ''}`}>
                      {index + 1}
                    </div>
                    <div className={`step-label ${currentStep === index ? 'active' : ''}`}>
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Content */}
            <div className="demo-content">
              <AnimatePresence mode="wait">
                {/* INTRO SCREEN */}
                {phase === "intro" && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-4"
                  >
                    <div className="demo-icon mb-3">
                      <i className="bi bi-play-circle-fill text-success fs-1"></i>
                    </div>
                    <h4 className="text-success">Welcome to Crop Addition Demo</h4>
                    <p className="text-muted">
                      Watch how to add your crops for AI-powered grading and pricing
                    </p>
                    <div className="spinner-border text-success mt-3" role="status">
                      <span className="visually-hidden">Starting demo...</span>
                    </div>
                  </motion.div>
                )}

                {/* FILE UPLOAD STEP */}
                {phase === "fileUpload" && (
                  <motion.div
                    key="fileUpload"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <div className="alert alert-info">
                      <strong>Step 1:</strong> Upload clear images of your crop
                    </div>
                    <div className="file-upload-demo border rounded p-4 text-center">
                      <i className="bi bi-cloud-arrow-up fs-1 text-primary"></i>
                      <p className="mt-2 mb-1">
                        <strong>Click to upload crop images</strong>
                      </p>
                      <small className="text-muted">
                        Maximum 5 images • JPG, JPEG, PNG formats only
                      </small>
                      <div className="image-previews mt-3">
                        <div className="d-flex gap-2 justify-content-center">
                          {[1, 2, 3].map((num) => (
                            <div key={num} className="image-preview-demo">
                              <div className="placeholder-image">
                                <i className="bi bi-image text-muted"></i>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* BASIC INFO STEP */}
                {phase === "basicInfo" && (
                  <motion.div
                    key="basicInfo"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <div className="alert alert-info">
                      <strong>Step 2:</strong> Enter basic crop information
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Crop Name *</label>
                        <input
                          readOnly
                          value={cropName}
                          className="form-control demo-typing"
                          placeholder="e.g., Organic Wheat, Basmati Rice"
                        />
                        <small className="text-muted">
                          Enter the specific variety if known
                        </small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Location *</label>
                        <input
                          readOnly
                          value={location}
                          className="form-control demo-typing"
                          placeholder="e.g., Punjab Farms, Maharashtra"
                        />
                        <small className="text-muted">
                          Helps in location-based pricing
                        </small>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* QUANTITY STEP */}
                {phase === "quantity" && (
                  <motion.div
                    key="quantity"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <div className="alert alert-info">
                      <strong>Step 3:</strong> Specify quantity details
                    </div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Quantity (kg) *</label>
                        <input
                          readOnly
                          value={quantity}
                          type="number"
                          className="form-control demo-typing"
                          placeholder="e.g., 500, 1000"
                        />
                        <small className="text-muted">
                          Total quantity available in kilograms
                        </small>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Expected Price (₹)</label>
                        <input
                          readOnly
                          value=""
                          className="form-control"
                          placeholder="Optional - AI will suggest price"
                        />
                        <small className="text-muted">
                          Leave empty for AI price suggestion
                        </small>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* DESCRIPTION STEP */}
                {phase === "description" && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <div className="alert alert-info">
                      <strong>Step 4:</strong> Add crop description
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        readOnly
                        value={description}
                        className="form-control demo-typing"
                        rows="3"
                        placeholder="Describe your crop quality, growing methods, special features..."
                      />
                      <small className="text-muted">
                        Optional but helps in better grading
                      </small>
                    </div>
                  </motion.div>
                )}

                {/* SUBMISSION STEP */}
                {phase === "submission" && (
                  <motion.div
                    key="submission"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <div className="alert alert-warning">
                      <strong>Step 5:</strong> Review and submit
                    </div>
                    <div className="submission-demo text-center p-4 border rounded">
                      <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
                      <h5 className="text-success">Ready to Submit!</h5>
                      <p className="text-muted">
                        All information filled. Click "Add Crop" to send for AI analysis.
                      </p>
                      <button className="btn btn-success px-4" disabled>
                        <i className="bi bi-robot me-2"></i>
                        Add Crop for AI Grading
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* AI PROCESSING STEP */}
                {phase === "aiProcessing" && (
                  <motion.div
                    key="aiProcessing"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-4"
                  >
                    <div className="ai-processing-demo">
                      <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Analyzing...</span>
                      </div>
                      <h5 className="text-primary">AI is Analyzing Your Crop</h5>
                      <p className="text-muted">
                        Our AI model is examining crop images and data...
                      </p>
                      <div className="progress mt-3">
                        <div 
                          className="progress-bar progress-bar-striped progress-bar-animated" 
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                      <div className="ai-features mt-3">
                        <small className="text-muted">
                          • Image Quality Analysis • Grade Prediction • Market Price Suggestion • Demand Trends
                        </small>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* RESULTS STEP */}
                {phase === "results" && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-4"
                  >
                    <div className="results-demo">
                      <i className="bi bi-award-fill text-warning fs-1 mb-3"></i>
                      <h4 className="text-success">AI Analysis Complete!</h4>
                      
                      <div className="results-grid mt-4">
                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="result-card border rounded p-3">
                              <h6 className="text-primary">Crop Grade</h6>
                              <div className="grade-badge grade-A">Grade A</div>
                              <small className="text-muted">Premium Quality</small>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="result-card border rounded p-3">
                              <h6 className="text-primary">Suggested Price</h6>
                              <div className="price-value">₹2,450/kg</div>
                              <small className="text-muted">Market Competitive</small>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="final-step mt-4 p-3 bg-light rounded">
                        <p className="mb-2">
                          <strong>Next:</strong> Review AI suggestions and send to admin for approval
                        </p>
                        <small className="text-muted">
                          You can agree with the price or decline the offer
                        </small>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close Demo
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                setPhase("intro");
                setCurrentStep(0);
                setCropName("");
                setLocation("");
                setQuantity("");
                setDescription("");
              }}
            >
              Restart Demo
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .demo-progress .steps-container {
          display: flex;
          justify-content: space-between;
          position: relative;
        }
        .demo-progress .steps-container::before {
          content: '';
          position: absolute;
          top: 15px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e9ecef;
          z-index: 1;
        }
        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: bold;
          margin-bottom: 5px;
          transition: all 0.3s ease;
        }
        .step-number.active {
          background: #28a745;
          color: white;
        }
        .step-label {
          font-size: 0.7rem;
          text-align: center;
          max-width: 100px;
          color: #6c757d;
          transition: all 0.3s ease;
        }
        .step-label.active {
          color: #28a745;
          font-weight: 600;
        }
        .file-upload-demo {
          background: #f8f9fa;
          border-style: dashed !important;
        }
        .image-preview-demo {
          width: 60px;
          height: 60px;
          border: 1px dashed #dee2e6;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .placeholder-image {
          color: #6c757d;
        }
        .demo-typing {
          background: #f8f9fa !important;
          border-color: #28a745 !important;
        }
        .grade-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: bold;
          background: #d4edda;
          color: #155724;
        }
        .price-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #28a745;
        }
        .ai-features {
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

export default WatchDemoAnimation;