const express = require("express");
const router = express.Router();
const db = require("../config/db");
const crypto = require("crypto");

const HMAC_SECRET = "canteen_wallet_integrity_key";

function generateWalletSignature(employeeId, balance) {
    const formattedBalance = parseFloat(balance).toFixed(2);
    return crypto
        .createHmac("sha256", HMAC_SECRET)
        .update(`${employeeId}:${formattedBalance}`)
        .digest("hex");
}


// CREATE PAYMENT
router.post("/create", async (req, res) => {

    console.log("PAYMENT REQUEST:", req.body);

    try {

        const {
            order_id,
            employee_id,
            amount,
            payment_method
        } = req.body;

        let empId = employee_id;

        // Redirect admin checkouts to dedicated guest 'admin_user'
        const [empRows] = await db.query(
            "SELECT role FROM employee WHERE employee_id = ?",
            [employee_id]
        );
        if (empRows.length > 0 && empRows[0].role === 'ADMIN') {
            const [adminGuestRows] = await db.query(
                "SELECT employee_id FROM employee WHERE username = 'admin_user'"
            );
            if (adminGuestRows.length > 0) {
                empId = adminGuestRows[0].employee_id;
            }
        }

        const [lastPayment] =
            await db.query(`
                SELECT payment_id
                FROM payments
                ORDER BY payment_id DESC
                LIMIT 1
            `);

        let paymentId = "PAY0001";

        if (lastPayment.length > 0) {

            const lastNo =
                parseInt(
                    lastPayment[0]
                        .payment_id
                        .replace("PAY", "")
                );

            paymentId =
                `PAY${String(lastNo + 1)
                    .padStart(4, "0")}`;
        }

        if (payment_method === "Wallet") {
            const [walletRows] = await db.query(
                "SELECT balance, signature FROM wallets WHERE employee_id = ?",
                [empId]
            );
            if (walletRows.length === 0) {
                return res.status(400).json({ success: false, message: "Wallet not initialized." });
            }
            const currentBalance = parseFloat(walletRows[0].balance);
            const signature = walletRows[0].signature;
            const expectedSig = generateWalletSignature(empId, currentBalance);

            if (expectedSig !== signature) {
                const details = `CRITICAL ALERT: Tampering detected for Wallet of Employee ID ${empId}. Attempted meal purchase of ₹${amount} was aborted.`;
                await db.query(
                    "INSERT INTO audit_logs (action_name, details, severity) VALUES ('WALLET_TAMPERING_DETECTED', ?, 'CRITICAL')",
                    [details]
                );
                return res.status(400).json({ success: false, message: "Wallet integrity check failed. Canteen order aborted." });
            }

            const deductAmt = parseFloat(amount);
            if (currentBalance < deductAmt) {
                return res.status(400).json({ success: false, message: "Insufficient wallet balance." });
            }

            const newBalance = currentBalance - deductAmt;
            const newSig = generateWalletSignature(empId, newBalance);

            await db.query(
                "UPDATE wallets SET balance = ?, signature = ? WHERE employee_id = ?",
                [newBalance, newSig, empId]
            );

            // Log deduction in audit logs
            await db.query(
                "INSERT INTO audit_logs (action_name, details, severity) VALUES ('MEAL_PURCHASE_DEDUCTION', ?, 'INFO')",
                [`Employee ID ${empId} spent ₹${deductAmt} from Wallet for Canteen Order ID ${order_id}.`]
            );

            // Log inside wallet_transactions
            await db.query(
                "INSERT INTO wallet_transactions (employee_id, type, amount, title) VALUES (?, 'debit', ?, 'Meal Coupon (Wallet)')",
                [empId, deductAmt]
            );
        }

        await db.query(
            `
            INSERT INTO payments
            (
                payment_id,
                order_id,
                employee_id,
                amount,
                payment_method,
                payment_status
            )
            VALUES
            (?, ?, ?, ?, ?, 'SUCCESS')
            `,
            [
                paymentId,
                order_id,
                empId,
                amount,
                payment_method
            ]
        );

        res.json({
            success: true,
            payment_id: paymentId
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }
});


// ADMIN PAYMENT HISTORY
router.get("/", async (req, res) => {

    try {

        const [rows] = await db.query(`
            SELECT
                p.payment_id,

                CONCAT(
                    'ORD',
                    p.order_id
                ) AS order_id,

                e.full_name AS employee_name,

                p.amount,

                p.payment_method,

                p.payment_status,

                p.payment_date AS rawDate,

                DATE_FORMAT(
                    p.payment_date,
                    '%d-%m-%Y %h:%i %p'
                ) AS payment_date

            FROM payments p

            JOIN employee e
            ON p.employee_id =
               e.employee_id

            ORDER BY
                p.payment_date DESC
        `);

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});


// EMPLOYEE PAYMENT HISTORY
router.get(
    "/employee/:employeeId",
    async (req, res) => {

        try {

            const [rows] =
                await db.query(
                    `
            SELECT

                payment_id,

                CONCAT(
                    'ORD',
                    order_id
                ) AS order_id,

                amount,

                payment_method,

                payment_status,

                payment_date

            FROM payments

            WHERE employee_id = ?

            ORDER BY
                payment_date DESC
            `,
                    [
                        req.params.employeeId
                    ]
                );

            res.json(rows);

        } catch (err) {

            res.status(500).json(err);

        }

    });

module.exports = router;