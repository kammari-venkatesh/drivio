import React, { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router";

const SignUpPanel = () => {
  const [role, setRole] = useState("customer"); // only customer or driver
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    vehicle_id: "",
    license_plate: "",
    model: "",
    capacity: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  let url = "";

  if (role === "customer") {
    url = "https://drivio-1uea.onrender.com/api/users/register";
  } else if (role === "driver") {
    url = "https://drivio-1uea.onrender.com/api/drivers/register";
  }

  // ✅ Add isVerified = false only for driver
  const payload = role === "driver" 
    ? { ...formData, isVerified: false } 
    : formData;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Account created successfully!");
      console.log(data);
      setFormData({
        username: "",
        email: "",
        password: "",
        vehicle_id: "",
        license_plate: "",
        model: "",
        capacity: "",
      });
      navigate("/login"); // redirect to login after signup
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  }
};

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-heading">Create an Account</h1>
        <p className="auth-subheading">Sign up as a {role}</p>

        <div className="role-selector">
          <button
            className={`role-tab ${role === "customer" ? "active" : ""}`}
            onClick={() => setRole("customer")}
          >
            User
          </button>
          <button
            className={`role-tab ${role === "driver" ? "active" : ""}`}
            onClick={() => setRole("driver")}
          >
            Driver
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {role === "driver" && (
            <>
              <div className="form-group">
                <label>Vehicle ID</label>
                <input
                  type="text"
                  name="vehicle_id"
                  value={formData.vehicle_id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>License Plate</label>
                <input
                  type="text"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vehicle Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Capacity (kg)</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <button type="submit" className="submit-btn">Sign Up</button>
        </form>

        {/* Toggle link */}
        <p className="toggle-text">
          Already have an account?{" "}
          <span
            className="toggle-link"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPanel;
