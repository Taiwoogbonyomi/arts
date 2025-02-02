import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { NavLink, useHistory } from 'react-router-dom';
import styles from "../styles/NavBar.module.css"; 
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import Avatar from "./Avatar";
import axios from 'axios';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const history = useHistory();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

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
    <NavLink to="/create-post" className={styles.navLink} aria-label="Create Post">
      <i className="fas fa-plus"></i> <span>Create Post</span>
    </NavLink>
  );

  const loggedInIcons = (
    <>
      <NavLink className={styles.navLink} activeClassName={styles.activeLink} to="/timeline">
        <i className="fas fa-stream"></i> <span>Timeline</span>
      </NavLink>
      <NavLink className={styles.navLink} activeClassName={styles.activeLink} to="/liked">
        <i className="fas fa-heart"></i> <span>Liked</span>
      </NavLink>
      <NavLink className={styles.navLink} to="/" onClick={handleLogout} aria-label="Sign out">
        <i className="fas fa-sign-out-alt"></i> <span>Sign out</span>
      </NavLink>
      <NavLink className={styles.navLink} to={`/profiles/${currentUser?.profile_id}`}>
        <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
      </NavLink>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink to="/signin" className={styles.navLink} activeClassName={styles.activeLink} aria-label="Sign in">
        <i className="fas fa-sign-in-alt"></i> <span>Sign in</span>
      </NavLink>
      <NavLink to="/signup" className={styles.navLink} activeClassName={styles.activeLink} aria-label="Sign up">
        <i className="fas fa-user-plus"></i> <span>Sign up</span>
      </NavLink>
    </>
  );

  return (
    <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/" className="navbar-brand" aria-label="Home">
          <Navbar.Brand>ArtConnect</Navbar.Brand>
        </NavLink>
        {currentUser && addPostIcon}
        <Navbar.Toggle ref={ref} onClick={() => setExpanded(!expanded)} aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink to="/" className={styles.navLink} activeClassName={styles.activeLink} aria-label="Home">
              <i className="fas fa-home"></i> <span>Home</span>
            </NavLink>
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
