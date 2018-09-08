import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'reactstrap'
import AmCharts from '@amcharts/amcharts3-react';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import './styles.css';
// import { Graph } from 'react-d3-graph';
// import { 
//   InteractiveForceGraph,
//   ForceGraph,
//   ForceGraphNode,
//   ForceGraphArrowLink,
//   ForceGraphLink,
//   updateSimulation,
//   runSimulation,
//   createSimulation
// } from 'react-vis-force';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import { generateCombination } from 'gfycat-style-urls';
import { Redirect } from 'react-router-dom';

import { ImportData, ImportReferences, ImportPeople } from '../../utils/ImportData';
import { throws } from 'assert';
import d3 from 'd3-selection';

function hsl_col_perc(percent, start, end) {
  var a = percent / 100,
      b = (end - start) * a,
  		c = b + start;

  // Return a CSS HSL string
  return 'hsl('+c+', 100%, 50%)';
}

class ModelBuilder extends Component {
  constructor() {
    super();
    this.state = {
      alpha: 1,
      conceptValue: 1,
      conceptFilterName: 'All',
      addedVariables: [],
      editLinkTypeValue: 'Causal',
      editLinkOriginValue: 'via Model',
      focusedLinks: [],
      focusedNodes: [],
      highlightedLinks: [],
      highlightedNodes: [],
      isEditLinkOpen: false,
      newLinkInput: '',
      newVariableInput: '',
      selectedNodeID: '',
      selectedType: '',
      selectedTitle: '',
      selectedLinkType: '',
      selectedLinkOrigin: '',
      selectedLinkTargetTitle: '',
      data: { nodes: [], links: [] },
      dropdownValue: 1,
      isCheckedCausal: true,
      isCheckedHypothesis: true,
      isCheckedModel: true,
      isCheckedOpinion: true,
      isCheckedReference: true,
      isCheckedIndependent: true,
      isCheckedDependent: true,
      isReferenceModalOpen: false,
      weightValues: {
        // Conversation: 0.5,
      },
      weightVariable: 'Variable',
      weightValue: '',
      redirectToUpdateToken: false,
      token: '',
      references: [],
    }

    this.addNewNode = this.addNewNode.bind(this);
    this.getNodeFromID = this.getNodeFromID.bind(this);
    this.getNodeFromName = this.getNodeFromName.bind(this);
    this.getLinksToNode = this.getLinksToNode.bind(this);
    this.getReferenceFromID = this.getReferenceFromID.bind(this);
    this.getAuthorsFromIDs = this.getAuthorsFromIDs.bind(this);
    this.handleAddVariable = this.handleAddVariable.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleConceptChange = this.handleConceptChange.bind(this);
    this.handleLinkHover = this.handleLinkHover.bind(this);
    this.handleNodeHover = this.handleNodeHover.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleLinkTypeFilter = this.handleLinkTypeFilter.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleSimulate = this.handleSimulate.bind(this);
    this.isNodeInConcept = this.isNodeInConcept.bind(this);
    this.onSaveToKB = this.onSaveToKB.bind(this);
    
    //modal
    this.handleLinkTypeChange = this.handleLinkTypeChange.bind(this);
    this.handleLinkOriginChange = this.handleLinkOriginChange.bind(this);
    this.handleNewLinkInputChange = this.handleNewLinkInputChange.bind(this);
    this.toggleEditLink = this.toggleEditLink.bind(this);
    this.submitEditLink = this.submitEditLink.bind(this);
    this.toggleReferenceModal = this.toggleReferenceModal.bind(this);

    //input
    this.handleNewVariableInputChange = this.handleNewVariableInputChange.bind(this);

    //checkboxes
    this.handleCheckedCausal = this.handleCheckedCausal.bind(this);
    this.handleCheckedHypothesis = this.handleCheckedHypothesis.bind(this);
    this.handleCheckedModel = this.handleCheckedModel.bind(this);
    this.handleCheckedOpinion = this.handleCheckedOpinion.bind(this);
    this.handleCheckedReference = this.handleCheckedReference.bind(this);
    this.handleCheckedIndependent = this.handleCheckedIndependent.bind(this);
    this.handleCheckedDependent = this.handleCheckedDependent.bind(this);

    //weight form
    this.handleWeightVariableChange = this.handleWeightVariableChange.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleWeight = this.handleWeight.bind(this);
  };
  
