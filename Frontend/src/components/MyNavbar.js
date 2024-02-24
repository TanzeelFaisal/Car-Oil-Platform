
import { Link } from "react-router-dom";
import { Container, Nav, Navbar } from 'react-bootstrap';

const MyNavbar = () => {
    return (
        <Navbar bg="light" collapseOnSelect expand="lg" className="bg-body-tertiary navbar">
            <Container>
                <Navbar.Brand href="#home">Car Oil Sales</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link ><Link to='/'>Sales</Link></Nav.Link>
                    </Nav>
                    <Nav>

                        <Nav.Link><Link to='customers'>Customers</Link></Nav.Link>
                        <Nav.Link>
                            <Link to='products'>Products</Link>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MyNavbar;