import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'reactstrap'
import AmCharts from '@amcharts/amcharts3-react';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import Slider from 'material-ui/Slider';
import Checkbox from 'material-ui/Checkbox';
import './styles.css';
import { Graph } from 'react-d3-graph';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import d3 from 'd3-hierarchy';

// graph payload (with minimalist structure)
const data = {
  nodes: [
    // {
    //   id: 'Context',
    //   name: 'Housing Prices',
    //   color: 'rgb(228, 82, 75)',
    //   symbolType: 'square',
    // },
    // {
    //   id: 'A',
    //   name: 'Price',
    //   color: 'rgb(131, 198, 72)',
    //   symbolType: 'diamond',
    // }, 
    {
      id: '1',
      name: 'Click-through rate',
    },
    {
      id: '2',
      name: 'Affiliation',
    },
    {
      id: '3',
      name: 'Conversion rate',
    },
    {
      id: '4',
      name: 'Conversation',
    },
    {
      id: '5',
      name: 'Responsiveness',
    }
  ],
  links: [
    {
      source: '1',
      target: '2',
      linkType: 'Casual',
      linkOrigin: 'via literature',
    },
    {
      source: '1',
      target: '4',
      linkType: 'Hypothesized',
      linkOrigin: 'via model',
    },
    {
      source: '1',
      target: '5',
      linkType: 'Hypothesized',
      linkOrigin: 'via model'
    },
    {
      source: '2',
      target: '3',
      linkType: 'Casual',
      linkOrigin: 'via opinion'
    },
    {
      source: '4',
      target: '3',
      linkType: 'Hypothesized',
      linkOrigin: 'via reference'
    },
    {
      source: '5',
      target: '3',
      linkType: 'Casual',
      linkOrigin: 'via hypothesis'
    },
  ],
  removedLinks: [],
};

class ModelBuilder extends Component {
  constructor() {
    super();
    this.state = {
      addedVariables: [],
      selectedNodeID: '',
      selectedType: '',
      selectedTitle: '',
      selectedLinkType: '',
      selectedLinkOrigin: '',
      selectedLinkTargetTitle: '',
      data: data,
      dropdownValue: 1,
      checkboxes: {
        Casual: true,
        Hypothesized: true,
        'via model': true,
        'via reference': true,
        'via opinion': true,
      },
      isCheckedCasual: true,
      isCheckedHypothesis: true,
    }

    this.getNodeFromID = this.getNodeFromID.bind(this);
    this.getLinksToNode = this.getLinksToNode.bind(this);
    this.handleAddVariable = this.handleAddVariable.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleLinkTypeFilter = this.handleLinkTypeFilter.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleSimulate = this.handleSimulate.bind(this);

    this.handleCheckedCasual = this.handleCheckedCasual.bind(this);
    this.handleCheckedHypothesis = this.handleCheckedHypothesis.bind(this);
  };

  getNodeFromID(nodeID) {
    const nodes = this.state.data.nodes;
    return nodes.find(function (node) { return node.id === nodeID; });
  }
  getLinksToNode(nodeID) {
    const links = this.state.data.links;
    const linksWithNode = [];
    for (let link of links) {
      if (link.target === nodeID || link.source === nodeID) {
        linksWithNode.push(link);
      }
    }
    return linksWithNode;
  }

  handleDropDownChange = (event, index, dropdownValue) => this.setState({dropdownValue});

  handleNodeClick(nodeID) {
    const nodes = data.nodes;
    const selectedNode = nodes.find(function (node) { return node.id === nodeID; });
    this.setState({
      selectedNodeID: nodeID,
      selectedTitle: selectedNode.name,
      selectedType: 'Variable',
      selectedLinkType: '',
      selectedLinkOrigin: '',
      selectedLinkTargetTitle: '',
      shouldSimulate: false,
      selectedNodeLinks: this.getLinksToNode(nodeID),
    });
  }

