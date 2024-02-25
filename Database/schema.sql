DROP DATABASE IF EXISTS oil_sales_db;
CREATE DATABASE oil_sales_db;
USE oil_sales_db;

CREATE TABLE IF NOT EXISTS Oil (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Car (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    reg_number VARCHAR(20) NOT NULL UNIQUE,
    FOREIGN KEY (customer_id) REFERENCES Customer(id)
);

CREATE TABLE IF NOT EXISTS Sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    car_reg_number INT NOT NULL,
    oil_id INT NOT NULL,
    bill_amount DECIMAL(10, 2) NOT NULL,
    current_mileage INT NOT NULL,
    next_mileage INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(id),
    FOREIGN KEY (oil_id) REFERENCES Oil(id)
);
