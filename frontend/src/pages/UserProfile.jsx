import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Nav,
  Form,
  Button,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./UserProfile.css";

/*
  Assumptions:
  - GET user endpoint: GET http://127.0.0.1:8000/user/<id>/
    (returns fields like id, username, email, first_name, last_name,
     mobile_no, role, address, profile_picture (url or base64), acres, experience)
  - Update endpoint: POST http://127.0.0.1:8000/api/update-profile/<id>/
    (accepts JSON and saves fields)
  - loggedInUser is stored in localStorage after login and contains at least {id, email}
*/

const API_BASE = "http://127.0.0.1:8000";

const UserProfile = () => {
  const loggedIn = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  const localUsers = JSON.parse(localStorage.getItem("users") || "[]");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState({
    id: null,
    firstName: "",
    lastName: "",
    fullName: "",
    contact: "",
    email: "",
    address: "",
    profilePic: null, // base64 string or URL
    role: "",
    acres: "",
    experience: "",
  });

  const [editAll, setEditAll] = useState(false);
  const [tempUser, setTempUser] = useState(null);

  // Fetch user from backend by id (best source of truth)
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);

      // 1) If we have loggedIn user with id -> fetch from backend
      if (loggedIn && loggedIn.id) {
        try {
          const resp = await fetch(`${API_BASE}/user/${loggedIn.id}/`);
          if (!resp.ok) {
            const json = await resp.json().catch(() => ({}));
            throw new Error(json.error || `Server returned ${resp.status}`);
          }
          const data = await resp.json();

          // map fields (backend names might differ slightly; adjust if needed)
          setUser({
            id: data.id || loggedIn.id,
            firstName: data.first_name || data.firstName || "",
            lastName: data.last_name || data.lastName || "",
            fullName:
              (data.first_name || data.firstName || "") +
              (data.last_name || data.lastName ? ` ${data.last_name || data.lastName}` : ""),
            contact: data.mobile_no || data.contact || "",
            email: data.email || loggedIn.email || "",
            address: data.address || "",
            profilePic: data.profile_picture || data.profilePic || null,
            role: data.role || "",
            acres: data.acres || data.acre || "",
            experience: data.experience || "",
          });

          setLoading(false);
        } catch (err) {
          console.error("Fetch user failed:", err);
          setError("Failed to fetch user from server. See console for details.");
          // fallback: try to populate from localStorage users array if available
          if (localUsers.length > 0 && loggedIn && loggedIn.email) {
            const lu = localUsers.find((u) => u.email === loggedIn.email);
            if (lu) {
              setUser({
                id: lu.id || loggedIn.id,
                firstName: lu.firstName || lu.first_name || "",
                lastName: lu.lastName || lu.last_name || "",
                fullName: (lu.firstName || "") + (lu.lastName ? ` ${lu.lastName}` : ""),
                contact: lu.phone || lu.mobile_no || lu.contact || "",
                email: lu.email || loggedIn.email || "",
                address: lu.address || "",
                profilePic: lu.profilePic || lu.profile_picture || null,
                role: lu.role || "",
                acres: lu.acres || "",
                experience: lu.experience || "",
              });
              setLoading(false);
              return;
            }
          }
          setLoading(false);
        }
        return;
      }

      // 2) If loggedIn exists but no id, try to get from local users array
      if (localUsers.length > 0 && loggedIn && loggedIn.email) {
        const lu = localUsers.find((u) => u.email === loggedIn.email);
        if (lu) {
          setUser({
            id: lu.id || null,
            firstName: lu.firstName || lu.first_name || "",
            lastName: lu.lastName || lu.last_name || "",
            fullName: (lu.firstName || "") + (lu.lastName ? ` ${lu.lastName}` : ""),
            contact: lu.phone || lu.mobile_no || lu.contact || "",
            email: lu.email || loggedIn.email || "",
            address: lu.address || "",
            profilePic: lu.profilePic || lu.profile_picture || null,
            role: lu.role || "",
            acres: lu.acres || "",
            experience: lu.experience || "",
          });
          setLoading(false);
          return;
        }
      }

      // 3) Nothing found
      setError("User not logged in or user id not available.");
      setLoading(false);
    }

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  const startEditAll = () => {
    setTempUser({ ...user });
    setEditAll(true);
  };

  const cancelEditAll = () => {
    if (tempUser) setUser({ ...tempUser });
    setEditAll(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...user, [name]: value };
    if (name === "firstName" || name === "lastName") {
      updated.fullName = `${updated.firstName || ""} ${updated.lastName || ""}`.trim();
    }
    setUser(updated);
  };

  // image file -> base64
  const handleImageUpload = (e) => {
    if (!editAll) return;
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUser((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    if (!editAll) return;
    setUser((prev) => ({ ...prev, profilePic: null }));
  };

  // Save to backend + sync localStorage users array
  const saveEditAll = async () => {
    if (!user.id) {
      alert("Cannot update: user id missing.");
      return;
    }

    // prepare payload - send only the fields your backend expects
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      contact: user.contact,
      address: user.address,
      acres: user.acres,
      experience: user.experience,
      profilePic: user.profilePic, // base64 or url depending on backend handling
    };

    try {
      const resp = await fetch(`${API_BASE}/api/update-profile/${user.id}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        console.error("Update error:", json);
        alert(json.error || "Update failed");
        return;
      }

      // sync local users array if present
      try {
        const updatedUsers = localUsers.map((u) =>
          u.email === user.email
            ? {
                ...u,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.fullName || u.username,
                phone: user.contact,
                mobile_no: user.contact,
                address: user.address,
                profilePic: user.profilePic,
                // acres: user.acres,
                // experience: user.experience,
              }
            : u
        );
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      } catch (e) {
        // ignore localStorage sync errors
        console.warn("localStorage sync failed", e);
      }

      alert(json.message || "Profile updated successfully");
      setEditAll(false);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Server error while updating profile.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <h5>Loading profile...</h5>
      </Container>
    );
  }

  return (
    <Container className="profile-container mt-5 mb-5">
      <Card className="shadow-lg border-0 profile-card p-4">
        <Row>
          {/* LEFT */}
          <Col
            md={4}
            className="text-center border-end d-flex flex-column align-items-center justify-content-center"
          >
            <img
              src={
                user.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.fullName || user.email || "User"
                )}&background=0D8ABC&color=fff`
              }
              alt="User"
              className="profile-pic mb-3"
            />

            {editAll && (
              <label className="btn btn-sm btn-primary mt-2">
                Upload Image
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageUpload}
                  hidden
                />
              </label>
            )}

            {editAll && user.profilePic && (
              <button
                className="btn btn-sm btn-outline-danger mt-2"
                onClick={removeImage}
              >
                <FaTrash /> Remove
              </button>
            )}

            <h5 className="text-muted mt-3">{user.fullName || user.email}</h5>
            <h6 className="text-secondary">{user.role}</h6>
          </Col>

          {/* RIGHT */}
          <Col md={8} className="p-4">
            <Tab.Container defaultActiveKey="profile">
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="profile">Profile Info</Nav.Link>
                </Nav.Item>
              </Nav>

              <div className="d-flex justify-content-end mb-3">
                {!editAll ? (
                  <Button variant="warning" onClick={startEditAll}>
                    <FaEdit /> Edit All
                  </Button>
                ) : (
                  <>
                    <Button className="me-2" variant="success" onClick={saveEditAll}>
                      Save All
                    </Button>
                    <Button variant="danger" onClick={cancelEditAll}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>

              <Tab.Content>
                <Tab.Pane eventKey="profile">
                  <div className="user-info">
                    {/* FIRST NAME */}
                    <div className="info-item mt-3">
                      <h6>First Name:</h6>
                      {editAll ? (
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={user.firstName}
                          onChange={handleChange}
                        />
                      ) : (
                        <h5>{user.firstName}</h5>
                      )}
                    </div>

                    {/* LAST NAME */}
                    <div className="info-item mt-3">
                      <h6>Last Name:</h6>
                      {editAll ? (
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={user.lastName}
                          onChange={handleChange}
                        />
                      ) : (
                        <h5>{user.lastName}</h5>
                      )}
                    </div>

                    {/* CONTACT */}
                    <div className="info-item mt-4">
                      <h6>Contact:</h6>
                      {editAll ? (
                        <Form.Control
                          type="text"
                          name="contact"
                          value={user.contact}
                          onChange={handleChange}
                        />
                      ) : (
                        <h6>{user.contact}</h6>
                      )}
                    </div>

                    {/* EMAIL */}
                      <div className="info-item mt-4">
                      <h6>Email:</h6>
                      {editAll ? (
                        <Form.Control
                          type="text"
                          name="contact"
                          value={user.email}
                          onChange={handleChange}
                        />
                      ) : (
                        <h6>{user.email}</h6>
                      )}
                    </div>
                    
                    {/* ADDRESS */}
                    <div className="info-item mt-4">
                      <h6>Address:</h6>
                      {editAll ? (
                        <Form.Control
                          type="text"
                          name="address"
                          value={user.address}
                          onChange={handleChange}
                        />
                      ) : (
                        <h6>{user.address || "No address added"}</h6>
                      )}
                    </div>

                    {/* ROLE */}
                    <div className="info-item mt-4">
                      <h6>Role:</h6>
                      <h6>{user.role}</h6>
                    </div>

                    {/* FARMER FIELDS */}
                    {/* {user.role === "farmer" && (
                      <>
                        <div className="info-item mt-3">
                          <Form.Label>Land Acres</Form.Label>
                          {editAll ? (
                            <Form.Control
                              name="acres"
                              value={user.acres}
                              onChange={handleChange}
                            />
                          ) : (
                            <h6>{user.acres || "Not provided"}</h6>
                          )}
                        </div>

                        <div className="info-item mt-3">
                          <Form.Label>Experience (Years)</Form.Label>
                          {editAll ? (
                            <Form.Control
                              name="experience"
                              value={user.experience}
                              onChange={handleChange}
                            />
                          ) : (
                            <h6>{user.experience || "Not provided"}</h6>
                          )}
                        </div>
                      </>
                    )} */}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>

            {error && <div className="text-danger mt-3">{error}</div>}
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default UserProfile;
