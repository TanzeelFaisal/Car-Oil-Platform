import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

function Customers() {
    const [show, setShow] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const handleClose = () => {
        setShow(false);
        setSelectedCustomer(null);
    };

    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:3001/customers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleAddCustomer = async (event) => {
        event.preventDefault();
        const form = event.target;
        const newCustomer = {
            name: form.customerName.value,
            phoneNumber: form.phoneNumber.value,
            email: form.email.value,
            address: form.address.value
        };

        if (!newCustomer.name || !newCustomer.phoneNumber || !newCustomer.email || !newCustomer.address)  {
            toast.error('Enter complete customer details')
            return
        }

        try {
            const response = await fetch('http://localhost:3001/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCustomer)
            });
            fetchCustomers();
            if (response.ok)
                toast.success('Customer added successfully')
            else
                toast.error('Customer already exists. Enter unique email and password');

        } catch (error) {
            toast.error('Customer already exists. Enter unique email and password');
        }

        handleClose();
    };

    const handleEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        handleShow();
    };

    const handleUpdateCustomer = async (event) => {
        event.preventDefault();
        const form = event.target;
        const updatedCustomer = {
            ...selectedCustomer,
            name: form.customerName.value,
            phoneNumber: form.phoneNumber.value,
            email: form.email.value,
            address: form.address.value
        };

        try {
            await fetch(`http://localhost:3001/customers/${selectedCustomer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCustomer)
            });
            fetchCustomers();
            toast.success('Customer updated successfully')
        } catch (error) {
            toast.error('Error updating customer');
        }

        handleClose();
    };

    const handleDeleteCustomer = async (customerId) => {
        try {
            await fetch(`http://localhost:3001/customers/${customerId}`, {
                method: 'DELETE'
            });
            fetchCustomers();
            toast.success('Customer deleted successfully')
        } catch (error) {
            toast.error('Error deleting customer');
        }
    };

    const handleSearch = async (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.number.includes(searchTerm)
    );

    return ( 
        <div className='container'>
            <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
                <div className="row ">
                    <div className="col-sm-3 mt-5 mb-4 text-gred">
                        <div className="search">
                            <input
                                className="form-control mr-sm-2"
                                type="search"
                                placeholder="Search Customer"
                                aria-label="Search"
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred"><h2><b>Customer Details</b></h2></div>
                    <div className="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred">
                        <Button variant="primary" onClick={handleShow}>
                            Add New Customer
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <div className="table-responsive " >
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Phone Number</th>
                                    <th>Email</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map(customer => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.name}</td>
                                        <td>{customer.number}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.address}</td>
                                        <td>
                                            <a href="#" onClick={() => handleEditCustomer(customer)} className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                                            <a href="#" onClick={() => handleDeleteCustomer(customer.id)} className="delete" title="Delete" data-toggle="tooltip" style={{ color: "red" }}><i className="material-icons">&#xE872;</i></a>
                                        </td>
                                    </tr>
                                ))}
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
                            <Modal.Title>{selectedCustomer ? 'Edit Customer' : 'Add Customer'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={selectedCustomer ? handleUpdateCustomer : handleAddCustomer}>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="customerName" placeholder="Enter Name" defaultValue={selectedCustomer ? selectedCustomer.name : ''} />
                                </div>
                                <div className="form-group mt-3">
                                    <input type="tel" className="form-control" id="phoneNumber" placeholder="Enter Phone Number" defaultValue={selectedCustomer ? selectedCustomer.number : ''} />
                                </div>
                                <div className="form-group mt-3">
                                    <input type="email" className="form-control" id="email" placeholder="Enter Email" defaultValue={selectedCustomer ? selectedCustomer.email : ''} />
                                </div>
                                <div className="form-group mt-3">
                                    <input type="text" className="form-control" id="address" placeholder="Enter Address" defaultValue={selectedCustomer ? selectedCustomer.address : ''} />
                                </div>
                                <button type="submit" className="btn btn-success mt-4">{selectedCustomer ? 'Update Customer' : 'Add Customer'}</button>
                            </form>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
     );
}

export default Customers;