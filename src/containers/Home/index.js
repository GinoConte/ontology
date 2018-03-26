import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'reactstrap'

import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './Home.css';

class Home extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Container className="Home">
          <Row>
            <Col xs={12}>
              <h1>Financial Ontology</h1>
            </Col>
            <Col xs={12}>
              <div className="Home-buttons-container">
                <FlatButton label="About" />
                <FlatButton href="/categories" label="Categories" />
                <FlatButton label="Sign in" />
              </div>
            </Col>
          </Row>
        </Container>
      </MuiThemeProvider>
    );
  }
}

export default Home;
