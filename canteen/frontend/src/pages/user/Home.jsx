import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaClipboardList,
  FaTicketAlt,
  FaWallet,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";

import breakfastImg from "../../assets/images/breakfast.jpg";
import lunchImg from "../../assets/images/lunch.jpg";
import snacksImg from "../../assets/images/snacks.jpg";

import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [cashierStats, setCashierStats] = useState({ cashCollection: 0.00, qrCollection: 0.00 });
  const [walletBalance, setWalletBalance] = useState(0.00);
  const [notifications, setNotifications] = useState([]);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    if (user?.username === "admin" && user?.employee_id) {
      axios.get(`http://localhost:5000/api/orders/cashier-stats/${user.employee_id}`)
        .then(res => {
          if (res.data.success) {
            setCashierStats({
              cashCollection: res.data.cashCollection,
              qrCollection: res.data.qrCollection
            });
          }
        })
        .catch(err => console.error("Error loading cashier stats:", err));
    } else if (user?.employee_id) {
      axios.get(`http://localhost:5000/api/wallet/balance/${user.employee_id}`)
        .then(res => {
          setWalletBalance(parseFloat(res.data.balance || 0.00));
        })
        .catch(err => console.error("Error loading wallet balance:", err));
    }
    fetchNotifications();
  }, [user?.employee_id, user?.username]);

  const fetchNotifications = () => {
    axios.get("http://localhost:5000/api/notifications/list")
      .then(res => {
        setNotifications(res.data);
      })
      .catch(err => console.error("Error fetching notifications:", err));
  };

  const lastViewedId = parseInt(localStorage.getItem("lastViewedNotifId") || "0");
  const unreadCount = notifications.filter(n => n.id > lastViewedId).length;

  const openNotificationsModal = () => {
    setIsNotifModalOpen(true);
    if (notifications.length > 0) {
      const maxId = Math.max(...notifications.map(n => n.id));
      localStorage.setItem("lastViewedNotifId", String(maxId));
    }
  };

  const menuItems = [
    {
      id: 1,
      title: "Breakfast",
      item: "Poha + Tea",
      time: "06:00 AM - 10:00 AM",
      image: breakfastImg,
    },
    {
      id: 2,
      title: "Lunch",
      item: "Rice + Dal + Paneer",
      time: "11:30 AM - 02:30 PM",
      image: lunchImg,
    },
    {
      id: 3,
      title: "Snacks",
      item: "Samosa + Tea",
      time: "04:00 PM - 06:00 PM",
      image: snacksImg,
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home-page">
      <div className="main-card">

        {/* HEADER */}
        <div className="department-header">
          <img
            src="/images/images.png"
            alt="Government Logo"
            className="dept-logo"
          />

          <div className="dept-title">
            <h1>
              Office of the Principal Accountant General (A&E), W.B.
            </h1>

            <p>
              Treasury Buildings, Kolkata - 700001
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div className="notification-bell-container" onClick={openNotificationsModal} style={{ position: "relative", cursor: "pointer", padding: "10px", background: "#f1f5f9", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FaBell style={{ color: "#334155", fontSize: "20px" }} />
              {unreadCount > 0 && (
                <span className="bell-badge" style={{ position: "absolute", top: "-5px", right: "-5px", background: "#ef4444", color: "white", borderRadius: "50%", padding: "2px 6px", fontSize: "10px", fontWeight: "bold" }}>
                  {unreadCount}
                </span>
              )}
            </div>

            <img
              src="/images/IA&AS_Logo.png"
              alt="IA&AS Logo"
              className="dept-logo"
            />
          </div>
        </div>

        {/* CONTENT */}
        <div className="content-area">

          {/* PROFILE CARD */}
          <div className="profile-card">
            <div className="profile-left">
              <img
                src={
                  user?.profile_image
                    ? user.profile_image
                    : "https://i.pravatar.cc/150"
                }
                alt="Profile"
                className="profile-image"
                onClick={() => navigate((user?.role === "ADMIN" || user?.username === "admin") ? "/admin" : "/profile")}
              />

              <div>
                <h3>
                  Hello, {user?.full_name || "Employee"}
                </h3>

                <p>
                  Username: {user?.username || "-"}
                </p>
              </div>
            </div>

            {(user?.role === "ADMIN" || user?.username === "admin") ? (
              user?.username === "admin" ? null : (
                <button
                  className="profile-btn"
                  onClick={() => navigate("/admin")}
                  style={{ background: "#7c3aed", color: "#fff" }}
                >
                  Back to Dashboard
                </button>
              )
            ) : (
              <button
                className="profile-btn"
                onClick={() => navigate("/profile")}
              >
                View Profile
              </button>
            )}
          </div>

          {/* WALLET CARD / OPERATOR WIDGET */}
          {user?.username === "admin" ? (
            <div className="operator-details-card" style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", color: "white", padding: "20px", borderRadius: "15px", marginBottom: "25px", boxShadow: "0 4px 15px rgba(59, 130, 246, 0.2)" }}>
              <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>Operator Console Info</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px 10px", fontSize: "13px" }}>
                <div>
                  <span style={{ opacity: 0.8 }}>Today's Total Cash Collection:</span>
                  <strong style={{ display: "block", color: "#4ade80", fontSize: "18px", marginTop: "5px" }}>₹{cashierStats.cashCollection.toFixed(2)}</strong>
                </div>
                <div>
                  <span style={{ opacity: 0.8 }}>Today's Total QR Collection:</span>
                  <strong style={{ display: "block", color: "#4ade80", fontSize: "18px", marginTop: "5px" }}>₹{cashierStats.qrCollection.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="wallet-card">
              <div>
                <span>Today's Balance</span>
                <h2>₹{walletBalance.toFixed(2)}</h2>
              </div>

              <button
                onClick={() => navigate("/wallet")}
              >
                View Wallet
              </button>
            </div>
          )}

          {/* MENU SECTION */}
          <div className="menu-section">

            <div className="menu-header">
              Today's Menu
            </div>

            <div className="menu-date">
              {new Date().toLocaleDateString()}
            </div>

            {menuItems.map((menu) => (
              <div
                key={menu.id}
                className="menu-card"
                onClick={() =>
                  navigate(
                    `/menu/${menu.title.toLowerCase()}`
                  )
                }
              >
                <img
                  src={menu.image}
                  alt={menu.title}
                  className="food-image"
                />

                <div className="menu-details">
                  <h4>{menu.title}</h4>
                  <p>{menu.item}</p>
                  <span>{menu.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* LOGOUT */}


        </div>

        {/* FOOTER */}
        <div className="bottom-footer">

          {user?.username !== "admin" && (
            <div
              className="footer-item"
              onClick={() => navigate((user?.role === "ADMIN" || user?.username === "admin") ? "/admin" : "/profile")}
            >
              <FaUser />
              <span>{(user?.role === "ADMIN" || user?.username === "admin") ? "Dashboard" : "Profile"}</span>
            </div>
          )}

          <div
            className="footer-item"
            onClick={() => navigate("/orders")}
          >
            <FaClipboardList />
            <span>Orders</span>
          </div>

          <div
            className="footer-item"
            onClick={() => navigate("/coupons")}
          >
            <FaTicketAlt />
            <span>Coupons</span>
          </div>

          {user?.username !== "admin" && (
            <div
              className="footer-item"
              onClick={() => navigate("/wallet")}
            >
              <FaWallet />
              <span>Wallet</span>
            </div>
          )}

          <div
            className="footer-item"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </div>

        </div>

        {/* NOTIFICATIONS LIST MODAL */}
        {isNotifModalOpen && (
          <div className="employee-modal-overlay">
            <div className="employee-modal-card">
              <div className="employee-modal-header">
                <h3>Notifications & Updates</h3>
                <button className="close-modal-btn" onClick={() => setIsNotifModalOpen(false)}>×</button>
              </div>
              <div className="employee-modal-body" style={{ maxHeight: "400px", overflowY: "auto", padding: "16px" }}>
                {notifications.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#64748b", margin: "20px 0" }}>No new notifications at this time.</p>
                ) : (
                  <div className="notif-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className="notif-item" 
                        onClick={() => setSelectedNotif(notif)}
                        style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "10px", background: "#f8fafc", cursor: "pointer", border: "1px solid #e2e8f0", transition: "all 0.2s" }}
                      >
                        <div style={{
                          background: notif.type === "ANNOUNCEMENT" ? "#dbeafe" : "#dcfce7",
                          color: notif.type === "ANNOUNCEMENT" ? "#2563eb" : "#16a34a",
                          padding: "10px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px"
                        }}>
                          <FaBell />
                        </div>
                        <div style={{ flex: 1, textAlign: "left" }}>
                          <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{notif.title}</h4>
                          <span style={{ fontSize: "11px", color: "#64748b" }}>{notif.type === "ANNOUNCEMENT" ? "Announcement" : "Special Menu"}</span>
                        </div>
                        <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                          {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATION DETAILS MODAL */}
        {selectedNotif && (
          <div className="employee-modal-overlay" style={{ zIndex: 1100 }}>
            <div className="employee-modal-card">
              <div className="employee-modal-header">
                <h3>{selectedNotif.type === "ANNOUNCEMENT" ? "Announcement Details" : "Special Menu Item"}</h3>
                <button className="close-modal-btn" onClick={() => setSelectedNotif(null)}>×</button>
              </div>
              <div className="employee-modal-body" style={{ padding: "16px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "12px", textAlign: "left" }}>{selectedNotif.title}</h4>
                
                {selectedNotif.type === "ANNOUNCEMENT" ? (
                  <p style={{ fontSize: "14px", color: "#334155", lineHeight: "1.5", background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", margin: 0, textAlign: "left", whiteSpace: "pre-wrap" }}>
                    {selectedNotif.message}
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    {selectedNotif.image_url && (
                      <img 
                        src={`http://localhost:5000${selectedNotif.image_url}`} 
                        alt={selectedNotif.item_name} 
                        style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", border: "1px solid #cbd5e1" }}
                      />
                    )}
                    <div style={{ textAlign: "left" }}>
                      <strong style={{ display: "block", fontSize: "16px", color: "#0f172a" }}>{selectedNotif.item_name}</strong>
                      <span style={{ display: "block", fontSize: "18px", color: "#16a34a", fontWeight: "700", marginTop: "4px" }}>₹{selectedNotif.price}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="employee-modal-footer" style={{ padding: "12px 16px", background: "#f8fafc", display: "flex", justifyContent: "flex-end", borderTop: "1px solid #e2e8f0" }}>
                <button className="close-btn" onClick={() => setSelectedNotif(null)} style={{ border: "none", background: "#cbd5e1", color: "#475569", padding: "8px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Home;