import React, {
    useEffect,
    useState
} from "react";

import {
    FaMoneyBillWave,
    FaDownload
} from "react-icons/fa";

import "./AdminPayments.css";
import axios from "axios";

function AdminPayments() {

    const [payments, setPayments] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/payments");
            setPayments(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
    };

    const filteredPayments = payments.filter(payment => {
        if (!startDate && !endDate) return true;

        const paymentTime = new Date(payment.rawDate).getTime();
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (paymentTime < start.getTime()) return false;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (paymentTime > end.getTime()) return false;
        }
        return true;
    });

    const successCount = filteredPayments.filter(p => p.payment_status === "SUCCESS").length;
    const failedCount = filteredPayments.filter(p => p.payment_status === "FAILED").length;
    const collectionAmount = filteredPayments.reduce((total, p) => total + Number(p.amount), 0);

    const printReport = () => {
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Payments Settlement Report</title>
                    <style>
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #333; }
                        h1 { margin-bottom: 5px; color: #2c3e50; }
                        p { margin-top: 0; color: #7f8c8d; font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
                        th { background-color: #f8f9fa; color: #2c3e50; }
                        tr:nth-child(even) { background-color: #f9f9f9; }
                        .status-success { color: #15803d; font-weight: 600; }
                        .status-failed { color: #b91c1c; font-weight: 600; }
                    </style>
                </head>
                <body>
                    <h1>Canteen Payments Settlement Report</h1>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                    <p>Date Range: ${startDate || 'Start'} to ${endDate || 'End'}</p>
                    <p>Total Success: ${successCount} | Total Failed: ${failedCount} | Total Collection: ₹${collectionAmount.toFixed(2)}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Payment ID</th>
                                <th>Order ID</th>
                                <th>Employee Name</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Payment Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredPayments.map(p => `
                                <tr>
                                    <td>${p.payment_id}</td>
                                    <td>${p.order_id}</td>
                                    <td>${p.employee_name}</td>
                                    <td>₹${p.amount}</td>
                                    <td>${p.payment_method}</td>
                                    <td><span class="${p.payment_status === 'SUCCESS' ? 'status-success' : 'status-failed'}">${p.payment_status}</span></td>
                                    <td>${p.payment_date}</td>
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
        const headers = ["Payment ID", "Order ID", "Employee Name", "Amount", "Method", "Status", "Payment Date"];
        const rows = filteredPayments.map(p => [
            p.payment_id,
            p.order_id,
            p.employee_name,
            p.amount,
            p.payment_method,
            p.payment_status,
            p.payment_date
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `payments_settlement_${startDate || 'all'}_to_${endDate || 'all'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (

        <main className="ec-section-page">

            {/* HERO */}

            <div className="payments-header-card">

                <div className="payments-header-left">

                    <div className="payments-icon-box">
                        <FaMoneyBillWave />
                    </div>

                    <div>
                        <h2>Payment Management</h2>

                        <p>
                            Track payment transactions, settlement records and payment status.
                        </p>
                    </div>

                </div>

                <div className="orders-date-filter-block">
                    <div className="filter-input-group">
                        <label>Start</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                        />
                    </div>
                    <div className="filter-input-group">
                        <label>End</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
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

            </div>

            {/* METRICS */}

            <section className="section-metrics">

                <article>
                    <small>
                        Success
                    </small>

                    <strong>
                        {successCount}
                    </strong>
                </article>

                <article>
                    <small>
                        Failed
                    </small>

                    <strong>
                        {failedCount}
                    </strong>
                </article>


                <article>
                    <small>
                        Collection
                    </small>

                    <strong>
                        ₹{collectionAmount.toFixed(2)}
                    </strong>
                </article>

            </section>

            {/* TABLE */}

            <section className="section-grid">

                <article className="ec-panel section-table full-width-table">

                    <div className="panel-head">

                        <h3>
                            Payment Records
                        </h3>

                    </div>

                    <div className="table-scroll">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Payment ID
                                    </th>

                                    <th>
                                        Order ID
                                    </th>

                                    <th>
                                        Employee Name
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Method
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Payment Date
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {
                                    filteredPayments.map(
                                        payment => (

                                            <tr
                                                key={
                                                    payment.payment_id
                                                }
                                            >

                                                <td>
                                                    {
                                                        payment.payment_id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        payment.order_id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        payment.employee_name
                                                    }
                                                </td>

                                                <td>
                                                    ₹{
                                                        payment.amount
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        payment.payment_method
                                                    }
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            payment.payment_status ===
                                                                "SUCCESS"
                                                                ? "status-success"
                                                                : payment.payment_status ===
                                                                    "FAILED"
                                                                    ? "status-failed"
                                                                    : "status-pending"
                                                        }
                                                    >
                                                        {
                                                            payment.payment_status
                                                        }
                                                    </span>

                                                </td>

                                                <td>
                                                    {
                                                        payment.payment_date
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )
                                }

                            </tbody>

                        </table>

                    </div>

                </article>

            </section>

        </main>

    );

}

export default AdminPayments;