  handleLinkClick(sourceID, targetID) {
    const nodes = data.nodes;
    const sourceNode = nodes.find(function (node) { return node.id === sourceID; });
    const targetNode = nodes.find(function (node) { return node.id === targetID; });
    const links = data.links;
    const selectedLink = links.find(function (link) { 
      return ((link.source === sourceID && link.target === targetID)
        || (link.source === targetID && link.target === sourceID)); 
    });

    this.setState({
      selectedType: 'Link',
      selectedTitle: sourceNode.name,
      selectedLinkType: selectedLink.linkType,
      selectedLinkOrigin: selectedLink.linkOrigin,
      selectedLinkTargetTitle: targetNode.name,
      selectedNodeLinks: [],
    })
    // const souNode = nodes.find(function (node) { return node.id === nodeID; });

  }

  handleLinkTypeFilter(e) {
    const isToggleOff = !e.target.checked;
    const filter = e.target.value;
    let links = this.state.data.links;
    console.log('links', links);
    let removedLinks = this.state.data.removedLinks;
    let newCheckboxes = this.state.checkboxes;

    if (isToggleOff) {
      links.forEach((link, index) => {
        // console.log('link', link);
        if ((link.linkType === filter || link.linkOrigin === filter) && links.length > 1) {
          removedLinks.push(link);
          links = links.splice(index, 1);
          // console.log('links removed', links);
          newCheckboxes[filter] = false;
        }
      });
    } else {
      removedLinks.forEach((link, index) => {
        if ((link.linkType === filter || link.linkOrigin === filter) && removedLinks.length > 1) {
          links.push(link);
          removedLinks = removedLinks.splice(index, 1);
          newCheckboxes[filter] = true;
        }
      });
    }
    let newData = this.state.data;
    newData.links = links;

    newData.removedLinks = removedLinks;
    this.setState({
      checkboxes: newCheckboxes,
      data: newData,
    });
  }

  handleCheckedCasual() {
    this.setState({ isCheckedCasual: !this.state.isCheckedCasual });
  }

  handleCheckedHypothesis() {
    this.setState({ isCheckedHypothesis: !this.state.isCheckedHypothesis });
  }

  handleSimulate() {
    this.setState({ shouldSimulate: true });
  }

  handleAddVariable() {
    // console.log('hi', this.state.selectedType);
    const { selectedTitle, addedVariables } = this.state;
    let newVariables = [...addedVariables];

    newVariables.push({
      'variable': selectedTitle,
      'weight': 0.75,
    });
    console.log('handle', addedVariables);
    this.setState({ addedVariables: newVariables });
    // console.log(this.radar);
    // this.radar.state.chart.validateData();
  }

