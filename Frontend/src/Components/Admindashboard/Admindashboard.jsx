import React, { useEffect, useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router';

const FleetManager = () => {
  const [drivers, setDrivers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [showDeliveries, setShowDeliveries] = useState(false);
    const navigate = useNavigate();
  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/drivers/all');
        const data = await response.json();
        if (response.ok) setDrivers(data.data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };
    fetchDrivers();
  }, []);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/all');
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
        const response = await fetch('http://localhost:3000/api/deliveries/all');
        const data = await response.json();
        if (response.ok) setDeliveries(data.data);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };
    fetchDeliveries();
  }, []);

  const formatDateTime = (dateString) =>
    dateString ? new Date(dateString).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

  return (
    <div className="fleet-manager">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Fleet Manager</h2>
          <p className="sidebar-subtitle">Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          <div
            className={`nav-item ${!showDeliveries ? 'active' : ''}`}
            onClick={() => setShowDeliveries(false)}
          >
            <span className="nav-icon">🚛</span>
            <span className="nav-text">Drivers & Customers</span>
          </div>
          <div
            className={`nav-item ${showDeliveries ? 'active' : ''}`}
            onClick={() => setShowDeliveries(true)}
          >
            <span className="nav-icon">📦</span>
            <span className="nav-text">Deliveries</span>
          </div>
           <div
            className="nav-item" onClick={() => {
                navigate('/')
            }}
          >

            <span className="nav-icon"></span>
            <span className="nav-text">Logout</span>
          </div>

        </nav>
      </div>

      <div className="main-content">
        {!showDeliveries ? (
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
                    {drivers.map((driver) => (
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
                    {customers.map((customer) => (
                      <tr key={customer._id}>
                        <td>{customer.username}</td>
                        <td>{customer.email}</td>
                        <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
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
        ) : (
          <>
            {/* Professional Deliveries Table */}
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
                        <td>{delivery.vehicle_id || '—'}</td>
                        <td>{formatDateTime(delivery.scheduled_pickup_time)}</td>
                        <td>{formatDateTime(delivery.scheduled_dropoff_time)}</td>
                        <td>
                          <span
                            className={`status-badge ${
                              delivery.status === 'pending' ? 'pending' : 'on-route'
                            }`}
                          >
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
        )}
      </div>
    </div>
  );
};

export default FleetManager;
