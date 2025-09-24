// import React, { useEffect, useState } from 'react';
// import './index.css';
// import Cookies from "js-cookie";
// import { useNavigate } from 'react-router';
// import io from "socket.io-client";

// // Connect to the backend
// const socket = io("http://localhost:3000");

// const DriverAcceptPage = () => {
//   const deliveryId = Cookies.get("deliveryId") || "";
//   const [delivery, setDelivery] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!deliveryId) return;
//     const cleanId = deliveryId.replace(/"/g, "");
//     console.log("Fetching details for delivery ID:", cleanId);

//     // Initial fetch
//     const fetchDeliveryDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/api/deliveries/${cleanId}`, {
//           method: 'GET',
//           headers: { 
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${Cookies.get("token")}`
//           }
//         });

//         const data = await response.json();
//         if (response.ok) {
//           console.log("Delivery Details:", data.data);
//           setDelivery(data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching delivery details:", error);
//       }
//     };

//     fetchDeliveryDetails();

//     // Register driver with socket to receive real-time updates
//     const driverId = Cookies.get("driverid");
//     if (driverId) {
//       socket.emit("registerDriver", driverId);
//     }

//     // Listen for delivery updates
//     socket.on("deliveryUpdated", (updatedDelivery) => {
//       if (updatedDelivery._id === cleanId) {
//         console.log("🔄 Delivery updated in real time:", updatedDelivery);
//         setDelivery(updatedDelivery);

//         // If delivery was canceled by customer, navigate away
//         if (updatedDelivery.status === "canceled") {
//           alert("This delivery has been canceled by the customer.");
//           navigate('/driverrequest', { replace: true });
//         }
//       }
//     });

//     // Cleanup on unmount
//     return () => {
//       socket.off("deliveryUpdated");
//     };
//   }, [deliveryId, navigate]);

//   if (!delivery) {
//     return <div className="loading">Loading delivery details...</div>;
//   }

//   const handleComplete = async () => {
//     try {
//       const res = await fetch(`http://localhost:3000/api/deliveries/${delivery._id}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${Cookies.get("token")}`
//         },
//         body: JSON.stringify({ status: 'delivered' })
//       });

//       if (!res.ok) throw new Error('Failed to update delivery status');
//       const data = await res.json();
//       console.log("Delivery status updated successfully:", data);
//       navigate('/driverrequest', { replace: true });
//     } catch (error) {
//       console.error("Error updating delivery status:", error);
//     }
//   };

//   const handleCancel = async () => {
//     try {
//       const res = await fetch(`http://localhost:3000/api/deliveries/${delivery._id}/cancel`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${Cookies.get("token")}`
//         }
//       });

//       if (!res.ok) throw new Error('Failed to cancel delivery');
//       const data = await res.json();
//       console.log("Delivery cancelled successfully:", data);

//       // Emit cancel event to notify customer in real-time
//       socket.emit("deliveryCanceled", { deliveryId: delivery._id });

//       navigate('/driverrequest', { replace: true });
//     } catch (error) {
//       console.error("Error cancelling delivery:", error);
//     }
//   };

//   return (
//     <div className="fleet-flow-container">
//       {/* Left Sidebar */}
//       <div className="sidebar">
//         <div className="logo"><span className="logo-text">FleetFlow</span></div>
//         <div className="driver-info">
//           <div className="driver-avatar">
//             <img src="https://img.freepik.com/premium-vector/driver-cartoon-vector_889056-101598.jpg" alt="Driver" />
//           </div>
//           <div className="driver-details">
//             <div className="driver-name">{Cookies.get('drivername')}</div>
//             <div className="driver-role">Driver</div>
//           </div>
//         </div>

//         <nav className="navigation">
//           <div className="nav-item active">🚗 Accepted Ride</div>
//           <div className="nav-item">📦 My Deliveries</div>
//           <div className="nav-item">👤 Profile</div>
//         </nav>

