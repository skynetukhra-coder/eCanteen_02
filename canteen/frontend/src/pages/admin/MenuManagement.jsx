import React, { useState, useEffect } from "react";
import {
    FaUtensils,
    FaPlus,
    FaEdit,
    FaTrash
} from "react-icons/fa";

import breakfastImg from "../../assets/images/breakfast.jpg";
import lunchImg from "../../assets/images/lunch.jpg";
import snacksImg from "../../assets/images/snacks.jpg";

import "./MenuManagement.css";

function MenuManagement({ searchQuery = "" }) {

    const [activeMeal, setActiveMeal] = useState("Breakfast");
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Dynamic slots configuration
    const [slotsLoading, setSlotsLoading] = useState(true);
    const [tempSlots, setTempSlots] = useState({
        breakfast: { start_time: "", end_time: "" },
        lunch: { start_time: "", end_time: "" },
        snacks: { start_time: "", end_time: "" }
    });

    // Helper to convert 12-hour (e.g. "06:00 AM") to 24-hour (e.g. "06:00")
    const convertTo24Hour = (timeStr) => {
        if (!timeStr) return "";
        const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return "";
        let [_, hours, minutes, modifier] = match;
        let hrs = parseInt(hours, 10);
        if (modifier.toUpperCase() === "PM" && hrs < 12) hrs += 12;
        if (modifier.toUpperCase() === "AM" && hrs === 12) hrs = 0;
        return `${String(hrs).padStart(2, "0")}:${minutes}`;
    };

    // Helper to convert 24-hour (e.g. "06:00") to 12-hour (e.g. "06:00 AM")
    const convertTo12Hour = (timeStr) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        let hrs = parseInt(hours, 10);
        const modifier = hrs >= 12 ? "PM" : "AM";
        hrs = hrs % 12;
        hrs = hrs ? hrs : 12; // the hour '0' should be '12'
        return `${String(hrs).padStart(2, "0")}:${minutes} ${modifier}`;
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            setSlotsLoading(true);
            const res = await fetch("http://localhost:5000/api/menu/slots/all");
            const data = await res.json();
            const slots = {};
            data.forEach(s => {
                slots[s.category.toLowerCase()] = { 
                    start_time: convertTo24Hour(s.start_time), 
                    end_time: convertTo24Hour(s.end_time) 
                };
            });
            setTempSlots(prev => ({ ...prev, ...slots }));
        } catch (err) {
            console.error("Error fetching slots:", err);
        } finally {
            setSlotsLoading(false);
        }
    };

    const handleUpdateSlots = async (e) => {
        e.preventDefault();
        try {
            const payload = Object.keys(tempSlots).map(cat => ({
                category: cat.charAt(0).toUpperCase() + cat.slice(1),
                start_time: convertTo12Hour(tempSlots[cat].start_time),
                end_time: convertTo12Hour(tempSlots[cat].end_time)
            }));

            const res = await fetch("http://localhost:5000/api/menu/slots/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slots: payload })
            });
            const data = await res.json();
            if (data.success) {
                alert("Meal time slots updated successfully!");
                fetchSlots();
            } else {
                alert("Failed to update slots: " + (data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Error updating slots:", err);
            alert("Error updating slots: " + err.message);
        }
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [selectedImage, setSelectedImage] =
        useState(null);

    const [formData, setFormData] = useState({
        image_url: "",
        category: "Breakfast",
        item_name: "",
        price: "",
        available_qty: "",
        is_active: "ACTIVE"
    });

    const handleEdit = (item) => {

        setFormData({
            image_url: item.image_url,
            category: item.category,
            item_name: item.item_name,
            price: item.price,
            available_qty: item.available_qty,
            is_active: item.is_active
        });

        setEditId(item.item_id);

        setIsEditing(true);

        setShowModal(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {





        try {
            let imageUrl = formData.image_url;

            if (selectedImage) {

                const uploadData = new FormData();

                uploadData.append(
                    "image",
                    selectedImage
                );



                const uploadResponse =
                    await fetch(
                        "http://localhost:5000/api/menu/upload",
                        {
                            method: "POST",
                            body: uploadData
                        }
                    );

                const uploadResult =
                    await uploadResponse.json();



                imageUrl =
                    uploadResult.image_url;


            }

            let url =
                "http://localhost:5000/api/menu";

            let method = "POST";

            if (isEditing) {

                url =
                    `http://localhost:5000/api/menu/${editId}`;

                method = "PUT";
            }

            console.log("Selected Image:", selectedImage);

            const payload = {
                ...formData,
                image_url: imageUrl
            };

            const response =
                await fetch(url, {
                    method,
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(payload)
                });

            const data = await response.json();

            if (data.success) {
                fetchItems();
                setShowModal(false);
                setIsEditing(false);
                setEditId(null);
                setFormData({
                    image_url: "",
                    category: "Breakfast",
                    item_name: "",
                    price: "",
                    available_qty: "",
                    is_active: "ACTIVE"
                });
                alert(isEditing ? "Menu item updated successfully!" : "Menu item added successfully!");
            } else {
                alert("Failed to save menu item: " + (data.message || "Unknown error"));
            }

        } catch (error) {
            console.error(error);
            alert("Error saving menu item: " + error.message);
        }
    };

    const mealCards = [
        {
            name: "Breakfast",
            image: breakfastImg,
            subtitle: "Manage breakfast items",
        },
        {
            name: "Lunch",
            image: lunchImg,
            subtitle: "Manage lunch items",
        },
        {
            name: "Snacks",
            image: snacksImg,
            subtitle: "Manage snacks items",
        },
    ];

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await fetch(
                "http://localhost:5000/api/menu"
            );

            const data = await response.json();

            setItems(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this item?"
        );

        if (!confirmDelete) return;

        try {

            await fetch(
                `http://localhost:5000/api/menu/${id}`,
                {
                    method: "DELETE",
                }
            );

            fetchItems();

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="menu-management">

            <div className="menu-header-card">

                <div className="menu-header-left">

                    <div className="menu-icon-box">
                        <FaUtensils />
                    </div>

                    <div>
                        <h2>Menu Management</h2>
                        <p>
                            Manage Breakfast, Lunch and Snacks Items
                        </p>
                    </div>

                </div>

                <button
                    className="add-item-btn"
                    onClick={() => {
                        setIsEditing(false);
                        setEditId(null);

                        setFormData({
                            image_url: "",
                            category: "Breakfast",
                            item_name: "",
                            price: "",
                            available_qty: "",
                            is_active: "ACTIVE"
                        });

                        setShowModal(true);
                    }}
                >
                    <FaPlus />
                    Add New Item
                </button>

            </div>

            {/* TIME SLOTS CONFIGURATION PANEL */}
            <div className="time-slots-config-card" style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid #e2e8f0", marginBottom: "25px" }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", color: "#1e293b", fontWeight: "700" }}>Meal Time Slots Configuration</h3>
                {slotsLoading ? (
                    <div style={{ fontSize: "14px", color: "#64748b" }}>Loading time slots...</div>
                ) : (
                    <form onSubmit={handleUpdateSlots} style={{ display: "flex", gap: "20px", alignItems: "flex-end", flexWrap: "wrap" }}>
                        {Object.keys(tempSlots).map((cat) => (
                            <div key={cat} style={{ display: "flex", gap: "10px", alignItems: "center", background: "#f8fafc", padding: "10px 15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                                <span style={{ fontWeight: "600", minWidth: "80px", textTransform: "capitalize", fontSize: "14px", color: "#475569" }}>{cat}:</span>
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <label style={{ fontSize: "10px", color: "#64748b" }}>Start Time</label>
                                    <input 
                                        type="time" 
                                        value={tempSlots[cat].start_time}
                                        onChange={(e) => setTempSlots({
                                            ...tempSlots,
                                            [cat]: { ...tempSlots[cat], start_time: e.target.value }
                                        })}
                                        style={{ width: "120px", padding: "4px 8px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <label style={{ fontSize: "10px", color: "#64748b" }}>End Time</label>
                                    <input 
                                        type="time" 
                                        value={tempSlots[cat].end_time}
                                        onChange={(e) => setTempSlots({
                                            ...tempSlots,
                                            [cat]: { ...tempSlots[cat], end_time: e.target.value }
                                        })}
                                        style={{ width: "120px", padding: "4px 8px", fontSize: "13px", border: "1px solid #cbd5e1", borderRadius: "4px" }}
                                    />
                                </div>
                            </div>
                        ))}
                        <button 
                            type="submit" 
                            style={{ background: "#7c3aed", color: "#ffffff", border: "none", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            Update Slots
                        </button>
                    </form>
                )}
            </div>

            <div className="meal-cards">

                {mealCards.map((meal) => (

                    <div
                        key={meal.name}
                        className={`meal-card ${activeMeal === meal.name
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            setActiveMeal(meal.name)
                        }
                    >

                        <img
                            src={meal.image}
                            alt={meal.name}
                        />

                        <div className="meal-overlay">
                            <h2>{meal.name}</h2>
                            <p>{meal.subtitle}</p>
                        </div>

                    </div>

                ))}

            </div>

            <div className="menu-table-card">

                <div className="table-title">
                    {activeMeal} Menu
                </div>

                <table className="menu-table">

                    <thead>

                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Category</th>
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {items
                            .filter(
                                (item) =>
                                    item.category === activeMeal &&
                                    (!searchQuery || item.item_name.toLowerCase().includes(searchQuery.toLowerCase()))
                            )
                            .map((item) => (

                                <tr
                                    key={item.item_id}
                                >

                                    <td>
                                        {item.item_id}
                                    </td>

                                    <td>

                                        <img
                                            className="table-image"
                                            src={`http://localhost:5000${item.image_url}`}
                                            alt={item.item_name}
                                            onError={(e) => {
                                                console.log(
                                                    "Image failed:",
                                                    `http://localhost:5000${item.image_url}`
                                                );
                                            }}
                                        />

                                    </td>

                                    <td>
                                        {item.category}
                                    </td>

                                    <td>
                                        {item.item_name}
                                    </td>

                                    <td>
                                        ₹{item.price}
                                    </td>

                                    <td>
                                        {
                                            item.available_qty
                                        }
                                    </td>

                                    <td>

                                        {item.is_active === "ACTIVE"
                                            ? "ACTIVE"
                                            : "INACTIVE"}

                                    </td>

                                    <td>

                                        {new Date(
                                            item.created_at
                                        ).toLocaleDateString()}

                                    </td>

                                    <td>

                                        <div className="action-buttons">

                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <FaEdit />
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        item.item_id
                                                    )
                                                }
                                            >
                                                <FaTrash />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                    </tbody>

                </table>

            </div>

            {
                showModal && (

                    <div className="modal-overlay">

                        <div className="modal-box">

                            <h2>
                                {isEditing
                                    ? "Edit Menu Item"
                                    : "Add New Menu Item"}
                            </h2>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setSelectedImage(
                                        e.target.files[0]
                                    )
                                }
                            />

                            {formData.image_url && (
                                <img
                                    src={formData.image_url}
                                    alt="Preview"
                                    style={{
                                        width: "120px",
                                        height: "120px",
                                        objectFit: "cover",
                                        borderRadius: "10px",
                                        border: "1px solid #ddd"
                                    }}
                                />
                            )}

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Snacks</option>
                            </select>

                            <input
                                type="text"
                                name="item_name"
                                placeholder="Item Name"
                                value={formData.item_name}
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="price"
                                placeholder="Price"
                                value={formData.price}
                                onChange={handleChange}
                            />

                            <input
                                type="number"
                                name="available_qty"
                                placeholder="Quantity"
                                value={formData.available_qty}
                                onChange={handleChange}
                            />

                            <select
                                name="is_active"
                                value={formData.is_active}
                                onChange={handleChange}
                            >
                                <option value="ACTIVE">
                                    ACTIVE
                                </option>

                                <option value="INACTIVE">
                                    INACTIVE
                                </option>

                            </select>

                            <div className="modal-actions">

                                <button
                                    className="save-btn"
                                    onClick={() => {

                                        handleSave();
                                    }}
                                >
                                    Save
                                </button>

                                <button
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div >
    );
}

export default MenuManagement;