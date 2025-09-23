import './index.css';


// --- Style Injector ---
// This component injects the styles directly into the document's head
// to work around limitations in the build environment.



// --- SVG Icons ---
const DeliveriesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
);

const ProfileIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);

// --- Components ---
const Sidebar = () => (
    <aside className="sidebar">
        <div className="sidebar-inner-container">
            <div className="sidebar-profile">
                <img src="https://placehold.co/64x64/E7F5FF/1C7ED6?text=SM" alt="Sarah Miller" className="avatar" />
                <h3 className="profile-name">Sarah Miller</h3>
                <p className="profile-role">Driver</p>
            </div>
            <nav className="sidebar-nav">
                <a href="#" className="nav-item active">
                    <DeliveriesIcon />
                    <span>My Deliveries</span>
                </a>
                <a href="#" className="nav-item">
                    <ProfileIcon />
                    <span>Profile</span>
                </a>
            </nav>
        </div>
        <div className="sidebar-footer">
             <a href="#" className="nav-item">
                <LogoutIcon />
                <span>Logout</span>
            </a>
        </div>
    </aside>
);

const UpcomingDelivery = () => (
    <div className="card upcoming-delivery-card">
         <div className="delivery-header">
            <h3 className="card-title">Order #12345</h3>
            <span className="status-pill">Pending</span>
        </div>
        <div className="delivery-content">
            <div className="delivery-details">
                <div className="detail-item"><strong>Pickup:</strong> <span>123 Main St, Anytown, USA</span></div>
                <div className="detail-item"><strong>Dropoff:</strong> <span>456 Oak Ave, Anytown, USA</span></div>
                <div className="detail-item"><strong>Vehicle:</strong> <span>Ford Transit Van</span></div>
                <div className="detail-item"><strong>Customer:</strong> <span>Alex Johnson (555-1234)</span></div>
            </div>
            <img src="https://placehold.co/150x100/f1f3f5/495057?text=Van" alt="Delivery Van" className="delivery-image" />
        </div>
    </div>
);

const DeliveryStatusControl = () => (
    <div className="card delivery-status-card">
        <h3 className="card-title">Delivery Status Control</h3>
        <p className="status-description">Update the current status of your delivery.</p>
        <div className="status-buttons">
            <button className="status-btn btn-pending">Pending</button>
            <button className="status-btn btn-on-route">On Route</button>
            <button className="status-btn btn-delivered">Delivered</button>
        </div>
    </div>
);

const MapView = () => (
    <div className="card map-view-card">
        <h3 className="card-title">Map View</h3>
        <img src="https://placehold.co/600x600/E9ECEF/ADB5BD?text=Map+View" alt="Map View of Delivery Route" className="map-image" />
        <div className="map-info">
            <p>Live Route: <strong>Anytown</strong></p>
            <p className="last-updated">Last updated: Just now</p>
        </div>
    </div>
);


const Dashboard = () => {
    return (
        <div className="driver-dashboard-container">
            <Sidebar />
            <main className="main-content">
                <header className="main-header">
                    <h1>Dashboard</h1>
                    <p>Welcome back, Sarah!</p>
                </header>
                <div className="dashboard-grid">
                    <UpcomingDelivery />
                    <DeliveryStatusControl />
                    <MapView />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

