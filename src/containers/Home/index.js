import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'reactstrap'
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';

import FlatButton from 'material-ui/FlatButton';

import './styles.css';


class Home extends Component {
  render() {
    return (
      <Container className="Home">
        <Row>
          <Col xs={12}>
            <h1>FLO</h1>
            <h4>Force-directed (Statistical) Learning Ontology</h4>
          </Col>
          <Col xs={12}>
            <div className="Home-buttons-container">
              <FlatButton label="About" className="Home-button" />
              <FlatButton href="/categories" label="Knowledge Packs" className="Home-button" primary={true} />
            </div>


          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
