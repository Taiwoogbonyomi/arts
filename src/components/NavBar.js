import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import styles from "../styles/NavBar.module.css";  

const NavBar = () => {
  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/" className="navbar-brand">
          <Navbar.Brand aria-label="Home">
            <span className="sr-only">Home</span>
          </Navbar.Brand>
        </NavLink>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <Nav.Link 
              as={NavLink} 
              to="/" 
              aria-label="Home" 
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              <i className="fas fa-home"></i> Home
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/signin" 
              aria-label="Sign in" 
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              <i className="fas fa-sign-in-alt"></i> Sign in
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/signup" 
              aria-label="Sign up" 
              className={({ isActive }) => (isActive ? styles.activeLink : '')}
            >
              <i className="fas fa-user-plus"></i> Sign up
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
