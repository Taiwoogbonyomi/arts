import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";  
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";

import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import { SetCurrentUserContext } from "../../App";

const SignInForm = () => {
  const setCurrentUser = useContext(SetCurrentUserContext);

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const history = useHistory();

  // Handle input field changes
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 
    try {
      // Make the request to the backend with CSRF token and credentials
      const { data } = await axios.post(
        "https://art-drf-api-f47791898f85.herokuapp.com/dj-rest-auth/login/", 
        signInData,
        { withCredentials: true } 
      );

      // Store the auth token in localStorage
      localStorage.setItem("authToken", data.key);

      // Redirect to the home page after successful login
      setCurrentUser(data.user);
      history.push("/home");  
    } catch (err) {
      setErrors(err.response?.data || { non_field_errors: ["An error occurred, please try again."] });
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="w-50 p-4 shadow-lg bg-white rounded"> 
        <h1 className="text-center mb-4">Sign In</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label className="d-none">Username</Form.Label>
            <Form.Control
              className={styles.Input}
              type="text"
              placeholder="Username"
              name="username"
              value={username}
              onChange={handleChange}
            />
          </Form.Group>
          {errors.username?.map((message, idx) => (
            <Alert variant="warning" key={idx}>
              {message}
            </Alert>
          ))}

          <Form.Group controlId="password">
            <Form.Label className="d-none">Password</Form.Label>
            <Form.Control
              className={styles.Input}
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </Form.Group>
          {errors.password?.map((message, idx) => (
            <Alert key={idx} variant="warning">
              {message}
            </Alert>
          ))}

          <Button
            className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright} w-100 mt-3`}
            type="submit"
            disabled={loading} 
          >
            {loading ? (
              <Spinner animation="border" size="sm" /> 
            ) : (
              "Sign In"
            )}
          </Button>

          {errors.non_field_errors?.map((message, idx) => (
            <Alert key={idx} variant="warning" className="mt-3">
              {message}
            </Alert>
          ))}
        </Form>

        <div className="text-center mt-3">
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up here!</span>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default SignInForm;
