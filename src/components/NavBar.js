import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import styles from "../styles/NavBar.module.css"; 
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import Avatar from "./Avatar"
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

  const addPostIcon = (
      <NavLink to="/create-post" 
      className={styles.navLink} 
      aria-label="Add Post">
        <i className="fas fa-plus"></i> Add Post
      </NavLink>
  )

  const loggedInIcons = (
    <>
       <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/timeline"
      >
        <i className="fas fa-stream"></i>Timeline
      </NavLink>
      <NavLink
        className={styles.NavLink}
        activeClassName={styles.Active}
        to="/liked"
      >
        <i className="fas fa-heart"></i>Liked
      </NavLink>
      <NavLink className={styles.NavLink} to="/" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>Sign out
      </NavLink>
      <NavLink
        className={styles.NavLink}
        to={`/profiles/${currentUser?.profile_id}`}
      >
        <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
      </NavLink>
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
        {currentUser && addPostIcon}
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
