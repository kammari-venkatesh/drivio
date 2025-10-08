// import React, { useEffect, useState } from 'react';
// import './index.css';
// import Cookies from 'js-cookie';
// import { io } from 'socket.io-client';
// import { useNavigate } from 'react-router';


// // --- SVG Icons ---
// // --- SVG Icons ---
// const LocationPinIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
//     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//     className="icon-pin">
//     <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
//     <circle cx="12" cy="10" r="3"></circle>
//   </svg>
// );

// const ListIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
//     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//     className="nav-icon">
//     <line x1="8" y1="6" x2="21" y2="6"></line>
//     <line x1="8" y1="12" x2="21" y2="12"></line>
//     <line x1="8" y1="18" x2="21" y2="18"></line>
//     <line x1="3" y1="6" x2="3.01" y2="6"></line>
//     <line x1="3" y1="12" x2="3.01" y2="12"></line>
//     <line x1="3" y1="18" x2="3.01" y2="18"></line>
//   </svg>
// );

// const UserIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
//     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//     className="nav-icon">
//     <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
//     <circle cx="12" cy="7" r="4"></circle>
//   </svg>
// );

// const LogoutIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
//     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//     className="nav-icon">
//     <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
//     <polyline points="16 17 21 12 16 7"></polyline>
//     <line x1="21" y1="12" x2="9" y2="12"></line>
//   </svg>
// );

// // (Keep your LocationPinIcon, ListIcon, UserIcon, LogoutIcon as-is)

// // --- Sidebar ---
// const Sidebar = () => {
//   const navigate = useNavigate();

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-header">
//         <h1 className="sidebar-title">Drivio</h1>
//       </div>
//       <div className="user-profile">
//       <img src="https://img.freepik.com/premium-vector/driver-cartoon-vector_889056-101598.jpg" alt="Driver avatar" className="profile-avatar" />
//       <div className="profile-details">
//         <p className="profile-name">{Cookies.get('drivername')}</p>
//         <p className="profile-role">Driver</p>
//       </div>
//     </div>
//     <nav className="nav-links">
//       <a href="#" className="nav-link active"><ListIcon /><span>Booking Requests</span></a>
//     </nav>
//     <div className="logout-section">
//       <a href="#" className="nav-link" onClick={() => {
//         Cookies.remove('driverid');
//         Cookies.remove('drivername');
//         Cookies.remove('vehicle_id');
//         navigate('/');
//       }}><LogoutIcon /><span>Logout</span></a>
//     </div>
//   </aside>
// );
// }
// // --- Booking Request Card ---
// const BookingRequestCard = ({ request, onAccept }) => (
//   <div className="booking-request-card">
//     <div className="card-header">
//       <div className="user-info">
//         <img src="https://placehold.co/40x40" alt={`${request.customer_id?.username}'s avatar`} className="avatar" />
//         <div className="user-details">
//           <p className="user-name">{request.customer_id?.username || "Unknown"}</p>
//           <p className="user-phone">{request.customer_id?.email || "N/A"}</p>
//         </div>
//       </div>
//       <span className={`status-badge ${request.status}`}>{request.status.toUpperCase()}</span>
//     </div>

//     <div className="card-body">
//       <div className="location-info">
//         <LocationPinIcon />
//         <div className="location-details">
//           <p className="location-address">{request.pickup_location}</p>
//         </div>
//       </div>
//       <div className="location-info">
//         <LocationPinIcon />
//         <div className="location-details">
//           <p className="location-address">{request.dropoff_location}</p>
//         </div>
//       </div>
//     </div>

//     <div className="card-footer">
//       <button className="accept-button" onClick={() => onAccept(request._id)}>Accept Ride</button>
//     </div>
//   </div>
// );

// // --- Booking Requests Page with Socket.IO ---
// const BookingRequestsPage = () => {
//   const navigate = useNavigate();
//   const [requests, setRequests] = useState([]);

//   // Initialize socket connection
//   useEffect(() => {
//     const socket = io("https://drivio-1uea.onrender.com"); // replace with your server URL

//     // Listen for new delivery requests
//     socket.on("new_delivery_request", (delivery) => {
//       setRequests(prev => [delivery, ...prev]);
//     });

//     // // Listen for deliveries accepted by others
//     // socket.on("delivery_assigned", (assignedDelivery) => {
//     //   setRequests(prev => prev.filter(r => r._id !== assignedDelivery._id));
//     // });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   // Fetch pending requests initially
//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const res = await fetch("https://drivio-1uea.onrender.com/api/deliveries/pending", {
//           method: 'GET',
//           headers: {
//             "Authorization": `Bearer ${Cookies.get('token')}`,
//             "Content-Type": "application/json"
//           }
//         });

//         if (res.ok) {
//           const data = await res.json();
//           if (data.status === "success") setRequests(data.data);
//         }
//       } catch (err) {
//         console.error('Error fetching requests:', err);
//       }
//     };
//     fetchRequests();
//   }, []);

//   const handleAccept = async (deliveryId) => {
//     try {
//       const res = await fetch(`https://drivio-1uea.onrender.com/api/deliveries/${deliveryId}/assign`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ driver_id: Cookies.get("driverid"), vehicle_id: Cookies.get("vehicle_id"), status: "on_route" }),
//       });
//       const data = await res.json();
//       if (data.status === "success") {

