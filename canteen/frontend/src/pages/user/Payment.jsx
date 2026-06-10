import React, { useState, useEffect } from "react";
import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    FaArrowLeft,
    FaUser,
    FaClipboardList,
    FaTicketAlt,
    FaWallet,
    FaSignOutAlt,
} from "react-icons/fa";
import axios from "axios";

import "./Payment.css";

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();

    const cartItems =
        location.state?.cartItems || [];

    const user = JSON.parse(
        localStorage.getItem("user")
    ) || {};

    const [walletBalance, setWalletBalance] = useState(0.00);

    useEffect(() => {
        if (user.employee_id) {
            axios.get(`http://localhost:5000/api/wallet/balance/${user.employee_id}`)
                .then(res => {
                    setWalletBalance(parseFloat(res.data.balance));
                })
                .catch(err => {
                    console.error("Error fetching wallet balance:", err);
                });
        }
    }, []);

    const [paymentMethod, setPaymentMethod] =
        useState(user?.role === "ADMIN" ? "Cash" : "Wallet");

    const totalItems = cartItems.reduce(
        (sum, item) =>
            sum + (item.selectedQty || 0),
        0
    );

    const totalAmount = cartItems.reduce(
        (sum, item) =>
            sum +
            Number(item.price) *
            (item.selectedQty || 0),
        0
    );

    const remainingBalance =
        walletBalance - totalAmount;

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className="payment-page">
            <div className="payment-main-card">

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
                            Accountant General (A&E),
                            W.B.
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

                <div className="payment-content">

                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft />
                        Back
                    </button>

                    <div className="payment-title">

                        <h2>
                            Payment Summary
                        </h2>

                        <p>
                            {user?.full_name}
                            {" | "}
                            {user?.username}
                        </p>

                    </div>

                    {/* ORDER SUMMARY */}

                    <div className="payment-card">

                        <h3>
                            Order Summary
                        </h3>

                        {cartItems.length > 0 ? (
                            cartItems.map(
                                (item) => (
                                    <div
                                        className="info-row"
                                        key={item.id}
                                    >
                                        <span>
                                            {item.name}
                                            {" x "}
                                            {
                                                item.selectedQty
                                            }
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                item.price
                                            ) *
                                                item.selectedQty}
                                        </strong>
                                    </div>
                                )
                            )
                        ) : (
                            <div className="info-row">
                                <span>
                                    No items selected
                                </span>
                            </div>
                        )}

                        <div className="info-row total-row">

                            <span>
                                Total Items
                            </span>

                            <strong>
                                {totalItems}
                            </strong>

                        </div>

                        <div className="info-row total-row">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹{totalAmount}
                            </strong>

                        </div>

                    </div>

                    {/* PAYMENT METHOD */}

                    <div className="payment-card">

                        <h3>
                            Select Payment
                            Method
                        </h3>

                        {user?.role !== "ADMIN" && (
                            <label className="payment-option">
                                <input
                                    type="radio"
                                    checked={paymentMethod === "Wallet"}
                                    onChange={() => setPaymentMethod("Wallet")}
                                />
                                Wallet Balance (₹{walletBalance})
                            </label>
                        )}

                        {user?.role === "ADMIN" && (
                            <>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        checked={paymentMethod === "Cash"}
                                        onChange={() => setPaymentMethod("Cash")}
                                    />
                                    Cash Payment
                                </label>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        checked={paymentMethod === "Scan QR"}
                                        onChange={() => setPaymentMethod("Scan QR")}
                                    />
                                    Scan QR Code
                                </label>
                            </>
                        )}

                        {user?.role !== "ADMIN" && (
                            <>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        checked={paymentMethod === "BHIM UPI"}
                                        onChange={() => setPaymentMethod("BHIM UPI")}
                                    />
                                    BHIM UPI
                                </label>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        checked={paymentMethod === "PhonePe"}
                                        onChange={() => setPaymentMethod("PhonePe")}
                                    />
                                    PhonePe
                                </label>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        checked={paymentMethod === "Google Pay"}
                                        onChange={() => setPaymentMethod("Google Pay")}
                                    />
                                    Google Pay
                                </label>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        checked={paymentMethod === "SuperMoney"}
                                        onChange={() => setPaymentMethod("SuperMoney")}
                                    />
                                    SuperMoney
                                </label>
                            </>
                        )}
                    </div>

                    {/* PAYMENT DETAILS */}

                    <div className="payment-card">

                        <h3>
                            Payment Details
                        </h3>

                        <div className="info-row">

                            <span>
                                Payment Method
                            </span>

                            <strong>
                                {paymentMethod}
                            </strong>

                        </div>

                        <div className="info-row">

                            <span>
                                Amount To Pay
                            </span>

                            <strong>
                                ₹{totalAmount}
                            </strong>

                        </div>

                        {paymentMethod ===
                            "Wallet" && (
                                <>
                                    <div className="info-row">

                                        <span>
                                            Wallet
                                            Balance
                                        </span>

                                        <strong>
                                            ₹
                                            {
                                                walletBalance
                                            }
                                        </strong>

                                    </div>

                                    <div className="info-row">

                                        <span>
                                            Balance After
                                            Payment
                                        </span>

                                        <strong className="wallet-balance">
                                            ₹
                                            {
                                                remainingBalance
                                            }
                                        </strong>

                                    </div>
                                </>
                            )}

                    </div>

                    {/* PAY BUTTON */}

                    <div className="payment-bottom-action">

                        <button
                            className="pay-btn"
                            onClick={() => {
                                if (paymentMethod === "Wallet" && remainingBalance < 0) {
                                    alert("Insufficient Wallet Balance! Please use another payment method.");
                                    return;
                                }

                                navigate("/paymentsuccess", {
                                    state: {
                                        cartItems,
                                        totalItems,
                                        totalAmount,
                                        paymentMethod,
                                        user
                                    }
                                });

                            }}
                        >
                            Proceed To Pay
                        </button>

                    </div>

                </div>

                {/* FOOTER */}

                <div className="bottom-footer">

                    <div
                        className="footer-item"
                        onClick={() =>
                            navigate(user?.role === "ADMIN" ? "/admin" : "/profile")
                        }
                    >
                        <FaUser />
                        <span>{user?.role === "ADMIN" ? "Dashboard" : "Profile"}</span>
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

                    {user?.username !== "admin" && (
                        <div
                            className="footer-item"
                            onClick={() =>
                                navigate("/wallet")
                            }
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

            </div>
        </div>
    );
}

export default Payment;