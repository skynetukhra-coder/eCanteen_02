import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaWallet,
    FaMoneyBillWave,
    FaBalanceScale,
    FaChartBar,
    FaPlus,
    FaUniversity,
    FaFileInvoiceDollar,
    FaCalendarAlt,
    FaTicketAlt,
    FaTimes,
    FaCloudUploadAlt,
    FaPrint,
    FaArrowLeft
} from "react-icons/fa";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis
} from "recharts";
import axios from "axios";
import "./Cashbook.css";

const API_BASE = "http://localhost:5000/api/cashbook";

function Cashbook() {
    const navigate = useNavigate();
    
    // Date selection (defaults to today)
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    // Modal Visibility States
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [isClosingModalOpen, setIsClosingModalOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);

    // Form States
    const [receiptForm, setReceiptForm] = useState({
        amount: "",
        description: "",
        payment_mode: "Cash",
        entry_date: ""
    });

    const [expenseForm, setExpenseForm] = useState({
        amount: "",
        description: "",
        payment_mode: "Cash",
        entry_date: ""
    });

    const [bankForm, setBankForm] = useState({
        entry_type: "BANK_CREDIT",
        amount: "",
        description: "",
        entry_date: ""
    });
    const [receiptFile, setReceiptFile] = useState(null);

    useEffect(() => {
        fetchCashbookSummary(selectedDate);
    }, [selectedDate]);

    const fetchCashbookSummary = async (date) => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/summary?date=${date}`);
            setSummary(res.data);
        } catch (err) {
            console.error("Error loading cashbook data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Submits
    const handleReceiptSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/manual-entry`, {
                entry_type: "RECEIPT",
                amount: receiptForm.amount,
                description: receiptForm.description,
                payment_mode: receiptForm.payment_mode,
                entry_date: receiptForm.entry_date || selectedDate
            });
            setIsReceiptModalOpen(false);
            setReceiptForm({ amount: "", description: "", payment_mode: "Cash", entry_date: "" });
            fetchCashbookSummary(selectedDate);
            alert("Receipt entry added successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add manual receipt.");
        }
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/manual-entry`, {
                entry_type: "EXPENSE",
                amount: expenseForm.amount,
                description: expenseForm.description,
                payment_mode: expenseForm.payment_mode,
                entry_date: expenseForm.entry_date || selectedDate
            });
            setIsExpenseModalOpen(false);
            setExpenseForm({ amount: "", description: "", payment_mode: "Cash", entry_date: "" });
            fetchCashbookSummary(selectedDate);
            alert("Expense entry added successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add manual expense.");
        }
    };

    const handleBankSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("entry_type", bankForm.entry_type);
            formData.append("amount", bankForm.amount);
            formData.append("description", bankForm.description);
            formData.append("payment_mode", "Bank");
            formData.append("entry_date", bankForm.entry_date || selectedDate);
            if (receiptFile) {
                formData.append("receipt_file", receiptFile);
            }

            await axios.post(`${API_BASE}/manual-entry`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setIsBankModalOpen(false);
            setBankForm({ entry_type: "BANK_CREDIT", amount: "", description: "", entry_date: "" });
            setReceiptFile(null);
            fetchCashbookSummary(selectedDate);
            alert("Bank transaction logged successfully!");
        } catch (err) {
            alert(err.response?.data?.message || "Failed to log bank transaction.");
        }
    };

    const handleConfirmDailyClosing = async () => {
        try {
            await axios.post(`${API_BASE}/daily-closing`, {
                date: selectedDate,
                opening: summary.closingDetails.openingBalance,
                income: summary.todayIncome,
                expense: summary.todayExpense,
                closing: summary.closingDetails.closingBalance
            });
            setIsClosingModalOpen(false);
            alert(`Daily closing locked and audited for ${selectedDate}!`);
            fetchCashbookSummary(selectedDate);
        } catch (err) {
            alert("Failed to confirm daily closing.");
        }
    };

    const handlePrintReport = () => {
        window.print();
    };

    if (loading || !summary) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: "16px" }}>
                Loading Cashbook Records...
            </div>
        );
    }

    const incomeExpenseData = [
        { name: "Income", value: summary.todayIncome, color: "#22c55e" },
        { name: "Expense", value: summary.todayExpense, color: "#ef4444" }
    ];

    const todayTotal = summary.todayIncome + summary.todayExpense;
    
    const formattedDate = new Date(selectedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    return (
        <div className="cashbook-page">
            {/* HEADER */}
            <div className="cashbook-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
                <h1 style={{ margin: 0 }}>Cashbook Management</h1>
                
                {/* DATE SELECTOR */}
                <div className="date-selector-wrapper">
                    <FaCalendarAlt style={{ color: "#3b82f6" }} />
                    <label htmlFor="cashbook-date">Choose Date:</label>
                    <input
                        type="date"
                        id="cashbook-date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="cashbook-kpis">
                <div className="cashbook-kpi">
                    <FaMoneyBillWave className="cashbook-icon green" />
                    <div>
                        <h2>₹{summary.todayIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h2>
                        <p>Total Income</p>
                    </div>
                </div>

                <div className="cashbook-kpi">
                    <FaFileInvoiceDollar className="cashbook-icon red" />
                    <div>
                        <h2>₹{summary.todayExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h2>
                        <p>Total Expense</p>
                    </div>
                </div>

                <div className="cashbook-kpi">
                    <FaBalanceScale className="cashbook-icon blue" />
                    <div>
                        <h2>₹{summary.netClosingToday.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h2>
                        <p>Net Balance (Day)</p>
                    </div>
                </div>

                <div className="cashbook-kpi">
                    <FaWallet className="cashbook-icon purple" />
                    <div>
                        <h2>₹{summary.thisMonthBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</h2>
                        <p>This Month Balance</p>
                    </div>
                </div>
            </div>

            {/* ROW 1 */}
            <div className="cashbook-summary-row">
                {/* DONUT CHART */}
                <div className="cashbook-card">
                    <h3 className="summary-title">
                        CASHBOOK RATIO SUMMARY
                        <span>({formattedDate})</span>
                    </h3>

                    <div className="income-expense-wrapper">
                        <div className="chart-container" style={{ margin: "0 auto", width: "160px", height: "160px" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={incomeExpenseData}
                                        dataKey="value"
                                        innerRadius={45}
                                        outerRadius={70}
                                        paddingAngle={0}
                                    >
                                        {incomeExpenseData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pie-center-text">
                                <span style={{ fontSize: "11px" }}>Total</span>
                                <strong style={{ fontSize: "18px" }}>₹{todayTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</strong>
                            </div>
                        </div>

                        <div className="cashbook-legend" style={{ gap: "8px" }}>
                            <div className="legend-item" style={{ fontSize: "12px" }}>
                                <span className="legend-dot income"></span>
                                Income: ₹{summary.todayIncome.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </div>
                            <div className="legend-item" style={{ fontSize: "12px" }}>
                                <span className="legend-dot expense"></span>
                                Expense: ₹{summary.todayExpense.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* BAR CHART */}
                <div className="cashbook-card">
                    <h3>Payment Mode Collection ({formattedDate})</h3>
                    <ResponsiveContainer width="95%" height={180}>
                        <BarChart data={summary.paymentModeData}>
                            <XAxis dataKey="mode" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                                dataKey="amount"
                                fill="#1d63e8"
                                barSize={30}
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* QUICK ACTIONS */}
                <div className="cashbook-card quick-actions-card" style={{ minHeight: "auto" }}>
                    <h3>Cashbook Quick Actions</h3>
                    <div className="cashbook-action-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        
                        {/* REDIRECT TO HOME FOR OUTSIDER MEALS */}
                        <div className="cash-action-card" onClick={() => {
                            localStorage.clear();
                            sessionStorage.clear();
                            navigate("/login");
                        }} style={{ minHeight: "85px" }}>
                            <div className="cash-icon orange">
                                <FaTicketAlt />
                            </div>
                            <span>Generate Coupon</span>
                        </div>

                        <div className="cash-action-card" onClick={() => setIsReceiptModalOpen(true)} style={{ minHeight: "85px" }}>
                            <div className="cash-icon green">
                                <FaPlus />
                            </div>
                            <span>Add Receipt</span>
                        </div>

                        <div className="cash-action-card" onClick={() => setIsExpenseModalOpen(true)} style={{ minHeight: "85px" }}>
                            <div className="cash-icon red">
                                <FaFileInvoiceDollar />
                            </div>
                            <span>Add Expense</span>
                        </div>

                        <div className="cash-action-card" onClick={() => setIsBankModalOpen(true)} style={{ minHeight: "85px" }}>
                            <div className="cash-icon blue">
                                <FaUniversity />
                            </div>
                            <span>Bank Trans.</span>
                        </div>

                        <div className="cash-action-card" onClick={() => setIsClosingModalOpen(true)} style={{ minHeight: "85px" }}>
                            <div className="cash-icon purple">
                                <FaWallet />
                            </div>
                            <span>Daily Closing</span>
                        </div>

                        <div className="cash-action-card" onClick={() => setIsReportOpen(true)} style={{ minHeight: "85px" }}>
                            <div className="cash-icon orange">
                                <FaChartBar />
                            </div>
                            <span>Export Report</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROW 2 */}
            <div className="cashbook-receipt-payment-row">
                <div className="cashbook-card">
                    <h3>Recent Receipts ({formattedDate})</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Receipt No</th>
                                <th>From Details</th>
                                <th>Amount</th>
                                <th>Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.recentReceipts.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>
                                        No receipts recorded for this date.
                                    </td>
                                </tr>
                            ) : (
                                summary.recentReceipts.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row.receipt_no}</td>
                                        <td>{row.from_user}</td>
                                        <td><strong>₹{parseFloat(row.amount).toFixed(2)}</strong></td>
                                        <td><span className="status-pill">{row.mode}</span></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="cashbook-card">
                    <h3>Recent Payments ({formattedDate})</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Payment No</th>
                                <th>To Details</th>
                                <th>Amount</th>
                                <th>Mode</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.recentPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>
                                        No payments recorded for this date.
                                    </td>
                                </tr>
                            ) : (
                                summary.recentPayments.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row.payment_no}</td>
                                        <td>{row.to_user}</td>
                                        <td><strong>₹{parseFloat(row.amount).toFixed(2)}</strong></td>
                                        <td><span className="status-pill">{row.mode}</span></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ROW 3 */}
            <div className="cashbook-bottom-row">
                {/* BANK */}
                <div className="cashbook-card">
                    <h3>Bank Adjustments & UPIs ({formattedDate})</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Bank Details</th>
                                <th>Reference ID</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.bankTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>
                                        No bank transactions logged for this date.
                                    </td>
                                </tr>
                            ) : (
                                summary.bankTransactions.map((row, i) => (
                                    <tr key={i}>
                                        <td>{row.bank}</td>
                                        <td>{row.reference}</td>
                                        <td><strong>₹{parseFloat(row.amount).toFixed(2)}</strong></td>
                                        <td className="success">{row.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* DAILY CLOSING */}
                <div className="cashbook-card">
                    <h3>Daily Cash Closing Balance</h3>
                    <div className="closing-box">
                        <div>
                            <span>Opening Balance</span>
                            <strong>₹{summary.closingDetails.openingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
                        </div>
                        <div>
                            <span>Total Receipts (+)</span>
                            <strong>₹{summary.closingDetails.todayIncome.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
                        </div>
                        <div>
                            <span>Total Expenses (-)</span>
                            <strong>₹{summary.closingDetails.todayExpense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
                        </div>
                        <div className="highlight">
                            <span>Closing Balance</span>
                            <strong>₹{summary.closingDetails.closingBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
                        </div>
                    </div>
                </div>

                {/* REPORT CARD */}
                <div className="cashbook-card cashbook-report-card">
                    <h3>Print Canteen Report</h3>
                    <div className="report-box">
                        <div className="report-icon">
                            <FaChartBar />
                        </div>
                        <div>
                            <p>
                                Generate dynamic cashbook reports and ledger summaries for audit verification.
                            </p>
                            <button className="report-btn" onClick={() => setIsReportOpen(true)}>
                                View & Print Ledger
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================
                MODAL: ADD RECEIPT
            ======================================================== */}
            {isReceiptModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Record Manual Receipt</h2>
                        <p>Manually log incoming cash or deposits for canteen services.</p>
                        <form onSubmit={handleReceiptSubmit} className="modal-form">
                            <div className="form-field">
                                <label>Date of Entry</label>
                                <input
                                    type="date"
                                    value={receiptForm.entry_date || selectedDate}
                                    onChange={e => setReceiptForm({ ...receiptForm, entry_date: e.target.value })}
                                />
                            </div>
                            <div className="form-field">
                                <label>Received From (Details)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Catering collection / Outsider meal"
                                    value={receiptForm.description}
                                    onChange={e => setReceiptForm({ ...receiptForm, description: e.target.value })}
                                />
                            </div>
                            <div className="form-field">
                                <label>Amount (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    value={receiptForm.amount}
                                    onChange={e => setReceiptForm({ ...receiptForm, amount: e.target.value })}
                                />
                            </div>
                            <div className="form-field">
                                <label>Payment Mode</label>
                                <select
                                    value={receiptForm.payment_mode}
                                    onChange={e => setReceiptForm({ ...receiptForm, payment_mode: e.target.value })}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Google Pay">Google Pay</option>
                                    <option value="PhonePe">PhonePe</option>
                                    <option value="BHIM UPI">BHIM UPI</option>
                                    <option value="Wallet">Wallet</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsReceiptModalOpen(false)}>Cancel</button>
                                <button type="submit" className="submit-btn">Add Receipt</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================
                MODAL: ADD EXPENSE
            ======================================================== */}
            {isExpenseModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Record Manual Expense</h2>
                        <p>Log miscellaneous payments or minor kitchen expenses directly.</p>
                        <form onSubmit={handleExpenseSubmit} className="modal-form">
                            <div className="form-field">
                                <label>Date of Entry</label>
                                <input
                                    type="date"
                                    value={expenseForm.entry_date || selectedDate}
                                    onChange={e => setExpenseForm({ ...expenseForm, entry_date: e.target.value })}
                                />
                            </div>
                            <div className="form-field">
                                <label>Paid To (Description)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Vegetable vendor / Daily tea leaves"
                                    value={expenseForm.description}
                                    onChange={e => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                />
                            </div>
                            <div className="form-field">
                                <label>Amount (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    value={expenseForm.amount}
                                    onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                />
                            </div>
                            <div className="form-field">
                                <label>Payment Mode</label>
                                <select
                                    value={expenseForm.payment_mode}
                                    onChange={e => setExpenseForm({ ...expenseForm, payment_mode: e.target.value })}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Bank">Bank Transfer</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsExpenseModalOpen(false)}>Cancel</button>
                                <button type="submit" className="submit-btn">Add Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================
                MODAL: BANK TRANSACTION (DEBIT / CREDIT & FILE UPLOAD)
            ======================================================== */}
            {isBankModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Record Manual Bank Adjustment</h2>
                        <p>Withdraw or deposit funds from the canteen treasury bank account.</p>
                        <form onSubmit={handleBankSubmit} className="modal-form">
                            <div className="form-field">
                                <label>Transaction Type</label>
                                <select
                                    value={bankForm.entry_type}
                                    onChange={e => setBankForm({ ...bankForm, entry_type: e.target.value })}
                                >
                                    <option value="BANK_CREDIT">Bank Deposit (Credit +)</option>
                                    <option value="BANK_DEBIT">Bank Withdrawal (Debit -)</option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Date of Transaction</label>
                                <input
                                    type="date"
                                    value={bankForm.entry_date || selectedDate}
                                    onChange={e => setBankForm({ ...bankForm, entry_date: e.target.value })}
                                />
                            </div>
                            <div className="form-field">
                                <label>Reference / Remarks</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. SBI deposit / Treasury pull"
                                    value={bankForm.description}
                                    onChange={e => setBankForm({ ...bankForm, description: e.target.value })}
                                />
                            </div>
                            <div className="form-field">
                                <label>Amount (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    placeholder="0.00"
                                    value={bankForm.amount}
                                    onChange={e => setBankForm({ ...bankForm, amount: e.target.value })}
                                />
                            </div>
                            <div className="form-field">
                                <label>Upload Bank Receipt/Voucher (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={e => setReceiptFile(e.target.files[0])}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsBankModalOpen(false)}>Cancel</button>
                                <button type="submit" className="submit-btn">Log Transaction</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================
                MODAL: DAILY CASH CLOSING LOCK
            ======================================================== */}
            {isClosingModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Daily Cash Closing Validation</h2>
                        <p>Close and lock the canteen balances for date <strong>{formattedDate}</strong>.</p>
                        
                        <div style={{ background: "#f8fafc", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Opening Balance:</span>
                                <strong>₹{summary.closingDetails.openingBalance.toFixed(2)}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Total Receipts (+):</span>
                                <strong>₹{summary.closingDetails.todayIncome.toFixed(2)}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Total Expenses (-):</span>
                                <strong>₹{summary.closingDetails.todayExpense.toFixed(2)}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Bank Credits (+):</span>
                                <strong>₹{summary.closingDetails.bankCredits.toFixed(2)}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span>Bank Debits (-):</span>
                                <strong>₹{summary.closingDetails.bankDebits.toFixed(2)}</strong>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #cbd5e1", paddingTop: "10px", color: "#16a34a" }}>
                                <strong>Net Closing Balance:</strong>
                                <strong>₹{summary.closingDetails.closingBalance.toFixed(2)}</strong>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsClosingModalOpen(false)}>Cancel</button>
                            <button type="button" className="submit-btn" onClick={handleConfirmDailyClosing} style={{ background: "#7c3aed" }}>Confirm & Close Day</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================
                MODAL: FULL-SCREEN REPORT PREVIEW & PDF EXPORT
            ======================================================== */}
            {isReportOpen && (
                <div className="modal-overlay" style={{ background: "rgba(15, 23, 42, 0.85)" }}>
                    <div className="modal-content report-modal-content print-area" style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                        
                        {/* TOP ACTIONS PANEL */}
                        <div className="top-corner-actions" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px" }}>
                            <button 
                                className="cancel-btn" 
                                onClick={() => setIsReportOpen(false)}
                                style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #cbd5e1", background: "#f8fafc", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
                            >
                                <FaArrowLeft /> Close Preview
                            </button>
                            <button 
                                className="report-btn" 
                                onClick={handlePrintReport}
                                style={{ display: "flex", alignItems: "center", gap: "8px", background: "#3b82f6", color: "#ffffff", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: 600 }}
                            >
                                <FaPrint /> Print / Save PDF
                            </button>
                        </div>

                        {/* PREVIEW LEDGER SHEET */}
                        <div className="ledger-sheet-body">
                            <div className="report-header-print">
                                <h2>DAILY CANTEEN LEDGER & REPORT</h2>
                                <p>Office of the Principal Accountant General (A&E) West Bengal | Kolkata</p>
                                <h3 style={{ margin: "10px 0 0 0", color: "#3b82f6", fontSize: "16px" }}>Report Date: {formattedDate}</h3>
                            </div>

                            <div className="report-kpi-summary-print">
                                <div>
                                    <span>Opening Balance</span>
                                    <strong>₹{summary.closingDetails.openingBalance.toFixed(2)}</strong>
                                </div>
                                <div>
                                    <span>Total Income</span>
                                    <strong>₹{summary.closingDetails.todayIncome.toFixed(2)}</strong>
                                </div>
                                <div>
                                    <span>Total Expense</span>
                                    <strong>₹{summary.closingDetails.todayExpense.toFixed(2)}</strong>
                                </div>
                                <div>
                                    <span>Closing Balance</span>
                                    <strong>₹{summary.closingDetails.closingBalance.toFixed(2)}</strong>
                                </div>
                            </div>

                            <div className="report-grid-print">
                                {/* RECEIPTS */}
                                <div>
                                    <h4 className="report-section-title">Income / Receipts Trail</h4>
                                    <table style={{ fontSize: "11px" }}>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Description</th>
                                                <th>Amount</th>
                                                <th>Mode</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {summary.recentReceipts.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>No entries.</td>
                                                </tr>
                                            ) : (
                                                summary.recentReceipts.map((row, i) => (
                                                    <tr key={i}>
                                                        <td>{row.receipt_no}</td>
                                                        <td>{row.from_user}</td>
                                                        <td>₹{parseFloat(row.amount).toFixed(2)}</td>
                                                        <td>{row.mode}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* PAYMENTS */}
                                <div>
                                    <h4 className="report-section-title">Expense / Payments Trail</h4>
                                    <table style={{ fontSize: "11px" }}>
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Description</th>
                                                <th>Amount</th>
                                                <th>Mode</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {summary.recentPayments.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>No entries.</td>
                                                </tr>
                                            ) : (
                                                summary.recentPayments.map((row, i) => (
                                                    <tr key={i}>
                                                        <td>{row.payment_no}</td>
                                                        <td>{row.to_user}</td>
                                                        <td>₹{parseFloat(row.amount).toFixed(2)}</td>
                                                        <td>{row.mode}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* BANK & UPIS */}
                            <div style={{ marginTop: "15px" }}>
                                <h4 className="report-section-title">Bank Transactions & Treasury Adjustments</h4>
                                <table style={{ fontSize: "11px" }}>
                                    <thead>
                                        <tr>
                                            <th>Voucher Details</th>
                                            <th>Reference Number</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {summary.bankTransactions.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: "center", color: "#64748b" }}>No transactions logged.</td>
                                            </tr>
                                        ) : (
                                            summary.bankTransactions.map((row, i) => (
                                                <tr key={i}>
                                                    <td>{row.bank}</td>
                                                    <td>{row.reference}</td>
                                                    <td>₹{parseFloat(row.amount).toFixed(2)}</td>
                                                    <td style={{ color: "#16a34a" }}>{row.status}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* AUDITING FOOTER */}
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", borderTop: "1px solid #cbd5e1", paddingTop: "20px", fontSize: "12px", color: "#64748b" }}>
                                <span>Report generated by: <strong>System Canteen Administrator</strong></span>
                                <span>Certified Auditor Signature: _______________________</span>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default Cashbook;