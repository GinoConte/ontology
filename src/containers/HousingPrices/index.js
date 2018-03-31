import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'reactstrap'
import AmCharts from '@amcharts/amcharts3-react';
// import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

import './styles.css';

class Home extends Component {
  render() {
    const chartData = [
      {
        "country": "USA",
        "visits": 4252
      },
      {
        "country": "Poland",
        "visits": 328
      },
      {
        "country": "Australia",
        "visits": 2011
      },
      {
        "country": "China",
        "visits": 3599
      }
    ];
    return (
      <Container className="Container">
        <Row>
          <Col xs={12}>
            <h1>Housing Prices</h1>
          </Col>
          <Col xs={12}>
            <div className="Content">
            <AmCharts.React
              style={{
                width: "100%",
                height: "500px"
              }}
              options={{
                "type": "serial",
                "theme": "dark",
                "dataProvider": chartData,
                "categoryField": "country",
                "graphs": [{
                  "valueField": "visits",
                  "type": "column",
                  "fillAlphas": 0.4,
                  "lineAlpha": 0.9,
                  "lineColor": 'rgb(11, 179, 214)',
                }]
              }}
            />
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
