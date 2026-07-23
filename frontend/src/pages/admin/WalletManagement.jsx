import React, { useState, useEffect } from "react";
import {
    FaSearch,
    FaWallet,
    FaPlus,
    FaMinus,
    FaHistory,
    FaExclamationTriangle,
    FaShieldAlt,
    FaDownload
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

const API_BASE = (window.API_BASE_URL || "http://localhost:5000") + "/api/wallet";

function WalletManagement() {
    const [employees, setEmployees] = useState([]);
    const [recharges, setRecharges] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [rechargeToday, setRechargeToday] = useState(0);
    const [rechargeTrend, setRechargeTrend] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

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
            const [listRes, rechargesRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE}/list`),
                axios.get(`${API_BASE}/recharges`),
                axios.get(`${API_BASE}/stats`)
            ]);
            setEmployees(listRes.data);
            setRecharges(rechargesRes.data);
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

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
    };

    const filteredRecharges = recharges.filter(r => {
        if (!startDate && !endDate) return true;

        const logTime = new Date(r.rawDate).getTime();
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (logTime < start.getTime()) return false;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (logTime > end.getTime()) return false;
        }
        return true;
    });

    const printReport = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Wallet Recharge History Report</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
                        h1 { margin-bottom: 5px; color: #2c3e50; }
                        p { margin-top: 0; color: #7f8c8d; font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
                        th { background-color: #f8f9fa; color: #2c3e50; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                    </style>
                </head>
                <body>
                    <h1>Canteen Wallet Recharge Report</h1>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                    <p>Date Range: ${startDate || 'Start'} to ${endDate || 'End'}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Amount Recharged</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredRecharges.map(r => `
                                <tr>
                                    <td>${r.time}</td>
                                    <td>${r.employee_code}</td>
                                    <td>${r.employee_name}</td>
                                    <td>₹${parseFloat(r.amount).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <script>
                        window.onload = function() {
                            window.print();
                            window.close();
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const exportToCSV = () => {
        const headers = ["Timestamp", "Employee ID", "Employee Name", "Amount Recharged"];
        const rows = filteredRecharges.map(r => [
            r.time,
            r.employee_code,
            r.employee_name,
            r.amount
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `wallet_recharges_${startDate || 'all'}_to_${endDate || 'all'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="wallet-page">
            {/* HEADER CARD */}
            <div className="wallet-header-card">
                <div className="wallet-header-left">
                    <div className="wallet-icon-box">
                        <FaWallet />
                    </div>
                    <div>
                        <h2>Wallet Management</h2>
                        <p>Manage employee canteen wallets, process balance recharges, and verify transaction hashes.</p>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "flex-end" }}>
                    {/* ROW 1: Date filters, Reset, Print, CSV */}
                    <div className="orders-date-filter-block" style={{ margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="filter-input-group">
                            <label>Start</label>
                            <input 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)} 
                                onClick={(e) => e.target.showPicker()}
                                onFocus={(e) => e.target.showPicker()}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                        <div className="filter-input-group">
                            <label>End</label>
                            <input 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)} 
                                onClick={(e) => e.target.showPicker()}
                                onFocus={(e) => e.target.showPicker()}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                        <button className="reset-filter-btn" onClick={handleReset}>
                            Reset
                        </button>
                        <button className="print-report-btn" onClick={printReport}>
                            Print
                        </button>
                        <button className="export-csv-btn" onClick={exportToCSV}>
                            <FaDownload /> CSV
                        </button>
                    </div>

                    {/* ROW 2: Search Input and Run Integrity Scan Button */}
                    <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                        <div className="wallet-search" style={{ height: "42px", padding: "0 16px", display: "flex", alignItems: "center" }}>
                            <FaSearch />
                            <input
                                type="text"
                                placeholder="Search Employee..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ height: "100%", background: "transparent", border: "none", outline: "none" }}
                            />
                        </div>

                        <button className="verify-btn" onClick={handleVerifyAll} style={{ margin: 0, height: "42px", padding: "0 20px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <FaShieldAlt />
                            Run Integrity Scan
                        </button>
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
                <h2>Wallet Recharge History</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Amount Recharged (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecharges.length === 0 ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", color: "#666" }}>
                                    No recharge transactions recorded yet.
                                </td>
                            </tr>
                        ) : (
                            filteredRecharges.map((r) => (
                                <tr key={r.transaction_id}>
                                    <td>{r.time}</td>
                                    <td>{r.employee_code}</td>
                                    <td>{r.employee_name}</td>
                                    <td>
                                        <strong>₹{parseFloat(r.amount).toFixed(2)}</strong>
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