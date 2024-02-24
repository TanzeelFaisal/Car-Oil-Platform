// Import required modules
const express = require('express');
const mysql = require('mysql2');
const { dbConfig } = require('./config');

// Create an Express application
const app = express();
const port = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Routes

// POST request to add oil
app.post('/oil', (req, res) => {
    const { name, type } = req.body;
    pool.query('INSERT INTO Oil (name, type) VALUES (?, ?)', [name, type], (error, results) => {
        if (error) {
            console.error('Error adding oil:', error);
            res.status(500).json({ error: 'Error adding oil' });
        } else {
            res.json({ message: 'Oil added successfully' });
        }
    });
});

// GET request to fetch all customers
app.get('/customers', (req, res) => {
    pool.query('SELECT * FROM Customer', (error, results) => {
        if (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ error: 'Error fetching customers' });
        } else {
            res.json(results);
        }
    });
});

// GET request to fetch customer data using phone number
app.get('/customer/:phoneNumber', (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    pool.query('SELECT * FROM Customer WHERE number = ?', [phoneNumber], (error, customerResults) => {
        if (error) {
            console.error('Error fetching customer:', error);
            res.status(500).json({ error: 'Error fetching customer' });
            return;
        }
        
        if (customerResults.length === 0) {
            res.status(404).json({ error: 'Customer not found' });
            return;
        }

        const customerId = customerResults[0].id;
        const customerName = customerResults[0].name;

        pool.query('SELECT * FROM Sales WHERE customer_id = ?', [customerId], (error, salesResults) => {
            if (error) {
                console.error('Error fetching sales:', error);
                res.status(500).json({ error: 'Error fetching sales' });
                return;
            }

            pool.query('SELECT * FROM Car WHERE customer_id = ?', [customerId], (error, carResults) => {
                if (error) {
                    console.error('Error fetching cars:', error);
                    res.status(500).json({ error: 'Error fetching cars' });
                    return;
                }

                res.json({
                    customer: {
                        id: customerId,
                        name: customerName,
                        number: phoneNumber
                    },
                    sales: salesResults,
                    cars: carResults
                });
            });
        });
    });
});

// POST request to add a new customer
app.post('/customers', (req, res) => {
    const { name, number } = req.body;
    pool.query('INSERT INTO Customer (name, number) VALUES (?, ?)', [name, number], (error, results) => {
        if (error) {
            console.error('Error adding customer:', error);
            res.status(500).json({ error: 'Error adding customer' });
        } else {
            res.json({ message: 'Customer added successfully' });
        }
    });
});

// GET request to fetch customer car information
app.get('/customer/:customerId/cars', (req, res) => {
    const customerId = req.params.customerId;
    pool.query('SELECT * FROM Car WHERE customer_id = ?', [customerId], (error, results) => {
        if (error) {
            console.error('Error fetching customer cars:', error);
            res.status(500).json({ error: 'Error fetching customer cars' });
        } else {
            res.json(results);
        }
    });
});

// POST request to add customer car data
app.post('/customer/:customerId/cars', (req, res) => {
    const { regNumber, currentMileage, nextMileage, oilId } = req.body;
    const customerId = req.params.customerId;
    pool.query('INSERT INTO Car (customer_id, reg_number, current_mileage, next_mileage, oil_id) VALUES (?, ?, ?, ?, ?)', 
        [customerId, regNumber, currentMileage, nextMileage, oilId], 
        (error, results) => {
            if (error) {
                console.error('Error adding customer car:', error);
                res.status(500).json({ error: 'Error adding customer car' });
            } else {
                res.json({ message: 'Customer car added successfully' });
            }
        }
    );
});

// POST request to add sale data
app.post('/sales', (req, res) => {
    const { customerPhoneNumber, carRegNumber, oilId, billAmount } = req.body;

    // Check if customer exists
    pool.query('SELECT * FROM Customer WHERE number = ?', [customerPhoneNumber], (error, customerResults) => {
        if (error) {
            console.error('Error fetching customer:', error);
            res.status(500).json({ error: 'Error fetching customer' });
            return;
        }
        
        if (customerResults.length === 0) {
            res.status(404).json({ error: 'Customer not found' });
            return;
        }

        const customerId = customerResults[0].id;

        // Check if car belongs to the customer
        pool.query('SELECT * FROM Car WHERE customer_id = ? AND reg_number = ?', [customerId, carRegNumber], (error, carResults) => {
            if (error) {
                console.error('Error fetching car:', error);
                res.status(500).json({ error: 'Error fetching car' });
                return;
            }

            if (carResults.length === 0) {
                res.status(404).json({ error: 'Car not found for this customer' });
                return;
            }

            const carId = carResults[0].id;

            // Add sale data
            pool.query('INSERT INTO Sales (customer_id, car_id, oil_id, bill_amount) VALUES (?, ?, ?, ?)', 
                [customerId, carId, oilId, billAmount], 
                (error, results) => {
                    if (error) {
                        console.error('Error adding sale:', error);
                        res.status(500).json({ error: 'Error adding sale' });
                    } else {
                        res.json({ message: 'Sale added successfully' });
                    }
                }
            );
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
