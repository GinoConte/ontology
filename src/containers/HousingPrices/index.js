import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'reactstrap'

import FlatButton from 'material-ui/FlatButton';

import './styles.css';

class Home extends Component {
  render() {
    return (
      <Container className="Home">
        <Row>
          <Col xs={12}>
            <h1>Housing Prices</h1>
          </Col>
          <Col xs={12}>
            <div className="Home-buttons-container">
              <FlatButton label="About" />
              <FlatButton href="/categories" label="Categories" />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
