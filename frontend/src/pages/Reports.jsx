import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { toast } from "react-toastify";

const Reports = () => {
  const [requests, setRequests] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectForId, setRejectForId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  // Fetch all crop requests (pending/accepted/rejected)
  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/marketplace/crops");
      const data = await res.json();
      setRequests(data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load requests.");
    }
  };

  // Accept crop request
  const acceptRequest = async (reqId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/marketplace/crops/accept/${reqId}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Request accepted successfully.");
        fetchRequests(); // refresh table
      } else {
        toast.error(data.message || "Failed to accept request.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while accepting request.");
    }
  };

  // Open reject modal
  const openRejectModal = (reqId) => {
    setRejectForId(reqId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  // Submit rejection
  const submitReject = async () => {
    if (!rejectReason.trim()) {
      toast.warning("Please enter a reason for rejection.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/marketplace/crops/reject/${rejectForId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason: rejectReason }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Request rejected successfully.");
        setShowRejectModal(false);
        setRejectForId(null);
        setRejectReason("");
        fetchRequests();
      } else {
        toast.error(data.message || "Failed to reject request.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while rejecting request.");
    }
  };

  // Remove rejected request from table
  const removeRequest = async (reqId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/marketplace/crops/${reqId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        toast.success("Request removed.");
        fetchRequests();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove request.");
    }
  };

  return (
    <AdminLayout>
      <div className="container-fluid mt-4" style={{ height: "100vh" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Crop Requests Management</h2>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={fetchRequests}
          >
            🔄 Refresh
          </button>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Farmer</th>
                    <th>Crop</th>
                    <th>Qty (kg)</th>
                    <th>Price (₹)</th>
                    <th>Grade</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.length > 0 ? (
                    requests.map((r, idx) => (
                      <tr key={r._id}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong>{r.farmerName}</strong>
                        </td>
                        <td>{r.cropName}</td>
                        <td>{r.quantity}</td>
                        <td>₹{r.price}</td>
                        <td>
                          <span className={`badge grade-${r.grade}`}>
                            {r.grade}
                          </span>
                        </td>
                        <td>{r.location || "—"}</td>
                        <td>
                          <span
                            className={`badge ${
                              r.status === "Pending"
                                ? "bg-warning"
                                : r.status === "Accepted"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td
                          style={{ maxWidth: "200px", wordBreak: "break-word" }}
                        >
                          {r.reason || "—"}
                        </td>
                        <td>
                          {r.status === "Pending" && (
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-success"
                                onClick={() => acceptRequest(r._id)}
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => openRejectModal(r._id)}
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {r.status === "Accepted" && (
                            <span className="badge bg-success">Completed</span>
                          )}

                          {r.status === "Rejected" && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeRequest(r._id)}
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4">
                        <div className="text-muted">
                          <i className="bi bi-inbox fs-1"></i>
                          <p className="mt-2">No crop requests found.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Reject Reason Modal */}
        {showRejectModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reject Request</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectForId(null);
                      setRejectReason("");
                    }}
                  />
                </div>

                <div className="modal-body">
                  <label className="form-label">Reason for rejection:</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter reason for rejection..."
                    rows="4"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-danger"
                    onClick={submitReject}
                    disabled={!rejectReason.trim()}
                  >
                    Submit Rejection
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectForId(null);
                      setRejectReason("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .grade-A {
          background: #d4edda;
          color: #155724;
        }
        .grade-B {
          background: #fff3cd;
          color: #f0b609ff;
        }
        .grade-C {
          background: #f8d7da;
          color: #721c24;
        }
      `}</style>
    </AdminLayout>
  );
};

export default Reports;
