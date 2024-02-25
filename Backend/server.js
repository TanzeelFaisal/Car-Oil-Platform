const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { dbConfig } = require('./config');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}))

const pool = mysql.createPool(dbConfig);

app.post('/oil', (req, res) => {
    const { name, type } = req.body;
    pool.query('INSERT INTO Oil (name, type) VALUES (?, ?)', [name, type], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error adding oil' });
        } else {
            res.json({ message: 'Oil added successfully' });
        }
    });
});

app.get('/customers', (req, res) => {
    pool.query('SELECT * FROM Customer', (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching customers' });
        } else {
            res.json(results);
        }
    });
});

app.get('/customer/:phoneNumber', (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    pool.query('SELECT * FROM Customer WHERE number = ?', [phoneNumber], (error, customerResults) => {
        if (error) {
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
                res.status(500).json({ error: 'Error fetching sales' });
                return;
            }

            pool.query('SELECT * FROM Car WHERE customer_id = ?', [customerId], (error, carResults) => {
                if (error) {
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

app.post('/customers', (req, res) => {
    const { name, number } = req.body;
    pool.query('INSERT INTO Customer (name, number) VALUES (?, ?)', [name, number], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error adding customer' });
        } else {
            res.json({ message: 'Customer added successfully' });
        }
    });
});

app.get('/customer/:customerId/cars', (req, res) => {
    const customerId = req.params.customerId;
    pool.query('SELECT * FROM Car WHERE customer_id = ?', [customerId], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching customer cars' });
        } else {
            res.json(results);
        }
    });
});

app.post('/customer/:customerId/cars', (req, res) => {
    const { regNumber, currentMileage, nextMileage, oilId } = req.body;
    const customerId = req.params.customerId;
    pool.query('INSERT INTO Car (customer_id, reg_number, current_mileage, next_mileage, oil_id) VALUES (?, ?, ?, ?, ?)',
        [customerId, regNumber, currentMileage, nextMileage, oilId],
        (error, results) => {
            if (error) {
                res.status(500).json({ error: 'Error adding customer car' });
            } else {
                res.json({ message: 'Customer car added successfully' });
            }
        }
    );
});

app.post('/sales', (req, res) => {
    const { customerPhoneNumber, carRegNumber, oilId, billAmount } = req.body;

    pool.query('SELECT * FROM Customer WHERE number = ?', [customerPhoneNumber], (error, customerResults) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching customer' });
            return;
        }

        if (customerResults.length === 0) {
            res.status(404).json({ error: 'Customer not found' });
            return;
        }

        const customerId = customerResults[0].id;

        pool.query('SELECT * FROM Car WHERE customer_id = ? AND reg_number = ?', [customerId, carRegNumber], (error, carResults) => {
            if (error) {
                res.status(500).json({ error: 'Error fetching car' });
                return;
            }

            if (carResults.length === 0) {
                res.status(404).json({ error: 'Car not found for this customer' });
                return;
            }

            const carId = carResults[0].id;

            pool.query('INSERT INTO Sales (customer_id, car_id, oil_id, bill_amount) VALUES (?, ?, ?, ?)',
                [customerId, carId, oilId, billAmount],
                (error, results) => {
                    if (error) {
                        res.status(500).json({ error: 'Error adding sale' });
                    } else {
                        res.json({ message: 'Sale added successfully' });
                    }
                }
            );
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});