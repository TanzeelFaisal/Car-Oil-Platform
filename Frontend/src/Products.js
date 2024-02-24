import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function Products() {
    const [show, setShow] = useState(false);
    const [products, setProducts] = useState([
        { id: 1, name: 'Product 1', price: 10, description: 'Description 1' },
        { id: 2, name: 'Product 2', price: 20, description: 'Description 2' }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleClose = () => {
        setShow(false);
        setSelectedProduct(null);
    };

    const handleShow = () => setShow(true);

    const handleAddProduct = (event) => {
        event.preventDefault();
        const form = event.target;
        const newProduct = {
            id: products.length + 1,
            name: form.productName.value,
            price: form.price.value,
            description: form.description.value
        };
        setProducts([...products, newProduct]);
        handleClose();
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        handleShow();
    };

    const handleUpdateProduct = (event) => {
        event.preventDefault();
        const form = event.target;
        const updatedProduct = {
            ...selectedProduct,
            name: form.productName.value,
            price: form.price.value,
            description: form.description.value
        };
        const updatedProducts = products.map(product =>
            product.id === updatedProduct.id ? updatedProduct : product
        );
        setProducts(updatedProducts);
        setSelectedProduct(null);
        handleClose();
    };

    const handleDeleteProduct = (productId) => {
        const updatedProducts = products.filter(product => product.id !== productId);
        setProducts(updatedProducts);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.price == searchTerm
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
                                    <th>Price</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>Rs. {product.price}</td>
                                        <td>{product.description}</td>
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
                                    <input type="text" className="form-control" id="price" placeholder="Enter Price" defaultValue={selectedProduct ? selectedProduct.price : ''} />
                                </div>
                                <div className="form-group mt-3">
                                    <input type="text" className="form-control" id="description" placeholder="Enter Description" defaultValue={selectedProduct ? selectedProduct.description : ''} />
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