//         <div className="logout">↩ Logout</div>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         <div className="header">
//           <h1 className="page-title">Accepted Ride</h1>
//           <div className="order-info">
//             <span className="order-number">Order #{delivery._id}</span>
//             <span className="order-status">{delivery.status}</span>
//           </div>
//         </div>

//         {/* Map Container */}
//         <div className="map-container">
//           <div className="map-placeholder">
//             <div className="map-locations">
//               <div className="location-marker pickup-marker">📍</div>
//               <div className="location-marker dropoff-marker">🏁</div>
//               <div className="route-line"></div>
//             </div>
//             <div className="map-labels">
//               <div className="location-label">{delivery.pickup_location}</div>
//               <div className="location-label">{delivery.dropoff_location}</div>
//             </div>
//             <div className="map-attribution">Map data ©2024 Google</div>
//           </div>
//         </div>
//       </div>

//       {/* Right Panel */}
//       <div className="right-panel">
//         {/* Delivery Details */}
//         <div className="details-section">
//           <h2 className="section-title">Delivery Details</h2>
          
//           <div className="detail-item">
//             <span className="detail-icon">📍</span>
//             <div className="detail-content">
//               <div className="detail-label">Pickup</div>
//               <div className="detail-value">{delivery.pickup_location}</div>
//             </div>
//           </div>

//           <div className="detail-item">
//             <span className="detail-icon">🏁</span>
//             <div className="detail-content">
//               <div className="detail-label">Drop-off</div>
//               <div className="detail-value">{delivery.dropoff_location}</div>
//             </div>
//           </div>

//           <div className="detail-item">
//             <span className="detail-icon">📦</span>
//             <div className="detail-content">
//               <div className="detail-label">Vehicle</div>
//               <div className="detail-value">{delivery.vehicle_id}</div>
//             </div>
//           </div>
//         </div>

//         {/* Customer Details */}
//         <div className="details-section">
//           <h2 className="section-title">Customer Details</h2>
          
//           <div className="detail-item">
//             <span className="detail-icon">👤</span>
//             <div className="detail-content">
//               <div className="detail-label">Name</div>
//               <div className="detail-value">{delivery.customer_id?.username}</div>
//             </div>
//           </div>

//           <div className="detail-item">
//             <span className="detail-icon">📞</span>
//             <div className="detail-content">
//               <div className="detail-label">Email</div>
//               <div className="detail-value">{delivery.customer_id?.email}</div>
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="actions-section">
//           <h2 className="section-title">Actions</h2>
          
//           <button className="action-button primary" onClick={handleComplete}>✓ Mark as Delivered</button>
//           <button className="action-button secondary" onClick={handleCancel}>✕ Cancel Ride</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DriverAcceptPage;
import React, { useEffect, useState } from 'react';
import './index.css';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router';
import io from "socket.io-client";

// Connect to backend
const socket = io("http://localhost:3000");

