import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import styles from "../styles/NavBar.module.css"; 
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import axios from 'axios';

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const history = useHistory();

  // Logout Handler
  const handleLogout = async () => {
    try {
      await axios.post("/dj-rest-auth/logout/", {}, { withCredentials: true });
      setCurrentUser(null);
      history.push("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const loggedInIcons = (
    <>
      <NavLink to="/profile" className={styles.navLink} aria-label="Profile">
        <i className="fas fa-user"></i> {currentUser?.username}
      </NavLink>
      <Nav.Link onClick={handleLogout} aria-label="Logout">
        <i className="fas fa-sign-out-alt"></i> Logout
      </Nav.Link>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink 
        to="/signin" 
        aria-label="Sign in" 
        className={({ isActive }) => (isActive ? styles.activeLink : styles.navLink)}
      >
        <i className="fas fa-sign-in-alt"></i> Sign in
      </NavLink>
      <NavLink 
        to="/signup" 
        aria-label="Sign up" 
        className={({ isActive }) => (isActive ? styles.activeLink : styles.navLink)}
      >
        <i className="fas fa-user-plus"></i> Sign up
      </NavLink>
    </>
  );

  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/" className="navbar-brand" aria-label="Home">
          <Navbar.Brand>ArtConnect</Navbar.Brand>
        </NavLink>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink 
              to="/" 
              aria-label="Home" 
              className={({ isActive }) => (isActive ? styles.activeLink : styles.navLink)}
            >
              <i className="fas fa-home"></i> Home
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
