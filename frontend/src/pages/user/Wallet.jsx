import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaWallet,
    FaArrowDown,
    FaArrowUp,
    FaArrowLeft,
    FaUser,
    FaClipboardList,
    FaTicketAlt,
    FaSignOutAlt,
    FaExclamationTriangle,
    FaHome
} from "react-icons/fa";
import axios from "axios";

import "./Wallet.css";

function Wallet() {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0.00);
    const [isTampered, setIsTampered] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const user = JSON.parse(localStorage.getItem("user")) || {};

    useEffect(() => {
        if (!user.employee_id) {
            navigate("/login");
            return;
        }
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const [balRes, txRes] = await Promise.all([
                axios.get((window.API_BASE_URL || "http://localhost:5000") + `/api/wallet/balance/${user.employee_id}`),
                axios.get((window.API_BASE_URL || "http://localhost:5000") + `/api/wallet/transactions/${user.employee_id}`)
            ]);

            setBalance(parseFloat(balRes.data.balance));
            setIsTampered(balRes.data.is_tampered);
            setTransactions(txRes.data);
        } catch (err) {
            console.error("Error loading wallet details:", err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const totalRecharge = transactions
        .filter((t) => t.type === "credit")
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const totalSpent = transactions
        .filter((t) => t.type === "debit")
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    return (
        <div className="wallet-page">

            <div className="wallet-main-card">

                {/* HEADER */}

                <div className="department-header">

                    <img
                        src="/images/images.png"
                        alt="Government Logo"
                        className="dept-logo"
                    />

                    <div className="dept-title">

                        <h1>
                            Office of the Principal
                            Accountant General (A&E), W.B.
                        </h1>

                        <p>
                            Treasury Buildings,
                            Kolkata - 700001
                        </p>

                    </div>

                    <img
                        src="/images/IA&AS_Logo.png"
                        alt="IAAS Logo"
                        className="dept-logo"
                    />

                </div>

                {/* CONTENT */}

                <div className="wallet-content">

                    <button
                        className="back-button"
                        onClick={() => navigate("/home")}
                    >
                        <FaArrowLeft />
                        Back
                    </button>

                    <div className="wallet-title-section">

                        <h2>My Wallet</h2>

                        <p>
                            View balance, recharges and
                            transaction history
                        </p>

                    </div>

                    {/* TAMPER BANNER */}
                    {isTampered && (
                        <div style={{
                            background: "#fee2e2",
                            border: "1px solid #fca5a5",
                            color: "#991b1b",
                            padding: "12px",
                            borderRadius: "8px",
                            marginBottom: "15px",
                            fontWeight: "bold",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}>
                            <FaExclamationTriangle />
                            <span>Wallet balance verification failed. Contact admin!</span>
                        </div>
                    )}

                    {/* BALANCE CARD */}

                    <div className="wallet-balance-card">

                        <div className="wallet-icon">
                            <FaWallet />
                        </div>

                        <p>Available Balance</p>

                        <h1>₹{balance}</h1>

                    </div>

                    {/* STATS */}

                    <div className="wallet-stats">

                        <div className="wallet-stat">

                            <span>Total Recharge</span>

                            <h3>₹{totalRecharge.toFixed(2)}</h3>

                        </div>

                        <div className="wallet-stat">

                            <span>Total Spent</span>

                            <h3>₹{totalSpent.toFixed(2)}</h3>

                        </div>

                    </div>

                    {/* TRANSACTION HISTORY */}

                    <div className="history-section">

                        <h3>
                            Transaction History
                        </h3>

                        {transactions.map((txn) => (

                            <div
                                className="transaction-card"
                                key={txn.id}
                            >

                                <div
                                    className={`transaction-icon ${txn.type === "credit"
                                        ? "credit"
                                        : "debit"
                                        }`}
                                >
                                    {txn.type === "credit" ? (
                                        <FaArrowDown />
                                    ) : (
                                        <FaArrowUp />
                                    )}
                                </div>

                                <div className="transaction-info">

                                    <h4>
                                        {txn.title}
                                    </h4>

                                    <p>
                                        {txn.date}
                                    </p>

                                </div>

                                <div
                                    className={`transaction-amount ${txn.type === "credit"
                                        ? "credit-text"
                                        : "debit-text"
                                        }`}
                                >
                                    {txn.type === "credit"
                                        ? `+₹${txn.amount}`
                                        : `-₹${txn.amount}`}
                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* FOOTER */}

                <div className="bottom-footer">

                    <div
                        className="footer-item"
                        onClick={() => navigate("/home")}
                    >
                        <FaHome />
                        <span>Home</span>
                    </div>

                    <div
                        className="footer-item"
                        onClick={() =>
                            navigate("/orders")
                        }
                    >
                        <FaClipboardList />
                        <span>Orders</span>
                    </div>

                    <div
                        className="footer-item"
                        onClick={() =>
                            navigate("/coupons")
                        }
                    >
                        <FaTicketAlt />
                        <span>Coupons</span>
                    </div>

                    <div
                        className="footer-item"
                        onClick={() =>
                            navigate("/wallet")
                        }
                    >
                        <FaWallet />
                        <span>Wallet</span>
                    </div>

                    <div
                        className="footer-item"
                        onClick={handleLogout}
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Wallet;