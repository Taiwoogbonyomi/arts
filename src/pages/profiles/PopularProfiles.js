import React from 'react';
import appstyles from "../../App.module.css"
import { Container } from 'react-bootstrap';

const PopularProfiles = () => {
  return (
    <Container className={appstyles.content}>
        <p>Most followed profiles</p>
    </Container>
  )
}

export default PopularProfiles