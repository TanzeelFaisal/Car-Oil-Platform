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

app.get('/customers/:customerId/cars', (req, res) => {
    const customerId = req.params.customerId;
    console.log('hi')
    pool.query('SELECT * FROM Car INNER JOIN Customer ON Car.customer_id = Customer.id WHERE Car.customer_id = ?', [customerId], (error, results) => {
        if (error) {
            console.log(error)
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

app.get('/sales', (req, res) => {
    pool.query('SELECT Sales.*, Car.car_name FROM Sales INNER JOIN Car ON Car.reg_number = Sales.car_reg_number;', (err, result) => {
        if (err) {
            console.error('Error fetching sales:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.post('/sales', (req, res) => {
    const newSale = req.body;
    pool.query('INSERT INTO Sales SET ?', newSale, (err, result) => {
        if (err) {
            console.error('Error adding sale:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(201).json({ message: 'Sale added successfully', id: result.insertId });
        }
    });
});

app.put('/sales/:id', (req, res) => {
    const saleId = req.params.id;
    const updatedSale = req.body;
    pool.query('UPDATE Sales SET ? WHERE id = ?', [updatedSale, saleId], (err, result) => {
        if (err) {
            console.error('Error updating sale:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ message: 'Sale updated successfully' });
        }
    });
});

app.delete('/sales/:id', (req, res) => {
    const saleId = req.params.id;
    pool.query('DELETE FROM Sales WHERE id = ?', saleId, (err, result) => {
        if (err) {
            console.error('Error deleting sale:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(204).end();
        }
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

app.get('/cars', (req, res) => {
    pool.query(
        'SELECT Car.id, Car.car_name, Car.reg_number, Customer.name AS customer_name FROM Car INNER JOIN Customer ON Car.customer_id = Customer.id',
        (error, results) => {
            if (error) {
                res.status(500).json({ error: 'Error fetching cars' });
            } else {
                res.json(results);
            }
        }
    );
});

app.post('/cars', (req, res) => {
    const { customer_id, car_name, reg_number } = req.body;
    pool.query(
        'INSERT INTO Car (customer_id, car_name, reg_number) VALUES (?, ?, ?)',
        [customer_id, car_name, reg_number],
        (error, results) => {
            if (error) {
                res.status(500).json({ error: 'Error adding car' });
            } else {
                res.json({ message: 'Car added successfully' });
            }
        }
    );
});

app.put('/cars/:id', (req, res) => {
    const { id } = req.params;
    const { car_name, reg_number } = req.body;
    pool.query(
        'UPDATE Car SET car_name=?, reg_number=? WHERE id=?',
        [car_name, reg_number, id],
        (error, results) => {
            if (error) {
                res.status(500).json({ error: 'Error updating car' });
            } else {
                res.json({ message: 'Car updated successfully' });
            }
        }
    );
});

app.delete('/cars/:id', (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM Car WHERE id=?', [id], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error deleting car' });
        } else {
            res.json({ message: 'Car deleted successfully' });
        }
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
