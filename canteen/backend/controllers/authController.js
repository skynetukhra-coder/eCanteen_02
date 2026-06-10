const db = require("../config/db");

exports.login = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { username, password } = req.body;

        const [rows] = await db.query(
            "SELECT * FROM employee WHERE username = ?",
            [username]
        );

        console.log("Rows Found:", rows);

        if (rows.length === 0) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const user = rows[0];

        console.log("DB Password:", user.password);
        console.log("Entered Password:", password);

        if (user.password !== password) {
            return res.json({
                success: false,
                message: "Invalid Password"
            });
        }

        return res.json({
            success: true,
            user: {
                employee_id: user.employee_id,
                username: user.username,
                full_name: user.full_name,
                role: user.role,
                email: user.email,
                mobile: user.mobile,
                designation: user.designation,
                profile_image: user.profile_image
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:");
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { employee_id, current_password, new_password } = req.body;

        if (!employee_id || !current_password || !new_password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields (employee_id, current_password, new_password)."
            });
        }

        const [rows] = await db.query(
            "SELECT * FROM employee WHERE employee_id = ? AND role = 'ADMIN'",
            [employee_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Administrator user not found."
            });
        }

        const user = rows[0];

        if (user.password !== current_password) {
            return res.status(400).json({
                success: false,
                message: "Incorrect current password."
            });
        }

        await db.query(
            "UPDATE employee SET password = ? WHERE employee_id = ?",
            [new_password, employee_id]
        );

        // Insert log in audit_logs
        await db.query(
            "INSERT INTO audit_logs (action_name, details, severity) VALUES ('ADMIN_PASSWORD_CHANGED', ?, 'INFO')",
            [`Admin ${user.full_name} (ID: ${employee_id}) successfully changed their password.`]
        );

        return res.json({
            success: true,
            message: "Password changed successfully."
        });

    } catch (error) {
        console.error("CHANGE PASSWORD ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};