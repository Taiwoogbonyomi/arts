import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button, Col, Row, Container, Alert, Image, Spinner } from "react-bootstrap";
import axios from "axios";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

const SignUpForm = () => {
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
    profileImage: null,
  });

  const { username, password1, password2, profileImage } = signUpData;
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const history = useHistory();

  // Handle input change and clear errors
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });

    setErrors((prevErrors) => ({
      ...prevErrors,
      [event.target.name]: undefined,
    }));
  };

  // Handle file selection and preview
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setErrors({ profileImage: ["Only JPG and PNG files are allowed."] });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ profileImage: ["File size must be less than 2MB."] });
        return;
      }

      setSignUpData({ ...signUpData, profileImage: file });

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrors({});

    // Client-side validation
    if (username.length < 3) {
      setErrors({ username: ["Username must be at least 3 characters long."] });
      setLoading(false);
      return;
    }
    if (password1.length < 8) {
      setErrors({ password1: ["Password must be at least 8 characters long."] });
      setLoading(false);
      return;
    }
    if (password1 !== password2) {
      setErrors({ password2: ["Passwords must match."] });
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password1", password1);
    formData.append("password2", password2);

    if (profileImage) {
      formData.append("image", profileImage);
    }

    try {
      const response = await axios.post("/dj-rest-auth/registration/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // If registration is successful
      setSuccessMessage("Registration successful! Please sign in.");
      setTimeout(() => history.push("/signin"), 2000);
    } catch (err) {
      setErrors(err.response?.data || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className={`${styles.Row} d-flex align-items-center justify-content-center min-vh-100`}>
      <Col xs={12} md={6}>
        <Container className={`${appStyles.Content} p-4`} style={{ maxWidth: "500px", minWidth: "320px" }}>
          <h1 className={styles.Header}>Sign up for Art Connect</h1>

          {/* Display success or error messages */}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          {errors.non_field_errors?.map((message, idx) => (
            <Alert key={idx} variant="warning" className="mt-3">{message}</Alert>
          ))}

          <Form onSubmit={handleSubmit}>
            {/* Username Field */}
            <Form.Group controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
                aria-describedby="username-help"
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>{message}</Alert>
            ))}

            {/* Profile Image Upload */}
            <Form.Group controlId="profileImage">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="profileImage"
                onChange={handleFileChange}
                className={styles.Input}
                aria-describedby="profileImage-help"
              />
            </Form.Group>
            {preview && <Image src={preview} alt="Profile Preview" className="mt-3" roundedCircle fluid />}
            {errors.profileImage?.map((message, idx) => (
              <Alert key={idx} variant="warning">{message}</Alert>
            ))}

            {/* Password Fields */}
            <Form.Group controlId="password1">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password1"
                value={password1}
                onChange={handleChange}
                aria-describedby="password1-help"
              />
            </Form.Group>
            {errors.password1?.map((message, idx) => (
              <Alert key={idx} variant="warning">{message}</Alert>
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
                aria-describedby="password2-help"
              />
            </Form.Group>
            {errors.password2?.map((message, idx) => (
              <Alert key={idx} variant="warning">{message}</Alert>
            ))}

            {/* Submit Button */}
            <Button className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`} type="submit" disabled={loading}>
              {loading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                "Sign up"
              )}
            </Button>
          </Form>
        </Container>

        {/* Sign-in Link */}
        <Container className={`mt-3 ${appStyles.Content}`} style={{ maxWidth: "320px" }}>
          <Link className={styles.Link} to="/signin">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </Col>
    </Row>
  );
};

export default SignUpForm;
