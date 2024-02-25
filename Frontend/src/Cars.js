import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

function Cars() {
    const [show, setShow] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [cars, setCars] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCar, setSelectedCar] = useState(null);
    const [customerId, setCustomerId] = useState('');

    useEffect(() => {
        fetchCustomers();
        fetchCars();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:3001/customers');
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchCars = async () => {
        try {
            const response = await fetch('http://localhost:3001/cars');
            const data = await response.json();
            setCars(data);
        } catch (error) {
            console.error('Error fetching cars:', error);
        }
    };

    const handleClose = () => {
        setShow(false);
        setSelectedCar(null);
    };

    const handleShow = () => setShow(true);

    const handleAddCar = async (event) => {
        event.preventDefault();
        const form = event.target;
        const newCar = {
            customer_id: form.customerId.value,
            car_name: form.carName.value,
            reg_number: form.regNumber.value
        };

        try {
            await fetch('http://localhost:3001/cars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCar)
            });
            fetchCars();
        } catch (error) {
            console.error('Error adding car:', error);
        }

        handleClose();
    };

    const handleEditCar = (car) => {
        setSelectedCar(car);
        handleShow();
    };

    const handleUpdateCar = async (event) => {
        event.preventDefault();
        const form = event.target;
        const updatedCar = {
            ...selectedCar,
            car_name: form.carName.value,
            reg_number: form.regNumber.value
        };

        try {
            await fetch(`http://localhost:3001/cars/${selectedCar.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedCar)
            });
            fetchCars();
        } catch (error) {
            console.error('Error updating car:', error);
        }

        handleClose();
    };

    const handleDeleteCar = async (carId) => {
        try {
            await fetch(`http://localhost:3001/cars/${carId}`, {
                method: 'DELETE'
            });
            fetchCars();
        } catch (error) {
            console.error('Error deleting car:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCars = Array.isArray(cars)
        ? cars.filter(car =>
            car.car_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            car.reg_number.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <div className='container'>
            <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
                <div className="row ">
                    <div className="col-sm-3 mt-5 mb-4 text-gred">
                        <div className="search">
                            <input
                                className="form-control mr-sm-2"
                                type="search"
                                placeholder="Search Car"
                                aria-label="Search"
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred"><h2><b>Car Details</b></h2></div>
                    <div className="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred">
                        <Button variant="primary" onClick={handleShow}>
                            Add New Car
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
                                    <th>Registration Number</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCars.map(car => (
                                    <tr key={car.id}>
                                        <td>{car.id}</td>
                                        <td>{car.car_name}</td>
                                        <td>{car.reg_number}</td>
                                        <td>{car.customer_name}</td>
                                        <td>
                                            <a href="#" onClick={() => handleEditCar(car)} className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                                            <a href="#" onClick={() => handleDeleteCar(car.id)} className="delete" title="Delete" data-toggle="tooltip" style={{ color: "red" }}><i className="material-icons">&#xE872;</i></a>
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
                            <Modal.Title>{selectedCar ? 'Edit Car' : 'Add Car'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={selectedCar ? handleUpdateCar : handleAddCar}>
                                <div className="form-group">
                                    <label htmlFor="carName">Car Name:</label>
                                    <input type="text" className="form-control" id="carName" placeholder="Enter Car Name" value={selectedCar && selectedCar.car_name} />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="regNumber">Registration Number:</label>
                                    <input type="text" className="form-control" id="regNumber" placeholder="Enter Registration Number" value={selectedCar && selectedCar.reg_number} />
                                </div>
                                <div className="form-group mt-3">
                                    <label htmlFor="customerId">Select Customer:</label>
                                    <select className="form-control" id="customerId" onChange={(e) => setCustomerId(e.target.value)} value={selectedCar && selectedCar.customer_id}>
                                        <option value="">Select Customer</option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-success mt-4">{selectedCar ? 'Update Car' : 'Add Car'}</button>
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

export default Cars;
