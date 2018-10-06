import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container } from 'reactstrap'
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import './styles.css';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import { generateCombination } from 'gfycat-style-urls';
import { Redirect } from 'react-router-dom';
import Select from 'react-select';

import { ImportData, ImportReferences, ImportMeasures, ImportPeople } from '../../utils/ImportData';
import { isConceptNameSelected } from '../../utils/ConceptUtils';

class ModelBuilder extends Component {
  constructor() {
    super();
    this.state = {
      alpha: 1,
      collapsedLinks: [],
      collapsedNodes: [],
      conceptValue: 1,
      conceptFilterName: 'All',
      conceptsAll: [],
      conceptsSelected: [],
      addedVariables: [],
      editLinkTypeValue: 'Causal',
      editLinkOriginValue: 'via Model',
      focusedLinks: [],
      focusedNodes: [],
      highlightedLinks: [],
      highlightedNodes: [],
      isEditLinkOpen: false,
      isMeasureView: false,
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
    this.deselectNodes = this.deselectNodes.bind(this);
    this.collapseNode = this.collapseNode.bind(this);
    this.expandNode = this.expandNode.bind(this);
    this.getNodeFromID = this.getNodeFromID.bind(this);
    this.getNodeFromName = this.getNodeFromName.bind(this);
    this.getLinksToNode = this.getLinksToNode.bind(this);
    this.getReferenceFromID = this.getReferenceFromID.bind(this);
    this.getAuthorsFromIDs = this.getAuthorsFromIDs.bind(this);
    this.handleAddVariable = this.handleAddVariable.bind(this);
    this.handleDropDownChange = this.handleDropDownChange.bind(this);
    this.handleConceptMultiSelect = this.handleConceptMultiSelect.bind(this);
    this.handleLinkHover = this.handleLinkHover.bind(this);
    this.handleNodeHover = this.handleNodeHover.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.handleLinkTypeFilter = this.handleLinkTypeFilter.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleSimulate = this.handleSimulate.bind(this);
    this.handleMeasureView = this.handleMeasureView.bind(this);
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

    // add esc event listener
    document.addEventListener('keydown', this.deselectNodes);
  }

  addNewNode(e) {
    e.preventDefault();
    if (this.state.newVariableInput.length > 0) {
      const { data } = this.state;
      const newData = {
        nodes: [...data.nodes, { id: 'new node' + data.nodes.length, name: this.state.newVariableInput, value: 1 }],
        links: [...data.links],
        concepts: data.concepts ? [...data.concepts] : [],
      }
      this.setState({
        data: newData,
        newVariableInput: '',
        // alpha: this.state.alpha + 1,
      })
    };
  }

  deselectNodes(event) {
    if (event.code === 'Escape') {
      this.setState({
        focusedLinks: [],
        focusedNodes: [],
      });
    }
  }

  collapseNode(nodeID) {
    // for each link, if the target is nodeid, remove it;
    const { data, collapsedNodes, collapsedLinks } = this.state || [];
    const nodesToRemove = [];
    const linksToRemove = [];
    const filteredLinks = data.links.filter(link => {
      if (link.target.id === nodeID) {
        if (this.getLinksToNode(link.source.id).length <= 1) {
          nodesToRemove.push(link.source);
          linksToRemove.push(link);
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    });

    // return to avoid moving the graph due to new data
    if (nodesToRemove.length === 0 && linksToRemove.length === 0) {
      return;
    }

    const filteredNodes = data.nodes.filter(node => {
      return !(nodesToRemove.indexOf(node) > -1);
    });

    const newData = {
      nodes: [...filteredNodes],
      links: [...filteredLinks],
      concepts: [...data.concepts] || [],
    };
    this.setState({
      data: newData,
      collapsedNodes: [...collapsedNodes, { nodeid: nodeID, nodesRemoved: nodesToRemove }],
      collapsedLinks: [...collapsedLinks, { nodeid: nodeID, linksRemoved: linksToRemove}],
    });
  }

  expandNode(nodeID) {
    const { data, collapsedNodes, collapsedLinks } = this.state;
    const collapsedNodeObject = collapsedNodes.filter(cluster => cluster.nodeid === nodeID)[0] || { nodesRemoved: [] };
    const collapsedLinkObject = collapsedLinks.filter(cluster => cluster.nodeid === nodeID)[0] || { linksRemoved: [] };
    if (collapsedLinkObject.linksRemoved.length === 0 && collapsedNodeObject.nodesRemoved.length === 0) {
      return;
    }
    let newData = {
      nodes: [...data.nodes],
      links: [...data.links],
      concepts: [...data.concepts] || [],
    }
    if (collapsedNodeObject.nodesRemoved) {
      newData.nodes = [...newData.nodes, ...collapsedNodeObject.nodesRemoved];
    }
    if (collapsedLinkObject.linksRemoved) {
      newData.links = [...newData.links, ...collapsedLinkObject.linksRemoved];
    }
    this.setState({
      data: newData,
      collapsedNodes: [...collapsedNodes.filter(cluster => cluster.nodeid !== nodeID)],
      collapsedLinks: [...collapsedLinks.filter(cluster => cluster.nodeid !== nodeID)],
    });
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
    if (referencesFound.length > 1) {
      console.log('large refernece', referencesFound);
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

  handleConceptMultiSelect(value = [], { action, removedValue }) {
    const selectedConcepts = value;
    ImportData(data => {
      if (isConceptNameSelected('All', selectedConcepts) || value.length === 0) {
        return this.setState({ data });
      }
      let newData = {
        nodes: data.nodes.slice(),
        links: data.links.slice(),
        concepts: data.concepts.slice(),
      };
      newData.nodes = data.nodes.filter(node => {
        return isConceptNameSelected(node.concept_1, selectedConcepts) || isConceptNameSelected(node.concept_2, selectedConcepts) || isConceptNameSelected(node.concept_3, selectedConcepts);
      });
      const linksWithCorrectSources = data.links.filter(link => {
        for (const newNode in newData.nodes) {
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

      this.setState({
        data: newData,
      });

    });
  }

  handleNodeClick(clickedNode) {
    const selectedNode = clickedNode; //nodes.find(function (node) { return clickedNode.id === node.id; });
    
    //handle focus
    let { isMeasureView, focusedNodes, focusedLinks, selectedNodeID } = this.state || [];

    if (selectedNode.id == selectedNodeID) {
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
      selectedType: isMeasureView ? 'Measure' : 'Variable',
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
    });
  }

  handleMeasureView() {
    const { isMeasureView } = this.state;
    if (!isMeasureView) {
      ImportMeasures(graph => {
        this.setState({ data: graph, isMeasureView: !this.state.isMeasureView });
      });
    } else {
      ImportData(graph => {
        this.setState({ data: graph, isMeasureView: !this.state.isMeasureView });
      })
    }
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
      <div className="ForceGraphContainer" style={{overflowY: "hidden", maxHeight: "600px", position: "relative", left: "calc((100% - 1100px) / 2)", }}>
          <ForceGraph2D
            enableNodeDrag
            graphData={data}
            linkCurvature={0}
            nodeResolution={16}
            linkResolution={16}
            width={1100}
            linkWidth={link => {
              if (highlightedLinks.indexOf(link) > -1 || focusedLinks.indexOf(link) > -1) {
                return "4";
              } else {
                return "2";
              }
            }}
            linkColor={link => {

              // if node is focused, grey everything else out
              if (focusedLinks.length > 0) {
                if (focusedLinks.indexOf(link) > -1) {
                  return link.color;
                } else {
                  return 'rgba(0,0,0,0.2)';
                }       
              } else {
                if (focusedLinks.indexOf(link) > -1) {
                  return "rgba(228, 82, 75, 0.7)";
                } else if (highlightedLinks.indexOf(link) > -1) {
                  return "rgba(255, 198, 40, 0.7)";
                } else {
                  return link.color;
                }
              }
            }}
            nodeLabel="name"
            linkLabel="linkOrigin"
            backgroundColor="transparent"
            // backgroundColor="rgba(0,0,0,0.9)"
            // linkCurvature={link => {
            //   if (this.state.shouldSimulate) {
            //     return 0.3;
            //   } else {
            //     return 0;
            //   }
            // }}
            linkDirectionalParticles={1}
            linkDirectionalParticleWidth={link => {
              // show all when toggled
              if (this.state.shouldSimulate) {
                return 4;
              }
              if (focusedLinks.length > 0) {
                if (focusedLinks.indexOf(link) > -1) {
                  return 4;
                } else {
                  return 0;
                }
              } else {
                if (focusedLinks.indexOf(link) > -1) {
                  return 4;
                } else if (highlightedLinks.indexOf(link) > -1) {
                  return 4;
                } else {
                  return 0;
                }
              }
            }}
            onNodeClick={this.handleNodeClick}
            onNodeHover={this.handleNodeHover}
            onLinkHover={this.handleLinkHover}
            nodeCanvasObject={(node, ctx, globalScale) => {
              let label = node.name;
              const fontSize = 12/globalScale;
              let isHighlightedNode = highlightedNodes.indexOf(node) > -1;
              let isFocusedNode = focusedNodes.indexOf(node) > -1;

              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = node.color;
              ctx.beginPath();
              ctx.arc(node.x,node.y,node.value * 3, 0, 2 * Math.PI);

              if (focusedNodes.length > 0) {
                if (isFocusedNode) {
                  ctx.fillStyle = node.color;
                } else {
                  ctx.fillStyle = 'rgba(150,150,150,1)';
                }
              } else {
                if (isFocusedNode) {
                  ctx.fillStyle = 'rgb(0,0,0)';
                } else if (isHighlightedNode) {
                  ctx.fillStyle = "rgb(255, 198, 40)";
                } else {
                  ctx.fillStyle = node.color;
                }
                ctx.fillStyle = node.color || "rgba(11, 179, 214, 1)";
              }
              ctx.fill();

              if (isFocusedNode) {
                ctx.strokeStyle = "rgb(0, 0, 0)";
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

                let verticleOffset = node.value ? node.value * -4 : -5;
                if (node.value === 1) {
                  verticleOffset = -5;
                }
                ctx.fillText(label, node.x, node.y + verticleOffset);
              }
            }}
          />
        }
      </div>
    );

    const renderedConceptDropdownItems = data.concepts ? data.concepts.map((concept, index) => {
      return <MenuItem value={index + 2} primaryText={concept} />
    }) : null;

    let conceptMultiSelectOptions = data.concepts ? data.concepts.map(concept => {
      return { value: concept, label: concept };
    }) : [];
    conceptMultiSelectOptions = [{value: 'All', label: 'All'}, ...conceptMultiSelectOptions];

    return (
      <React.Fragment>
        <Container className="Container" style={{minWidth: "960px"}}>
          {/* <div className="GraphBackground" /> */}
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
                      {/* <ToolbarTitle className="ToolbarTitle" text="Concept:" /> */}
                      <Select
                        isMulti
                        className="ConceptMultiSelect"
                        onChange={this.handleConceptMultiSelect}
                        options={conceptMultiSelectOptions || []}
                        placeholder="Concepts"
                      /> 
                    </ToolbarGroup>
                    <ToolbarGroup>
                    </ToolbarGroup>
                    <ToolbarGroup>
                      {/* <ToolbarSeparator /> */}
                      <ToolbarTitle className="ToolbarTitle" text="Measure View" style={{overflow: 'visible'}} />
                      <Toggle
                        toggled={this.state.isMeasureView}
                        onToggle={this.handleMeasureView}
                        style={{marginRight: '20px',width: '100px'}}
                      />
                      <ToolbarTitle className="ToolbarTitle" text="Flow" style={{overflow: 'visible'}} />
                      <Toggle
                        toggled={this.state.shouldSimulate}
                        onToggle={this.handleSimulate}
                      />
                    </ToolbarGroup>
                  </Toolbar>
                </div>
                { !this.state.isMeasureView && (
                  <Paper className="Legend" style={{paddingBottom: '5px',backgroundColor: 'rgba(255,255,255,0.4)'}}>
                    <Col xs={12} style={{paddingTop: '5px',textAlign: 'left'}}>
                      <span style={{color: 'rgba(228, 82, 75, 1)'}}>Red line:</span> Formulaic link
                      <br />
                      <span style={{color: 'rgba(131, 198, 72, 1)'}}>Green line:</span> Causal link
                    </Col>     
                  </Paper>
                )}
              </div>
            </Col>
          </Row>
        </Container>
        {renderedForceGraph}
        <Container>
          <Row>
            <Col>
              <div>
                <div className="InfoContainer">
                  <Row>
                    <Col xs={8}>
                      <div className="CreateNode">
                        <form onSubmit={this.addNewNode}>
                          <TextField
                            // hintText="Variable name"
                            className="CreateNodeInput"
                            floatingLabelText="New variable name"
                            value={newVariableInput}
                            onChange={this.handleNewVariableInputChange}
                            onSubmit={this.addNewNode}
                          /> 
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
                              <Checkbox label="Formulaic" checked={this.state.isCheckedHypothesis} onCheck={this.handleCheckedHypothesis} />
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
                            (selectedType === 'Variable' || selectedType === 'Measure') && (
                              <div className="InfoLegendButton">
                                <div>
                                  <FlatButton
                                    label="Expand"
                                    onClick={() => this.expandNode(selectedNodeID)}
                                    secondary
                                  />
                                  <FlatButton
                                    label="Collapse"
                                    onClick={() => this.collapseNode(selectedNodeID)}
                                    secondary
                                  />
                                </div>
                                <div>
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
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default ModelBuilder;
