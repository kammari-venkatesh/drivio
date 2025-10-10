import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { 
  CheckCircleIcon, 
  TruckIcon, 
  MapPinIcon, 
  UserCircleIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/solid';
import './index.css';

// Establishes the connection to your server
const socket = io("https://drivio-1uea.onrender.com");

// --- Helper Component: Loading Skeleton ---
const LoadingSkeleton = () => (
  <div className="page-container">
    {/* skeleton code unchanged */}
  </div>
);

// --- Helper Component: Timeline Step ---
const TimelineStep = ({ title, description, isCompleted, isLast }) => (
  <div className="timeline-step">
    <div className="timeline-step__connector">
      <div className={`timeline-step__icon ${isCompleted ? 'completed' : ''}`} />
      {!isLast && <div className={`timeline-step__line ${isCompleted ? 'completed' : ''}`} />}
    </div>
    <div className="timeline-step__content">
      <p className={`timeline-step__title ${isCompleted ? 'completed' : ''}`}>{title}</p>
      <p className="timeline-step__description">{description}</p>
    </div>
  </div>
);

// --- Popup Component ---
const Popup = ({ message, onConfirm }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2 className="popup-title">Delivery Update</h2>
        <p className="popup-message">{message}</p>
        <button className="popup-button" onClick={onConfirm}>
          OK
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---
const CustomerDelivery = ({ deliveryCreated }) => {
  const [isLoading, setIsLoading] = useState(deliveryCreated);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [delivery, setDelivery] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const userId = Cookies.get("userid");
  if (userId) {
    socket.emit("registerUser", userId);
  }

  socket.on("deliveryAssigned", (deliveryData) => {
    console.log("✅ Event 'deliveryAssigned' received:", deliveryData);
    setDelivery(deliveryData);
    setIsLoading(false);
  });

  socket.on("delivery_deleted", (data) => {
    console.log("🗑️ Event 'delivery_deleted' received:", data);
    // ✅ FIXED: Use data.deliveryId directly, check delivery state inside
    if (data.deliveryId) {
      navigate('/userdashboard', { replace: true });
    }
  });

  // ✅ FIXED: Listen for deliveryCompleted
  socket.on("deliveryCompleted", (data) => {
    console.log("📦 Event 'deliveryCompleted' received:", data);
    // ✅ FIXED: Just check if deliveryId exists in the event data
    if (data.deliveryId) {
      setPopupMessage("Your delivery has been successfully completed!");
      setShowPopup(true);
    }
  });

  return () => {
    socket.off("deliveryAssigned");
    socket.off("delivery_deleted");
    socket.off("deliveryCompleted");
  };
}, [navigate]); // ✅ FIXED: Remove 'delivery' from dependencies

  const handleConfirm = () => {
    setShowPopup(false);
    navigate("/userdashboard", { replace: true });
  };

  // 1. Loading
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // 2. Awaiting Driver
  if (!delivery || !delivery.driver_id) {
    return (
      <div className="status-page">
        <ExclamationTriangleIcon className="status-page__icon" />
        <h2 className="status-page__title">Awaiting Driver Assignment</h2>
        <p className="status-page__description">
          We are finding the nearest driver for your delivery. This screen will update automatically.
        </p>
      </div>
    );
  }

  // 3. Main UI
  const { driver_id: driver, status, scheduled_dropoff_time } = delivery;
  const statusLower = status.toLowerCase();

  const timelineSteps = [
    { title: 'Order Confirmed', description: 'Your request has been received.', isCompleted: true },
    { title: 'Driver Assigned', description: `${driver.username} is on the way.`, isCompleted: true },
    { title: 'In Transit', description: 'Your package is on its way to the destination.', isCompleted: statusLower === 'on route' || statusLower === 'delivered' },
    { title: 'Delivered', description: 'Your package has been delivered successfully.', isCompleted: statusLower === 'delivered' }
  ];

  const handleCancel = async () => {
    try {
      const res = await fetch(`https://drivio-1uea.onrender.com/api/deliveries/${delivery._id}/cancel`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get("token")}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to cancel delivery');
      }

      const data = await res.json();
      console.log("🚫 Delivery cancellation request sent:", data);
    } catch (error) {
      console.error("❌ Error cancelling delivery:", error);
    }
  };

  return (
    <div className="page-container">
      {/* ✅ POPUP rendered here */}
      {showPopup && <Popup message={popupMessage} onConfirm={handleConfirm} />}

      <header className="page-header">
        <h1>
          Delivery is <span className="highlight">{statusLower === 'on route' ? "on its way" : "being prepared"}!</span>
        </h1>
        <p>Order ID: #{delivery._id.substring(0, 8).toUpperCase()}</p>
      </header>

      <div className="delivery-grid">
        <main className="card">
          <h2 className="card__title">Delivery Progress</h2>
          <div className="timeline">
            {timelineSteps.map((step, index) => (
              <TimelineStep key={step.title} {...step} isLast={index === timelineSteps.length - 1} />
            ))}
          </div>
        </main>

        <aside className="sidebar">
          <div className="card card--accent">
            <p className="card__subtitle">Estimated Delivery</p>
            <p className="card__highlight-text">
              {new Date(scheduled_dropoff_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </p>
          </div>

          <div className="card">
            <h3 className="card__title">Your Driver</h3>
            <div className="driver-info">
              <UserCircleIcon className="driver-info__avatar" />
              <div className="driver-info__details">
                <p className="driver-info__name">{driver.username}</p>
                <p className="driver-info__rating">⭐️ 4.9 Rating</p>
              </div>
            </div>
            <div className="driver-info__vehicle">
              <p>{driver.model} - <span className="license-plate">{driver.license_plate}</span></p>
            </div>
            <button className="button" onClick={handleCancel}>
              Cancel Ride
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CustomerDelivery;
