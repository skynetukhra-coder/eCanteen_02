
CREATE DATABASE IF NOT EXISTS canteen_db;
USE canteen_db;

CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles(role_name) VALUES
('ADMIN'),('EMPLOYEE'),('KITCHEN_STAFF');

CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(role_id) REFERENCES roles(role_id)
);

CREATE TABLE employees (
    employee_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNIQUE,
    employee_code VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    mobile VARCHAR(20),
    department VARCHAR(100),
    designation VARCHAR(100),
    location VARCHAR(100),
    profile_image VARCHAR(255),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);

CREATE TABLE meal_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    start_time TIME,
    end_time TIME
);

INSERT INTO meal_categories(category_name) VALUES
('Breakfast'),('Lunch'),('Snacks'),('Dinner');

CREATE TABLE menu_items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    available_qty INT DEFAULT 0,
    image_url VARCHAR(255),
    is_active TINYINT DEFAULT 1,
    FOREIGN KEY(category_id) REFERENCES meal_categories(category_id)
);

CREATE TABLE wallets (
    wallet_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL UNIQUE,
    balance DECIMAL(12,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE wallet_transactions (
    transaction_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id BIGINT NOT NULL,
    transaction_type ENUM('CREDIT','DEBIT') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    reference_type ENUM('RECHARGE','ORDER','REFUND','ADJUSTMENT'),
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(wallet_id) REFERENCES wallets(wallet_id)
);

CREATE TABLE orders (
    order_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    employee_id BIGINT NOT NULL,
    order_status ENUM('PENDING','PAID','COUPON_GENERATED','AWAITING_PICKUP','REDEEMED','CANCELLED') DEFAULT 'PENDING',
    pickup_time DATETIME,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_status ENUM('PENDING','SUCCESS','FAILED','REFUNDED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE order_items (
    order_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(order_id),
    FOREIGN KEY(item_id) REFERENCES menu_items(item_id)
);

CREATE TABLE payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    payment_method ENUM('UPI','BHIM','CARD','NETBANKING','WALLET'),
    transaction_ref VARCHAR(100),
    amount DECIMAL(12,2) NOT NULL,
    payment_status ENUM('SUCCESS','FAILED','PENDING') DEFAULT 'PENDING',
    paid_at DATETIME,
    FOREIGN KEY(order_id) REFERENCES orders(order_id)
);

CREATE TABLE coupons (
    coupon_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    coupon_code VARCHAR(50) UNIQUE NOT NULL,
    order_id BIGINT NOT NULL,
    employee_id BIGINT NOT NULL,
    qr_data TEXT,
    validity_date DATE,
    coupon_status ENUM('ACTIVE','USED','EXPIRED','CANCELLED') DEFAULT 'ACTIVE',
    redeemed_at DATETIME,
    FOREIGN KEY(order_id) REFERENCES orders(order_id),
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT,
    title VARCHAR(150),
    message TEXT,
    is_read TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE inventory_items (
    inventory_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_code VARCHAR(30) UNIQUE,
    item_name VARCHAR(150) NOT NULL,
    category VARCHAR(100),
    unit VARCHAR(30),
    current_stock DECIMAL(12,2),
    minimum_stock DECIMAL(12,2),
    unit_cost DECIMAL(12,2)
);

CREATE TABLE inventory_transactions (
    txn_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    inventory_id BIGINT NOT NULL,
    txn_type ENUM('IN','OUT','TRANSFER','ADJUSTMENT'),
    quantity DECIMAL(12,2),
    remarks VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(inventory_id) REFERENCES inventory_items(inventory_id)
);

CREATE TABLE cashbook (
    cashbook_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entry_type ENUM('RECEIPT','EXPENSE'),
    amount DECIMAL(12,2) NOT NULL,
    description VARCHAR(255),
    entry_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action_name VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(user_id)
);
