import React from "react";
import "../styles/CropCard.css";

const CropCard = ({ 
  image, 
  name, 
  quantity, 
  location, 
  price, 
  grade, 
  marketTrend,
  status,
  onAgree,
  onDecline,
  onAdminAccept,
  onAdminReject,
  reason 
}

) => {
  console.log("image prop:", image);
  return (
    <div className="crop-card-grid">
      <div className="crop-image-container">
        <img 
          src={image}
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
            <span className="meta-value">{quantity}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Location:</span>
            <span className="meta-value">{location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Price:</span>
            <span className="meta-value">₹{price}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Grade:</span>
            <span className={`grade-value grade-${grade}`}>{grade}</span>
          </div>
        </div>

        {/* Status-based rendering */}
        {status === "ModelSuggested" && (
          <div className="action-buttons">
            <p className="agreement-prompt">Do you agree with AI suggestions?</p>
            <div className="btn-group-grid">
              <button className="btn-agree" onClick={onAgree}>
                👍 Yes, Send to Admin
              </button>
              <button className="btn-decline" onClick={onDecline}>
                👎 No, Decline
              </button>
            </div>
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
            {/* Admin Demo Buttons */}
            <div className="admin-actions mt-2">
              <small className="text-muted d-block mb-1">Admin Demo:</small>
              <div className="btn-group-sm d-flex gap-1">
                <button className="btn btn-success btn-sm flex-fill" onClick={onAdminAccept}>
                  Accept
                </button>
                <button className="btn btn-danger btn-sm flex-fill" onClick={onAdminReject}>
                  Reject
                </button>
              </div>
            </div>
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