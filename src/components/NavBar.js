import React from 'react';
import { Navbar, Container, Nav } from "react-bootstrap";
import "../styles/NavBar.css";  // Import CSS for styles

const NavBar = () => {
  return (
    <Navbar expand="md" fixed="top" className="custom-navbar">
      <Container>
        <Navbar.Brand href="/" aria-label="Home">
          <span className="sr-only">Home</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto text-left">
            <Nav.Link href="/" aria-label="Home">
              <i className="fas fa-home"></i> Home
            </Nav.Link>
            <Nav.Link href="/signin" aria-label="Sign in">
              <i className="fas fa-sign-in-alt"></i> Sign in
            </Nav.Link>
            <Nav.Link href="/signup" aria-label="Sign up">
              <i className="fas fa-user-plus"></i> Sign up
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
