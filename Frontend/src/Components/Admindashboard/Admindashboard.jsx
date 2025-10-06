import React, { useEffect, useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router';

const FleetManager = () => {
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [unverifiedDrivers, setUnverifiedDrivers] = useState([]);
  const [showDeliveries, setShowDeliveries] = useState(false);
  const [showVerifyDrivers, setShowVerifyDrivers] = useState(false);
  const navigate = useNavigate();

  // Fetch all drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('https://drivio-1uea.onrender.com/api/drivers/all');
        const data = await response.json();
        if (response.ok) setDrivers(data.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
    fetchDrivers();
  }, []);

  // Fetch unverified drivers
  useEffect(() => {
    const fetchUnverifiedDrivers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/drivers/unverified');
        const data = await response.json();
        if (response.ok) setUnverifiedDrivers(data.data);
      } catch (error) {
        console.error('Error fetching unverified drivers:', error);
      }
    };
    fetchUnverifiedDrivers();
  }, []);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('https://drivio-1uea.onrender.com/api/users/all');
        const data = await response.json();
        if (response.ok) setCustomers(data.users);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  // Fetch deliveries
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch('https://drivio-1uea.onrender.com/api/deliveries/all');
        const data = await response.json();
        if (response.ok) setDeliveries(data.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };
    fetchDeliveries();
  }, []);

  // Verify driver
  const handleVerifyDriver = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/drivers/acceptverify/${driverId}`, {
        method: 'PATCH',
      });
      const data = await response.json();
      if (response.ok) {
        alert(`Driver verified successfully!`);
        setUnverifiedDrivers(unverifiedDrivers.filter(driver => driver._id !== driverId));
      } else {
        alert(data.message || 'Failed to verify driver');
      }
    } catch (error) {
      console.error('Error verifying driver:', error);
      alert('Network error');
    }
  };

  // Delete driver
  const handleDeleteDriver = async (driverId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/drivers/delete/${driverId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log('Driver deleted successfully:', data);
      if (response.ok) {
        alert('Driver deleted successfully!');
        setUnverifiedDrivers(unverifiedDrivers.filter(driver => driver._id !== driverId));
      } else {
        alert(data.message || 'Failed to delete driver');
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Network error');
    }
  };

  const formatDateTime = (dateString) =>
    dateString ? new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : '—';

  return (
    <div className="fleet-manager">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Fleet Manager</h2>
          <p className="sidebar-subtitle">Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          <div
            className={`nav-item ${!showDeliveries && !showVerifyDrivers ? 'active' : ''}`}
            onClick={() => { setShowDeliveries(false); setShowVerifyDrivers(false); }}
          >
            <span className="nav-icon">🚛</span>
            <span className="nav-text">Drivers & Customers</span>
          </div>
          <div
            className={`nav-item ${showDeliveries ? 'active' : ''}`}
            onClick={() => { setShowDeliveries(true); setShowVerifyDrivers(false); }}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Deliveries</span>
          </div>
          <div
            className={`nav-item ${showVerifyDrivers ? 'active' : ''}`}
            onClick={() => { setShowDeliveries(false); setShowVerifyDrivers(true); }}
          >
            <span className="nav-icon">✅</span>
            <span className="nav-text">Verify Drivers</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/')}>
            <span className="nav-icon"></span>
            <span className="nav-text">Logout</span>
          </div>
        </nav>
      </div>

      <div className="main-content">
        {!showDeliveries && !showVerifyDrivers ? (
          <>
            {/* Drivers Table */}
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
                    {drivers.map(driver => (
                      <tr key={driver._id}>
                        <td>{driver.username}</td>
                        <td>{driver.email}</td>
                        <td>
                          <span className={`status-badge ${driver.status === 'available' ? 'available' : 'unavailable'}`}>
                            {driver.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Customers Table */}
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
                    {customers.map(customer => (
                      <tr key={customer._id}>
                        <td>{customer.username}</td>
                        <td>{customer.email}</td>
                        <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                        <td><span className="status-badge active">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : showDeliveries ? (
          <>
            {/* Deliveries Table */}
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
                    {deliveries.map(delivery => (
                      <tr key={delivery._id}>
                        <td>{delivery.pickup_location}</td>
                        <td>{delivery.dropoff_location}</td>
                        <td>{delivery.vehicle_id || '—'}</td>
                        <td>{formatDateTime(delivery.scheduled_pickup_time)}</td>
                        <td>{formatDateTime(delivery.scheduled_dropoff_time)}</td>
                        <td>
                          <span className={`status-badge ${delivery.status === 'pending' ? 'pending' : 'on-route'}`}>
                            {delivery.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* Verify & Delete Drivers Table */}
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
                    {unverifiedDrivers.map(driver => (
                      <tr key={driver._id}>
                        <td>{driver.username}</td>
                        <td>{driver.email}</td>
                        <td>{driver.vehicle_id}</td>
                        <td>
                          <button className="submit-btn" onClick={() => handleVerifyDriver(driver._id)}>Verify</button>
                        </td>
                        <td>
                          <button className="delete-btn" onClick={() => handleDeleteDriver(driver._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default FleetManager;
