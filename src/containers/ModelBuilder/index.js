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
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import d3 from 'd3-hierarchy';
import Dialog from 'material-ui/Dialog';


// graph payload (with minimalist structure)
const data = {
  nodes: [
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
      linkOrigin: 'via reference',
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
      linkOrigin: 'via opinion'
    },
  ],
  removedLinks: [],
};

const data2 = {
  nodes: [
    {
      id: '1',
      name: 'A',
    },
    {
      id: '2',
      name: 'B',
    },
    {
      id: '3',
      name: 'C',
    },
    {
      id: '4',
      name: 'D',
    },
    {
      id: '5',
      name: 'E',
    },
    {
      id: '6',
      name: 'F',
    },
    {
      id: '7',
      name: 'G',
    },
    {
      id: '8',
      name: 'H',
    },
    {
      id: '9',
      name: 'I',
    },
    {
      id: '10',
      name: 'J',
    },
    {
      id: '11',
      name: 'K',
    },
    {
      id: '12',
      name: 'AA',
    },
    {
      id: '13',
      name: 'AB',
    },
    {
      id: '14',
      name: 'AC',
    }
  ],
  links: [
    {
      source: '1',
      target: '2',
      linkType: 'Casual',
      linkOrigin: 'via reference',
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
      source: '8',
      target: '9',
      linkType: 'Casual',
      linkOrigin: 'via opinion'
    },
    {
      source: '9',
      target: '10',
      linkType: 'Casual',
      linkOrigin: 'via opinion'
    },
    {
      source: '10',
      target: '11',
      linkType: 'Casual',
      linkOrigin: 'via opinion'
    },
    {
      source: '10',
      target: '8',
      linkType: 'Casual',
      linkOrigin: 'via opinion'
    },
    {
      source: '5',
      target: '7',
      linkType: 'Casual',
      linkOrigin: 'via opinion'
    },
    {
      source: '1',
      target: '11',
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
      source: '12',
      target: '13',
      linkType: 'Hypothesized',
      linkOrigin: 'via reference'
    },
    {
      source: '13',
      target: '14',
      linkType: 'Hypothesized',
      linkOrigin: 'via reference'
    },
    {
      source: '14',
      target: '12',
      linkType: 'Hypothesized',
      linkOrigin: 'via reference'
    },
  ],
  removedLinks: [],
};

class ModelBuilder extends Component {
  constructor() {
    super();
    this.state = {
      addedVariables: [],
      editLinkTypeValue: 'Casual',
      editLinkOriginValue: 'via Model',
      isEditLinkOpen: false,
      newLinkInput: '',
      newVariableInput: '',
      selectedNodeID: '',
      selectedType: '',
      selectedTitle: '',
      selectedLinkType: '',
      selectedLinkOrigin: '',
      selectedLinkTargetTitle: '',
      data: data,
      dropdownValue: 1,
      isCheckedCasual: true,
      isCheckedHypothesis: true,
      isCheckedModel: true,
      isCheckedOpinion: true,
      isCheckedReference: true,
      weightValues: {
        // Conversation: 0.5,
      },
      weightVariable: 'Variable',
      weightValue: '',
    }

    this.addNewNode = this.addNewNode.bind(this);
    this.getNodeFromID = this.getNodeFromID.bind(this);
    this.getNodeFromName = this.getNodeFromName.bind(this);
    this.getLinksToNode = this.getLinksToNode.bind(this);
    this.handleAddVariable = this.handleAddVariable.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleLinkTypeFilter = this.handleLinkTypeFilter.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleSimulate = this.handleSimulate.bind(this);
    
    
    //modal
    this.handleLinkTypeChange = this.handleLinkTypeChange.bind(this);
    this.handleLinkOriginChange = this.handleLinkOriginChange.bind(this);
    this.handleNewLinkInputChange = this.handleNewLinkInputChange.bind(this);
    this.toggleEditLink = this.toggleEditLink.bind(this);
    this.submitEditLink = this.submitEditLink.bind(this);

    //input
    this.handleNewVariableInputChange = this.handleNewVariableInputChange.bind(this);

    //checkboxes
    this.handleCheckedCasual = this.handleCheckedCasual.bind(this);
    this.handleCheckedHypothesis = this.handleCheckedHypothesis.bind(this);
    this.handleCheckedModel = this.handleCheckedModel.bind(this);
    this.handleCheckedOpinion = this.handleCheckedOpinion.bind(this);
    this.handleCheckedReference = this.handleCheckedReference.bind(this);

    //weight form
    this.handleWeightVariableChange = this.handleWeightVariableChange.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleWeight = this.handleWeight.bind(this);
  };

