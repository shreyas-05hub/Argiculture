import React, { useState, useCallback } from "react";
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
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import "./UserProfile.css";

const UserProfile = () => {
  // ---- Load real logged-in user ----
  const loggedIn = JSON.parse(localStorage.getItem("loggedInUser"));
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  const realUser = allUsers.find((u) => u.email === loggedIn?.email);

  // ---- Initial User State ----
  const [user, setUser] = useState({
    name: realUser?.username || "Unknown",
    contact: realUser?.phone || realUser?.email || "",
    address: realUser?.address || "",
    profilePic: realUser?.profilePic || null,
    role: realUser?.role || "",
    acres: realUser?.acres || "",
    experience: realUser?.experience || "",
  });

  // ----- Combined Edit Mode -----
  const [editAll, setEditAll] = useState(false);
  const [tempUser, setTempUser] = useState({ ...user });

  const startEditAll = () => {
    setTempUser({ ...user });
    setEditAll(true);
  };

  const cancelEditAll = () => {
    setUser({ ...tempUser });
    setEditAll(false);
  };

  const saveEditAll = () => {
    updateLocalStorage(user);
    setEditAll(false);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ---- Update localStorage ----
  const updateLocalStorage = (updatedUser) => {
    const updatedUsers = allUsers.map((u) =>
      u.email === loggedIn.email
        ? {
            ...u,
            username: updatedUser.name,
            phone: updatedUser.contact,
            address: updatedUser.address,
            profilePic: updatedUser.profilePic,
            acres: updatedUser.acres,
            experience: updatedUser.experience,
          }
        : u
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  // ---- IMAGE CROPPING ----
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

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
    <Container className="profile-container mt-5 mb-5">
      <Card className="shadow-lg border-0 profile-card p-4">
        <Row>
          {/* LEFT SIDE */}
          <Col
            md={4}
            className="text-center border-end d-flex flex-column align-items-center justify-content-center"
          >
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
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </label>

            {user.profilePic && (
              <button
                className="btn btn-sm btn-outline-danger mt-2"
                onClick={removeImage}
              >
                <FaTrash /> Remove
              </button>
            )}

            <h5 className="text-muted mt-3">{user.name}</h5>
            <h6 className="text-secondary">{user.role}</h6>
          </Col>

          {/* RIGHT SIDE */}
          <Col md={8} className="p-4">
            <Tab.Container defaultActiveKey="profile">
              <Nav variant="tabs" className="mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="profile">Profile Info</Nav.Link>
                </Nav.Item>
              </Nav>

              {/* Edit Buttons */}
              <div className="d-flex justify-content-end mb-3">
                {!editAll ? (
                  <Button variant="warning" onClick={startEditAll}>
                    <FaEdit /> Edit All
                  </Button>
                ) : (
                  <>
                    <Button
                      className="me-2"
                      variant="success"
                      onClick={saveEditAll}
                    >
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
                    {/* NAME */}
                    <div className="info-item mt-3">
                      <h6>Name:</h6>
                      {editAll ? (
                        <Form.Control
                          type="text"
                          name="name"
                          value={user.name}
                          onChange={handleChange}
                        />
                      ) : (
                        <h5>{user.name}</h5>
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

                    {/* ------------ ROLE BASED FIELDS ------------ */}

                    {/* FARMER FIELDS ONLY */}
                    {user.role === "farmer" && (
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
                    )}

                    {/* BUYER FIELDS (You can add more later) */}
                    {user.role === "buyer" && (
                      <>
                        <div className="info-item mt-3">
                          <h6>Buyer Profile</h6>
                          <p>
                            You can add buyer fields here (GST, Company Name...)
                          </p>
                        </div>
                      </>
                    )}
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