const DriverAcceptPage = () => {
  const deliveryId = Cookies.get("deliveryId") || "";
  const [delivery, setDelivery] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!deliveryId) return;
    const cleanId = deliveryId.replace(/"/g, "");
    console.log("Fetching details for delivery ID:", cleanId);

    // Fetch initial delivery details
    const fetchDeliveryDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/deliveries/${cleanId}`, {
          method: 'GET',
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          console.log("Delivery Details:", data.data);
          setDelivery(data.data);
        }
      } catch (error) {
        console.error("Error fetching delivery details:", error);
      }
    };

    fetchDeliveryDetails();

    // Register driver with socket
    const driverId = Cookies.get("driverid");
    if (driverId) {
      socket.emit("registerDriver", driverId);
    }

    // Listen for delivery updates (status changes, cancellations)
    const handleDeliveryUpdate = (updatedDelivery) => {
      if (updatedDelivery._id === cleanId) {
        console.log("🔄 Delivery updated in real-time:", updatedDelivery);
        setDelivery(updatedDelivery);

        if (updatedDelivery.status === "canceled") {
          alert("This delivery has been canceled by the customer.");
          navigate('/driverrequest', { replace: true });
        }
      }
    };

    const handleDeliveryDeleted = ({ deliveryId: cancelledId }) => {
      if (cancelledId === cleanId) {
        console.log("🚫 Delivery canceled by customer:", cancelledId);
        alert("This delivery has been canceled by the customer.");
        navigate('/driverrequest', { replace: true });
      }
    };

    socket.on("deliveryUpdated", handleDeliveryUpdate);
    socket.on("delivery_deleted", handleDeliveryDeleted);

    // Cleanup
    return () => {
      socket.off("deliveryUpdated", handleDeliveryUpdate);
      socket.off("delivery_deleted", handleDeliveryDeleted);
    };
  }, [deliveryId, navigate]);

  if (!delivery) {
    return <div className="loading">Loading delivery details...</div>;
  }

  // Mark delivery as completed
  const handleComplete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/deliveries/${delivery._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        },
        body: JSON.stringify({ status: 'delivered' })
      });

      if (!res.ok) throw new Error('Failed to update delivery status');
      const data = await res.json();
      console.log("Delivery status updated successfully:", data);
      navigate('/driverrequest', { replace: true });
    } catch (error) {
      console.error("Error updating delivery status:", error);
    }
  };

  // Cancel delivery
  const handleCancel = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/deliveries/${delivery._id}/cancel`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        }
      });

      if (!res.ok) throw new Error('Failed to cancel delivery');
      const data = await res.json();
      console.log("Delivery cancelled successfully:", data);

      // Emit cancel event for real-time update
      socket.emit("deliveryCanceled", { deliveryId: delivery._id });

      navigate('/driverrequest', { replace: true });
    } catch (error) {
      console.error("Error cancelling delivery:", error);
    }
  };

  return (
    <div className="fleet-flow-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className="logo"><span className="logo-text">FleetFlow</span></div>
        <div className="driver-info">
          <div className="driver-avatar">
            <img src="https://img.freepik.com/premium-vector/driver-cartoon-vector_889056-101598.jpg" alt="Driver" />
          </div>
          <div className="driver-details">
            <div className="driver-name">{Cookies.get('drivername')}</div>
            <div className="driver-role">Driver</div>
          </div>
        </div>

        <nav className="navigation">
          <div className="nav-item active">🚗 Accepted Ride</div>
          <div className="nav-item">📦 My Deliveries</div>
          <div className="nav-item">👤 Profile</div>
        </nav>

        <div className="logout">↩ Logout</div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <h1 className="page-title">Accepted Ride</h1>
          <div className="order-info">
            <span className="order-number">Order #{delivery._id}</span>
            <span className="order-status">{delivery.status}</span>
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
              <div className="location-label">{delivery.pickup_location}</div>
              <div className="location-label">{delivery.dropoff_location}</div>
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
              <div className="detail-value">{delivery.pickup_location}</div>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">🏁</span>
            <div className="detail-content">
              <div className="detail-label">Drop-off</div>
              <div className="detail-value">{delivery.dropoff_location}</div>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">📦</span>
            <div className="detail-content">
              <div className="detail-label">Vehicle</div>
              <div className="detail-value">{delivery.vehicle_id}</div>
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
              <div className="detail-value">{delivery.customer_id?.username}</div>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-icon">📞</span>
            <div className="detail-content">
              <div className="detail-label">Email</div>
              <div className="detail-value">{delivery.customer_id?.email}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="actions-section">
          <h2 className="section-title">Actions</h2>
          
          <button className="action-button primary" onClick={handleComplete}>✓ Mark as Delivered</button>
          <button className="action-button secondary" onClick={handleCancel}>✕ Cancel Ride</button>
        </div>
      </div>
    </div>
  );
};

export default DriverAcceptPage;
