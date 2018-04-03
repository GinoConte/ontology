import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'reactstrap'
import AmCharts from '@amcharts/amcharts3-react';
// import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import Slider from 'material-ui/Slider';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';


import './styles.css';

class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: 1,
    }

    this.handleChange = this.handleChange.bind(this);
  };

  handleChange = (event, index, value) => this.setState({value});

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

    function updateHeatmap( event ) {
      var map = event.chart;
      if ( map.dataGenerated )
        return;
      if ( map.dataProvider.areas.length === 0 ) {
        setTimeout( updateHeatmap, 100 );
        return;
      }
      for ( var i = 0; i < map.dataProvider.areas.length; i++ ) {
        map.dataProvider.areas[ i ].value = Math.round( Math.random() * 10000 );
      }
      map.dataGenerated = true;
      map.validateNow();
    }

    function generatechartData() {
      var chartData = [];
      var firstDate = new Date();
      firstDate.setDate(firstDate.getDate() - 150);
      var visits = 800000;
  
      for (var i = 0; i < 150; i++) {
          // we create date objects here. In your data, you can have date strings
          // and then set format of your dates using chart.dataDateFormat property,
          // however when possible, use date objects, as this will speed up chart rendering.
          var newDate = new Date(firstDate);
          newDate.setDate(newDate.getDate() + i);
  
          visits += Math.round((Math.random()<0.5?1:-1)*Math.random()*10);
  
          chartData.push({
              date: newDate,
              visits: visits
          });
      }
      return chartData;
    }

    var data = generatechartData();

    const formula = `Y = f(X) = 𝛽0 + 𝛽1 * X1 + 𝛽1 * X2 + 𝛽1 * X3`;

    return (
      <Container className="Container">
        <Row>
          <Col xs={12}>
            <h1>Housing Prices</h1>
          </Col>
          <Col xs={12}>
            <div className="Content">
              <Paper className="Parameters" zDepth={1}>
                <Row>
                  {/* <Col xs={12}>
                    <span><i>Adjust fiancial model parameters</i></span>
                  </Col> */}
                  <Col xs={12} md={6} lg={4}>
                    <AmCharts.React
                      style={{
                        width: "100%",
                        height: "175px",
                        marginLeft: "-20px",
                        marginBottom: "-20px",
                        marginTop: "-5px",
                      }}
                      options={{
                        "type": "map",
                        "theme": "dark",
                        "colorSteps": 10,
                        "dataProvider": {
                          // "mapURL": "/lib/3/maps/svg/australiaLow.svg",
                          "map": "australiaLow",
                          "getAreasFromMap": true,
                          "zoomLevel": 0.9,
                          // "areas": []
                        },
                        "areasSettings": {
                          // "alpha": 0.5,
                          "color": "rgb(150, 150, 150)",
                          "rollOverColor": "rgb(11, 179, 214)",
                          "selectedColor": "rgb(11, 179, 214)",
                        },
                        "zoomControl": {
                          "panControlEnabled": false,
                          "zoomControlEnabled": false,
                          "homeButtonEnabled": false,
                        },
                        // "listeners": [{
                        //   "event": "init",
                        //   "method": updateHeatmap
                        // }]
                        "listeners": [{
                          "event": "clickMapObject",
                          "method": function(e) {
                            
                            // Ignore any click not on area
                            if (e.mapObject.objectType !== "MapArea")
                              return;
                            
                            var area = e.mapObject;
                            
                            // Toggle showAsSelected
                            area.showAsSelected = !area.showAsSelected;
                            e.chart.returnInitialColor(area);
                            
                            // Update the list
                            // document.getElementById("selected").innerHTML = JSON.stringify(getSelectedCountries());
                          }
                        }]
                      }}
                    />
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <SelectField
                      floatingLabelText="Distribution"
                      value={this.state.value}
                      onChange={this.handleChange}
                      className="SelectField"
                    >
                      <MenuItem value={1} primaryText="Normal" />
                      <MenuItem value={2} primaryText="Poisson" />
                      <MenuItem value={3} primaryText="Bernoulli" />
                      <MenuItem value={4} primaryText="Chi-Squared" />
                    </SelectField>
                  </Col>
                  <Col xs={12} md={6} lg={4}>
                    <div className="Factors">
                      <div className="FlavorText">Factors</div>
                      <Checkbox label="Interest Rate" />
                      <Checkbox label="Inflation" />
                      <Checkbox label="Population" />
                    </div>
                  </Col>
                </Row>
              </Paper>

              <Row>
                <Col xs={12}>
                  <AmCharts.React
                    style={{
                      width: "100%",
                      height: "500px"
                    }}
                    options={{
                      "theme": "dark",
                      "type": "serial",
                      // "marginRight": 80,
                      "autoMarginOffset": 20,
                      "marginTop":20,
                      "dataProvider": data,
                      "valueAxes": [{
                          "id": "v1",
                          "axisAlpha": 0.1
                      }],
                      "graphs": [{
                          "useNegativeColorIfDown": true,
                          // "balloonText": "[[category]]<br><b>value: [[value]]</b>",
                          "showBalloon": false,
                          "bullet": "round",
                          "bulletBorderAlpha": 1,
                          "bulletBorderColor": "#FFFFFF",
                          "hideBulletsCount": 50,
                          "lineThickness": 2,
                          "lineColor": "rgb(11, 179, 214)",
                          "negativeLineColor": "#FFC107",
                          "valueField": "visits"
                      }],
                      // "chartScrollbar": {
                      //     "scrollbarHeight": 5,
                      //     "backgroundAlpha": 0.1,
                      //     "backgroundColor": "#868686",
                      //     "selectedBackgroundColor": "#67b7dc",
                      //     "selectedBackgroundAlpha": 1
                      // },
                      "chartCursor": {
                          "valueLineEnabled": true,
                          "valueLineBalloonEnabled": true
                      },
                      "categoryField": "date",
                      "categoryAxis": {
                          "parseDates": true,
                          "axisAlpha": 0,
                          "minHorizontalGap": 60
                      },
                    }}
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={12}>
            <div className="Content">
              <Paper className="Parameters" zDepth={1}>
                <div className="FlavorText">Customise your regression formula</div>
                <div className="Formula">{formula}</div>
                <div className="Legend">
                  <span className="FlavorText">𝛽0 = inflation weight | 𝛽1 = interest rate weight</span>
                </div>
              </Paper>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