  componentDidMount() {
    const { token } = this.props.match.params || '';
    if (token) {
      console.log('We have a token: ', token);
    }

    // import data from csv
    ImportData(graph => {
      this.setState({
        // data: data,
        data: graph,
      });
    });

    ImportReferences(references => {
      this.setState({
        references,
      });
    });

    ImportPeople(people => {
      this.setState({
        people,
      });
    });
    
    if (this.forceGraphRef) {
      console.log('ref', this.forceGraphRef);
    }
  }

  addNewNode(e) {
    e.preventDefault();
    if (this.state.newVariableInput.length > 0) {
      const { data } = this.state;
      const newData = {
        nodes: [...data.nodes, { id: 'new node' + data.nodes.length, name: this.state.newVariableInput, value: 1 }],
        links: [...data.links],
      }
      this.setState({
        data: newData,
        newVariableInput: '',
        // alpha: this.state.alpha + 1,
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
      if (link.target.id === nodeID || link.source.id === nodeID) {
        linksWithNode.push(link);
      }
    }
    return linksWithNode;
  }

  getReferenceFromID(nodeReferences = '') {
    const referencesToFind = nodeReferences.replace(' ', '').split(',');
    const referencesFound = [];
    const { references } = this.state;
    for (const referenceToFind in referencesToFind) {
      for (const reference in references) {
        if (referencesToFind[referenceToFind] === references[reference].id) {
          referencesFound.push(references[reference]);
        }
      }
    }
    return referencesFound;
  }

  getAuthorsFromIDs(authorsString = '') {
    const authorsToFind = authorsString.replace(' ', '').split(',');
    const authorsFound = [];
    const { people } = this.state;
    for (const authorToFind in authorsToFind) {
      for (const person in people) {
        if (authorsToFind[authorToFind] === people[person].id) {
          authorsFound.push(people[person]);
        }
      }
    }
    return authorsFound;
  }

  handleDropDownChange = (event, index, dropdownValue) => this.setState({dropdownValue});
  handleConceptChange = (event, index, conceptValue) => {
    const selectedConcept = event.target.innerHTML;
    ImportData(data => {
      if (selectedConcept === 'All') {
        return this.setState({data});
      }
      let newData = {
        nodes: data.nodes.slice(),
        links: data.links.slice(),
        concepts: data.concepts.slice(),
      };
      newData.nodes = data.nodes.filter(node => {
        return node.concept_2 === selectedConcept || node.concept_1 === selectedConcept || node.concept_3 === selectedConcept;
      });
      const linksWithCorrectSources = data.links.filter(link => {
        for (const newNode in newData.nodes) {
          // console.log('node', newNode);
          // console.log('currn lint', link);
          if (newData.nodes[newNode].id === link.source)
            return true;
        }
      })
      const linksWithCorrectTargets = linksWithCorrectSources.filter(link => {
        for (const newNode in newData.nodes) {
          if (newData.nodes[newNode].id === link.target)
            return true;
        }
      })
      newData.links = linksWithCorrectTargets;  
  
      console.log('simulation ref?', this.forceGraphRef);
      // this.forceGraphRef
      // this.forceGraphRef.props.zoom = false;  
      // this.forceGraphRef.simulation.restart();
      this.setState({
        conceptValue,
        data: newData,
        alpha: 0.1,
      });

    });
  };

  handleNodeClick(clickedNode) {
    const selectedNode = clickedNode; //nodes.find(function (node) { return clickedNode.id === node.id; });
    
    //handle focus
    let { focusedNodes, focusedLinks } = this.state || [];
    if (focusedNodes.indexOf(selectedNode) > -1) {
      focusedLinks = [];
      focusedNodes = [];
    } else {
      focusedLinks = [...this.getLinksToNode(selectedNode.id)];
      focusedNodes = [selectedNode];
    }
    focusedLinks.forEach(link => {
      const sourceNode = this.getNodeFromID(link.source.id);
      const targetNode = this.getNodeFromID(link.target.id);
      if (focusedNodes.indexOf(sourceNode) < 0) {
        focusedNodes.push(sourceNode);
      }
      if (focusedNodes.indexOf(targetNode) < 0) {
        focusedNodes.push(targetNode);
      }
    });
    
    this.setState({
      focusedNodes,
      focusedLinks,
      selectedNodeID: selectedNode.id,
      selectedNodeReferences: this.getReferenceFromID(selectedNode.reference),
      selectedTitle: selectedNode.name,
      selectedType: 'Variable',
      selectedLinkType: '',
      selectedLinkOrigin: '',
      selectedLinkTargetTitle: '',
      selectedNodeLinks: this.getLinksToNode(selectedNode.id),
    });
  }

  handleLinkHover(link, prevLink) {
    this.setState({ 
      highlightedLinks: link ? [link] : [],
      highlightedNodes: link? [link.source, link.target] : [],
    });
  }

  handleNodeHover(node, prevNode) {
    const highlightedNodes = [];
    let highlightedLinks = [];
    //also highlight all links to node and their nodes
    if (node) {
      highlightedNodes.push(node);
      highlightedLinks = [...this.getLinksToNode(node.id)];
      highlightedLinks.forEach(link => {
        const sourceNode = this.getNodeFromID(link.source.id);
        const targetNode = this.getNodeFromID(link.target.id);
        if (highlightedNodes.indexOf(sourceNode) < 0) {
          highlightedNodes.push(sourceNode);
        }
        if (highlightedNodes.indexOf(targetNode) < 0) {
          highlightedNodes.push(targetNode);
        }
      });

    }
    
    this.setState({ highlightedNodes, highlightedLinks });
  }

  handleLinkClick(sourceID, targetID) {
    const nodes = this.state.data.nodes;
    const sourceNode = nodes.find(function (node) { return node.id === sourceID; });
    const targetNode = nodes.find(function (node) { return node.id === targetID; });
    const links = this.state.data.links;
    const selectedLink = links.find(function (link) { 
      return ((link.source === sourceID && link.target === targetID)
        || (link.source === targetID && link.target === sourceID)); 
    });

    this.setState({
      selectedType: 'Link',
      selectedTitle: sourceNode.name + ' ⟶ ' + targetNode.name,
      selectedLinkType: selectedLink.linkType,
      selectedLinkOrigin: this.getReferenceFromID(selectedLink.linkOrigin),
      selectedLinkReference: selectedLink.reference || '',
      selectedLinkModel: selectedLink.model || '',
      selectedLinkTargetTitle: targetNode.name,
      selectedNodeLinks: [],
      selectedNodeReferences: [],
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

  handleCheckedCausal() {
    const { data } = this.state;
    let newData = {}

    if (this.state.isCheckedCausal) {
      newData = {
        nodes: [...data.nodes],
        links: data.links.filter(link => link.linkType !== 'Causal'),
        removedLinksCausal: data.links.filter(link => link.linkType === 'Causal'),
      }
    } else {
      newData = {
        nodes: [...data.nodes],
        links: [...data.links, ...data.removedLinksCausal],
        removedLinksCausal: [],
      }
    }

    this.setState({
      isCheckedCausal: !this.state.isCheckedCausal,
      data: newData,
    });
  }

  handleCheckedIndependent() {
    const { data } = this.state;
    let newData = {}

    if (this.state.isCheckedIndependent) {
      newData = {
        nodes: data.nodes.filter(node => this.getLinksToNode(node.id).length > 0),
        links: [...data.links],
        removedNodesUnlinked: data.nodes.filter(node => this.getLinksToNode(node.id).length === 0),
      }
    } else {
      newData = {
        nodes: [...data.nodes, ...data.removedNodesUnlinked],
        links: [...data.links],
        removedNodesUnlinked: [],
      }
    }

    this.setState({
      isCheckedIndependent: !this.state.isCheckedIndependent,
      data: newData,
    });
  }

  handleCheckedDependent() {
    const { data } = this.state;
    let newData = {};
    const linksToRemove = [];
    if (this.state.isCheckedDependent) {
      newData = {
        nodes: data.nodes.filter(node => {
          let isDependent = false;
          for (const link in data.links) {
            if (node.id === data.links[link].target.id) {
              isDependent = true;
            }
          }
          return isDependent;
        }),
        links: [...data.links],
        removedNodesIndependent: data.nodes.filter(node => {
          let isIndependent = true;
          for (const link in data.links) {
            if (node.id === data.links[link].target.id) {
              linksToRemove.push(data.links[link]);
              isIndependent = false;
            }
          }
          return isIndependent;
        }),
        links: data.links.filter(link => {
          let shouldRemoveLink = false;
          for (const linkToRemove in linksToRemove) {
            if (link.source.id === linksToRemove[linkToRemove].source.id && link.target.id === linksToRemove[linkToRemove].target.id) {
              shouldRemoveLink = true;
            }
          }
          return !shouldRemoveLink;
        }),
        removedLinksIndependent: linksToRemove,
      }
    } else {
      newData = {
        nodes: [...data.nodes, ...data.removedNodesIndependent],
        links: [...data.links, ...data.removedLinksIndependent],
        removedNodesIndependent: [],
        removedLinksIndependent: [],
      }
    }

    this.setState({
      isCheckedDependent: !this.state.isCheckedDependent,
      data: newData,
    });
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
    this.setState({
      shouldSimulate: !this.state.shouldSimulate,
      alpha: this.state.alpha === 0.1 ? 0.01 : 0.1,
    });
  }

  isNodeInConcept(node) {
    const selectedConcept = this.state.conceptFilterName || 'All';
    if (selectedConcept === 'All') {
      return true;
    } else {
      if (node.concept_1 && node.concept_1 === selectedConcept) {
        return true;
      } 
      if (node.concept_2 && node.concept_2 === selectedConcept) {
        return true;
      } 
      if (node.concept_3 && node.concept_3 === selectedConcept) {
        return true;
      } 
    }
    return false;
  }

  onSaveToKB() {

    //1 check if token exists

      // if so save to current token
        let token = this.state.token;
        //2 check if changes are made to current token

      // if not generate new token
        token = generateCombination(3, "", true);
              
      //save to database

      //redirect to /model-builder/:token
      this.setState({
        token,
        redirectToUpdateToken: true,
      });

    console.log('generated token', token);
  }

  handleAddVariable() {
    // console.log('hi', this.state.selectedType);
    const { selectedTitle, addedVariables } = this.state;
    let newVariables = [...addedVariables];

    newVariables.push({
      'variable': selectedTitle,
      'weight': 0.75,
    });
    // console.log('handle', addedVariables);
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
          // console.log('found existing link');
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

  toggleReferenceModal() {
    this.setState({ isReferenceModalOpen: !this.state.isReferenceModalOpen });
  }

  render() {

    const {
      addedVariables,
      checkboxes,
      data,
      focusedNodes,
      focusedLinks,
      highlightedLinks,
      highlightedNodes,
      newVariableInput,
      selectedNodeID,
      selectedNodeLinks,
      selectedNodeReferences,
      selectedTitle,
      selectedType,
      shouldSimulate,
      weightValues,
    } = this.state;

    let influenceString = '';
    let originString = '';
    let referenceString = '';
    let modelString = '';
    if (this.state.selectedLinkTargetTitle) {
      influenceString = this.state.selectedLinkType;
      originString = this.state.selectedLinkOrigin;
      modelString = this.state.selectedLinkModel;
    }

    let renderedNodeReferences;
    if (selectedNodeReferences) {
      renderedNodeReferences = selectedNodeReferences.map((reference, index) => {
        const authors = this.getAuthorsFromIDs(reference.authors) || [];
        const renderedAuthors = authors.map((author, index) => {
          return (
            <span>{author.fullName}{author.affiliation && ` (${author.affiliation})`}{index < (authors.length - 1) && ' & '}</span>
          );
        });
        return (
          <div className="NodeReference" onClick={this.toggleReferenceModal}>
            <span style={{textDecoration: 'underline'}}>{reference.id}:</span><span>&nbsp;{reference.item}</span>
            <Dialog
              title="Reference Details"
              actions={editLinkActions}
              modal={false}
              open={this.state.isReferenceModalOpen}
              onRequestClose={this.toggleReferenceModal}
            >
              <div className="ModalContent">
                <p><i>{reference.item}</i></p>
                <p>ID: {reference.id}</p>
                { 
                  renderedAuthors.length > 0 && (
                    <div>
                      <p>Authors: {renderedAuthors}</p>
                    </div>
                  )
                }
              </div>
            </Dialog>
          </div>
        );
      });
    }

    //filter out data
    let filteredData = {
      nodes: [],
      links: [],
    };
    const numLinks = {};

    data.links.forEach((link, index) => {
      const filterTypes = [];
      !this.state.isCheckedCausal && filterTypes.push('Causal');
      !this.state.isCheckedHypothesis && filterTypes.push('Hypothesized');
      const filterOrigins = [];
      !this.state.isCheckedModel && filterOrigins.push('via model');
      !this.state.isCheckedOpinion && filterOrigins.push('via opinion');
      !this.state.isCheckedReference && filterOrigins.push('via reference');

      if (!(filterTypes.indexOf(link.linkType) > -1) && !(filterOrigins.indexOf(link.linkOrigin) > -1)) {
        //count links to nodes
        numLinks[link.target] ? numLinks[link.target]++ : numLinks[link.target] = 1;
        numLinks[link.source] ? numLinks[link.source]++ : numLinks[link.source] = 1;

        // link.linkType === 'Causal' ? link.value = 10 : link.value = 2;
        link.linkType === 'Causal' ? link.color = 'rgba(131, 198, 72, 0.9)' : link.color = 'rgba(228, 82, 75, 0.9)';

        const origin = link.linkOrigin;
        if (origin === 'via model') {
          link.dash = "5, 5";
          link.label = "via Model";
        } else if (origin === 'via reference') {
          link.dash = "0";
          link.label = "via Reference";
          // link.label = " ";
        } else if (origin === 'via opinion') {
          link.dash = "15, 10, 5, 10";
          link.label = "via Opinion";
        } else {
          link.label = " ";
        }
        filteredData.links.push(link);
      }
    });

    //apply styling to nodes based on different properties
    data.nodes.forEach((node, index) => {
      if (data.nodes.length < 30) {
        // node.value = 5;
      }
    });

    //if empty, display the knowledge pack
    if (filteredData.nodes.length < 1) {
      filteredData.nodes.push({
        id: 'Concept',
        name: 'Advertising Performance',
        color: 'rgb(131, 198, 72)',
        symbolType: 'diamond',
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

    let renderedTokenRedirect;
    if (this.state.redirectToUpdateToken) {
      const tokenURL = `/model-builder/${this.state.token || ''}`;
      renderedTokenRedirect = <Redirect to={tokenURL} />;
      this.setState({ redirectToUpdateToken: false });
    }

    // render the graph
    let renderedForceGraph = (
      <div className="ForceGraphContainer" style={{overflowY: "hidden", maxHeight: "600px"}}>
          <ForceGraph2D
            enableNodeDrag
            graphData={data}
            linkCurvature={0}
            nodeResolution={16}
            linkResolution={16}
            width={1000}
            linkWidth={link => {
              if (highlightedLinks.indexOf(link) > -1 || focusedLinks.indexOf(link) > -1) {
                return "4";
              } else {
                return "2";
              }
            }}
            linkColor={link => {

              if (focusedLinks.indexOf(link) > -1) {
                return "rgba(228, 82, 75, 0.7)";
              } else if (highlightedLinks.indexOf(link) > -1) {
                return "rgba(255, 198, 40, 0.7)";
              } else {
                return link.color;
              }
            }}
            nodeLabel="name"
            linkLabel="linkOrigin"
            backgroundColor="transparent"
            // backgroundColor="rgba(0,0,0,0.9)"
            linkDirectionalParticles={1}
            onNodeClick={this.handleNodeClick}
            onNodeHover={this.handleNodeHover}
            onLinkHover={this.handleLinkHover}
            nodeCanvasObject={(node, ctx, globalScale) => {
              let label = node.name;
              const fontSize = 12/globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = node.color;
              ctx.beginPath();
              ctx.arc(node.x,node.y,node.value * 3, 0, 2*Math.PI);
              ctx.fillStyle = node.color || "rgba(11, 179, 214, 1)";
              ctx.fill();

              let isHighlightedNode = highlightedNodes.indexOf(node) > -1;
              let isFocusedNode = focusedNodes.indexOf(node) > -1;
              if (isFocusedNode) {
                ctx.strokeStyle = "rgb(228, 82, 75)";
                ctx.lineWidth = 0.5;
                ctx.stroke();
              } else if (isHighlightedNode) {
                ctx.strokeStyle = "rgba(255, 198, 40, 1)";
                ctx.lineWidth = 0.5;
                ctx.stroke();
              }

              if (data.nodes.length < 40 || this.getLinksToNode(node.id).length > 20 || isHighlightedNode || isFocusedNode) {
                if (this.getLinksToNode(node.id).length > 5 && label.length > 20) {
                  label = label.slice(0,20) + '...';
                }
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = "black";
                ctx.fillText(label, node.x, node.y - 5);
              }
            }}
          />
        }
      </div>
    );

    const renderedConceptDropdownItems = data.concepts ? data.concepts.map((concept, index) => {
      return <MenuItem value={index + 2} primaryText={concept} />
    }) : null;

    return (
      <React.Fragment>
        <Container className="Container" style={{minWidth: "960px"}}>
          <div className="GraphBackground" />
          {renderedTokenRedirect}
          <Row>
            {/* <Col xs={12}>
              <h1>Ontology</h1>
            </Col> */}
            <Col xs={12}>
              <div className="GraphContainer" style={{background: "#fff9e5"}}>
                <div className="GraphControls">
                  <Toolbar className="GraphToolbar">
                    <ToolbarGroup firstChild={true}>
                      <a href="/categories">
                        <ToolbarTitle className="ToolbarTitle" text="Knowledge pack: Housing Prices" />
                      </a>
                      <ToolbarSeparator />
                      <ToolbarTitle className="ToolbarTitle" text="Concept:" />
                      <DropDownMenu className="ToolbarTitle dropdown" value={this.state.conceptValue} onChange={this.handleConceptChange}>
                        <MenuItem value={1} primaryText="All" />
                        {renderedConceptDropdownItems}
                      </DropDownMenu>
                    </ToolbarGroup>
                    <ToolbarGroup>
                      {/* <ToolbarTitle text="Options" /> */}
                      {/* <FontIcon className="muidocs-icon-custom-sort" /> */}
                      {/* <ToolbarSeparator />
                      <ToolbarTitle className="ToolbarTitle" text="Activities:" />
                      <DropDownMenu className="ToolbarTitle dropdown" value={this.state.dropdownValue} onChange={this.handleDropDownChange}>
                        <MenuItem value={1} primaryText="Explore Variables" />
                        <MenuItem value={2} primaryText="Model Builder" />
                        <MenuItem value={3} primaryText="View datasets" />
                        <MenuItem value={4} primaryText="Social Growth" />
                        <MenuItem value={5} primaryText="Monthly Active Users" />
                      </DropDownMenu> */}
                    </ToolbarGroup>
                    <ToolbarGroup>
                      {/* <ToolbarTitle text="Options" /> */}
                      {/* <FontIcon className="muidocs-icon-custom-sort" /> */}
                      <ToolbarSeparator />
                      <RaisedButton
                        label="Animate"
                        onClick={this.handleSimulate}
                        primary={!this.state.shouldSimulate} 
                      />
                      {/* <Checkbox label="Interest" /> */}
                    </ToolbarGroup>
                  </Toolbar>
                  {/* <FlatButton label="Pause" />
                  <FlatButton label="Simulate" /> */}
                </div>
                <Paper className="Legend" style={{paddingBottom: '5px',backgroundColor: 'rgba(255,255,255,0.4)'}}>
                  <Col xs={12} style={{paddingTop: '5px',textAlign: 'left'}}>
                    <span style={{color: 'rgba(228, 82, 75, 1)'}}>Red line:</span> Formulaic link
                    <br />
                    <span style={{color: 'rgba(131, 198, 72, 1)'}}>Green line:</span> Causal link
                  </Col>     
                </Paper>
              </div>
            </Col>
          </Row>
        </Container>
        {renderedForceGraph}
        <Container>
          <Row>
            <Col>
              <div>
                {/* <Graph
                  id="d3-ontology" // id is mandatory, if no id is defined rd3g will throw an error
                  data={filteredData}
                  config={myConfig}
                  onClickNode={this.handleNodeClick}
                  onClickLink={this.handleLinkClick}
                  onMouseOverNode={onMouseOverNode}
                  onMouseOutNode={onMouseOutNode}
                  onMouseOverLink={onMouseOverLink}
                  onMouseOutLink={onMouseOutLink}
                /> */}
                <div className="InfoContainer">
                  <Row>
                    <Col xs={8}>
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
                    <Col xs={4}>
                      <div className="SaveEdits">
                        <RaisedButton
                          label="Save To Knowledge Base"
                          onClick={this.onSaveToKB}
                          primary={true} 
                        />
                      </div>
                    </Col>
                  </Row>
                  <Paper className="InfoContainerPaper" zDepth={1}>
                    <Row>
                      <Col xs={4}>
                        <div className="InfoLegend">
                          <div className="InfoLegendTitle">Filters</div>
                          <Row>
                            <Col xs={6}>
                              <span className="InfoLegendItem filter">Link type</span>
                              <Checkbox label="Causal" checked={this.state.isCheckedCausal} onCheck={this.handleCheckedCausal}  />
                              <Checkbox label="Hypothesized" checked={this.state.isCheckedHypothesis} onCheck={this.handleCheckedHypothesis} />
                              <span className="InfoLegendItem filter">Show Unlinked</span>
                              <Checkbox label="Unlinked" checked={this.state.isCheckedIndependent} onCheck={this.handleCheckedIndependent} />
                            </Col>
                            <Col xs={6}>
                              <span className="InfoLegendItem filter">Link origin</span>
                              <Checkbox label="Model" checked={this.state.isCheckedModel} onCheck={this.handleCheckedModel} />
                              <Checkbox label="Reference" checked={this.state.isCheckedReference} onCheck={this.handleCheckedReference} />
                              <Checkbox label="Opinion" checked={this.state.isCheckedOpinion} onCheck={this.handleCheckedOpinion} />
                              <span className="InfoLegendItem filter">Dependence</span>
                              <Checkbox label="Independent" checked={this.state.isCheckedDependent} onCheck={this.handleCheckedDependent} />
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
                                    <div className="LinksTo">Reference</div>
                                    <div className="LinksTo">Model</div>
                                  </Col>
                                  <Col xs={8}>
                                    {influenceString}
                                    <br />
                                    {originString}
                                    <br />
                                    {referenceString}
                                    <br />
                                    {modelString}
                                  </Col>
                                  <Col xs={2} />
                                </Row>
                              </div>
                            )
                          }
                          {
                            renderedNodeReferences && renderedNodeReferences.length > 0 && (
                              <div className="InfoLegendLinks">
                                <Row>
                                  {/* <Col xs={2}>
                                    <div className="LinksTo">Links</div>
                                  </Col>
                                  <Col xs={8} style={{maxHeight: "55px", overflow: "scroll"}}>
                                    {renderedLinksToNode}
                                  </Col>
                                  <Col xs={2} /> */}
                                  <Col xs={2}>
                                    <div className="LinksTo">Origin</div>
                                  </Col>
                                  <Col xs={8}>
                                    {renderedNodeReferences}
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
                                  label="Collapse"
                                  onClick={this.collapseNodes}
                                  primary={true}
                                />
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
                                    <MenuItem value="Causal" primaryText="Causal" />
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
                </div>
              </div>
              {/* <div className="ModelContainer">
                <div className="InfoContainer">
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
              </div> */}

            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default ModelBuilder;
