import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "../styles/SignInUpForm.module.css";
import btnStyles from "../styles/Button.module.css";
import appStyles from "../App.module.css";

import {
  Form,
  Button,
  Image,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
import axios from "axios";

const SignUpForm = () => {
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
    bio: "",
    role: "Artist", // Default role
    profileImage: null,
  });
  
  const { username, password1, password2, bio, role, profileImage } = signUpData;
  const [errors, setErrors] = useState({});
  
  const history = useHistory();
  
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFileChange = (event) => {
    setSignUpData({
      ...signUpData,
      profileImage: event.target.files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password1", password1);
    formData.append("password2", password2);
    formData.append("bio", bio);
    formData.append("role", role);
    
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      await axios.post("/dj-rest-auth/registration/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      history.push("/signin");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4 `}>
          <h1 className={styles.Header}>Sign up for Art Connect</h1>

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

            <Form.Group controlId="bio">
              <Form.Label className="d-none">Bio</Form.Label>
              <Form.Control
                className={styles.Input}
                as="textarea"
                placeholder="Tell us about yourself and your art"
                name="bio"
                value={bio}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={role}
                onChange={handleChange}
                className={styles.Input}
              >
                <option value="Artist">Artist</option>
                <option value="Viewer">Viewer</option>
                <option value="Curator">Curator</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="profileImage">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="profileImage"
                onChange={handleFileChange}
                className={styles.Input}
              />
            </Form.Group>
            {errors.profileImage?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password1">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password1"
                value={password1}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password1?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group controlId="password2">
              <Form.Label className="d-none">Confirm password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Confirm password"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password2?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Button
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
              type="submit"
            >
              Sign up
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>

        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signin">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
      >

      </Col>
    </Row>
  );
};

export default SignUpForm;
