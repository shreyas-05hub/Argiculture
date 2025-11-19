import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

const Reports = () => {
  const [requests, setRequests] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectForId, setRejectForId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
    setRequests(stored);
  }, []);

  // refresh requests from storage
  const refresh = () => {
    const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
    setRequests(stored);
  };

  const acceptRequest = (reqId) => {
    const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
    const updated = stored.map((r) =>
      r.id === reqId ? { ...r, status: "Accepted", timestamp: Date.now() } : r
    );
    localStorage.setItem("cropRequests", JSON.stringify(updated));

    // also update crops array to mark the crop as Accepted
    const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
    const reconciled = storedCrops.map((c) =>
      c.id === stored.find((s) => s.id === reqId)?.cropId
        ? { ...c, status: "Accepted", reason: "" }
        : c
    );
    localStorage.setItem("crops", JSON.stringify(reconciled));

    refresh();
    alert("Request accepted.");
  };

  const openRejectModal = (reqId) => {
    setRejectForId(reqId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const submitReject = () => {
    if (!rejectReason.trim()) {
      alert("Please enter a reason for rejection.");
      return;
    }

    const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
    const updated = stored.map((r) =>
      r.id === rejectForId
        ? {
            ...r,
            status: "Rejected",
            reason: rejectReason,
            timestamp: Date.now(),
          }
        : r
    );
    localStorage.setItem("cropRequests", JSON.stringify(updated));

    // update crops array with rejection and reason
    const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
    const targetReq = updated.find((u) => u.id === rejectForId);
    const reconciled = storedCrops.map((c) =>
      c.id === targetReq.cropId
        ? { ...c, status: "Rejected", reason: rejectReason }
        : c
    );
    localStorage.setItem("crops", JSON.stringify(reconciled));

    setShowRejectModal(false);
    setRejectForId(null);
    setRejectReason("");
    refresh();
    alert("Request rejected.");
  };

  const removeRequest = (reqId) => {
    const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
    const updated = stored.filter((r) => r.id !== reqId);
    localStorage.setItem("cropRequests", JSON.stringify(updated));
    refresh();
  };

  return (
    <AdminLayout>
      <div className="container mt-4" style={{height:"100vh"}}>
        <h2>Crop Requests</h2>

        <div className="user-table mt-3">
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Farmer</th>
                  <th>Crop</th>
                  <th>Qty (kg)</th>
                  <th>Price (₹)</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.length > 0 ? (
                  requests.map((r, idx) => (
                    <tr key={r.id}>
                      <td>{idx + 1}</td>
                      <td>{r.farmerName}</td>
                      <td>{r.cropName}</td>
                      <td>{r.quantity}</td>
                      <td>{r.price}</td>
                      <td>{r.location || "—"}</td>
                      <td>{r.status}</td>
                      <td
                        style={{ maxWidth: "200px", wordBreak: "break-word" }}
                      >
                        {r.status === "Rejected" ? r.reason : "—"}
                      </td>
                      <td>
                        {r.status === "Pending" && (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => acceptRequest(r.id)}
                            >
                              Accept
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => openRejectModal(r.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {r.status === "Accepted" && (
                          <span className="badge bg-success">Accepted</span>
                        )}

                        {r.status === "Rejected" && (
                          <>
                            <span className="badge bg-danger me-2">
                              Rejected
                            </span>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => removeRequest(r.id)}
                            >
                              Remove
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reject Reason Modal (simple inline modal) */}
        {showRejectModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content p-3">
                <div className="modal-header">
                  <h5 className="modal-title">Reject Request</h5>
                  <button
                    className="btn-close"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectForId(null);
                      setRejectReason("");
                    }}
                  />
                </div>

                <div className="modal-body">
                  <textarea
                    className="form-control"
                    placeholder="Enter reason for rejection"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>

                <div className="modal-footer">
                  <button className="btn btn-danger" onClick={submitReject}>
                    Submit Reject
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
    </AdminLayout>
  );
};

export default Reports;
