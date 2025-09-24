import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { 
  CheckCircleIcon, 
  TruckIcon, 
  MapPinIcon, 
  UserCircleIcon, 
  PhoneIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/solid';
import './index.css';

// Establishes the connection to your server
const socket = io("http://localhost:3000");

// --- Helper Component: Loading Skeleton ---
// Displays an animated placeholder to improve perceived performance
const LoadingSkeleton = () => (
  <div className="page-container">
    <div className="delivery-grid">
      <div className="main-content-skeleton">
        <div className="card skeleton-card">
          <div className="skeleton-element skeleton-title"></div>
          <div className="skeleton-element skeleton-text"></div>
        </div>
        <div className="card skeleton-card">
          <div className="skeleton-element skeleton-title w-40"></div>
          <div className="skeleton-timeline">
            <div className="skeleton-timeline-item">
              <div className="skeleton-element skeleton-icon"></div>
              <div className="skeleton-element skeleton-text-full"></div>
            </div>
            <div className="skeleton-timeline-item">
              <div className="skeleton-element skeleton-icon"></div>
              <div className="skeleton-element skeleton-text-full"></div>
            </div>
            <div className="skeleton-timeline-item">
              <div className="skeleton-element skeleton-icon"></div>
              <div className="skeleton-element skeleton-text-full"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="sidebar-skeleton">
        <div className="card skeleton-card">
            <div className="skeleton-element skeleton-title w-40"></div>
            <div className="skeleton-element skeleton-text-large"></div>
        </div>
        <div className="card skeleton-card">
            <div className="skeleton-element skeleton-title w-40"></div>
            <div className="skeleton-element skeleton-button"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Helper Component: Timeline Step ---
// Renders a single step in the delivery progress timeline
// --- Helper Component: Timeline Step ---
const TimelineStep = ({ icon: Icon, title, description, isCompleted, isLast }) => (
  <div className="timeline-step">
    <div className="timeline-step__connector">
      <div className={`timeline-step__icon ${isCompleted ? 'completed' : ''}`}>
        <Icon className="icon" />
      </div>
      {!isLast && <div className={`timeline-step__line ${isCompleted ? 'completed' : ''}`} />}
    </div>
    <div className="timeline-step__content">
      <p className={`timeline-step__title ${isCompleted ? 'completed' : ''}`}>{title}</p>
      <p className="timeline-step__description">{description}</p>
    </div>
  </div>
);


// --- Main Component ---
const CustomerDelivery = ({ deliveryCreated }) => {
  // State to manage loading status
  const [isLoading, setIsLoading] = useState(deliveryCreated);
  // State to hold delivery data from the server
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
    // If the currently viewed delivery was deleted
    if (delivery && delivery._id === data.deliveryId) {
      navigate('/userdashboard', { replace: true });
    }
  });

  return () => {
    socket.off("deliveryAssigned");
    socket.off("delivery_deleted");
  };
}, [delivery, navigate]);
// Empty dependency array ensures this runs only once

  // 1. Loading State
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // 2. Awaiting Driver State (after initial load)
  if (!delivery || !delivery.driver_id) {
    return (
      <div className="status-page">
        <ExclamationTriangleIcon className="status-page__icon" />
        <h2 className="status-page__title">Awaiting Driver Assignment</h2>
        <p className="status-page__description">We are finding the nearest driver for your delivery. This screen will update automatically.</p>
      </div>
    );
  }

  // 3. Main UI when delivery and driver are assigned
  const { driver_id: driver, status, scheduled_dropoff_time } = delivery;
  const statusLower = status.toLowerCase();

  const timelineSteps = [
    { icon: CheckCircleIcon, title: 'Order Confirmed', description: 'Your request has been received.', isCompleted: true },
    { icon: UserCircleIcon, title: 'Driver Assigned', description: `${driver.username} is on the way.`, isCompleted: true },
    { icon: TruckIcon, title: 'In Transit', description: 'Your package is on its way to the destination.', isCompleted: statusLower === 'on route' || statusLower === 'delivered' },
    { icon: MapPinIcon, title: 'Delivered', description: 'Your package has been delivered successfully.', isCompleted: statusLower === 'delivered' }
  ];

  const handleCancel = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/deliveries/${delivery._id}/cancel`, {
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

    // The socket event will handle navigation
  } catch (error) {
    console.error("❌ Error cancelling delivery:", error);
  }
};


  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Delivery is <span className="highlight">{statusLower === 'on route' ? "on its way" : "being prepared"}!</span></h1>
        {/* ✅ FIXED THE LINE BELOW */}
        <p>Order ID: #{delivery._id.substring(0, 8).toUpperCase()}</p>
      </header>

      <div className="delivery-grid">
        {/* --- Main Content: Timeline --- */}
        <main className="card">
          <h2 className="card__title">Delivery Progress</h2>
          <div className="timeline">
            {timelineSteps.map((step, index) => (
              <TimelineStep key={step.title} {...step} isLast={index === timelineSteps.length - 1} />
            ))}
          </div>
        </main>

        {/* --- Sidebar: ETA & Driver Info --- */}
        <aside className="sidebar">
          <div className="card card--accent">
            <p className="card__subtitle">Estimated Delivery</p>
            <p className="card__highlight-text">{new Date(scheduled_dropoff_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
          </div>
          
          <div className="card">
            <h3 className="card__title">Your Driver</h3>
            <div className="driver-info">
              <UserCircleIcon className="driver-info__avatar"/>
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