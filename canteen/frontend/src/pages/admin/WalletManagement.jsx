import React, { useState, useEffect } from "react";
import {
    FaSearch,
    FaWallet,
    FaPlus,
    FaMinus,
    FaHistory,
    FaExclamationTriangle,
    FaShieldAlt
} from "react-icons/fa";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import "./WalletManagement.css";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/wallet";

function WalletManagement() {
    const [employees, setEmployees] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [rechargeToday, setRechargeToday] = useState(0);
    const [rechargeTrend, setRechargeTrend] = useState([]);

    // Modal control
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [modifyType, setModifyType] = useState("RECHARGE"); // RECHARGE or DEDUCT
    const [amount, setAmount] = useState("");
    const [adminPassword, setAdminPassword] = useState("");

    // Get current logged in admin
    const adminUser = JSON.parse(localStorage.getItem("user")) || {};

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [listRes, logsRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE}/list`),
                axios.get(`${API_BASE}/audit-logs`),
                axios.get(`${API_BASE}/stats`)
            ]);
            setEmployees(listRes.data);
            setAuditLogs(logsRes.data);
            setRechargeToday(statsRes.data.todayRecharges);
            setRechargeTrend(statsRes.data.trendData);
        } catch (err) {
            console.error("Error fetching wallet data:", err);
        }
    };

    const handleOpenModal = (emp, type) => {
        setSelectedEmp(emp);
        setModifyType(type);
        setAmount("");
        setAdminPassword("");
        setIsModalOpen(true);
    };

    const handleModifySubmit = async (e) => {
        e.preventDefault();
        if (!selectedEmp || !amount || !adminPassword) {
            alert("Please fill in all fields.");
            return;
        }

        const amtVal = parseFloat(amount);
        if (isNaN(amtVal) || amtVal <= 0) {
            alert("Please enter a valid positive amount.");
            return;
        }

        const signedAmount = modifyType === "RECHARGE" ? amtVal : -amtVal;

        try {
            const res = await axios.post(`${API_BASE}/modify`, {
                employee_id: selectedEmp.employee_id,
                amount: signedAmount,
                admin_id: adminUser.employee_id,
                admin_password: adminPassword
            });

            setIsModalOpen(false);
            fetchData();
            alert(res.data.message || "Wallet modified successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Modification failed. Verify admin password.");
        }
    };

    const handleVerifyAll = async () => {
        try {
            const res = await axios.post(`${API_BASE}/verify-all`);
            alert(`Integrity Scan Complete!\nTotal wallets checked: ${res.data.total_checked}\nDiscrepancies found: ${res.data.tampered_count}`);
            fetchData();
        } catch (err) {
            alert("Verification scan failed.");
        }
    };

    const filteredEmployees = employees.filter(
        (emp) =>
            emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sum details
    const totalWalletBalance = employees.reduce((sum, emp) => sum + parseFloat(emp.balance), 0);
    const hasTamperedWallets = employees.some(emp => emp.is_tampered);

    return (
        <div className="wallet-page">
            <div className="wallet-header">
                <h1>Wallet Management</h1>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button className="verify-btn" onClick={handleVerifyAll}>
                        <FaShieldAlt />
                        Run Integrity Scan
                    </button>

                    <div className="wallet-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search Employee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* TAMPER DETECTED ALERT BANNER */}
            {hasTamperedWallets && (
                <div className="tamper-banner">
                    <FaExclamationTriangle />
                    <span>
                        CRITICAL WARNING: Out-of-band wallet balance tampering has been detected!
                        Discrepancies have been logged automatically in the system audit logs.
                    </span>
                </div>
            )}

            {/* KPI CARDS */}
            <div className="wallet-stats">
                <div className="wallet-stat-card">
                    <FaWallet />
                    <h3>₹{totalWalletBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h3>
                    <p>Total Wallet Balance</p>
                </div>

                <div className="wallet-stat-card">
                    <FaPlus />
                    <h3>₹{rechargeToday.toLocaleString("en-IN", { minimumFractionDigits: 0 })}</h3>
                    <p>Recharge Today (Dynamic)</p>
                </div>

                <div className="wallet-stat-card">
                    <FaHistory />
                    <h3>{employees.length}</h3>
                    <p>Active Wallets</p>
                </div>
            </div>

            {/* CHART */}
            <div className="wallet-chart-card">
                <h2>Wallet Recharge Trend (Dynamic)</h2>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={rechargeTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="amount"
                            stroke="#f59e0b"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* EMPLOYEE TABLE */}
            <div className="wallet-table-card">
                <h2>Employee Canteen Wallets (Database Records)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Employee Code</th>
                            <th>Name</th>
                            <th>Designation</th>
                            <th>Wallet Balance</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center", color: "#666" }}>
                                    No employee wallets found.
                                </td>
                            </tr>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <tr key={emp.employee_id}>
                                    <td>{emp.username}</td>
                                    <td>{emp.full_name}</td>
                                    <td>{emp.designation || "N/A"}</td>
                                    <td>
                                        <strong>₹{parseFloat(emp.balance).toFixed(2)}</strong>
                                        {emp.is_tampered && (
                                            <span className="tamper-badge" title="HMAC Signature Mismatch!">
                                                TAMPERED
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                className="recharge-btn"
                                                onClick={() => handleOpenModal(emp, "RECHARGE")}
                                            >
                                                Recharge
                                            </button>
                                            <button
                                                className="deduct-btn"
                                                onClick={() => handleOpenModal(emp, "DEDUCT")}
                                            >
                                                Deduct
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* RECENT TRANSACTIONS / AUDIT LOGS */}
            <div className="history-card">
                <h2>Security Audit Logs (System Action Trails)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Time Logged</th>
                            <th>Action Type</th>
                            <th>Log Message Description</th>
                            <th>Severity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLogs.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", color: "#666" }}>
                                    No security logs recorded yet.
                                </td>
                            </tr>
                        ) : (
                            auditLogs.map((log) => (
                                <tr key={log.log_id}>
                                    <td>{log.time}</td>
                                    <td><strong>{log.action_name}</strong></td>
                                    <td>{log.details}</td>
                                    <td>
                                        <span className={`log-severity-${log.severity.toLowerCase()}`}>
                                            {log.severity}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL: RECHARGE / DEDUCT WALLET BALANCE */}
            {isModalOpen && selectedEmp && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>
                            {modifyType === "RECHARGE" ? "Recharge Wallet" : "Deduct Balance"}
                        </h2>
                        <p style={{ margin: "5px 0 20px 0", color: "#4b5563" }}>
                            Target Employee: <strong>{selectedEmp.full_name}</strong> ({selectedEmp.username})
                        </p>
                        <form onSubmit={handleModifySubmit} className="modal-form">
                            <div className="form-field">
                                <label>Enter Amount (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="e.g. 500"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div className="form-field">
                                <label>Admin Verification PIN/Password</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter your admin password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                />
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    Confirm Action
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WalletManagement;