import React, { useState, useCallback, useEffect } from "react";
import { Container, Row, Col, Card, Tab, Nav, Form, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import "./UserProfile.css";

const UserProfile = () => {
  // ---- Load real logged-in user from signup ----
  const loggedIn = JSON.parse(localStorage.getItem("loggedInUser"));
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  const realUser = allUsers.find((u) => u.email === loggedIn?.email);

  // ---- Initial State ----
  const [user, setUser] = useState({
    name: realUser?.username || "Unknown",
    phone: realUser?.email || "Not Available",
    address: realUser?.address || "",
    profilePic: realUser?.profilePic || null,
    role: realUser?.role || "farmer",
  });

  const [editing, setEditing] = useState({
    name: false,
    phone: false,
    address: false,
  });

  // IMAGE CROPPING STATES
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleEditToggle = (field) => {
    setEditing({ ...editing, [field]: !editing[field] });
  };

  const handleChange = (e) => {
    const updated = { ...user, [e.target.name]: e.target.value };
    setUser(updated);
    updateLocalStorage(updated);
  };

  // ---- Update in localStorage.users ----
  const updateLocalStorage = (updatedUser) => {
    const updatedUsers = allUsers.map((u) =>
      u.email === loggedIn.email
        ? { ...u, username: updatedUser.name, email: updatedUser.phone, address: updatedUser.address, profilePic: updatedUser.profilePic }
        : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  // ---- When selecting a new file ----
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const saveCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const updatedUser = { ...user, profilePic: croppedImage };
      setUser(updatedUser);
      updateLocalStorage(updatedUser);
      setShowCropper(false);
    } catch (error) {
      console.error(error);
    }
  };

  const removeImage = () => {
    const updatedUser = { ...user, profilePic: null };
    setUser(updatedUser);
    updateLocalStorage(updatedUser);
  };

  return (
    <Container className="profile-container mt-5">
      <Card className="shadow-lg border-0 profile-card p-4">
        <Row>

          {/* LEFT SIDE */}
          <Col md={4} className="text-center border-end d-flex flex-column align-items-center justify-content-center">

            {/* Profile Picture or Avatar */}
            <img
              src={
                user.profilePic ||
                `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`
              }
              alt="User"
              className="profile-pic mb-3"
            />

            <label className="btn btn-sm btn-primary mt-2">
              Upload Image
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>

            {user.profilePic && (
              <button className="btn btn-sm btn-outline-danger mt-2" onClick={removeImage}>
                <FaTrash /> Remove
              </button>
            )}

            <h5 className="text-muted mt-3">{user.name}</h5>
          </Col>

          {/* RIGHT SIDE */}
          <Col md={8} className="p-4">
            <Tab.Container defaultActiveKey="profile">
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="profile">Profile Info</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="profile">
                  <div className="user-info">

                    {/* NAME */}
                    <div className="info-item d-flex justify-content-between align-items-center">
                      {editing.name ? (
                        <Form.Control
                          type="text"
                          name="name"
                          value={user.name}
                          onChange={handleChange}
                          onBlur={() => handleEditToggle("name")}
                          autoFocus
                        />
                      ) : (
                        <h5>
                          {user.name}
                          <FaEdit className="edit-icon" onClick={() => handleEditToggle("name")} />
                        </h5>
                      )}
                    </div>

                    {/* EMAIL AS PHONE */}
                    <div className="info-item d-flex justify-content-between align-items-center mt-3">
                      <h6>📧 {user.phone}</h6>
                    </div>

                    {/* ADDRESS */}
                    <div className="info-item d-flex justify-content-between align-items-center mt-3">
                      {editing.address ? (
                        <Form.Control
                          type="text"
                          name="address"
                          value={user.address}
                          onChange={handleChange}
                          onBlur={() => handleEditToggle("address")}
                          autoFocus
                        />
                      ) : (
                        <h6>
                          🏠 {user.address || "No address added"}
                          <FaEdit className="edit-icon" onClick={() => handleEditToggle("address")} />
                        </h6>
                      )}
                    </div>

                    {/* ROLE (Readonly) */}
                    <div className="info-item mt-3">
                      <h6>👤 Role: {user.role}</h6>
                    </div>

                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Card>

      {/* IMAGE CROPPER MODAL */}
      {showCropper && (
        <div className="cropper-modal">
          <div className="cropper-box">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />

            <div className="crop-controls">
              <Button variant="success" onClick={saveCroppedImage}>Save</Button>
              <Button variant="danger" onClick={() => setShowCropper(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default UserProfile;
