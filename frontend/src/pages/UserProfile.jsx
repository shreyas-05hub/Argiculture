import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { PencilSquare } from "react-bootstrap-icons";
import axios from "axios";
import "./UserProfile.css";

/**
 * Final UserProfile.jsx
 * - Field-wise editing (single-field edit at a time)
 * - Profile picture edit with preview and inline Save/Cancel
 * - Uses existing API endpoints (no changes)
 * - Updates localStorage.loggedInUser with returned/updated values
 *
 * Notes:
 * - apiBase: change if your backend runs on a different host.
 * - Expects update API at: POST {apiBase}/api/update-profile/{userId}/
 *   Accepts multipart/form-data for image; form fields for other values.
 */

const apiBase = "http://127.0.0.1:8000";

const fieldToApiKey = {
  firstName: "first_name",
  lastName: "last_name",
  contact: "mobile_no",
  address: "address",
  dob: "dob",
  gender: "gender",
  city: "city",
  state: "state",
  pincode: "pincode",
  profilePic: "profile_picture",
};

const UserProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const userId = storedUser.id;

  // which single field is being edited, or null
  const [editingField, setEditingField] = useState(null);

  // temporarily selected image file for profile picture editing
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  // user state shown on form
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    email: "",
    profilePic: "",
    dob: "",
    gender: "",
    city: "",
    state: "",
    pincode: "",
  });

  // keep original value to restore on cancel
  const [originalValue, setOriginalValue] = useState(null);

  useEffect(() => {
    setUser({
      firstName: storedUser.first_name || "",
      lastName: storedUser.last_name || "",
      contact: storedUser.mobile_no || "",
      address: storedUser.address || "",
      email: storedUser.email || "",
      profilePic: storedUser.profile_picture || "",
      dob: storedUser.dob || "",
      gender: storedUser.gender || "",
      city: storedUser.city || "",
      state: storedUser.state || "",
      pincode: storedUser.pincode || "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- IMAGE CHANGE (preview only) ----------------
  const handleImageSelected = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prev) => ({
        ...prev,
        // use data URL for immediate preview
        profilePic: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // ---------------- START EDIT FOR FIELD ----------------
  const startEdit = (fieldName) => {
    // store original value so cancel can revert
    setOriginalValue(user[fieldName]);
    setEditingField(fieldName);
    // clear any selected image file when starting non-image edits
    if (fieldName !== "profilePic") {
      setSelectedImageFile(null);
    }
  };

  // ---------------- CANCEL EDIT ----------------
  const handleCancel = (fieldName) => {
    // revert the value
    setUser((prev) => ({
      ...prev,
      [fieldName]: originalValue,
    }));
    setSelectedImageFile(null);
    setOriginalValue(null);
    setEditingField(null);
  };

  // ---------------- LOCAL CHANGE (input) ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // ---------------- SAVE SINGLE FIELD ----------------
  const handleFieldSave = async (fieldName) => {
    try {
      const apiKey = fieldToApiKey[fieldName];
      if (!apiKey) {
        alert("Unknown field.");
        return;
      }

      const formData = new FormData();

      if (fieldName === "profilePic") {
        if (!selectedImageFile) {
          alert("Please choose an image to upload first.");
          return;
        }
        formData.append(apiKey, selectedImageFile);
      } else {
        // send value (ensure not undefined)
        formData.append(apiKey, user[fieldName] ?? "");
      }

      // call API - send only the changed field
      const response = await axios.post(
        `${apiBase}/api/update-profile/${userId}/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // Update storedUser in localStorage with changed value(s)
      const updatedStoredUser = { ...storedUser };

      if (response && response.data) {
        // merge all returned keys into stored user (backend might return snake_case)
        Object.keys(response.data).forEach((k) => {
          updatedStoredUser[k] = response.data[k];
        });

        // If backend returned profile_picture specifically, update user's profilePic shown
        if (response.data.profile_picture) {
          // sometimes backend returns a relative path like /media/...
          const picValue = response.data.profile_picture;
          setUser((prev) => ({ ...prev, profilePic: picValue }));
        }
      } else {
        // backend didn't return data - update locally for the changed field
        if (fieldName !== "profilePic") {
          updatedStoredUser[apiKey] = user[fieldName];
        }
      }

      // ensure apiKey mapping also present (for non-image fields)
      if (fieldName !== "profilePic") {
        updatedStoredUser[apiKey] = user[fieldName];
      }

      localStorage.setItem("loggedInUser", JSON.stringify(updatedStoredUser));

      setOriginalValue(null);
      setSelectedImageFile(null);
      setEditingField(null);
      alert("Updated successfully.");
    } catch (error) {
      console.error("Save field error:", error);
      alert("Update failed. Please try again.");
    }
  };

  // helper to produce correct image src for preview / backend path
  const getProfileImageSrc = () => {
    if (!user.profilePic) return "/default.png";
    // if it's a data URL (starts with data:) or already an absolute http(s) URL, use directly
    if (typeof user.profilePic === "string") {
      if (user.profilePic.startsWith("data:")) return user.profilePic;
      if (user.profilePic.startsWith("http")) return user.profilePic;
      // if backend returned a relative path like /media/..., prefix with apiBase
      if (user.profilePic.startsWith("/")) return `${apiBase}${user.profilePic}`;
    }
    return user.profilePic;
  };

  return (
    <div className="user-profile-page">
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-image-wrapper" style={{ position: "relative" }}>
            <img
              src={getProfileImageSrc()}
              className="profile-image"
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ccc",
              }}
            />

            {/* small pencil to start image edit */}
            <button
              className="image-pencil-btn"
              title="Edit profile picture"
              onClick={() => startEdit("profilePic")}
              style={{
                position: "absolute",
                right: 4,
                bottom: 4,
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              📸
            </button>

            {/* when editing profilePic show file input + inline actions */}
            {editingField === "profilePic" && (
              <div className="image-edit-block" style={{ marginTop: 12 }}>
                <input
                  id="profilePicInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelected}
                />
                <div className="inline-actions" style={{ marginTop: 8 }}>
                  <Button
                    size="sm"
                    className="save-btn"
                    onClick={() => handleFieldSave("profilePic")}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    className="cancel-btn ms-2"
                    onClick={() => handleCancel("profilePic")}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="profile-header-text" style={{ marginLeft: 20 }}>
            <h1 className="profile-name">
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-role">Registered User</p>
          </div>
        </div>
      </div>

      {/* INFORMATION CARD */}
      <Card className="profile-card mt-4 p-4">
        <h3 className="profile-title">Personal Information</h3>
        <div className="section-divider" style={{ height: 1, background: "#eee", margin: "12px 0" }} />

        {/* FIRST + LAST NAME */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                First Name{" "}
                {editingField !== "firstName" && (
                  <PencilSquare className="edit-icon" onClick={() => startEdit("firstName")} style={{ cursor: "pointer", marginLeft: 6 }} />
                )}
              </Form.Label>

              <Form.Control
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                disabled={editingField !== "firstName"}
              />

              {editingField === "firstName" && (
                <div className="inline-actions" style={{ marginTop: 8 }}>
                  <Button size="sm" className="save-btn" onClick={() => handleFieldSave("firstName")}>
                    Save
                  </Button>
                  <Button size="sm" className="cancel-btn ms-2" onClick={() => handleCancel("firstName")}>
                    Cancel
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Last Name{" "}
                {editingField !== "lastName" && (
                  <PencilSquare className="edit-icon" onClick={() => startEdit("lastName")} style={{ cursor: "pointer", marginLeft: 6 }} />
                )}
              </Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                disabled={editingField !== "lastName"}
              />

              {editingField === "lastName" && (
                <div className="inline-actions" style={{ marginTop: 8 }}>
                  <Button size="sm" className="save-btn" onClick={() => handleFieldSave("lastName")}>
                    Save
                  </Button>
                  <Button size="sm" className="cancel-btn ms-2" onClick={() => handleCancel("lastName")}>
                    Cancel
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* DOB + Gender */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Date of Birth{" "}
                {editingField !== "dob" && <PencilSquare className="edit-icon" onClick={() => startEdit("dob")} style={{ cursor: "pointer", marginLeft: 6 }} />}
              </Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={user.dob}
                onChange={handleChange}
                disabled={editingField !== "dob"}
              />

              {editingField === "dob" && (
                <div className="inline-actions" style={{ marginTop: 8 }}>
                  <Button size="sm" className="save-btn" onClick={() => handleFieldSave("dob")}>
                    Save
                  </Button>
                  <Button size="sm" className="cancel-btn ms-2" onClick={() => handleCancel("dob")}>
                    Cancel
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                Gender{" "}
                {editingField !== "gender" && <PencilSquare className="edit-icon" onClick={() => startEdit("gender")} style={{ cursor: "pointer", marginLeft: 6 }} />}
              </Form.Label>
              <Form.Select
                name="gender"
                value={user.gender}
                onChange={handleChange}
                disabled={editingField !== "gender"}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Form.Select>

              {editingField === "gender" && (
                <div className="inline-actions" style={{ marginTop: 8 }}>
                  <Button size="sm" className="save-btn" onClick={() => handleFieldSave("gender")}>
                    Save
                  </Button>
                  <Button size="sm" className="cancel-btn ms-2" onClick={() => handleCancel("gender")}>
                    Cancel
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* CITY, STATE, PINCODE */}
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                City{" "}
                {editingField !== "city" && <PencilSquare className="edit-icon" onClick={() => startEdit("city")} style={{ cursor: "pointer", marginLeft: 6 }} />}
              </Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={user.city}
                onChange={handleChange}
                disabled={editingField !== "city"}
              />

              {editingField === "city" && (
                <div className="inline-actions" style={{ marginTop: 8 }}>
                  <Button size="sm" className="save-btn" onClick={() => handleFieldSave("city")}>
                    Save
                  </Button>
                  <Button size="sm" className="cancel-btn ms-2" onClick={() => handleCancel("city")}>
                    Cancel
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                State{" "}
                {editingField !== "state" && <PencilSquare className="edit-icon" onClick={() => startEdit("state")} style={{ cursor: "pointer", marginLeft: 6 }} />}
              </Form.Label>
              <Form.Control
                type="text"
                name="state"
                value={user.state}
                onChange={handleChange}
                disabled={editingField !== "state"}
              />

              {editingField === "state" && (
                <div className="inline-actions" style={{ marginTop: 8 }}>
                  <Button size="sm" className="save-btn" onClick={() => handleFieldSave("state")}>
                    Save
                  </Button>
                  <Button size="sm" className="cancel-btn ms-2" onClick={() => handleCancel("state")}>
                    Cancel
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>
                Pincode{" "}
                {editingField !== "pincode" && <PencilSquare className="edit-icon" onClick={() => startEdit("pincode")} style={{ cursor: "pointer", marginLeft: 6 }} />}
              </Form.Label>
              <Form.Control
                type="text"
                name="pincode"
                value={user.pincode}
                onChange={handleChange}
                disabled={editingField !== "pincode"}
              />

              {editingField === "pincode" && (
                <div className="inline-actions" style={{ marginTop: 8 }}>
                  <Button size="sm" className="save-btn" onClick={() => handleFieldSave("pincode")}>
                    Save
                  </Button>
                  <Button size="sm" className="cancel-btn ms-2" onClick={() => handleCancel("pincode")}>
                    Cancel
                  </Button>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>

        {/* EMAIL (non-editable) */}
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="text" value={user.email} disabled />
        </Form.Group>

        {/* CONTACT */}
        <Form.Group className="mb-3">
          <Form.Label>
            Contact{" "}
            {editingField !== "contact" && <PencilSquare className="edit-icon" onClick={() => startEdit("contact")} style={{ cursor: "pointer", marginLeft: 6 }} />}
          </Form.Label>
          <Form.Control
            type="text"
            name="contact"
            value={user.contact}
            onChange={handleChange}
            disabled={editingField !== "contact"}
          />

          {editingField === "contact" && (
            <div className="inline-actions" style={{ marginTop: 8 }}>
              <Button size="sm" className="save-btn" onClick={() => handleFieldSave("contact")}>
                Save
              </Button>
              <Button size="sm" className="cancel-btn ms-2" onClick={() => handleCancel("contact")}>
                Cancel
              </Button>
            </div>
          )}
        </Form.Group>

        {/* ADDRESS */}
        <Form.Group className="mb-3">
          <Form.Label>
            Address{" "}
            {editingField !== "address" && <PencilSquare className="edit-icon" onClick={() => startEdit("address")} style={{ cursor: "pointer", marginLeft: 6 }} />}
          </Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
            disabled={editingField !== "address"}
          />

          {editingField === "address" && (
            <div className="inline-actions" style={{ marginTop: 8 }}>
              <Button size="sm" className="save-btn" onClick={() => handleFieldSave("address")}>
                Save
              </Button>
              <Button size="sm" className="cancel-btn ms-2" onClick={() => handleCancel("address")}>
                Cancel
              </Button>
            </div>
          )}
        </Form.Group>
      </Card>
    </div>
  );
};

export default UserProfile;
