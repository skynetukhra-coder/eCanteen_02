const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:category", async (req, res) => {
    try {
        const { category } = req.params;

        const formattedCategory =
            category.charAt(0).toUpperCase() +
            category.slice(1).toLowerCase();

        const [rows] = await db.query(
            `
            SELECT
                item_id AS id,
                item_name AS name,
                price,
                image_url,
                available_qty
            FROM menu_items
            WHERE category = ?
            AND is_active = 'ACTIVE'
            `,
            [formattedCategory]
        );

        res.json(rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;