  render() {

    const {
      addedVariables,
      checkboxes,
      data,
      selectedNodeID,
      selectedNodeLinks,
      selectedTitle,
      selectedType,
      shouldSimulate
    } = this.state;

    // the graph configuration, you only need to pass down properties
    // that you want to override, otherwise default ones will be used
    const myConfig = {
      nodeHighlightBehavior: true,
      node: {
        color: 'rgb(11, 179, 214)',
        fontSize: 20,
        fontWeight: 100,
        fontColor: 'rgb(11, 179, 214)',
        size: 300,
        labelProperty: 'name',
        highlightStrokeColor: 'rgba(255, 198, 40, 0.4)',
        highlightFontSize: 20,
        highlightFontWeight: 100,
      },
      link: {
        strokeWidth: 5,
        highlightColor: 'rgba(255, 198, 40, 0.4)',//positive ? green : red
      },
      height: 350,
      automaticRearrangeAfterDropNode: shouldSimulate,
      staticGraph: false,
    };

    // graph event callbacks
    const onClickNode = function(nodeId) {
      // window.alert('Clicked node ${nodeId}');
    };
    
    const onMouseOverNode = function(nodeId) {
      // window.alert(`Mouse over node ${nodeId}`);
    };
    
    const onMouseOutNode = function(nodeId) {
      // window.alert(`Mouse out node ${nodeId}`);
    };
    
    const onClickLink = function(source, target) {
      // window.alert(`Clicked link between ${source} and ${target}`);
    };
    
    const onMouseOverLink = function(source, target) {
      // window.alert(`Mouse over in link between ${source} and ${target}`);
    };
    
    const onMouseOutLink = function(source, target) {
      // window.alert(`Mouse out link between ${source} and ${target}`);
    };

    let renderedLinksToNode = [];
    if (selectedNodeLinks) {
      renderedLinksToNode = selectedNodeLinks.map((link) => {
        if (selectedNodeID !== link.source) {
          return <div className="InfoLegendItem">{`${this.getNodeFromID(link.source).name} (${link.linkType})`}</div>
        } else {
          return <div className="InfoLegendItem">{`${this.getNodeFromID(link.target).name} (${link.linkType})`}</div>
        }
      });
    }

    let renderedVariables = [];
    if (data) {
      const variables = data.nodes;
      renderedVariables = variables.map((variable) => {
        return <div className="VariableItem">{variable.name}</div>;
      });
    }

    // console.log('rend', renderedLinksToNode);
    // renderedLinksToNode = this.state.

    let influenceString = '';
    let originString = '';
    if (this.state.selectedLinkTargetTitle) {
      influenceString = `${this.state.selectedLinkType} on ${this.state.selectedLinkTargetTitle}`;
      originString = `Source: ${this.state.selectedLinkOrigin}`;
    }

    // console.log('variables', addedVariables);

    //filter out data
    let filteredData = {
      nodes: [],
      links: [],
    };
    data.links.forEach((link, index) => {
      const filterTypes = [];
      !this.state.isCheckedCasual && filterTypes.push('Casual');
      !this.state.isCheckedHypothesis && filterTypes.push('Hypothesized');
      if (filterTypes.indexOf(link.linkType) > -1) {
      } else {
        filteredData.links.push(link);
      }

    });

    //check if nodes have links, if so, add them
    data.nodes.forEach((node, nodeIndex) => {
      filteredData.links.forEach((link, linkIndex) => {
        if (link.source === node.id || link.target === node.id) {
          //check if id exists
          if (filteredData.nodes.indexOf(node.id) > -1) {
          } else {
            filteredData.nodes.push(node);
          }
        }
      });
    });

    //if empty, display the knowledge pack
    if (filteredData.nodes.length < 1) {
      filteredData.nodes.push({
        id: 'Knowledge Pack',
        name: 'Digital Marketing',
        color: 'rgb(131, 198, 72)',
      })
    }

    return (
      <Container className="Container">
        <Row>
          <Col xs={12}>
            <h1>Variable Map</h1>
          </Col>
          <Col xs={12}>
            <div className="GraphContainer">
              <div className="GraphControls">
                <Toolbar className="GraphToolbar">
                  <ToolbarGroup firstChild={true}>
                    <ToolbarTitle className="ToolbarTitle" text="Knowledge pack: Digital marketing" />
                    <ToolbarSeparator />
                    <ToolbarTitle className="ToolbarTitle" text="Concept (thing):" />
                    <DropDownMenu className="ToolbarTitle dropdown" value={this.state.dropdownValue} onChange={this.handleDropDownChange}>
                      <MenuItem value={1} primaryText="Advertising Performance" />
                      <MenuItem value={2} primaryText="Every Night" />
                      <MenuItem value={3} primaryText="Weeknights" />
                      <MenuItem value={4} primaryText="Weekends" />
                      <MenuItem value={5} primaryText="Weekly" />
                    </DropDownMenu>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    {/* <ToolbarTitle text="Options" /> */}
                    {/* <FontIcon className="muidocs-icon-custom-sort" /> */}
                    <ToolbarSeparator />
                    <RaisedButton
                      label="Unstick"
                      onClick={this.handleSimulate}
                      primary={true} 
                    />
                    {/* <Checkbox label="Interest" /> */}
                  </ToolbarGroup>
                </Toolbar>
                {/* <FlatButton label="Pause" />
                <FlatButton label="Simulate" /> */}
              </div>
              <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={filteredData}
                config={myConfig}
                onClickNode={this.handleNodeClick}
                onClickLink={this.handleLinkClick}
                onMouseOverNode={onMouseOverNode}
                onMouseOutNode={onMouseOutNode}
                onMouseOverLink={onMouseOverLink}
                onMouseOutLink={onMouseOutLink}
              />
              <div className="InfoContainer">
                <Paper className="InfoContainerPaper" zDepth={1}>
                  <Row>
                    {/* <Col xs={4}>
                      <div className="InfoLegend">
                        <div className="InfoLegendTitle">Legend</div>
                        <div className="InfoLegendItem">
                          <div className="Accent red">■</div> Knowledge Pack
                        </div>
                        <div className="InfoLegendItem">
                          <div className="Accent green">◆</div> Concept (Thing)
                        </div>
                        <div className="InfoLegendItem">
                          <div className="Accent blue">●</div> Influencing Variable
                        </div>
                      </div>
                    </Col> */}
                    <Col xs={4}>
                      <div className="InfoLegend">
                        <div className="InfoLegendTitle">Filters</div>
                        <Row>
                          <Col xs={6}>
                            <span className="InfoLegendItem type">Link type</span>
                            <Checkbox label="Casual" checked={this.state.isCheckedCasual} onCheck={this.handleCheckedCasual}  />
                            <Checkbox label="Hypothesized" checked={this.state.isCheckedHypothesis} onCheck={this.handleCheckedHypothesis} />
                          </Col>
                          <Col xs={6}>
                            <span className="InfoLegendItem type">Link origin</span>
                            <Checkbox label="Model" onCheck={this.handleLinkTypeFilter} />
                            <Checkbox label="Reference" onCheck={this.handleLinkTypeFilter} />
                            <Checkbox label="Opinion" onCheck={this.handleLinkTypeFilter} />
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col xs={1} />
                    <Col xs={6}>
                      <div className="InfoLegend">
                        <div className="InfoLegendTitle selection">
                          { selectedType ? `${selectedTitle}` : 'Nothing selected'}
                          {
                            selectedType && (
                              <div className="InfoLegendItem type">{`${selectedType}`}</div>
                            )
                          }
                        </div>
                        {
                          influenceString && (
                            <div className="InfoLegendItem">{influenceString}</div>
                          )
                        }
                        {
                          originString && (
                            <div className="InfoLegendItem">{originString}</div>
                          )
                        }
                        {
                          renderedLinksToNode.length > 0 && (
                            <div className="InfoLegendLinks">
                              <div className="LinksTo">Links</div>
                              {renderedLinksToNode}
                            </div>
                          )
                        }
                        { 
                          selectedType === 'Variable' && (
                            <div className="InfoLegendButton">
                              <RaisedButton
                                label="Add to model"
                                onClick={this.handleAddVariable}
                                primary={true} 
                              />
                            </div>
                          )
                        }
                      </div>
                    </Col>
                    <Col xs={1} />
                  </Row>
                </Paper>
                <Row>
                  <Col xd={4}>
                    {
                      renderedVariables.length > 0 && (
                        <div className="VariablesContainer">
                          {renderedVariables}
                        </div>
                      )
                    }
                  </Col>
                  <Col xs={8}>
                    <AmCharts.React
                      ref={(radar) => { this.radar = radar; }}
                      style={{
                        width: "100%",
                        height: "500px"
                      }}
                      options={{
                        "type": "radar",
                        "theme": "light",
                        "dataProvider": this.state.addedVariables,
                        "colors": ["rgb(11, 179, 214)"],
                        "startDuration": 0,
                        "graphs": [{
                          "balloonText": "Weighting: [[value]]",
                          "bullet": "round",
                          "fillAlphas": 0.5,
                          "lineThickness": 2,
                          "valueField": "weight"
                        }],
                        "categoryField": "variable",
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </div>

          </Col>
        </Row>
      </Container>
    );
  }
}

export default ModelBuilder;
