import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

const Query = () => {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/get-all-queries/")
      .then((res) => res.json())
      .then((data) => setQueries(data.queries || []))
      .catch((err) => console.log("Error fetching queries:", err));
  }, []);

  return (
    <AdminLayout>
      <div
        className="container mt-4"
        style={{
          height: "100vh",
          background:
            "linear-gradient(90deg, rgba(179,230,177,1) 0%, rgba(179,230,177,1) 88%)",
        }}
      >
        <h2>Query Management</h2>

        <div className="user-table mt-3">
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>User Role</th>
                </tr>
              </thead>

              <tbody>
                {queries.length > 0 ? (
                  queries.map((q, index) => (
                    <tr key={q.id || index}>
                      <td>{index + 1}</td>
                      <td>{q.name}</td>
                      <td>{q.email}</td>
                      <td>{q.subject}</td>
                      <td
                        style={{
                          maxWidth: "300px",
                          wordBreak: "break-word",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {q.message}
                      </td>
                      <td>{q.role}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No queries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Query;
