import React, { useState, useEffect } from "react";
import "./index.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

const AuthPanel = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("admin"); // 'admin', 'customer', 'driver'
  const [panel, setPanel] = useState("login"); // 'login', 'signup'
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Post-login state
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInRole, setLoggedInRole] = useState("");

  // States for each form
  const [signcustomerData, setsignCustomerData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [logincustomerData, setloginCustomerData] = useState({
    email: "",
    password: "",
  });
  const [logindriverData, setloginDriverData] = useState({
    email: "",
    password: "",
  });
  const [signdriverData, setsignDriverData] = useState({
    username: "",
    email: "",
    password: "",
    vehicle_id: "",
    license_plate: "",
    model: "",
    capacity: "",
  });
  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
  });

  // Reset on role/panel change
  useEffect(() => {
    if (role === "admin") setPanel("login");
    setErrors({});
    setSuccessMessage("");
  }, [role, panel]);

  // Handlers
  const handleSignCustomerChange = (e) => {
    const { name, value } = e.target;
    setsignCustomerData({ ...signcustomerData, [name]: value });
  };
  const handleLoginCustomerChange = (e) => {
    const { name, value } = e.target;
    setloginCustomerData({ ...logincustomerData, [name]: value });
  };
  const handleSignDriverChange = (e) => {
    const { name, value } = e.target;
    setsignDriverData({ ...signdriverData, [name]: value });
  };
  const handleLoginDriverChange = (e) => {
    const { name, value } = e.target;
    setloginDriverData({ ...logindriverData, [name]: value });
  };
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  // Validation
  const validate = (payload) => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!payload.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(payload.email))
      newErrors.email = "Invalid email format";

    if (!payload.password) newErrors.password = "Password is required";
    else if (payload.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (panel === "signup" && role === "customer") {
      if (!payload.username) newErrors.username = "Name is required";
    }

    if (panel === "signup" && role === "driver") {
      if (!payload.username) newErrors.username = "Name is required";
      if (!payload.vehicle_id) newErrors.vehicle_id = "Vehicle ID is required";
      if (!payload.license_plate)
        newErrors.license_plate = "License plate is required";
      if (!payload.model) newErrors.model = "Model is required";
      if (!payload.capacity) newErrors.capacity = "Capacity is required";
      else if (isNaN(payload.capacity))
        newErrors.capacity = "Capacity must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    let payload = {};
    let url = "";

    if (role === "customer" && panel === "signup") {
      payload = signcustomerData;
      url = "http://localhost:3000/api/users/register";
    } else if (role === "customer" && panel === "login") {
      payload = logincustomerData;
      url = "http://localhost:3000/api/users/login";
    } else if (role === "driver" && panel === "signup") {
      payload = signdriverData;
      url = "http://localhost:3000/api/drivers/register";
    } else if (role === "driver" && panel === "login") {
      payload = logindriverData;
      url = "http://localhost:3000/api/drivers/login";
    } else if (role === "admin" && panel === "login") {
      payload = adminData;

      // ✅ Admin special validation
      if (
        adminData.email === "venkat@gmail.com" &&
        adminData.password === "A0612"
      ) {
        navigate("/admindashboard");
        return;
      } else {
        setErrors({ password: "Invalid credentials" });
        return;
      }
    }

    if (!validate(payload)) {
      console.error("Validation failed:", errors);
      return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log('response',response)

      const data = await response.json();

      if (response.ok) {
        console.log("API Response:", data);

        setSuccessMessage(
          panel === "login"
            ? "Login successful!"
            : "Account created successfully!"
        );

        // ✅ Save userid in cookie using js-cookie
        if (role === "customer" && panel === "login" && data.userId) {
          Cookies.set('username', data.username, { expires: 50 });
          Cookies.set("userid", data.userId, { expires: 50 });
          navigate("/userdashboard");
        }
        if (role === "driver" && panel === "login" && data.driverId) {
          Cookies.set("driverid", data.driverId, { expires: 50 });
          Cookies.set('drivername', data.drivername, { expires: 50 });
          Cookies.set("vehicle_id", data.vehicle_id, { expires: 50 });
          console.log('data.vehicle_id:', data.vehicle_id);
          console.log('driver')
          navigate("/driverrequest");
        }

        setPanel("login");
        setsignCustomerData({ username: "", email: "", password: "" });
        setloginCustomerData({ email: "", password: "" });
      }

      if (panel === "login") {
        setLoggedIn(true);
        setLoggedInRole(role);
      }

    } catch (error) {
      console.error("Network Error:", error);
      alert("Network error. Please try again later.");
    }
  };

  // Render form fields
  const renderFormFields = () => {
    if (panel === "login") {
      if (role === "customer") {
        return (
          <>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={logincustomerData.email}
                onChange={handleLoginCustomerChange}
                required
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={logincustomerData.password}
                onChange={handleLoginCustomerChange}
                required
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
          </>
        );
      }

      if (role === "driver") {
        return (
          <>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={logindriverData.email}
                onChange={handleLoginDriverChange}
                required
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={logindriverData.password}
                onChange={handleLoginDriverChange}
                required
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
          </>
        );
      }

      // Admin login
      return (
        <>
          <div className="form-group">
            <label>Email or Username</label>
            <input
              type="email"
              name="email"
              value={adminData.email}
              onChange={handleAdminChange}
              required
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={adminData.password}
              onChange={handleAdminChange}
              required
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
        </>
      );
    }

    if (panel === "signup") {
      if (role === "customer") {
        return (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="username"
                value={signcustomerData.username}
                onChange={handleSignCustomerChange}
                required
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={signcustomerData.email}
                onChange={handleSignCustomerChange}
                required
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={signcustomerData.password}
                onChange={handleSignCustomerChange}
                required
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
          </>
        );
      }

      if (role === "driver") {
        return (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="username"
                value={signdriverData.username}
                onChange={handleSignDriverChange}
                required
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={signdriverData.email}
                onChange={handleSignDriverChange}
                required
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={signdriverData.password}
                onChange={handleSignDriverChange}
                required
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
            </div>
            <div className="form-group">
              <label>Vehicle ID</label>
              <input
                type="text"
                name="vehicle_id"
                value={signdriverData.vehicle_id}
                onChange={handleSignDriverChange}
                required
              />
              {errors.vehicle_id && (
                <span className="error-message">{errors.vehicle_id}</span>
              )}
            </div>
            <div className="form-group">
              <label>License Plate</label>
              <input
                type="text"
                name="license_plate"
                value={signdriverData.license_plate}
                onChange={handleSignDriverChange}
                required
              />
              {errors.license_plate && (
                <span className="error-message">{errors.license_plate}</span>
              )}
            </div>
            <div className="form-group">
              <label>Vehicle Model</label>
              <input
                type="text"
                name="model"
                value={signdriverData.model}
                onChange={handleSignDriverChange}
                required
              />
              {errors.model && (
                <span className="error-message">{errors.model}</span>
              )}
            </div>
            <div className="form-group">
              <label>Capacity (kg)</label>
              <input
                type="number"
                name="capacity"
                value={signdriverData.capacity}
                onChange={handleSignDriverChange}
                required
              />
              {errors.capacity && (
                <span className="error-message">{errors.capacity}</span>
              )}
            </div>
          </>
        );
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="role-selector" role="tablist">
        {["Admin", "Customer", "Driver"].map((r) => (
          <button
            key={r}
            role="tab"
            aria-selected={role === r.toLowerCase()}
            className={`role-tab ${role === r.toLowerCase() ? "active" : ""}`}
            onClick={() => setRole(r.toLowerCase())}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="auth-card">
        <img
          src="https://res.cloudinary.com/dwatnpdcy/image/upload/v1758346988/Gemini_Generated_Image_tb7d7qtb7d7qtb7d_bxxs3t.png"
          alt="Auth Icon"
          className="Logo"
        />
        <h1 className="auth-heading">
          {panel === "login" ? "Login to" : "Create an Account with"} Drivio
        </h1>
        <p className="auth-subheading">
          {panel === "login"
            ? "Enter your credentials to access your account."
            : `Signing up as a ${role}.`}
        </p>

        {role !== "admin" && !loggedIn && (
          <div className="panel-tabs">
            <button
              className={`panel-tab ${panel === "login" ? "active" : ""}`}
              onClick={() => setPanel("login")}
            >
              Login
            </button>
            <button
              className={`panel-tab ${panel === "signup" ? "active" : ""}`}
              onClick={() => setPanel("signup")}
            >
              Sign Up
            </button>
          </div>
        )}

        {loggedIn ? (
          <div className="post-login-panel">
            <h2>Welcome, {loggedInRole}!</h2>
            <p>You are now logged in.</p>
            <button
              className="submit-btn"
              onClick={() => {
                setLoggedIn(false);
                setPanel("login");
                setRole(loggedInRole);
              }}
            >
              Logout
            </button>

            {loggedInRole === "customer" && (
              <form>
                <h3>Customer Dashboard</h3>
                <p>Here you can add customer-specific actions</p>
              </form>
            )}
            {loggedInRole === "driver" && (
              <form>
                <h3>Driver Dashboard</h3>
                <p>Here you can add driver-specific actions</p>
              </form>
            )}
            {loggedInRole === "admin" && (
              <form>
                <h3>Admin Dashboard</h3>
                <p>Here you can add admin-specific actions</p>
              </form>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {renderFormFields()}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            <button type="submit" className="submit-btn">
              {panel === "login" ? "Login" : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPanel;