  addNewNode(e) {
    e.preventDefault();
    if (this.state.newVariableInput.length > 0) {
      const { data } = this.state;
      data.nodes.push({
        id: 'new node' + data.nodes.length,
        name: this.state.newVariableInput,
      });
      this.setState({
        data,
        newVariableInput: '',
      })
    };
  }

  handleLinkTypeChange = (event, index, dropdownValue) => this.setState({ editLinkTypeValue: dropdownValue});

  handleLinkOriginChange = (event, index, dropdownValue) => this.setState({ editLinkOriginValue: dropdownValue});

  getNodeFromID(nodeID) {
    const nodes = this.state.data.nodes;
    return nodes.find(function (node) { return node.id === nodeID; });
  }

  getNodeFromName(name) {
    const nodes = this.state.data.nodes;
    return nodes.find(function (node) { return node.name.toLowerCase() === name.toLowerCase(); });
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
      selectedTitle: sourceNode.name + ' ⟶ ' + targetNode.name,
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

  handleCheckedModel() {
    this.setState({ isCheckedModel: !this.state.isCheckedModel });
  }

  handleCheckedOpinion() {
    this.setState({ isCheckedOpinion: !this.state.isCheckedOpinion });
  }

  handleCheckedReference() {
    this.setState({ isCheckedReference: !this.state.isCheckedReference });
  }

  handleNewVariableInputChange(event) {
    this.setState({ newVariableInput: event.target.value });
  }

  handleNewLinkInputChange(event) {
    this.setState({ newLinkInput: event.target.value });
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

  handleWeightVariableChange(event, index, value) {
    const { weightValues } = this.state;
    let inputValue = 1;
    if (weightValues[value]) {
      inputValue = weightValues[value];
    }
    this.setState({ weightVariable: value, weightValue: inputValue });
  }

  handleWeightChange(e) {
    const numberOnly = /^[\.0-9\b]+$/;
    // if value is not blank, then test the regex
    if (e.target.value == '' || numberOnly.test(e.target.value)) {
       this.setState({ weightValue: e.target.value });
    }
  };

  handleWeight(e) {
    e.preventDefault();
    const selectedVariable = this.state.weightVariable;
    const selectedWeight = this.state.weightValue;
    const newWeightValues = this.state.weightValues;
    if (selectedVariable && selectedVariable !== 'Variable') {
      newWeightValues[selectedVariable] = selectedWeight;
    };
    this.setState({ weightValues: newWeightValues });
  }

  submitEditLink() {
    const linkType = this.state.editLinkTypeValue;
    const linkOrigin = this.state.editLinkOriginValue;
    const newData = this.state.data;
    const targetNode = this.getNodeFromName(this.state.newLinkInput);
    const sourceNode = this.getNodeFromID(this.state.selectedNodeID);

    if (targetNode) {

      //check if already exists, update if it does
      let linkExists = false;
      newData.links.forEach((link, index) => {
        if ((link.target === sourceNode.id) && !linkExists) {
          console.log('found existing link');
          linkExists = true;
          newData.links[index].linkType = linkType;
          newData.links[index].linkOrigin = linkOrigin;
          // break; -- need to implement exception for larger quantities of variables
        }
      })

      //doesn't exist, so we push new link
      if (!linkExists) {
        newData.links.push({
          linkOrigin: linkOrigin,
          linkType: linkType,
          source: this.state.selectedNodeID,
          target: targetNode.id,
        });
      }

      this.setState({ data: newData });
      this.toggleEditLink();
    }
  }

  toggleEditLink() {
    this.setState({ isEditLinkOpen: !this.state.isEditLinkOpen });
  }

  render() {

    const {
      addedVariables,
      checkboxes,
      data,
      newVariableInput,
      selectedNodeID,
      selectedNodeLinks,
      selectedTitle,
      selectedType,
      shouldSimulate,
      weightValues,
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
        highlightStrokeColor: 'rgb(255, 198, 40)',
        highlightFontSize: 20,
        highlightFontWeight: 100,
      },
      link: {
        strokeWidth: 5,
        highlightColor: 'rgb(255, 198, 40)',//positive ? green : red
      },
      linkHighlightBehavior: true,
      height: 350,
      width: 900,
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
        let value = 1;
        if (this.state.weightValues[variable.name]) {
          value = this.state.weightValues[variable.name];
        }
        return (
          <div className="VariableItem">
            {variable.name}: {value}
          </div>
        );
      });
    }

    // console.log('rend', renderedLinksToNode);
    // renderedLinksToNode = this.state.

