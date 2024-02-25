const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { dbConfig } = require('./config');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors())

const pool = mysql.createPool(dbConfig);

app.post('/customers', (req, res) => {
    const { name, phoneNumber, email, address } = req.body;
    pool.query('INSERT INTO Customer (name, number, email, address) VALUES (?, ?, ?, ?)', [name, phoneNumber, email, address], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error adding customer' });
        } else {
            res.json({ message: 'Customer added successfully' });
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

app.put('/customers/:id', (req, res) => {
    const customerId = req.params.id;
    const { name, phoneNumber, email, address } = req.body;
    pool.query('UPDATE Customer SET name=?, number=?, email=?, address=? WHERE id=?', [name, phoneNumber, email, address, customerId], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error updating customer' });
        } else {
            res.json({ message: 'Customer updated successfully' });
        }
    });
});

app.delete('/customers/:id', (req, res) => {
    const customerId = req.params.id;
    pool.query('DELETE FROM Customer WHERE id=?', [customerId], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error deleting customer' });
        } else {
            res.json({ message: 'Customer deleted successfully' });
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

app.get('/customer/:customerId/cars', (req, res) => {
    const customerId = req.params.customerId;
    pool.query('SELECT Car.reg_number FROM Car INNER JOIN Customer ON Car.customer_id = Customer.id WHERE Car.customer_id = ?', [customerId], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching customer cars' });
        } else {
            res.json(results);
        }
    });
});

app.post('/customer/:customerId/cars', (req, res) => {
    const { regNumber, currentMileage, nextMileage } = req.body;
    const customerId = req.params.customerId;
    pool.query('INSERT INTO Car (customer_id, reg_number, current_mileage, next_mileage) VALUES (?, ?, ?, ?)',
        [customerId, regNumber, currentMileage, nextMileage],
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
    const { customerPhoneNumber, carRegNumber, billAmount } = req.body;

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

        pool.query('SELECT Car.reg_number FROM Car INNER JOIN Customer ON Car.customer_id = Customer.id WHERE Customer.id = ? AND Car.reg_number = ?', [customerId, carRegNumber], (error, carResults) => {
            if (error) {
                res.status(500).json({ error: 'Error fetching car' });
                return;
            }

            if (carResults.length === 0) {
                res.status(404).json({ error: 'Car not found for this customer' });
                return;
            }

            const carRegNumber = carResults[0].reg_number;

            pool.query('INSERT INTO Sales (customer_id, car_reg_number, bill_amount) VALUES (?, ?, ?)',
                [customerId, carRegNumber, billAmount],
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

app.get('/oils', (req, res) => {
    pool.query('SELECT * FROM Oil', (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching customers' });
        } else {
            res.json(results);
        }
    });
});

app.post('/oils', (req, res) => {
    const { name, price, type, stock } = req.body;
    pool.query('INSERT INTO Oil (name, price, type, stock) VALUES (?, ?, ?, ?)', [name, price, type, stock], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error adding product' });
        } else {
            res.json({ message: 'Product added successfully' });
        }
    });
});

app.put('/oils/:id', (req, res) => {
    const productId = req.params.id;
    const { name, price, type, stock } = req.body;
    pool.query('UPDATE Oil SET name=?, price=?, type=?, stock=? WHERE id=?', [name, price, type, stock, productId], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error updating product' });
        } else {
            res.json({ message: 'Product updated successfully' });
        }
    });
});

app.delete('/oils/:id', (req, res) => {
    const productId = req.params.id;
    pool.query('DELETE FROM Oil WHERE id = ?', [productId], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error deleting product' });
        } else {
            res.json({ message: 'Product deleted successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
