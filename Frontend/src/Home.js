import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function Home() {
    const [show, setShow] = useState(false);
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [car, setCar] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
    const [carModal, setCarModal] = useState(false);
    const [userCars, setUserCars] = useState([]);

    const [carName, setCarName] = useState('');
    const [registrationNo, setRegistrationNo] = useState('');

    const handleAddCar = (e) => {
        e.preventDefault();

        const newCar = {
            name: carName,
            registrationNo: registrationNo
        };

        setUserCars([...userCars, newCar]);

        setCarModal(false);
    };

    useEffect(() => {
        fetchSales();
        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await fetch('http://localhost:3001/sales');
            const data = await response.json();
            setSales(data);
        } catch (error) {
            console.error('Error fetching sales:', error);
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:3001/customers');
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleClose = () => {
        setShow(false);
        setSelectedSale(null);
        setQuantity('')
        setCustomerId('')
        setProductId('')
        setCar('')
    };

    const handleShow = () => {
        setShow(true);
    }

    const handleAddSale = async (e) => {
        e.preventDefault()
        const newSale = {
            customerId,
            productId,
            quantity: parseInt(quantity),
            car,
            date: new Date().toLocaleDateString()
        };
        try {
            const response = await fetch('http://localhost:3001/sales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSale)
            });
            if (response.ok) {
                fetchSales();
                handleClose();
            } else {
                console.error('Error adding sale:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding sale:', error);
        }
    };

    const handleEditSale = (sale) => {
        setSelectedSale(sale);
        handleShow();
    };

    const handleUpdateSale = async (e) => {
        e.preventDefault()
        const updatedSale = {
            customerId,
            productId,
            quantity: parseInt(quantity),
            car
        };
        try {
            const response = await fetch(`http://localhost:3001/sales/${selectedSale.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedSale)
            });
            if (response.ok) {
                fetchSales();
                handleClose();
            } else {
                console.error('Error updating sale:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating sale:', error);
        }
    };

    const handleDeleteSale = async (sale) => {
        try {
            const response = await fetch(`http://localhost:3001/sales/${sale.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchSales();
            } else {
                console.error('Error deleting sale:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting sale:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredSales = sales.filter((sale) => {
        const customer = customers.find((cust) => cust.id == sale.customerId);
        const product = products.find((prod) => prod.id == sale.productId);
        return (
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.phoneNumber.toLowerCase().includes(searchTerm) ||
            product.name.toLowerCase().includes(searchTerm) ||
            sale.date.toLowerCase().includes(searchTerm)
        );
    });

    useEffect(() => {
        console.log(sales)
    }, [handleAddSale]);

    const showCarModal = (e) => {
        setShow(false)
        setCarModal(true)
    };
    return (
        <div className='container'>
            <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
                <div className="row ">
                    <div className="col-sm-3 mt-5 mb-4 text-gred">
                        <div className="search">
                            <input
                                className="form-control mr-sm-2"
                                type="search"
                                placeholder="Search Sales"
                                aria-label="Search"
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred"><h2><b>Sale Details</b></h2></div>
                    <div className="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred">
                        <Button variant="primary" onClick={handleShow}>
                            Add New Sale
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <div className="table-responsive " >
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Car Name</th>
                                    <th>Product Name</th>
                                    <th>Total Amount</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSales.map((sale, index) => {
                                    const customer = customers.find(cust => cust.id == sale.customerId);
                                    const product = products.find(prod => prod.id == sale.productId);
                                    const totalAmount = product ? sale.quantity * product.price : 0;
                                    console.log(customer, product, sale)
                                    return (
                                        <tr key={index}>
                                            <td>{customer ? customer.name : ''}</td>
                                            <td>{sale.car}</td>
                                            <td>{product ? product.name : ''}</td>
                                            <td>{totalAmount}</td>
                                            <td>{sale.date}</td>
                                            <td>
                                                <a href="#" onClick={() => handleEditSale(sale)} className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                                                <a href="#" onClick={() => handleDeleteSale(sale)} className="delete" title="Delete" data-toggle="tooltip" style={{ color: "red" }}><i className="material-icons">&#xE872;</i></a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="model_box">
                    <Modal
                        show={show}
                        onHide={handleClose}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>{selectedSale ? 'Edit Sale' : 'Add Sale'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={selectedSale ? handleUpdateSale : handleAddSale}>
                                <div className="form-group">
                                    <select className="form-control" onChange={(e) => setCustomerId(e.target.value)} value={selectedSale && selectedSale.customerId}>
                                        <option value="">Select Customer</option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group mt-3">
                                    <select className="form-control" onChange={(e) => setProductId(e.target.value)} value={selectedSale && selectedSale.productId}>
                                        <option value="">Select Product</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group mt-3">
                                    <input required type="number" className="form-control" placeholder="Enter Quantity" value={selectedSale && selectedSale.quantity} onChange={(e) => setQuantity(e.target.value)} />
                                </div>
                                {customerId &&
                                    <div className="form-group d-flex mt-3 align-items-center">
                                        {userCars.length === 0 ?
                                            <div className="form-control me-2"> No previous cars</div>
                                            :
                                            <select className="form-control">
                                                {userCars.map((car) =>
                                                    <option key={car.id}>{car.name}</option>
                                                )}
                                            </select>
                                        }
                                        <div onClick={showCarModal} className="add-button" title="Add New" data-toggle="tooltip">+</div>
                                    </div>
                                }
                                <br />
                                <Button variant="primary" className="me-3" type="submit">{selectedSale ? 'Update Sale' : 'Add Sale'}</Button>
                                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                            </form>
                        </Modal.Body>

                    </Modal>
                </div>
                <div className="model_box">
                    <Modal
                        show={carModal}
                        onHide={() => {
                            setCarModal(false); // Close the car modal
                            setShow(true); // Open the sale modal
                        }}
                        backdrop="static"
                        keyboard={false}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Add New Car</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleAddCar}>
                                <div className="form-group">
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        placeholder="Car Name"
                                        value={carName}
                                        onChange={(e) => setCarName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group my-3">
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        placeholder="Registration Number"
                                        value={registrationNo}
                                        onChange={(e) => setRegistrationNo(e.target.value)}
                                    />
                                </div>
                                <Button variant="primary" className="me-3" type="submit">
                                    Add Car
                                </Button>
                                <Button variant="secondary" onClick={() => setCarModal(false)}>
                                    Cancel
                                </Button>
                            </form>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>

    );
}

export default Home;