//         const { delivery } = data.data;
//         navigate('/driveracceptpage', { state: { delivery } });
    
//         setRequests(prev => prev.filter(r => r._id !== deliveryId));
//       } else alert("Failed: " + data.message);
//     } catch (err) {
//       console.error(err);
//       alert("Server error while accepting ride.");
//     }
//   };

//   return (
//     <div className="booking-requests-container">
//       <header className="page-header">
//         <h1 className="page-title">Incoming Booking Requests</h1>
//         <p className="page-subtitle">Review requests and accept a ride.</p>
//       </header>
//       <main className="requests-list">
//         {requests.length > 0 ? requests.map(r => (
//           <BookingRequestCard key={r._id} request={r} onAccept={handleAccept} />
//         )) : <p className="no-requests">No pending requests.</p>}
//       </main>
//     </div>
//   );
// };

// // --- Driver Dashboard Layout ---
// const Driverrequestboard = () => (
//   <div className="dashboard-layout">
//     <Sidebar />
//     <main className="main-content">
//       <BookingRequestsPage />
//     </main>
//   </div>
// );

// export default Driverrequestboard;

import React, { useEffect, useState } from 'react';
import './index.css';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router';

// --- SVG Icons ---
const LocationPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="icon-pin">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const ListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="nav-icon">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="nav-icon">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

// --- Sidebar ---
const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Drivio</h1>
      </div>
      <div className="user-profile">
        <img src="https://img.freepik.com/premium-vector/driver-cartoon-vector_889056-101598.jpg" alt="Driver avatar" className="profile-avatar" />
        <div className="profile-details">
          <p className="profile-name">{Cookies.get('drivername')}</p>
          <p className="profile-role">Driver</p>
        </div>
      </div>
      <nav className="nav-links">
        <a href="#" className="nav-link active"><ListIcon /><span>Booking Requests</span></a>
      </nav>
      <div className="logout-section">
        <a href="#" className="nav-link" onClick={() => {
          Cookies.remove('driverid');
          Cookies.remove('drivername');
          Cookies.remove('vehicle_id');
          Cookies.remove('delivery'); // clear saved delivery
          navigate('/');
        }}>
          <LogoutIcon /><span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

// --- Booking Request Card ---
const BookingRequestCard = ({ request, onAccept }) => (
  <div className="booking-request-card">
    <div className="card-header">
      <div className="user-info">
        <img src="https://placehold.co/40x40" alt={`${request.customer_id?.username}'s avatar`} className="avatar" />
        <div className="user-details">
          <p className="user-name">{request.customer_id?.username || "Unknown"}</p>
          <p className="user-phone">{request.customer_id?.email || "N/A"}</p>
        </div>
      </div>
      <span className={`status-badge ${request.status}`}>{request.status.toUpperCase()}</span>
    </div>

    <div className="card-body">
      <div className="location-info">
        <LocationPinIcon />
        <div className="location-details">
          <p className="location-address">{request.pickup_location}</p>
        </div>
      </div>
      <div className="location-info">
        <LocationPinIcon />
        <div className="location-details">
          <p className="location-address">{request.dropoff_location}</p>
        </div>
      </div>
    </div>

    <div className="card-footer">
      <button className="accept-button" onClick={() => onAccept(request._id)}>Accept Ride</button>
    </div>
  </div>
);

// --- Booking Requests Page ---
const BookingRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const socket = io("https://drivio-1uea.onrender.com");
    socket.on("new_delivery_request", (delivery) => {
      setRequests(prev => [delivery, ...prev]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("https://drivio-1uea.onrender.com/api/deliveries/pending", {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${Cookies.get('token')}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === "success") setRequests(data.data);
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (deliveryId) => {
    try {
            const res = await fetch(`https://drivio-1uea.onrender.com/api/deliveries/${deliveryId}/assign`, {
              method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driver_id: Cookies.get("driverid"), vehicle_id: Cookies.get("vehicle_id"), status: "on_route" }),
      });
      const data = await res.json();
      if (data.status === "success") {
        console.log(data.data);
        // Save delivery in cookies for later use
        Cookies.set("deliveryId", JSON.stringify(data.data._id));

        navigate('/driveracceptpage'); // no need to pass state
        setRequests(prev => prev.filter(r => r._id !== deliveryId));
      } else {
        alert("Failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error while accepting ride.");
    }
  };

  return (
    <div className="booking-requests-container">
      <header className="page-header">
        <h1 className="page-title">Incoming Booking Requests</h1>
        <p className="page-subtitle">Review requests and accept a ride.</p>
      </header>
      <main className="requests-list">
        {requests.length > 0 ? requests.map(r => (
          <BookingRequestCard key={r._id} request={r} onAccept={handleAccept} />
        )) : <p className="no-requests">No pending requests.</p>}
      </main>
    </div>
  );
};

// --- Layout ---
const Driverrequestboard = () => (
  <div className="dashboard-layout">
    <Sidebar />
    <main className="main-content">
      <BookingRequestsPage />
    </main>
  </div>
);

export default Driverrequestboard;

