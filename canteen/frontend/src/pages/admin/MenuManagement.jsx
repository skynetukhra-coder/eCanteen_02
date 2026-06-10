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

            const data =
                await response.json();

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
            }

        } catch (error) {

            console.error(error);

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