import React, { useState } from "react";
import "./index.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

const LoginPanel = () => {
  const [role, setRole] = useState("customer"); 
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = "";

    if (role === "customer") {
      url = "https://drivio-1uea.onrender.com/api/users/login";
    } else if (role === "driver") {
      url = "https://drivio-1uea.onrender.com/api/drivers/login";
    } else if (role === "admin") {
      if (formData.email === "venkat@gmail.com" && formData.password === "A0612") {
        navigate("/admindashboard");
        return;
      } else {
        alert("Invalid Admin Credentials");
        return;
      }
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        if (role === "customer") {
          Cookies.set("userid", data.userId, { expires: 50 });
          navigate("/userdashboard");
        } else if (role === "driver") {
          Cookies.set("driverid", data.driverId, { expires: 50 });
          navigate("/driverrequest");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-heading">Login</h1>
        <p className="auth-subheading">Select role and login to Drivio</p>

        <div className="form-group">
     <label htmlFor="role">Role</label>
<select
  id="role"
  className="custom-select"
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  <option value="admin">Admin</option>
  <option value="customer">User</option>
  <option value="driver">Driver</option>
</select>

        </div>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="submit-btn">Login</button>
        </form>

        {/* Toggle link */}
        <p className="toggle-text">
          Don’t have an account?{" "}
          <span
            className="toggle-link"
            onClick={() => navigate("/")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPanel;
