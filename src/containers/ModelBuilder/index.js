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

// graph payload (with minimalist structure)
const data = {
  nodes: [
    {
      id: 'Context',
      name: 'Housing Prices',
      color: 'rgb(228, 82, 75)',
      symbolType: 'square',
    },
    {
      id: 'A',
      name: 'Price',
      color: 'rgb(131, 198, 72)',
      symbolType: 'diamond',
    }, 
    {
      id: 'B',
      name: 'Population',
    },
    {
      id: 'C',
      name: 'Inflation',
    },
    {
      id: 'D',
      name: 'Foreign Policy',
    },
    {
      id: 'E',
      name: 'Interest Rate',
    }
  ],
  links: [
    {
      source: 'A',
      target: 'E',
      linkType: 'Positive influence',
      linkOrigin: 'via literature',
    },
    {
      source: 'Context',
      target: 'A',
      color: 'red',
      linkType: 'Operationlization',
    },
    {
      source: 'E',
      target: 'B',
      linkType: 'Positive correlation',
      linkOrigin: 'via model'
    },
    {
      source: 'B',
      target: 'C',
      linkType: 'Negative influence',
      linkOrigin: 'via expert'
    },
    {
      source: 'C',
      target: 'D',
      linkType: 'Positive correlation',
      linkOrigin: 'via model'
    },
    {
      source: 'E',
      target: 'C',
      linkType: 'Negative correlation',
      linkOrigin: 'via hypothesis'
    },
    {
      source: 'D',
      target: 'A',
      linkType: 'Positive correlation',
      linkOrigin: 'via literature'
    },
  ]
};

class ModelBuilder extends Component {
  constructor() {
    super();
    this.state = {
      selectedNodeID: '',
      selectedType: '',
      selectedTitle: '',
      selectedLinkType: '',
      selectedLinkOrigin: '',
      selectedLinkTargetTitle: '',
      data: data,
    }

    this.getNodeFromID = this.getNodeFromID.bind(this);
    this.getLinksToNode = this.getLinksToNode.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleSimulate = this.handleSimulate.bind(this);
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

  handleSimulate() {
    this.setState({ shouldSimulate: true });
  }

  render() {

    const { data, selectedNodeID, selectedNodeLinks, selectedTitle, selectedType, shouldSimulate } = this.state;

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
        console.log('link', link);
        console.log('data', data.nodes);

        if (selectedNodeID !== link.source) {
          console.log('node found', this.getNodeFromID(link.source));
          console.log('hi', data.nodes[link.source]);
          return <div className="InfoLegendItem">{`${this.getNodeFromID(link.source).name} (${link.linkType})`}</div>
        } else {
          return <div className="InfoLegendItem">{`${this.getNodeFromID(link.target).name} (${link.linkType})`}</div>
        }
      });
    }

    console.log('rend', renderedLinksToNode);
    // renderedLinksToNode = this.state.

    let influenceString = '';
    let originString = '';
    if (this.state.selectedLinkTargetTitle) {
      influenceString = `\"${this.state.selectedLinkType}\" on ${this.state.selectedLinkTargetTitle}`;
      originString = `Source: ${this.state.selectedLinkOrigin}`;
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
                    <DropDownMenu value={this.state.value} onChange={this.handleChange}>
                      <MenuItem value={1} primaryText="All Broadcasts" />
                      <MenuItem value={2} primaryText="All Voice" />
                      <MenuItem value={3} primaryText="All Text" />
                      <MenuItem value={4} primaryText="Complete Voice" />
                      <MenuItem value={5} primaryText="Complete Text" />
                      <MenuItem value={6} primaryText="Active Voice" />
                      <MenuItem value={7} primaryText="Active Text" />
                    </DropDownMenu>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    <ToolbarTitle text="Options" />
                    <FontIcon className="muidocs-icon-custom-sort" />
                    <ToolbarSeparator />
                    <RaisedButton
                      label="Simulate"
                      onClick={this.handleSimulate}
                      primary={true} 
                    />
                  </ToolbarGroup>
                </Toolbar>
                {/* <FlatButton label="Pause" />
                <FlatButton label="Simulate" /> */}
              </div>
              <Graph
                id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
                data={this.state.data}
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
                    <Col xs={4}>
                      <div className="InfoLegend">
                        <div className="InfoLegendTitle">Legend</div>
                        <div className="InfoLegendItem">
                          <div className="Accent red">■</div> Context (Thing)
                        </div>
                        <div className="InfoLegendItem">
                          <div className="Accent green">◆</div> Operationalized Variable
                        </div>
                        <div className="InfoLegendItem">
                          <div className="Accent blue">●</div> Influencing Variable
                        </div>
                      </div>
                    </Col>
                    <Col xs={4}>
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
                        {renderedLinksToNode}
                      </div>
                    </Col>
                    <Col xs={4} />
                  </Row>
                </Paper>
              </div>
            </div>

          </Col>
        </Row>
      </Container>
    );
  }
}

export default ModelBuilder;
