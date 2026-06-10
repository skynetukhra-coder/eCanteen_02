const mysql = require("mysql2/promise");

async function main() {
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "1234",
        database: "canteen"
    });
    
    const [paymentsCols] = await connection.query("DESCRIBE payments");
    console.log("payments cols:", paymentsCols.map(c => `${c.Field} (${c.Type})`));

    const [ordersCols] = await connection.query("DESCRIBE orders");
    console.log("orders cols:", ordersCols.map(c => `${c.Field} (${c.Type})`));

    const [wtCols] = await connection.query("DESCRIBE wallet_transactions");
    console.log("wallet_transactions cols:", wtCols.map(c => `${c.Field} (${c.Type})`));

    const [cbCols] = await connection.query("DESCRIBE cashbook");
    console.log("cashbook cols:", cbCols.map(c => `${c.Field} (${c.Type})`));

    await connection.end();
}

main().catch(console.error);
