import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUtensils,
    FaQrcode,
    FaSignOutAlt,
    FaSearch,
    FaClipboardList,
} from "react-icons/fa";
import "./Kitchen.css";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/orders";

function Kitchen() {
    const navigate = useNavigate();
    const [activeOrders, setActiveOrders] = useState([]);
    const [couponCode, setCouponCode] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Validate that a staff is logged in
    const user = JSON.parse(localStorage.getItem("user")) || {};

    useEffect(() => {
        if (!user.employee_id || user.role !== "STAFF") {
            navigate("/login");
            return;
        }
        fetchActiveOrders();
        // Setup polling every 8 seconds for real-time kitchen queue updates
        const interval = setInterval(fetchActiveOrders, 8000);
        return () => clearInterval(interval);
    }, []);

    const fetchActiveOrders = async () => {
        try {
            const res = await axios.get(`${API_BASE}/active`);
            setActiveOrders(res.data);
        } catch (err) {
            console.error("Error loading active orders:", err);
        }
    };

    const handleRedeem = async (codeToRedeem) => {
        const code = codeToRedeem || couponCode;
        if (!code) {
            alert("Please provide a coupon code.");
            return;
        }

        try {
            const res = await axios.post(`${API_BASE}/redeem`, {
                coupon_code: code
            });
            alert(res.data.message || "Coupon redeemed successfully!");
            setCouponCode("");
            fetchActiveOrders();
        } catch (err) {
            alert(err.response?.data?.message || "Redemption failed. Check coupon code.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const filteredOrders = activeOrders.filter((order) => {
        return (
            order.coupon_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.items.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="kitchen-page">
            {/* HEADER */}
            <header className="kitchen-header">
                <div className="kitchen-header-title">
                    <h1>eCanteen Kitchen Queue</h1>
                    <p>Office of the Principal Accountant General (A&E), W.B. | Kolkata</p>
                </div>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                    <div style={{ color: "#dbeafe", fontWeight: 600 }}>
                        Staff: {user.full_name || "Kitchen Staff"}
                    </div>
                    <button className="kitchen-logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
            </header>

            {/* SCANNER / MANUAL REDEEMER CARD */}
            <div className="redeem-card">
                <h3>
                    <FaQrcode />
                    Redeem Employee Food Coupon
                </h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRedeem();
                    }}
                    className="redeem-form"
                >
                    <div className="redeem-input-wrapper">
                        <input
                            type="text"
                            placeholder="Enter Coupon Token (e.g. CPN1717892348123) or Scan QR..."
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="redeem-submit-btn">
                        <FaUtensils />
                        Redeem Token
                    </button>
                </form>
            </div>

            {/* SEARCH AND QUEUE */}
            <div className="kitchen-dashboard-layout">
                <div className="queue-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h2>Preparation Queue</h2>
                        <span className="queue-count-badge">
                            {filteredOrders.length} Pending Meals
                        </span>
                    </div>

                    {/* SEARCH BOX */}
                    <div className="wallet-search" style={{ margin: 0 }}>
                        <FaSearch style={{ color: "#64748b" }} />
                        <input
                            type="text"
                            placeholder="Search token, user, meal..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                border: "none",
                                outline: "none",
                                marginLeft: "8px",
                                width: "220px",
                                background: "transparent"
                            }}
                        />
                    </div>
                </div>

                <div className="queue-grid">
                    {filteredOrders.length === 0 ? (
                        <div className="empty-queue-message">
                            <FaClipboardList style={{ fontSize: "32px", marginBottom: "10px", color: "#cbd5e1" }} />
                            <p>No pending meals in the queue. Outstanding orders will appear here automatically.</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div className="queue-card" key={order.order_id}>
                                <div>
                                    <div className="queue-card-header">
                                        <span className="queue-card-id">ORD{order.order_id}</span>
                                        <span className={`queue-card-category cat-${order.category.toLowerCase()}`}>
                                            {order.category}
                                        </span>
                                    </div>
                                    <div className="queue-card-body">
                                        <div className="queue-card-items">{order.items}</div>
                                        <div className="queue-card-emp">
                                            Served To: <strong>{order.employee_name}</strong>
                                        </div>
                                        <div className="queue-card-time">Ordered: {order.created_at}</div>
                                    </div>
                                </div>
                                <div className="queue-card-footer">
                                    <span className="queue-coupon-code">{order.coupon_code}</span>
                                    <button
                                        className="queue-action-btn"
                                        onClick={() => handleRedeem(order.coupon_code)}
                                    >
                                        Mark Served
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Kitchen;
