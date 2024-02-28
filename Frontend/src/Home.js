import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Receipt from "./components/Receipt";
import {toast} from 'react-toastify'
// import axios from 'axios';

function Home() {
    const [show, setShow] = useState(false);
    const [sales, setSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [customerId, setCustomerId] = useState('');
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [car, setCar] = useState({});
    const [currentMileage, setCurrentMileage] = useState('');
    const [nextMileage, setNextMileage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
    const [receiptModal, setreceiptModal] = useState(false);
    const [userCars, setUserCars] = useState([]);
    const [receipt, setReceipt] = useState();

    useEffect(() => {
        fetchSales();
        fetchCustomers();
        fetchProducts();
    }, []);

    const fetchSales = async () => {
        try {
            const response = await fetch('http://localhost:3001/sales', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });    
            let data = await response.json();
            data = data.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    
    const fetchUserCars = async (customerId) => {
        try {
            const response = await fetch(`http://localhost:3001/customers/${customerId}/cars`);
            const data = await response.json();
            setUserCars(data);
            return data
        } catch (error) {
            console.error('Error fetching user cars:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/oils');
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
        e.preventDefault();
        if (!customerId || !productId || !nextMileage || !currentMileage || !car) {
            toast.error('Enter complete details')
            return
        }
        const selectedProduct = products.find(product => product.id === parseInt(productId));
    
        const totalAmount = selectedProduct.price * parseInt(quantity);
        

        const newSale = {
            customer_id: customerId,
            oil_id: productId,
            oil_quantity: parseInt(quantity),
            car_reg_number: car,
            current_mileage: currentMileage,
            next_mileage: nextMileage,
            bill_amount: totalAmount,
            date: new Date().toLocaleString()
        };
        const selectedCustomer = customers.find(customer => customer.id === parseInt(customerId));
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
                sendText(selectedCustomer.number, `Your purchase of ${totalAmount} was confirmed for your car with the registration number: ${car}.`);
                toast.success('Sale added successfully')
            } else if (response.status == 400) {
                toast.error('Stock is lesser than the quantity entered!');
            } else {
                toast.error('Error adding sale');
            }
        } catch (error) {
            toast.error('Error adding sale');
        }
    };

    const sendText = async (recipient, textmessage) => { 
        const body = {
            recipient: recipient,
            textmessage: textmessage
        };
    
        const response = await fetch('http://localhost:3001/send-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }).then(response => {
            toast.success('Message sent to user successfully')
            })
        .catch(error => {
            toast.error('Error sending text. Balance low')
        });
    };

    const handleEditSale = (sale) => {
        setCustomerId(sale.customer_id)
        setProductId(sale.oil_id)
        setQuantity(sale.oil_quantity)
        setCurrentMileage(sale.current_mileage)
        setNextMileage(sale.next_mileage)
        setCar(sale.car_reg_number)
        setSelectedSale(sale);
        handleShow();
        fetchUserCars(sale.customer_id)
    };

    const handleUpdateSale = async (e) => {
        e.preventDefault()
        const selectedProduct = products.find(product => product.id === parseInt(productId));
    
        const totalAmount = selectedProduct.price * parseInt(quantity);
        const updatedSale = {
            customer_id: customerId,
            oil_id: productId,
            car_reg_number: car,
            next_mileage: nextMileage,
            current_mileage: currentMileage,
            oil_quantity: parseInt(quantity),
            bill_amount: totalAmount
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
                toast.success('Sale updated successfully')
            } else {
                toast.error('Error updating sale');
            }
        } catch (error) {
            toast.error('Error updating sale');
        }
    };

    const handleDeleteSale = async (sale) => {
        try {
            const response = await fetch(`http://localhost:3001/sales/${sale.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchSales();
                toast.success('Sale removed successfully')
            } else {
                toast.error('Error deleting sale');
            }
        } catch (error) {
            toast.error('Error deleting sale');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const filteredSales = sales.filter(sale =>{
        const customer = customers.find(cust => cust.id == sale.customer_id);
        const product = products.find(prod => prod.id == sale.oil_id);

        return sale.car_reg_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    );

    const handleShowReceipt = (sale) => {
        const customer = customers.find(cust => cust.id == sale.customer_id);
        const product = products.find(prod => prod.id == sale.oil_id);
        const info = {
            name: customer.name,
            phone: customer.number,
            email: customer.email,
            date: sale.date,
            amount: sale.bill_amount,
            quantity: sale.oil_quantity,
            carname: sale.car_name,
            regNo: sale.car_reg_number,
            current: sale.current_mileage,
            next: sale.next_mileage,
            oil: product.name
        };
        setReceipt(info)
        setreceiptModal(true)
    }

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
                                    <th>Car Registration</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Total Amount</th>
                                    <th>Current Mileage</th>
                                    <th>Next Mileage</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSales.map((sale, index) => {
                                    const customer = customers.find(cust => cust.id == sale.customer_id);
                                    const product = products.find(prod => prod.id == sale.oil_id);
                                    return (
                                        <tr key={index}>
                                            <td>{customer ? customer.name : ''}</td>
                                            <td>{sale.car_reg_number}</td>
                                            <td>{product ? product.name : ''}</td>
                                            <td>{sale.oil_quantity}</td>
                                            <td>{sale.bill_amount}</td>
                                            <td>{sale.current_mileage}</td>
                                            <td>{sale.next_mileage}</td>
                                            <td>{new Date(sale.date).toLocaleDateString()}</td>
                                            <td>
                                                <a href="#" onClick={() => handleEditSale(sale)} className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                                                <a href="#" onClick={() => handleDeleteSale(sale)} className="delete" title="Delete" data-toggle="tooltip" style={{ color: "red" }}><i className="material-icons">&#xE872;</i></a>
                                                <a href="#" onClick={() => handleShowReceipt(sale)} className="viewreceipt" title="view receipt" data-toggle="tooltip" style={{color:"#10ab80"}}><i className="material-icons">&#xE417;</i></a>
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
                                    <select className="form-control" onChange={(e) => { setCustomerId(e.target.value); fetchUserCars(e.target.value) } } defaultValue={customerId}>
                                        <option value="">Select Customer</option>
                                        
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group mt-3">
                                    {(customerId || selectedSale) && (
                                        <select className="form-control" onChange={(e) => setCar(e.target.value)} defaultValue={car}>
                                            <option value="">Select Car</option>
                                            {userCars.map(car => (
                                                <option key={car.reg_number} value={car.reg_number}>{car.reg_number}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div className="form-group mt-3">
                                    <input required type="number" className="form-control" placeholder="Enter Current Mileage" defaultValue={currentMileage} onChange={(e) => setCurrentMileage(e.target.value)} />
                                </div>
                                <div className="form-group mt-3">
                                    <input required type="number" className="form-control" placeholder="Enter Next Mileage" defaultValue={nextMileage} onChange={(e) => setNextMileage(e.target.value)} />
                                </div>
                                <div className="form-group mt-3">
                                    <select className="form-control" onChange={(e) => setProductId(e.target.value)} value={productId}>
                                        <option value="">Select Product</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>{product.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group mt-3">
                                    <input required type="number" className="form-control" placeholder="Enter Quantity" defaultValue={quantity} onChange={(e) => setQuantity(e.target.value)} />
                                </div>
                                <br />
                                <Button variant="primary" className="me-3" type="submit">{selectedSale ? 'Update Sale' : 'Add Sale'}</Button>
                                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                            </form>
                        </Modal.Body>
                    </Modal>
                </div>
                <div className="model_box receipt">
                    <Modal
                        show={receiptModal}
                        onHide={() =>
                            setreceiptModal(false)
                        }
                        backdrop="static"
                        keyboard={false}
                        className="receipt"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Sale Receipt</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Receipt info={receipt}/>
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </div>

    );
}

export default Home;
