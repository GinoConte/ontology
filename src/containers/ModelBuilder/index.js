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
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import { generateCombination } from 'gfycat-style-urls';
import { Redirect } from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';

import { 
  ExportNodes,
  ExportLinks,
  ImportData,
  ImportReferences,
  ImportMeasures,
  ImportPeople,
  ImportModels 
} from '../../utils/ImportData';
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
      isFullscreen: false,
      isLoadingNewReference: false,
      newLinkInput: '',
      newLinkTarget: '',
      newVariableInput: '',
      newNodes: [],
      newLinks: [],
      newLinkReferences: [],
      savedToKB: false,
      savedToKBMessage: '',
      selectedNodeID: '',
      selectedType: '',
      selectedTitle: '',
      selectedLinkType: '',
      selectedLinkOrigin: '',
      selectedLinkTargetTitle: '',
      showAllLabels: false,
      showNoLabels: false,
      data: { nodes: [], links: [] },
      dropdownValue: 1,
      isCheckedCausal: true,
      isCheckedFormulaic: true,
      isCheckedHypothesis: true,
      isCheckedModel: true,
      isCheckedOpinion: true,
      isCheckedReference: true,
      isCheckedIndependent: true,
      isCheckedDependent: true,
      isReferenceModalOpen: false,
      isModelModalOpen: false,
      hasBeenInteractedWith: false,
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
    this.getModelsFromIDs = this.getModelsFromIDs.bind(this);
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
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleInteraction = this.handleInteraction.bind(this)
    
    //modal
    this.handleLinkTypeChange = this.handleLinkTypeChange.bind(this);
    this.handleLinkOriginChange = this.handleLinkOriginChange.bind(this);
    this.handleNewLinkTargetSelect = this.handleNewLinkTargetSelect.bind(this);
    this.handleNewLinkReferenceSelect = this.handleNewLinkReferenceSelect.bind(this);
    this.handleNewLinkInputChange = this.handleNewLinkInputChange.bind(this);
    this.toggleEditLink = this.toggleEditLink.bind(this);
    this.submitEditLink = this.submitEditLink.bind(this);
    this.handleCreateNewReference = this.handleCreateNewReference.bind(this);
    this.toggleReferenceModal = this.toggleReferenceModal.bind(this);
    this.toggleModelModal = this.toggleModelModal.bind(this);

    //input
    this.handleNewVariableInputChange = this.handleNewVariableInputChange.bind(this);

    //checkboxes
    this.handleCheckedCausal = this.handleCheckedCausal.bind(this);
    this.handleCheckedFormulaic = this.handleCheckedFormulaic.bind(this);
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

    ImportModels(models => {
      this.setState({
        models,
      });
    });

    ImportPeople(people => {
      this.setState({
        people,
      });
    });
    
    // position the canvas on load
    if (this.forceGraphRef) {
      this.forceGraphRef.zoom(4,100);
      this.forceGraphRef.centerAt(0, -20);
    }

    // add esc event listener
    document.addEventListener('keydown', this.deselectNodes);
  }

  addNewNode(e) {
    e.preventDefault();
    if (this.state.newVariableInput.length > 0) {
      const { data } = this.state;
      const newNode = { id: 'VID00' + data.nodes.length, name: this.state.newVariableInput, value: 2, color: "#0AE0DC" };
      const newData = {
        nodes: [...data.nodes, newNode],
        links: [...data.links],
        concepts: data.concepts ? [...data.concepts] : [],
      }
      this.setState({
        data: newData,
        newVariableInput: '',
        focusedLinks: [],
        focusedNodes: [],
        hasBeenInteractedWith: false,
        newNodes: [...this.state.newNodes, newNode],
      }, success => {
        // this.handleNodeClick(newNode);

        // move camera on new node
        // if (this.forceGraphRef) {
        //   this.forceGraphRef.centerAt()
        // }
      });
      
    };
  }

  // to-do rename to "keypress handler" because it does more than deselect lol
  deselectNodes(event) {
    if (event.code === 'Escape') {
      this.setState({
        focusedLinks: [],
        focusedNodes: [],
        selectedNodeID: '',
      });
    } else if (event.code === 'Slash') {
      // toggle showing all labels when slash is pressed
      this.setState({ showAllLabels: !this.state.showAllLabels })
    } else if (event.code === 'Quote') {
      // toggle showing NO labels when quote is pressed '
      this.setState({ showNoLabels: !this.state.showNoLabels });
    } else if (event.code === 'BracketRight') {
      const { isFullscreen } = this.state;
      const ontology = document.getElementById('ontology');
      const details = document.getElementById('details');
      const toolbar = document.getElementById('toolbar');
      const everything = document.getElementById('everythanggg');
      
      if (isFullscreen) {
        details.setAttribute('style', 'display: block');
        toolbar.setAttribute('style', 'display: block');
        ontology.setAttribute('style', 'max-height: 800px;overflow-y: hidden;position: relative;left: calc((100% - 1900px) / 2);');
      } else {
        details.setAttribute('style', 'display: none');
        toolbar.setAttribute('style', 'display: none');
        ontology.setAttribute('style', 'max-height: 2000px;overflow-y: hidden;position: relative;left: calc((100% - 1900px) / 2);');
        // everything.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
      this.setState({ isFullscreen: !this.state.isFullscreen });
      // ontology.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);

      // ontology.requestFullscreen();
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

    // get the node thats been collapsed to
    newData.nodes.forEach(node => {
      if (node.id === nodeID) {
        node.value = node.value + 1.5;
      }
    });

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

    // get the node thats been collapsed to
    newData.nodes.forEach(node => {
      if (node.id === nodeID) {
        node.value = node.references;
      }
    });

    this.setState({
      data: newData,
      collapsedNodes: [...collapsedNodes.filter(cluster => cluster.nodeid !== nodeID)],
      collapsedLinks: [...collapsedLinks.filter(cluster => cluster.nodeid !== nodeID)],
      hasBeenInteractedWith: false,
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
    const referencesToFind = nodeReferences.replace(/ /g, '').split(',');
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

  getModelsFromIDs(modelIDs = '') {
    const modelsToFind = modelIDs.replace(/ /g, '').split(',');
    const modelsFound = [];
    const { models } = this.state;
    for (const modelToFind in modelsToFind) {
      for (const model in models) {
        if (modelsToFind[modelToFind] === models[model].id) {
          modelsFound.push(models[model]);
        }
      }
    }
    return modelsFound;
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

  handleInteraction() {
    this.setState({ hasBeenInteractedWith: true });
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
        focusedNodes: [],
        focusedLinks: [],
        selectedNodeID: '',
        hasBeenInteractedWith: false,
      });

    });
  }

  // target takes the form { value: node.id, label: node.name }
  handleNewLinkTargetSelect(target) {
    console.log('target selected', target);
    this.setState({ newLinkTarget: target })
  }

  // target takes the form { value: node.id, label: node.name }
  handleNewLinkReferenceSelect(references) {
    this.setState({ newLinkReferences: references })
  }

  handleNodeClick(clickedNode) {
    const selectedNode = clickedNode;

    //handle focus
    let { isMeasureView, focusedNodes, focusedLinks, selectedNodeID } = this.state || [];

    if (selectedNode.id == selectedNodeID) { // this is the deselect case
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
      selectedNodeID: focusedNodes.length === 0 ? '' : selectedNode.id, // if deselect, remove node id
      selectedNodeReferences: this.getReferenceFromID(selectedNode.reference),
      selectedTitle: selectedNode.name,
      selectedType: isMeasureView ? 'Measure' : 'Variable',
      selectedLinkType: '',
      selectedLinkOrigin: '',
      selectedLinkTargetTitle: '',
      selectedNodeLinks: this.getLinksToNode(selectedNode.id),
      hasBeenInteractedWith: 'click',
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

  handleLinkClick(link) {
    console.log('link click', link);
    const { focusedLinks } = this.state;
    this.setState({
      selectedType: 'Link',
      selectedTitle: link.source.name + ' ⟶ ' + link.target.name,
      selectedLinkType: link.linkType,
      selectedLinkOrigin: link.linkOrigin,
      selectedNodeReferences: this.getReferenceFromID(link.reference) || [],
      selectedLinkModels: this.getModelsFromIDs(link.model) || [],
      selectedLinkModel: link.model || '',
      selectedLinkTargetTitle: link.target.name,
      selectedNodeLinks: [],
      selectedNodeID: '',
      focusedNodes: [link.target, link.source],
      focusedLinks: [link],
    })
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
      console.log('removed links', newData.removedLinksCausal);
    } else {
      newData = {
        nodes: [...data.nodes],
        links: data.removedLinksCausal ? [...data.links, ...data.removedLinksCausal] : [...data.links],
        removedLinksCausal: [],
      }
    }

    this.setState({
      isCheckedCausal: !this.state.isCheckedCausal,
      data: newData,
      hasBeenInteractedWith: false,
    });
  }

  handleCheckedFormulaic() {
    const { data } = this.state;
    let newData = {}

    if (this.state.isCheckedFormulaic) {
      newData = {
        nodes: [...data.nodes],
        links: data.links.filter(link => link.linkType !== 'Formula'),
        removedLinksFormulaic: data.links.filter(link => link.linkType === 'Formula'),
      }
    } else {
      newData = {
        nodes: [...data.nodes],
        links: [...data.links, ...data.removedLinksFormulaic],
        removedLinksFormulaic: [],
      }
    }

    this.setState({
      isCheckedFormulaic: !this.state.isCheckedFormulaic,
      data: newData,
      hasBeenInteractedWith: false,
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
        nodes: data.removedNodesUnlinked ? [...data.nodes, ...data.removedNodesUnlinked] : [...data.nodes],
        links: [...data.links],
        removedNodesUnlinked: [],
      }
    }

    this.setState({
      isCheckedIndependent: !this.state.isCheckedIndependent,
      data: newData,
      hasBeenInteractedWith: false,
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
      hasBeenInteractedWith: false,
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
    ExportNodes(this.state.newNodes, response => {
      this.setState({
        savedToKB: true,
        savedToKBMessage: response,
      });
      console.log('Refresh due to file changing -- possibly nodemon?');
    });
    ExportLinks(this.state.newLinks, response => {
      this.setState({
        savedToKB: true,
        savedToKBMessage: response,
      });
    });
  }

  handleSnackbarClose() {
    this.setState({ savedToKB: false });
  }

  handleAddVariable() {
    // console.log('hi', this.state.selectedType);
    const { selectedTitle, addedVariables } = this.state;
    let newVariables = [...addedVariables];

    newVariables.push({
      'variable': selectedTitle,
      'weight': 0.75,
    });
    this.setState({ addedVariables: newVariables });
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
    const { addedLinks, data, newLinkReferences } = this.state;
    const targetNode = this.getNodeFromID(this.state.newLinkTarget.value); // from the dropdown
    console.log('source node selected?', this.state.selectedNodeID);

    const sourceNode = this.getNodeFromID(this.state.selectedNodeID);

    console.log('source node', sourceNode);

    let commaSeparatedReferences = '';
    // process references
    newLinkReferences.forEach(reference => {
      commaSeparatedReferences = commaSeparatedReferences + ', ' + reference.value;
    });

    let newData = {
      links: [...data.links],
      nodes: [...data.nodes],
      concepts: data.concepts ? [...data.concepts] : [],
    }

    if (targetNode) {

      //check if already exists, update if it does
      // let linkExists = false;
      // newData.links.forEach((link, index) => {
      //   if ((link.target === sourceNode.id) && !linkExists) {
      //     linkExists = true;
      //     newData.links[index].linkType = linkType;
      //     newData.links[index].linkOrigin = linkOrigin;
      //     // break; -- need to implement exception for larger quantities of variables
      //   }
      // })
      let linkExists = false;

      //doesn't exist, so we push new link
      const newLink = {
        id: 'VL00' + this.state.data.links.length,
        linkOrigin: linkOrigin,
        linkType: linkType,
        source: sourceNode,
        target: targetNode,
        reference: commaSeparatedReferences || '',
      };

      if (!linkExists) {
        newData.links.push(newLink);
      }

      this.toggleEditLink();
      this.setState({
        data: newData,
        newLinks: [...this.state.newLinks, newLink],
        editLinkTypeValue: '',
        editLinkOriginValue: '',
        newLinkReferences: [],
      }, success => {
        this.deselectNodes({ code: 'Escape' });
      });
    }
  }

  handleCreateNewReference(referenceTitle = '') {
    if (referenceTitle) {
      const { references, referenceNames, newLinkReferences } = this.state;
      const newReferenceID = 'REF00' + (references.length + 1);
      const referenceObject = {
        id: newReferenceID,
        item: referenceTitle,
      };
      this.setState({ isLoadingNewReference: true }, () => {
        setTimeout(() => {
          // referenceNames.push(referenceTitle);
          // newLinkReferences.push({ value: newReferenceID, label: referenceTitle });
          this.setState({
            isLoadingNewReference: false,
            references: [...this.state.references, referenceObject],
            // newLinkReferences: { value: newReferenceID, label: referenceTitle },
            // referenceNames,
          }, () => {
            const newSelections = (newLinkReferences && newLinkReferences.length > 0) ? [...newLinkReferences, { value: newReferenceID, label: referenceTitle }] : [{ value: newReferenceID, label: referenceTitle }];
            this.handleNewLinkReferenceSelect(newSelections);
            // // re-process all the references to populate the list
            // const referenceNames = [];
            // references.forEach(reference => {
            //   if (reference.id) {
            //     referenceNames.push({value: reference.id, label: reference.item.slice(0,70)});
            //   }
            // })
          });
        }, 1000); // fake loading until we can export to database
      });
    }
  }

  toggleEditLink() {
    const { nodes } = this.state.data;
    const { references } = this.state;
    //get options for the dropdown
    const options = [];
    nodes.forEach(node => {
      if (node.name) {
        options.push({value: node.id, label: node.name})
      }
    });
    const referenceNames = [];
    references.forEach(reference => {
      if (reference.id) {
        referenceNames.push({value: reference.id, label: reference.item.slice(0,70)});
      }
    })
    
    this.setState({
      isEditLinkOpen: !this.state.isEditLinkOpen,
      nodeNames: options,
      referenceNames,
    });

  }

  toggleReferenceModal() {
    this.setState({ isReferenceModalOpen: !this.state.isReferenceModalOpen });
  }

  toggleModelModal() {
    this.setState({ isModelModalOpen: !this.state.isModelModalOpen });
  }

  render() {

    const {
      addedVariables,
      checkboxes,
      collapsedNodes,
      data,
      focusedNodes,
      focusedLinks,
      highlightedLinks,
      highlightedNodes,
      newVariableInput,
      selectedNodeID,
      selectedLinkModels,
      selectedNodeReferences,
      selectedModels,
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

    // render the clickable references + modal for each node
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

    // render all the chips for a collapsed node
    let renderedHiddenNodes;
    if (collapsedNodes && collapsedNodes.length > 0) {
      // get collapsedNodeArray
      const collapsedNode = collapsedNodes.filter(node => node.nodeid === selectedNodeID)[0] || [];
      if (collapsedNode && collapsedNode.nodesRemoved && collapsedNode.nodesRemoved.length > 0) {
        const hiddenNodes = collapsedNode.nodesRemoved || [];
        renderedHiddenNodes = hiddenNodes.map(hiddenNode => {

          // get what type of link it was from collapsedLinks
          let linkType = 'Formula';
          const { collapsedLinks } = this.state;
          const collapsedLinksForNode = collapsedLinks.filter(node => node.nodeid === selectedNodeID)[0] || {};
          if  (collapsedLinksForNode && collapsedLinksForNode.linksRemoved && collapsedLinksForNode.linksRemoved.length > 0) {
            const links = collapsedLinksForNode.linksRemoved || [];
            links.forEach(link => {
              if (link.target.id === selectedNodeID && link.source.id === hiddenNode.id) {
                linkType = link.linkType;
              }
            });
          }


          const chipStyle = {
            backgroundColor: linkType === 'Causal' ? 'rgba(0,255,0, 0.1)' : 'rgba(255,0,0,0.1)',
          }
          if (hiddenNode) {
            return (
              <div className="ChipSpacer">
                <Chip style={chipStyle}>
                  {hiddenNode.name}
                </Chip>
              </div>
            );
          } else {
            return;
          }
  
        });
      }

    }

    let renderedModels;
    if (selectedLinkModels) {
      renderedModels = selectedLinkModels.map((model, index) => {
        return (
          <div className="NodeReference" onClick={this.toggleModelModal}>
            <span style={{textDecoration: 'underline'}}>{model.id}:</span><span>&nbsp;{model.name}</span>
            <Dialog
              title="Model Details"
              actions={editLinkActions}
              modal={false}
              open={this.state.isModelModalOpen}
              onRequestClose={this.toggleModelModal}
            >
              <div className="ModalContent">
                <p><i>{model.name}</i></p>
                <p>ID: {model.id}</p>
                <div> <p>Model Type: {model.type} </p> </div>
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

    let cooldownTime = 15000;
    if (this.state.hasBeenInteractedWith === 'click') {
      cooldownTime = 0;
    } else if (this.state.hasBeenInteractedWith) {
      cooldownTime = 100;
    }

    // render the graph
    let renderedForceGraph = (
      <div id='ontology' className="ForceGraphContainer" style={{overflowY: "hidden", maxHeight: "800px", position: "relative", left: "calc((100% - 1900px) / 2)", }}>
          <ForceGraph2D
            enableNodeDrag
            ref={el => { this.forceGraphRef = el; }}
            graphData={data}
            linkCurvature={link => { return link.curvature; }}
            nodeResolution={16}
            linkResolution={16}
            cooldownTime={cooldownTime}
            width={1900}
            linkWidth={link => {
              if (link.thickness === 1) {
                return 1;
              }
              if (highlightedLinks.indexOf(link) > -1 || focusedLinks.indexOf(link) > -1) {
                return "4";
              } else {
                return "2";
              }
            }}
            linkColor={link => {

              // if node is focused, grey everything else out
              if (focusedLinks.length > 0 || focusedNodes.length > 0) {
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
            nodeLabel=""
            linkLabel="id"
            backgroundColor="transparent"
            // backgroundColor="rgba(0,0,0,0.9)"
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
            onNodeDrag={this.handleInteraction}
            onNodeHover={this.handleNodeHover}
            onLinkHover={this.handleLinkHover}
            onLinkClick={this.handleLinkClick}
            nodeCanvasObject={(node, ctx, globalScale) => {
              let label = node.name.toUpperCase();
              const fontSize = 12/globalScale;
              let isHighlightedNode = highlightedNodes.indexOf(node) > -1;
              let isFocusedNode = focusedNodes.indexOf(node) > -1;

              ctx.font = `500 ${fontSize}px Roboto Sans-Serif`;
              ctx.fillStyle = node.color;
              ctx.beginPath();
              ctx.arc(node.x,node.y,node.value * 3, 0, 2 * Math.PI);

              if (focusedNodes.length > 0) {
                if (selectedNodeID === node.id) {
                  ctx.fillStyle = '#9cfcfa';
                } else if (isFocusedNode) {
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

              if (!this.state.showNoLabels || node.id === selectedNodeID) {
                if (data.nodes.length < 40 || this.getLinksToNode(node.id).length > 20 || isHighlightedNode || isFocusedNode || this.state.showAllLabels) {
                  if (this.getLinksToNode(node.id).length > 20 && label.length > 20) {
                    label = label.slice(0,20) + '...';
                  }
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = "black";

                  let verticleOffset = node.value ? node.value * -4 : -5;
                  if (node.value === 1) {
                    verticleOffset = -5;
                  }
                  ctx.maxWidth = 20;
                  ctx.fillText(label, node.x, node.y + verticleOffset);
                }
              }
            }}
          />
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
        <Container id="toolbar" className="Container" style={{minWidth: "960px"}}>
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
                      <span style={{color: 'rgba(228, 82, 75, 1)'}}>Red link:</span> Formulaic link
                      <br />
                      <span style={{color: 'rgba(131, 198, 72, 1)'}}>Green link:</span> Causal link
                    </Col>     
                  </Paper>
                )}
              </div>
            </Col>
          </Row>
        </Container>
        {renderedForceGraph}
        <Container id="details">
          <Row>
            <Col>
              <div>
                <div className="InfoContainer">
                  <Row>
                    <Col xs={8}>
                      <Snackbar
                        open={this.state.savedToKB}
                        message={this.state.savedToKBMessage}
                        autoHideDuration={4000}
                        onRequestClose={this.handleSnackbarClose}
                      />
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
                              <Checkbox label="Formulaic" checked={this.state.isCheckedFormulaic} onCheck={this.handleCheckedFormulaic} />
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
                              <div className={`InfoLegendLinks link ${influenceString === 'Causal' ? 'causal' : 'formulaic'}`}>
                                <Row>
                                  <Col xs={2}>
                                    <div className="LinksTo">Type</div>
                                    { originString && <div className="LinksTo">Origin</div> }
                                    { renderedModels && renderedModels.length > 0 && <div className="LinksTo">Model</div> }
                                    { renderedNodeReferences && renderedNodeReferences.length > 0 && <div className="LinksTo">Ref.</div> }
                                  </Col>
                                  <Col xs={8}>
                                    { influenceString }
                                    <br />
                                    { originString }
                                    { originString && <br /> }
                                    { renderedModels && renderedModels.length > 0 && renderedModels }
                                    { renderedNodeReferences && renderedNodeReferences.length > 0 && renderedNodeReferences }
                                  </Col>
                                  <Col xs={2} />
                                </Row>
                              </div>
                            )
                          }
                          {
                            selectedType !== 'Link' && renderedNodeReferences && renderedNodeReferences.length > 0 && (
                              <React.Fragment>
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
                                {
                                  renderedHiddenNodes && renderedHiddenNodes.length > 0 && (
                                    <div className="InfoLegendLinks grey">
                                      <Row>
                                        <Col xs={2}>
                                          <div className="LinksTo">Hidden</div>
                                        </Col>
                                        <Col xs={10} className="ChipContainer">
                                          {renderedHiddenNodes}
                                        </Col>
                                      </Row>
                                    </div>
                                  )
                                }

                              </React.Fragment>
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
                                    title={`Create a new link connecting to ${selectedTitle.slice(0,30)}`}
                                    actions={editLinkActions}
                                    modal={false}
                                    open={this.state.isEditLinkOpen}
                                    onRequestClose={this.toggleEditLink}
                                  >
                                    <div className="EditLinkModal">
                                      <div className="EditLinkForm full">
                                        <div className="EditLinkFormLabel"><span> Target&nbsp; </span></div>
                                        <Select
                                          value={this.state.newLinkTarget}
                                          options={this.state.nodeNames}
                                          onChange={this.handleNewLinkTargetSelect}
                                          placeholder="Search by name"
                                        />
                                      </div>
                                      <div className="EditLinkForm">
                                        <div className="EditLinkFormLabel"><span> Link Type &nbsp; </span></div>
                                        <DropDownMenu anchorOrigin={{ vertical: 'center', horizontal: 'middle'}}	className="ToolbarTitle dropdown" value={this.state.editLinkTypeValue} onChange={this.handleLinkTypeChange}>
                                          <MenuItem value="Causal" primaryText="Causal" />
                                          <MenuItem value="Formula" primaryText="Formula" />
                                        </DropDownMenu>
                                      </div>
                                      <div className="EditLinkForm">
                                        <div className="EditLinkFormLabel"><span> Link Origin &nbsp; </span></div>
                                        <DropDownMenu anchorOrigin={{ vertical: 'center', horizontal: 'middle'}} className="ToolbarTitle dropdown" value={this.state.editLinkOriginValue} onChange={this.handleLinkOriginChange}>
                                          <MenuItem value="via Model" primaryText="via Model" />
                                          <MenuItem value="via Opinion" primaryText="via Opinion" />
                                          <MenuItem value="via Reference" primaryText="via Reference" />
                                        </DropDownMenu>
                                      </div>
                                      <div className="EditLinkForm full">
                                        <div className="EditLinkFormLabel"><span> References &nbsp; </span></div>
                                          <CreatableSelect
                                            isMulti
                                            isLoading={this.state.isLoadingNewReference}
                                            isDisabled={this.state.isLoadingNewReference}
                                            value={this.state.newLinkReferences}
                                            options={this.state.referenceNames}
                                            onChange={this.handleNewLinkReferenceSelect}
                                            onCreateOption={this.handleCreateNewReference}
                                            placeholder="Search by title"
                                          />
                                      </div>
                                    </div>
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
