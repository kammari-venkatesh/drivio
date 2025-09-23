import React, { useState, useEffect } from "react";
import "./index.css";
import Cookies from "js-cookie";

// --- SVG Icons ---
const DeliveriesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="icon">
    <path d="M5 18H3c-1.1 0-2-.9-2 2V8c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v1" />
    <path d="M14 17c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
    <path d="M21 17c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
    <path d="M11 12H3C1.9 12 1 11.1 1 10V8" />
    <path d="m17 12 1.3-1.3c.4-.4.4-1 0-1.4l-2.6-2.6c-.4-.4-1-.4-1.4 0L13 8" />
    <path d="m15 10-2.3-2.3" />
    <path d="M21 8h-3" />
  </svg>
);

const ReportsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="icon">
    <path d="M8 6h13" />
    <path d="M8 12h13" />
    <path d="M8 18h13" />
    <path d="M3 6h.01" />
    <path d="M3 12h.01" />
    <path d="M3 18h.01" />
  </svg>
);

// --- Components ---
const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-header profile-box">
      <img
        src="https://via.placeholder.com/48"
        alt="Profile"
        className="profile-img"
      />
      <div>
        <h2 className="sidebar-title">John Doe</h2>
        <p className="sidebar-subtitle">Fleet Manager</p>
      </div>
    </div>
    <nav className="sidebar-nav">
      <a href="#" className="nav-item active">
        <DeliveriesIcon />
        <span>Deliveries</span>
      </a>
      <a href="#" className="nav-item">
        <ReportsIcon />
        <span>Reports</span>
      </a>
    </nav>
  </aside>
);

const DeliveryLoader = ({ onBack }) => (
  <div className="card delivery-planner">
    <div className="delivery-loader">
      <div className="loader-animation">
        <div className="truck-container">
          <svg className="truck-icon" viewBox="0 0 100 60" fill="none">
            <rect x="10" y="20" width="50" height="25" rx="3" fill="#3b82f6" />
            <rect x="60" y="25" width="25" height="20" rx="2" fill="#3b82f6" />
            <circle cx="25" cy="50" r="8" fill="#1f2937" />
            <circle cx="75" cy="50" r="8" fill="#1f2937" />
            <circle cx="25" cy="50" r="4" fill="#6b7280" />
            <circle cx="75" cy="50" r="4" fill="#6b7280" />
            <rect x="15" y="25" width="8" height="6" fill="white" opacity="0.9" />
            <rect x="25" y="25" width="8" height="6" fill="white" opacity="0.9" />
            <rect x="35" y="25" width="8" height="6" fill="white" opacity="0.9" />
          </svg>
          <div className="road-lines">
            <div className="road-line"></div>
            <div className="road-line"></div>
            <div className="road-line"></div>
          </div>
        </div>
        
        <div className="spinner-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      
      <div className="loader-content">
        <h3 className="loader-title">Finding Your Perfect Match!</h3>
        <p className="loader-message">
          🔍 Searching for the best delivery partner near you...
        </p>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      
      <button 
        onClick={onBack} 
        className="btn btn-secondary loader-back-btn"
      >
        Cancel & Go Back
      </button>
    </div>
  </div>
);

const DeliveryPlanner = ({ pickup, setPickup, drop, setDrop, vehicle, setVehicle, onCreate, isLoading, onBack }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (pickup && drop && vehicle) {
      const newDelivery = {
        customer_id: Cookies.get("userid") || "",
        driver_id: "",
        vehicle_id: vehicle,
        pickup_location: pickup,
        dropoff_location: drop,
        status: "pending",
      };
      onCreate(newDelivery);
    } else {
      alert("Please fill all fields before creating a delivery.");
    }
  };

  // Show loader instead of form when loading
  if (isLoading) {
    return <DeliveryLoader onBack={onBack} />;
  }

  return (
    <div className="card delivery-planner">
      <h3 className="card-title">Delivery Planner</h3>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Pickup Location"
            className="form-input"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Drop Location"
            className="form-input"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Vehicle Type"
            className="form-input"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Delivery
        </button>
      </form>
    </div>
  );
};

const DriverStatus = ({ status }) => {
  let statusClass = "";
  if (status === "available") statusClass = "status-available";
  else if (status === "on-route") statusClass = "status-on-route";
  else statusClass = "status-unavailable";

  return <span className={`status-pill ${statusClass}`}>{status}</span>;
};

const AvailableDrivers = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/drivers/available", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDrivers(Array.isArray(data.drivers) ? data.drivers : []);
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  return (
    <div className="drivers-container">
      <h2 className="drivers-title">🚚 Available Drivers</h2>
      <div className="table-wrapper">
        <table className="drivers-table">
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Driver Name</th>
              <th>License Plate</th>
              <th>Model</th>
              <th>Capacity (kg)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length > 0 ? (
              drivers.map((driver, index) => (
                <tr key={index}>
                  <td>{driver.vehicle_id}</td>
                  <td>{driver.username}</td>
                  <td>{driver.license_plate}</td>
                  <td>{driver.model}</td>
                  <td>{driver.capacity}</td>
                  <td>
                    <DriverStatus status={driver.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No drivers available 🚫
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ConflictDetection = () => (
  <div className="card conflict-detection">
    <h3 className="card-title warning-title">Conflict Detection Warning</h3>
    <p className="warning-text">
      Warning: Driver Alex and Vehicle Truck 1 are double-booked for the selected time.
      Please resolve the conflict before proceeding.
    </p>
  </div>
);

const UserDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateDelivery = async (delivery) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:3000/api/deliveries/setdelivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({
          pickup_location: pickup,
          dropoff_location: drop,
          customer_id: Cookies.get("userid") || "",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDeliveries([...deliveries, data]);
        console.log("Delivery created:", data);
        
        // Keep loading for a bit longer to show the animation
        setTimeout(() => {
          setIsLoading(false);
          alert(
            `Delivery Created Successfully!\nPickup: ${delivery.pickup_location}\nDrop: ${delivery.dropoff_location}\nVehicle: ${delivery.vehicle_id}`
          );
          setPickup("");
          setDrop("");
          setVehicle("");
        }, 3000); // Show loader for 3 seconds
      } else {
        setIsLoading(false);
        alert("Failed to create delivery. Please try again.");
      }
    } catch (error) {
      console.error("Error creating delivery:", error);
      setIsLoading(false);
      alert("Error creating delivery. Please check your connection and try again.");
    }
  };

  const handleBackToForm = () => {
    setIsLoading(false);
    // Reset form values if needed
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content">
        <header className="main-header">
          <h1 className="dashboard-title">Dashboard</h1>
        </header>
        <div className="dashboard-grid">
          <div className="grid-left">
            <DeliveryPlanner
              pickup={pickup}
              setPickup={setPickup}
              drop={drop}
              setDrop={setDrop}
              vehicle={vehicle}
              setVehicle={setVehicle}
              onCreate={handleCreateDelivery}
              isLoading={isLoading}
              onBack={handleBackToForm}
            />
            <ConflictDetection />
          </div>
          <div className="grid-right">
            <AvailableDrivers />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;