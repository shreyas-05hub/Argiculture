import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";

const UserProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const userId = storedUser.id;

  const [editAll, setEditAll] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    address: "",
    email: "",
    profilePic: "",
  });

  useEffect(() => {
    setUser({
      firstName: storedUser.first_name || "",
      lastName: storedUser.last_name || "",
      contact: storedUser.mobile_no || "",
      address: storedUser.address || "",
      email: storedUser.email || "",
      profilePic: storedUser.profile_picture || "",
    });
  }, []);

  // ---------------- IMAGE CHANGE ----------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setUser((prev) => ({
        ...prev,
        profilePic: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ---------------- INPUT TEXT CHANGE ----------------
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ---------------- SAVE PROFILE ----------------
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("first_name", user.firstName);
      formData.append("last_name", user.lastName);
      formData.append("mobile_no", user.contact);
      formData.append("address", user.address);

      // Only send image if user selected new one
      if (selectedImageFile) {
        formData.append("profile_picture", selectedImageFile);
      }

      const response = await axios.post(
        `http://127.0.0.1:8000/api/update-profile/${userId}/`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedPic = response.data.profile_picture;

      // Update localStorage
      let updatedUser = {
        ...storedUser,
        first_name: user.firstName,
        last_name: user.lastName,
        mobile_no: user.contact,
        address: user.address,
        profile_picture: updatedPic,
      };

      localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      // Update UI
      setUser((prev) => ({
        ...prev,
        profilePic: updatedPic,
      }));

      alert("Profile Updated Successfully!");
      setEditAll(false);
    } catch (error) {
      console.error("Update Error", error);
      alert("Update failed");
    }
  };
  console.log("USER PROFILE RENDER", user);
  return (
    <div className="container mt-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-3">User Profile</h3>

        <Row>
          <Col md={4} className="text-center">
            <div className="mb-3">
              {user.profilePic ? (
               <img
  src={
    user.profilePic
      ? user.profilePic.startsWith("http")
        ? user.profilePic
        : `http://127.0.0.1:8000${user.profilePic}`
      : null
  }
  alt="Profile"
  style={{
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ccc",
  }}
/>

              ) : (
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #ccc",
                  }}
                >
                  No Image
                </div>
              )}
            </div>

            {editAll && (
              <input type="file" accept="image/*" onChange={handleImageChange} />
            )}
          </Col>

          <Col md={8}>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleChange}
                      disabled={!editAll}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleChange}
                      disabled={!editAll}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" value={user.email} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contact</Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  value={user.contact}
                  onChange={handleChange}
                  disabled={!editAll}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  disabled={!editAll}
                />
              </Form.Group>

              {!editAll ? (
                <Button variant="primary" onClick={() => setEditAll(true)}>
                  Edit All
                </Button>
              ) : (
                <div>
                  <Button variant="success" onClick={handleSave}>
                    Save All
                  </Button>
                  <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={() => setEditAll(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </Form>
          </Col>
        </Row>
      </Card> 
    </div>
  );
};

export default UserProfile;
