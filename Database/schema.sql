USE oil_sales_db;

-- Oil table
CREATE TABLE Oil (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL
);

-- Customer table
CREATE TABLE Customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    UNIQUE (number)
);

-- Car table
CREATE TABLE Car (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    reg_number VARCHAR(20) NOT NULL UNIQUE,
    current_mileage INT NOT NULL,
    next_mileage INT NOT NULL,
    oil_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(id),
    FOREIGN KEY (oil_id) REFERENCES Oil(id)
);

-- Sales table
CREATE TABLE Sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    car_id INT NOT NULL,
    oil_id INT NOT NULL,
    bill_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(id),
    FOREIGN KEY (car_id) REFERENCES Car(id),
    FOREIGN KEY (oil_id) REFERENCES Oil(id)
);
