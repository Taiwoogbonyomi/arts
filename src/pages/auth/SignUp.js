import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import treeLogo from "../../assets/tree-logo-5191427_1280.webp";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

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
    profile_image: null, 
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { username, password1, password2, profile_image } = signUpData;

  const [errors, setErrors] = useState({});

  const history = useHistory();

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "profile_image") {
      // Handle file input (image)
      const file = files[0];
      setSignUpData({
        ...signUpData,
        profile_image: file,
      });

      // Create an image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result); 
        };
        reader.readAsDataURL(file); 
      }
    } else {
      setSignUpData({
        ...signUpData,
        [name]: value, 
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password1", password1);
    formData.append("password2", password2);
    if (profile_image) {
      formData.append("profile_image", profile_image);
    }

    try {
      await axios.post("/dj-rest-auth/registration/", formData, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
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
          <h1 className={styles.Header}>sign up</h1>

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
              <Form.Label className="d-none">Confirm Password</Form.Label>
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

            <Form.Group controlId="profile_image">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                className={styles.Input}
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={handleChange}
              />
            </Form.Group>
            {imagePreview && (
              <div className="mt-3">
                <Image
                  src={imagePreview}
                  alt="Profile Preview"
                  roundedCircle
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </div>
            )}
            {errors.profile_image?.map((message, idx) => (
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
      <Col md={6} className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}>
        <Image className={`${appStyles.FillerImage}`} src={treeLogo} />
      </Col>
    </Row>
  );
};

export default SignUpForm;
