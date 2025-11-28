import React from "react";
import "../styles/CropCard.css";

const statusColors = {
  ModelSuggested: "#4F46E5",
  Pending: "#F59E0B",
  Accepted: "#10B981",
  Rejected: "#EF4444",
  Declined: "#EF4444", // Assuming similar to Rejected
};

const CropCard = ({ 
  id,
  cropName: name, 
  quantity, 
  location = "", // Optional, as in old
  pricePerKg: price, 
  totalAmount,
  grade, 
  marketTrend, // Optional, as in old
  status,
  description, // New prop
  images = [],
  userType, // "farmer" or "admin"
  reason, // Optional, as in old

  onFarmerAgree: onAgree,
  onFarmerDecline: onDecline,
  onAdminAccept,
  onAdminReject,
}) => {
  console.log("images prop:", images);
  return (
    <div className="crop-card-grid">
      <div className="crop-image-container">
        <img 
          src={images[0] || "/placeholder.jpg"}
          alt={name}
          className="crop-img"
        />
        {marketTrend && status === "ModelSuggested" && (
          <span className={`trend-badge ${marketTrend.toLowerCase().includes('high') ? 'trend-high' : marketTrend.toLowerCase().includes('medium') ? 'trend-medium' : 'trend-low'}`}>
            {marketTrend}
          </span>
        )}
      </div>

      <div className="crop-content">
        <h6 className="crop-title">{name}</h6>
        
        <div className="crop-meta">
          <div className="meta-item">
            <span className="meta-label">Qty:</span>
            <span className="meta-value">{quantity} kg</span>
          </div>
          {location && (
            <div className="meta-item">
              <span className="meta-label">Location:</span>
              <span className="meta-value">{location}</span>
            </div>
          )}
          <div className="meta-item">
            <span className="meta-label">Price:</span>
            <span className="meta-value">₹{price} /kg</span>
          </div>
          {totalAmount && (
            <div className="meta-item">
              <span className="meta-label">Total:</span>
              <span className="meta-value">₹{totalAmount}</span>
            </div>
          )}
          <div className="meta-item">
            <span className="meta-label">Grade:</span>
            <span className={`grade-value grade-${grade}`}>{grade}</span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="crop-description">
            <small><strong>Description:</strong> {description}</small>
          </div>
        )}

        {/* Status-based rendering */}
        {status === "ModelSuggested" && (
          <div className="action-buttons">
            <p className="agreement-prompt">Do you agree with AI suggestions?</p>
            {userType === "farmer" && (
              <div className="btn-group-grid">
                <button className="btn-agree" onClick={() => onAgree(id)}>
                  👍 Yes, Send to Admin
                </button>
                <button className="btn-decline" onClick={() => onDecline(id)}>
                  👎 No, Decline
                </button>
              </div>
            )}
            {userType === "admin" && (
              <div className="btn-group-grid">
                <button className="btn-accept" onClick={() => onAdminAccept(id)}>
                  Approve
                </button>
                <button className="btn-reject" onClick={() => onAdminReject(id)}>
                  Reject
                </button>
              </div>
            )}
          </div>
        )}

        {status === "Pending" && (
          <div className="status-container">
            <span className="status-badge status-pending">
              ⏳ Waiting for Admin Approval
            </span>
            <div className="status-info">
              <small className="text-muted">Your request is with the admin team</small>
            </div>
            {userType === "admin" && (
              <div className="admin-actions mt-2">
                <div className="btn-group-sm d-flex gap-1">
                  <button className="btn btn-success btn-sm flex-fill" onClick={() => onAdminAccept(id)}>
                    Accept
                  </button>
                  <button className="btn btn-danger btn-sm flex-fill" onClick={() => onAdminReject(id)}>
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {status === "Declined" && (
          <div className="status-container">
            <span className="status-badge status-declined">
              ❌ You Declined This Offer
            </span>
          </div>
        )}

        {status === "Rejected" && (
          <div className="status-container">
            <span className="status-badge status-rejected">
              ⚠️ Admin Rejected
            </span>
            {reason && (
              <div className="rejection-reason">
                <small><strong>Reason:</strong> {reason}</small>
              </div>
            )}
          </div>
        )}

        {status === "Accepted" && (
          <div className="status-container">
            <span className="status-badge status-accepted">
              ✅ Successfully Sold
            </span>
            <div className="status-info">
              <small className="text-success">Transaction completed successfully</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropCard;