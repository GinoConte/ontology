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
            <h1>Financial Ontology</h1>
          </Col>
          <Col xs={12}>
            <div className="Home-buttons-container">
              <FlatButton label="About" className="Home-button" />
              <FlatButton href="/categories" label="Categories" className="Home-button" />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
