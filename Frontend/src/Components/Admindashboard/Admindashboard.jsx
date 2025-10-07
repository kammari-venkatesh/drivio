// src/components/FleetManager.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import "./index.css";

const FleetManager = () => {
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [unverifiedDrivers, setUnverifiedDrivers] = useState([]);
  const [customerRequests, setCustomerRequests] = useState([]);
  const [showDeliveries, setShowDeliveries] = useState(false);
  const [showVerifyDrivers, setShowVerifyDrivers] = useState(false);
  const [showCustomerRequests, setShowCustomerRequests] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestActionLoading, setRequestActionLoading] = useState({});
  


  const navigate = useNavigate();

  // --- Fetch data on mount ---
  useEffect(() => {
    fetchDrivers();
    fetchUnverifiedDrivers();
    fetchCustomers();
    fetchCustomerRequests();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await fetch(
        "https://drivio-1uea.onrender.com/api/drivers/all"
      );
      const data = await res.json();
      if (res.ok) setDrivers(data.data);
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  const fetchUnverifiedDrivers = async () => {
    try {
      const res = await fetch(
        "https://drivio-1uea.onrender.com/api/drivers/unverified"
      );
      const data = await res.json();
      if (res.ok) setUnverifiedDrivers(data.data);
    } catch (err) {
      console.error("Error fetching unverified drivers:", err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch(
        "https://drivio-1uea.onrender.com/api/users/all"
      );
      const data = await res.json();
      if (res.ok) setCustomers(data.users);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const fetchCustomerRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await fetch(
        "http://localhost:3000/api/requests/pending",
        { headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      if (res.ok) {
        const data = await res.json();
  
        setCustomerRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Error fetching customer requests:", err);
    } finally {
      setRequestsLoading(false);
    }
  };

  // --- Driver actions ---
  const handleVerifyDriver = async (driverId) => {
    try {
      const res = await fetch(
        `https://drivio-1uea.onrender.com/api/drivers/acceptverify/${driverId}`,
        { method: "PATCH" }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Driver verified successfully!");
        setUnverifiedDrivers((prev) =>
          prev.filter((driver) => driver._id !== driverId)
        );
      } else {
        alert(data.message || "Failed to verify driver");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  const handleDeleteDriver = async (driverId) => {
    try {
      const res = await fetch(
        `https://drivio-1uea.onrender.com/api/drivers/delete/${driverId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Driver deleted successfully!");
        setUnverifiedDrivers((prev) =>
          prev.filter((driver) => driver._id !== driverId)
        );
      } else {
        alert(data.message || "Failed to delete driver");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  // --- Customer Request actions ---
  const handleAcceptRequest = async (request) => {
    setRequestActionLoading((prev) => ({ ...prev, [request._id]: true }));
    try {
      console.log("handleaccept working on request",request)
      const res = await fetch(
        "https://drivio-1uea.onrender.com/api/deliveries/setdelivery",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            pickup_location: request.pickup_location,
            dropoff_location: request.dropoff_location,
            customer_id: request.customer_id,
            vehicle_id: request.vehicle_type || "",
          }),
        }
      );

      if (res.ok) {

        // Remove request after creating delivery
        await fetch(
          `http://localhost:3000/api/requests/delete/${request._id}`,
          { method: "DELETE", headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
        );

        setCustomerRequests((prev) =>
          prev.filter((r) => r._id !== request._id)
        );
      }
    } catch (err) {
      console.error("Error accepting request:", err);
    } finally {
      setRequestActionLoading((prev) => ({ ...prev, [request._id]: false }));
    }
  };

  const handleDeleteRequest = async (id) => {
    setRequestActionLoading((prev) => ({ ...prev, [id]: true }));
    console.log("delete id",id)
    try {
      const res = await fetch(
        `http://localhost:3000/api/requests/delete/${id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${Cookies.get("token")}` } }
      );
      if (res.ok) {
        setCustomerRequests((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error("Error deleting request:", err);
    } finally {
      setRequestActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const formatDateTime = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  return (
    <div className="fleet-manager">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Fleet Manager</h2>
          <p className="sidebar-subtitle">Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          <div
            className={`nav-item ${
              !showDeliveries && !showVerifyDrivers && !showCustomerRequests
                ? "active"
                : ""
            }`}
            onClick={() => {
              setShowDeliveries(false);
              setShowVerifyDrivers(false);
              setShowCustomerRequests(false);
            }}
          >
            <span className="nav-icon">🚛</span>
            <span className="nav-text">Drivers & Customers</span>
          </div>
          <div
            className={`nav-item ${showDeliveries ? "active" : ""}`}
            onClick={() => {
              setShowDeliveries(true);
              setShowVerifyDrivers(false);
              setShowCustomerRequests(false);
            }}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Deliveries</span>
          </div>
          <div
            className={`nav-item ${showVerifyDrivers ? "active" : ""}`}
            onClick={() => {
              setShowDeliveries(false);
              setShowVerifyDrivers(true);
              setShowCustomerRequests(false);
            }}
          >
            <span className="nav-icon">✅</span>
            <span className="nav-text">Verify Drivers</span>
          </div>
          <div
            className={`nav-item ${showCustomerRequests ? "active" : ""}`}
            onClick={() => {
              setShowDeliveries(false);
              setShowVerifyDrivers(false);
              setShowCustomerRequests(true);
            }}
          >
            <span className="nav-icon">📨</span>
            <span className="nav-text">Customer Requests</span>
          </div>
          <div className="nav-item" onClick={() => navigate("/")}>
            <span className="nav-text">Logout</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Drivers & Customers */}
        {!showDeliveries && !showVerifyDrivers && !showCustomerRequests && (
          <>
            {/* Drivers */}
            <section className="drivers-section">
              <h1 className="section-title">Driver Management</h1>
              <div className="table-container">
                <table className="drivers-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((driver) => (
                      <tr key={driver._id}>
                        <td>{driver.username}</td>
                        <td>{driver.email}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              driver.status === "available"
                                ? "available"
                                : "unavailable"
                            }`}
                          >
                            {driver.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Customers */}
            <section className="customers-section">
              <h1 className="section-title">Customer Management</h1>
              <div className="table-container">
                <table className="customers-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>JOINED DATE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer._id}>
                        <td>{customer.username}</td>
                        <td>{customer.email}</td>
                        <td>
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <span className="status-badge active">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* Deliveries */}
        {showDeliveries && (
          <section className="deliveries-section">
            <h1 className="section-title">Deliveries</h1>
            <div className="table-container">
              <table className="deliveries-table professional">
                <thead>
                  <tr>
                    <th>PICKUP</th>
                    <th>DROPOFF</th>
                    <th>VEHICLE</th>
                    <th>SCHEDULED PICKUP</th>
                    <th>SCHEDULED DROPOFF</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map((delivery) => (
                    <tr key={delivery._id}>
                      <td>{delivery.pickup_location}</td>
                      <td>{delivery.dropoff_location}</td>
                      <td>{delivery.vehicle_id || "—"}</td>
                      <td>{formatDateTime(delivery.scheduled_pickup_time)}</td>
                      <td>{formatDateTime(delivery.scheduled_dropoff_time)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            delivery.status === "pending"
                              ? "pending"
                              : "on-route"
                          }`}
                        >
                          {delivery.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Verify Drivers */}
        {showVerifyDrivers && (
          <section className="verify-drivers-section">
            <h1 className="section-title">Verify / Delete Drivers</h1>
            <div className="table-container">
              <table className="drivers-table">
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>VEHICLE ID</th>
                    <th>ACTION</th>
                    <th>DELETE</th>
                  </tr>
                </thead>
                <tbody>
                  {unverifiedDrivers.map((driver) => (
                    <tr key={driver._id}>
                      <td>{driver.username}</td>
                      <td>{driver.email}</td>
                      <td>{driver.vehicle_id}</td>
                      <td>
                        <button
                          className="submit-btn"
                          onClick={() => handleVerifyDriver(driver._id)}
                        >
                          Verify
                        </button>
                      </td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteDriver(driver._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Customer Requests */}
        {showCustomerRequests && (
          <section className="customer-requests-section">
            <h1 className="section-title">Customer Delivery Requests</h1>
            <div className="table-container">
              {requestsLoading ? (
                <p>Loading requests...</p>
              ) : customerRequests.length === 0 ? (
                <p>No pending requests.</p>
              ) : (
                <table className="deliveries-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Pickup</th>
                      <th>Dropoff</th>
                      <th>Vehicle</th>
                      <th>Accept</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerRequests.map((request) => (
                      <tr key={request._id}>
                        <td>{request.customer_id}</td>
                        <td>{request.pickup_location}</td>
                        <td>{request.dropoff_location}</td>
                        <td>{request.vehicle_type || "-"}</td>
                        <td>
                          <button
                            className="submit-btn"
                            disabled={requestActionLoading[request._id]}
                            onClick={() => handleAcceptRequest(request)}
                          >
                            {requestActionLoading[request._id]
                              ? "Processing..."
                              : "Accept"}
                          </button>
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            disabled={requestActionLoading[request._id]}
                            onClick={() => handleDeleteRequest(request._id)}
                          >
                            {requestActionLoading[request._id]
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default FleetManager;
