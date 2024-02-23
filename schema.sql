USE oil_sales_db;

-- Customer table
CREATE TABLE Customer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    UNIQUE (number)
);

-- Sales table
CREATE TABLE Sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    product_id INT NOT NULL,
    car_number VARCHAR(20) NOT NULL,
    current_mileage INT NOT NULL,
    next_mileage INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES Customer(id)
);
