import React from 'react';
import './index.css';
const DriverAcceptPage = () => {
  return (
    <div className="fleet-flow-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <span className="logo-text">FleetFlow</span>
        </div>
        
        <div className="driver-info">
          <div className="driver-avatar">
            <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" alt="Sarah Miller" />
          </div>
          <div className="driver-details">
            <div className="driver-name">Sarah Miller</div>
            <div className="driver-role">Driver</div>
          </div>
        </div>

        <nav className="navigation">
          <div className="nav-item active">
            <span className="nav-icon">🚗</span>
            <span className="nav-text">Accepted Ride</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">📦</span>
            <span className="nav-text">My Deliveries</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profile</span>
          </div>
        </nav>

        <div className="logout">
          <span className="logout-icon">↩</span>
          <span className="logout-text">Logout</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <h1 className="page-title">Accepted Ride</h1>
          <div className="order-info">
            <span className="order-number">Order #12345</span>
            <span className="order-status">En route</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="map-container">
          <div className="map-placeholder">
            <div className="map-locations">
              <div className="location-marker pickup-marker">📍</div>
              <div className="location-marker dropoff-marker">🏁</div>
              <div className="route-line"></div>
            </div>
            <div className="map-labels">
              <div className="location-label">Taylor Park Trading Post</div>
              <div className="location-label">Park Cone</div>
              <div className="location-label">Abbeyville</div>
              <div className="location-label">Tincup</div>
            </div>
            <div className="map-attribution">Map data ©2024 Google</div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        {/* Delivery Details */}
        <div className="details-section">
          <h2 className="section-title">Delivery Details</h2>
          
          <div className="detail-item">
            <span className="detail-icon">📍</span>
            <div className="detail-content">
              <div className="detail-label">Pickup</div>
              <div className="detail-value">123 Main St, Anytown, USA</div>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">🏁</span>
            <div className="detail-content">
              <div className="detail-label">Drop-off</div>
              <div className="detail-value">456 Oak Ave, Anytown, USA</div>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">📦</span>
            <div className="detail-content">
              <div className="detail-label">Items</div>
              <div className="detail-value">2x Large Boxes, 1x Small Parcel</div>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="details-section">
          <h2 className="section-title">Customer Details</h2>
          
          <div className="detail-item">
            <span className="detail-icon">👤</span>
            <div className="detail-content">
              <div className="detail-label">Name</div>
              <div className="detail-value">Alex Johnson</div>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">📞</span>
            <div className="detail-content">
              <div className="detail-label">Contact</div>
              <div className="detail-value">555-1234</div>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">📝</span>
            <div className="detail-content">
              <div className="detail-label">Notes</div>
              <div className="detail-value">Fragile items, handle with care.</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="actions-section">
          <h2 className="section-title">Actions</h2>
          
          <button className="action-button primary">
            <span className="button-icon">✓</span>
            <span className="button-text">Mark as Delivered</span>
          </button>

          <button className="action-button secondary">
            <span className="button-icon">✕</span>
            <span className="button-text">Cancel Ride</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverAcceptPage;