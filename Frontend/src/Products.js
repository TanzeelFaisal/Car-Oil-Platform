import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

function Products() {
    const [show, setShow] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

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
        setSelectedProduct(null);
    };

    const handleShow = () => setShow(true);

    const handleAddProduct = async (event) => {
        event.preventDefault();
        const form = event.target;
        const newProduct = {
            name: form.productName.value,
            type: form.type.value,
            stock: form.stock.value,
            price: form.price.value // Include price
        };

        try {
            await fetch('http://localhost:3001/oils', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error);
        }

        handleClose();
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        handleShow();
    };

    const handleUpdateProduct = async (event) => {
        event.preventDefault();
        const form = event.target;
        const updatedProduct = {
            ...selectedProduct,
            name: form.productName.value,
            type: form.type.value,
            stock: form.stock.value,
            price: form.price.value // Include price
        };

        try {
            await fetch(`http://localhost:3001/oils/${selectedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });
            fetchProducts();
        } catch (error) {
            console.error('Error updating product:', error);
        }

        handleClose();
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await fetch(`http://localhost:3001/oils/${productId}`, {
                method: 'DELETE'
            });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = Array.isArray(products)
        ? products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(product.stock) === searchTerm ||
            String(product.price) === searchTerm // Include price
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
                                placeholder="Search Product"
                                aria-label="Search"
                                onChange={handleSearch}
                            />
                        </div>
                    </div>
                    <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred"><h2><b>Product Details</b></h2></div>
                    <div className="col-sm-3 offset-sm-1  mt-5 mb-4 text-gred">
                        <Button variant="primary" onClick={handleShow}>
                            Add New Product
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
                                    <th>Type</th>
                                    <th>Stock</th>
                                    <th>Price</th> {/* Include Price */}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.type}</td>
                                        <td>{product.stock}</td>
                                        <td>{product.price}</td> {/* Include Price */}
                                        <td>
                                            <a href="#" onClick={() => handleEditProduct(product)} className="edit" title="Edit" data-toggle="tooltip"><i className="material-icons">&#xE254;</i></a>
                                            <a href="#" onClick={() => handleDeleteProduct(product.id)} className="delete" title="Delete" data-toggle="tooltip" style={{ color: "red" }}><i className="material-icons">&#xE872;</i></a>
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
                            <Modal.Title>{selectedProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={selectedProduct ? handleUpdateProduct : handleAddProduct}>
                                <div className="form-group">
                                    <input type="text" className="form-control" id="productName" placeholder="Enter Name" defaultValue={selectedProduct ? selectedProduct.name : ''} />
                                </div>
                                <div className="form-group mt-3">
                                    <input type="text" className="form-control" id="type" placeholder="Enter Type" defaultValue={selectedProduct ? selectedProduct.type : ''} />
                                </div>
                                <div className="form-group mt-3">
                                    <input type="text" className="form-control" id="stock" placeholder="Enter Stock" defaultValue={selectedProduct ? selectedProduct.stock : ''} />
                                </div>
                                <div className="form-group mt-3"> {/* Include Price field */}
                                    <input type="text" className="form-control" id="price" placeholder="Enter Price" defaultValue={selectedProduct ? selectedProduct.price : ''} />
                                </div>
                                <button type="submit" className="btn btn-success mt-4">{selectedProduct ? 'Update Product' : 'Add Product'}</button>
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

export default Products;