    let influenceString = '';
    let originString = '';
    if (this.state.selectedLinkTargetTitle) {
      influenceString = this.state.selectedLinkType;
      originString = this.state.selectedLinkOrigin;
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
      const filterOrigins = [];
      !this.state.isCheckedModel && filterOrigins.push('via model');
      !this.state.isCheckedOpinion && filterOrigins.push('via opinion');
      !this.state.isCheckedReference && filterOrigins.push('via reference');

      if (!(filterTypes.indexOf(link.linkType) > -1) && !(filterOrigins.indexOf(link.linkOrigin) > -1)) {
        filteredData.links.push(link);
      }
    });

    //future 'hide independent variables' feature?
    // data.nodes.forEach((node, nodeIndex) => {
    //   filteredData.links.forEach((link, linkIndex) => {
    //     if (link.source === node.id || link.target === node.id) {
    //       //check if id exists
    //       if (filteredData.nodes.indexOf(node.id) > -1) {
    //       } else {
    //         filteredData.nodes.push(node);
    //       }
    //     }
    //   });
    // });
    filteredData.nodes = data.nodes;

    //if empty, display the knowledge pack
    if (filteredData.nodes.length < 1) {
      filteredData.nodes.push({
        id: 'Knowledge Pack',
        name: 'Digital Marketing',
        color: 'rgb(131, 198, 72)',
      })
    }

    const editLinkActions = [
      <FlatButton
        label="Cancel"
        // primary={true}
        onClick={this.toggleEditLink}
      />,
      <FlatButton
        label="Create"
        primary={true}
        onClick={this.submitEditLink}
      />,
    ];

    const dataProvider = [];
    filteredData.nodes.forEach((node, index) => {
      const weight = weightValues[node.name] || 1;
      dataProvider.push({
        variable: node.name,
        weight: weight,
      })
    });

    const menuItems = [];
    menuItems.push(<MenuItem value="Variable" primaryText="Variable" />);
    filteredData.nodes.forEach((node) => {
      menuItems.push(<MenuItem value={node.name} primaryText={node.name} />);
    });
    const renderedWeightForm = (
      <form onSubmit={this.handleWeight}>
        <div className="InfoLegendTitle">Edit Weight</div>
        <SelectField
          floatingLabelText="Variable name"
          value={this.state.weightVariable}
          onChange={this.handleWeightVariableChange}
          style={{width: 250}}
        >
          {menuItems}
        </SelectField>
        <div className="WeightForm">
          <TextField
            hintText="Weight"
            value={this.state.weightValue}
            onChange={this.handleWeightChange}  
            style={{width: 75}}    
          />
          <FlatButton style={{float: 'right',marginTop: 10}} label="Submit" onClick={this.handleWeight} primary={true} disabled={this.state.weightVariable === 'Variable'} />
        </div>
      </form>
    );

    const renderedSaveForm = (
      <div>
        <FlatButton
          label="Reset"
          onClick={this.handleSimulate}
          primary={true} 
        />
        <FlatButton
          label="Save"
          onClick={this.handleSimulate}
          primary={true} 
        />
        <RaisedButton
          label="Proceed"
          onClick={this.handleSimulate}
          primary={true} 
        />
      </div>
    );

    return (
      <Container className="Container">
        <Row>
          <Col xs={12}>
            <h1>Ontology</h1>
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
                      <MenuItem value={2} primaryText="Impressions" />
                      <MenuItem value={3} primaryText="CPM" />
                      <MenuItem value={4} primaryText="Social Growth" />
                      <MenuItem value={5} primaryText="Monthly Active Users" />
                    </DropDownMenu>
                  </ToolbarGroup>
                  <ToolbarGroup>
                    {/* <ToolbarTitle text="Options" /> */}
                    {/* <FontIcon className="muidocs-icon-custom-sort" /> */}
                    <ToolbarSeparator />
                    <RaisedButton
                      label="Auto"
                      onClick={this.handleSimulate}
                      primary={!this.state.shouldSimulate} 
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
                <Row>
                  <Col xs={9}>
                    <div className="CreateNode">
                      {/* <span className="CreateNodeSubtitle">Add new variable: </span> */}
                      <form onSubmit={this.addNewNode}>
                        <TextField
                          // hintText="Variable name"
                          className="CreateNodeInput"
                          floatingLabelText="New variable name"
                          value={newVariableInput}
                          onChange={this.handleNewVariableInputChange}
                          onSubmit={this.addNewNode}
                        /> 
                        {/* <RaisedButton
                          label="Create Variable"
                          // onClick={this.handleAddVariable}
                          primary={true} 
                        />     */}
                        <FlatButton label="Create Variable" onClick={this.addNewNode} primary={true} />
                      </form>
                    </div>
                  </Col>
                  <Col xs={3}>
                    <div className="SaveEdits">
                      <RaisedButton
                        label="Save Edits"
                        onClick={this.toggleEditLink}
                        primary={true} 
                      />
                    </div>
                  </Col>
                </Row>
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
                            <span className="InfoLegendItem filter">Link type</span>
                            <Checkbox label="Casual" checked={this.state.isCheckedCasual} onCheck={this.handleCheckedCasual}  />
                            <Checkbox label="Hypothesized" checked={this.state.isCheckedHypothesis} onCheck={this.handleCheckedHypothesis} />
                          </Col>
                          <Col xs={6}>
                            <span className="InfoLegendItem filter">Link origin</span>
                            <Checkbox label="Model" checked={this.state.isCheckedModel} onCheck={this.handleCheckedModel} />
                            <Checkbox label="Reference" checked={this.state.isCheckedReference} onCheck={this.handleCheckedReference} />
                            <Checkbox label="Opinion" checked={this.state.isCheckedOpinion} onCheck={this.handleCheckedOpinion} />
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
                          selectedType === 'Link' && (
                            <div className="InfoLegendLinks">
                              <Row>
                                <Col xs={2}>
                                  <div className="LinksTo">Type</div>
                                  <div className="LinksTo">Origin</div>
                                </Col>
                                <Col xs={8}>
                                  {influenceString}
                                  <br />
                                  {originString}
                                </Col>
                                <Col xs={2} />
                              </Row>
                            </div>
                          )
                        }
                        {
                          renderedLinksToNode.length > 0 && (
                            <div className="InfoLegendLinks">
                              <Row>
                                <Col xs={2}>
                                  <div className="LinksTo">Links</div>
                                </Col>
                                <Col xs={8}>
                                  {renderedLinksToNode}
                                </Col>
                                <Col xs={2} />
                              </Row>
                            </div>
                          )
                        }
                        { 
                          selectedType === 'Variable' && (
                            <div className="InfoLegendButton">
                              {/* <RaisedButton
                                label="Add to model"
                                onClick={this.handleAddVariable}
                                primary={true} 
                              /> */}
                              <RaisedButton
                                label="Add Link"
                                onClick={this.toggleEditLink}
                                primary={true} 
                              />
                              <Dialog
                                title="Create a new link"
                                actions={editLinkActions}
                                modal={false}
                                open={this.state.isEditLinkOpen}
                                onRequestClose={this.toggleEditLink}
                              >
                                <TextField
                                  // hintText="Variable name"
                                  className="CreateNodeInput"
                                  floatingLabelText="Target variable name"
                                  value={this.state.newLinkInput}
                                  onChange={this.handleNewLinkInputChange}
                                />
                                <br />
                                <DropDownMenu className="ToolbarTitle dropdown" value={this.state.editLinkTypeValue} onChange={this.handleLinkTypeChange}>
                                  <MenuItem value="Casual" primaryText="Casual" />
                                  <MenuItem value="Hypothesized" primaryText="Hypothesized" />
                                </DropDownMenu>
                                <br />
                                <DropDownMenu className="ToolbarTitle dropdown" value={this.state.editLinkOriginValue} onChange={this.handleLinkOriginChange}>
                                  <MenuItem value="via Model" primaryText="via Model" />
                                  <MenuItem value="via Opinion" primaryText="via Opinion" />
                                  <MenuItem value="via Reference" primaryText="via Reference" />
                                </DropDownMenu>
                              </Dialog>
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
                          {renderedWeightForm}
                        </div>
                      )
                    }
                  </Col>
                  <Col xs={8}>
                    <AmCharts.React
                      ref={(radar) => { this.radar = radar; }}
                      style={{
                        width: "100%",
                        height: "450px"
                      }}
                      options={{
                        "type": "radar",
                        "theme": "light",
                        "dataProvider": dataProvider,
                        "colors": ["rgb(11, 179, 214)", "#fff"],
                        "startDuration": 0,
                        "graphs": [{
                          "balloonText": "Weighting: [[value]]",
                          "bullet": "round",
                          "fillAlphas": 0.9,
                          "lineThickness": 2,
                          "valueField": "weight",
                          "fontFamily": "Lato",
                          "fillColors": ["rgb(11, 179, 214)", "rgba(255,255,0,0.7)"],
                          "gradientOrientation": "horizontal",
                        }],
                        "categoryField": "variable",
                      }}
                    />
                    <div className="SaveContainer">
                      {renderedSaveForm}
                    </div>
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
