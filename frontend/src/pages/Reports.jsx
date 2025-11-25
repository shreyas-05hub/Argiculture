import React from "react";
import AdminLayout from "../components/AdminLayout";
const Reports = () => {
<<<<<<< HEAD
  return (
    <AdminLayout>
      <div
        style={{
          height:"100vh",
          background: " #b3e6b1",
          background:
            "linear-gradient(90deg, rgba(179, 230, 177, 1) 0%, rgba(179, 230, 177, 1) 88%)",
        }}
      >
        <h1>Reports</h1>
=======
  const [requests, setRequests] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectForId, setRejectForId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  
  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
    // Sort by timestamp descending (newest first)
    const sorted = stored.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    setRequests(sorted);
  };

  const acceptRequest = (reqId) => {
    const stored = JSON.parse(localStorage.getItem("cropRequests")) || [];
    const updated = stored.map((r) =>
      r.id === reqId ? { ...r, status: "Accepted", timestamp: Date.now() } : r
    );
    localStorage.setItem("cropRequests", JSON.stringify(updated));

    // Update crops array to mark the crop as Accepted
    const storedCrops = JSON.parse(localStorage.getItem("crops")) || [];
    const targetReq = stored.find((s) => s.id === reqId);
    const reconciled = storedCrops.map((c) =>
      c.id === targetReq?.cropId
        ? { ...c, status: "Accepted", reason: "" }
        : c
    );
    localStorage.setItem("crops", JSON.stringify(reconciled));

    refresh();
    alert("Request accepted successfully.");
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

    // Update crops array with rejection and reason
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
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Crop Requests Management</h2>
          <button className="btn btn-outline-primary btn-sm" onClick={refresh}>
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
                      <tr key={r.id}>
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
                          <span className={`badge ${
                            r.status === 'Pending' ? 'bg-warning' :
                            r.status === 'Accepted' ? 'bg-success' :
                            'bg-danger'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td style={{ maxWidth: "200px", wordBreak: "break-word" }}>
                          {r.reason || "—"}
                        </td>
                        <td>
                          {r.status === "Pending" && (
                            <div className="btn-group btn-group-sm">
                              <button
                                className="btn btn-success"
                                onClick={() => acceptRequest(r.id)}
                              >
                                Accept
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={() => openRejectModal(r.id)}
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
                              onClick={() => removeRequest(r.id)}
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
>>>>>>> ec75e5741af9d6613f75e6b1ef2301698618213e
      </div>

      <style jsx>{`
        .grade-A { background: #d4edda; color: #155724; }
        .grade-B { background: #fff3cd; color: #f0b609ff; }
        .grade-C { background: #f8d7da; color: #721c24; }
      `}</style>
    </AdminLayout>
  );
};

export default Reports;