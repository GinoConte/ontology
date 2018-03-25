import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'reactstrap'

import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle, 
  CardText,
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


import './App.css';

class Categories extends Component {
  render() {
    const categories = ['Housing prices', 'Education', 'Stock forecasting', 'Event study']
    const renderedCategories = categories.map(category => (
      <Col xs={4} className="Card-section">
        <Card>
          <CardTitle title={category} subtitle="Card subtitle" />
          <CardText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
            Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
            Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
          </CardText>
          <CardActions>
            <FlatButton label="Start" />
          </CardActions>
        </Card>
      </Col>
    ));
    return (
      <Container className="Categories">
        <Row className="Cards-container">
          <Col xs={12}>
            <Row>
              {renderedCategories}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Categories;
