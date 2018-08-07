import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'reactstrap'

import {
  Card,
  CardActions,
  CardTitle, 
  CardText,
} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import './styles.css';

class Categories extends Component {
  render() {
    const categories = ['Housing prices', 'Digital Marketing', 'Education', 'Stock forecasting', 'Event study', 'A', 'B', 'C', 'D', 'E', 'F', 'Add'];
    const renderedCategories = categories.map(category => {
      if (category !== 'Add') {
        return (
          <Col xs={12} sm={12} md={6} lg={4} className="Card-section">
            <Card className="Card">
              <CardTitle title={category} subtitle={category === 'Digital Marketing' ? 'Advertising Performance & User Activity' : 'Card subtitle'} />
              <CardText className={"Category content"}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
              </CardText>
              <CardActions>
                <FlatButton href="/model-builder" label="Start" primary={true} />
              </CardActions>
            </Card>
          </Col>
        )
      } else {
        return (
          <Col xs={12} sm={12} md={6} lg={4} className="Card-section last">
            <Card className="Card">
              <CardActions>
                <FlatButton href="/model-builder" label="Load More" />
              </CardActions>
            </Card>
          </Col>
        );
      }
    });
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
