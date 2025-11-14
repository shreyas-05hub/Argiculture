import React, { useState, useCallback } from "react";
import { Container, Row, Col, Card, Tab, Nav, Form, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage"; 
import "./UserProfile.css";

const UserProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("userProfile"));

  const [user, setUser] = useState(
    storedUser || {
      name: "Shreyas Kandekar",
      phone: "+91 9876543210",
      address: "",
      profilePic: null,
    }
  );

  const [editing, setEditing] = useState({
    name: false,
    phone: false,
    address: false,
  });

  // ---- IMAGE CROP STATES ----
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleEditToggle = (field) => {
    setEditing({ ...editing, [field]: !editing[field] });
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    saveToLocal({ ...user, [e.target.name]: e.target.value });
  };

  // Save to localStorage
  const saveToLocal = (data) => {
    localStorage.setItem("userProfile", JSON.stringify(data));
  };

  // When selecting a file
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

  // Save the cropped image
  const saveCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      const updatedUser = { ...user, profilePic: croppedImage };
      setUser(updatedUser);
      saveToLocal(updatedUser);
      setShowCropper(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Remove Image
  const removeImage = () => {
    const updatedUser = { ...user, profilePic: null };
    setUser(updatedUser);
    saveToLocal(updatedUser);
  };

  return (
    <Container className="profile-container mt-5">
      <Card className="shadow-lg border-0 profile-card p-4">
        <Row>
          {/* LEFT SIDE */}
          <Col md={4} className="text-center border-end d-flex flex-column align-items-center justify-content-center">

            {/* Profile Image */}
            <img
              src={
                user.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="User"
              className="profile-pic mb-3"
            />

            {/* Upload Button */}
            <label className="btn btn-sm btn-primary mt-2">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </label>

            {/* Remove Button */}
            {user.profilePic && (
              <button className="btn btn-sm btn-outline-danger mt-2" onClick={removeImage}>
                <FaTrash /> Remove
              </button>
            )}

            <h5 className="text-muted mt-3">{user.name || "Name not added"}</h5>
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

                    {/* PHONE */}
                    <div className="info-item d-flex justify-content-between align-items-center mt-3">
                      {editing.phone ? (
                        <Form.Control
                          type="text"
                          name="phone"
                          value={user.phone}
                          onChange={handleChange}
                          onBlur={() => handleEditToggle("phone")}
                          autoFocus
                        />
                      ) : (
                        <h6>
                          📞 {user.phone}
                          <FaEdit className="edit-icon" onClick={() => handleEditToggle("phone")} />
                        </h6>
                      )}
                    </div>

                    {/* ADDRESS */}
                    <div className="info-item d-flex justify-content-between align-items-center mt-3">
                      {editing.address ? (
                        <Form.Control
                          type="text"
                          name="address"
                          value={user.address}
                          placeholder="Enter address"
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
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Card>

      {/* CROPPER MODAL */}
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
              <Button variant="success" onClick={saveCroppedImage}>
                Save
              </Button>
              <Button variant="danger" onClick={() => setShowCropper(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default UserProfile;
