import React, {
    useMemo,
    useState,
    useEffect,
} from "react";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaUser,
    FaClipboardList,
    FaTicketAlt,
    FaWallet,
    FaSignOutAlt,
    FaMinus,
    FaPlus,
    FaHome,
} from "react-icons/fa";

import breakfastBanner from "../../assets/images/breakfast.jpg";
import lunchBanner from "../../assets/images/lunch.jpg";
import snacksBanner from "../../assets/images/snacks.jpg";


import "./MenuDetails.css";

function MenuDetails() {
    const navigate = useNavigate();
    const { mealType } = useParams();

    const user = JSON.parse(localStorage.getItem("user"));

    const [menuItems, setMenuItems] =
        useState([]);

    const menuData = {
        breakfast: {
            title: "Breakfast Menu",
            time: "06:00 AM - 10:00 AM",
            banner: breakfastBanner,
        },

        lunch: {
            title: "Lunch Menu",
            time: "11:30 AM - 02:30 PM",
            banner: lunchBanner,
        },

        snacks: {
            title: "Snacks Menu",
            time: "04:00 PM - 06:00 PM",
            banner: snacksBanner,
        },
    };

    const selectedMenu =
        menuData[mealType?.toLowerCase()];

    useEffect(() => {
        fetchMenuItems();
    }, [mealType]);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/menu/${mealType}`
            );

            setMenuItems(response.data);
            console.log("MENU DATA:", response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const [quantities, setQuantities] = useState({});

    const increaseQty = (id, availableQty) => {
        const isAdmin = user?.role === "ADMIN" || user?.username === "admin";
        if (isAdmin && Number(availableQty || 0) <= 0) {
            alert(`Warning: This item is out of stock (Available quantity: ${availableQty}). Proceeding will drive inventory negative.`);
        }
        setQuantities((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }));
    };

    const decreaseQty = (id) => {
        setQuantities((prev) => ({
            ...prev,
            [id]:
                (prev[id] || 0) > 0
                    ? prev[id] - 1
                    : 0,
        }));
    };

    const totalItems = useMemo(() => {
        return Object.values(quantities).reduce(
            (a, b) => a + b,
            0
        );
    }, [quantities]);

    const totalAmount = useMemo(() => {
        return menuItems.reduce(
            (sum, item) =>
                sum +
                Number(item.price) *
                (quantities[item.id] || 0),
            0
        );
    }, [quantities, menuItems]);


    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (!selectedMenu) {
        return (
            <div className="menu-error">
                Menu Not Found
            </div>
        );
    }

    return (
        <div className="menu-page">

            <div className="menu-main-card">

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

                <div className="menu-content">

                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft />
                        Back
                    </button>

                    <div className="banner-card">
                        <img
                            src={selectedMenu.banner}
                            alt={selectedMenu.title}
                        />
                    </div>

                    <div className="menu-title-section">
                        <h2>{selectedMenu.title}</h2>
                        <p>{selectedMenu.time}</p>
                    </div>

                    {menuItems.map((item) => {
                        const isOutOfStock = Number(item.available_qty || 0) <= 0;
                        const isAdmin = user?.role === "ADMIN" || user?.username === "admin";
                        const isDisabled = isOutOfStock && !isAdmin;

                        return (
                            <div
                                className={`food-item-card ${isDisabled ? "disabled-item" : ""}`}
                                key={item.id}
                                style={isDisabled ? { opacity: 0.5, pointerEvents: "none" } : {}}
                            >
                                <div className="food-left">

                                    <img
                                        src={`http://localhost:5000${item.image_url}`}
                                        alt={item.name}
                                        className="food-item-image"
                                    />

                                    <div>
                                        <h4>{item.name}</h4>

                                        <span>₹{item.price}</span>

                                        {isAdmin && isOutOfStock && (
                                            <div style={{ color: "#d97706", fontSize: "11px", fontWeight: "600", marginTop: "4px" }}>
                                                ⚠️ Warning: Stock is {item.available_qty || 0}
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="qty-section">

                                    <button
                                        onClick={() =>
                                            decreaseQty(item.id)
                                        }
                                    >
                                        <FaMinus />
                                    </button>

                                    <span>
                                        {quantities[item.id] || 0}
                                    </span>

                                    <button
                                        onClick={() =>
                                            increaseQty(item.id, item.available_qty)
                                        }
                                    >
                                        <FaPlus />
                                    </button>

                                </div>
                            </div>
                        );
                    })}

                    <div className="cart-summary">

                        <h3>
                            Items Selected : {totalItems}
                        </h3>

                        <h2>
                            Total Amount : ₹{totalAmount}
                        </h2>

                        <button
                            className="cart-btn"
                            onClick={() => {

                                const cartItems = menuItems
                                    .filter(
                                        (item) =>
                                            (quantities[item.id] || 0) > 0
                                    )
                                    .map((item) => ({
                                        ...item,
                                        selectedQty:
                                            quantities[item.id],
                                    }));

                                navigate(user?.username === "admin" ? "/admin-payment" : "/payment", {
                                    state: {
                                        cartItems,
                                        totalItems,
                                        totalAmount,
                                        mealType,
                                    },
                                });
                            }}
                        >
                            Add To Cart
                        </button>

                    </div>

                </div>

                {/* FOOTER */}

                <div className="bottom-footer">

                    {user?.username !== "admin" && (
                        <div
                            className="footer-item"
                            onClick={() => navigate("/home")}
                        >
                            <FaHome />
                            <span>Home</span>
                        </div>
                    )}

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

export default MenuDetails;