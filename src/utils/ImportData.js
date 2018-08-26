import { csv } from 'd3-fetch';
import variableFile from './example2.csv';
import linkFile from './links.csv';
import referenceFile from './references.csv';

function ImportData(callback) {
  const graph = {
    nodes: [],
    links: [],
    concepts: [],
  };

  //build nodes
  csv(variableFile).then(function(data) {
    for (const datapoint in data) {
      const variable = data[datapoint];

      if (variable.name) {
        graph.nodes.push({
          id: variable["variable ID"],
          name: variable.name,
          reference: variable['Origin-Reference'] || '',
          concept_1: variable["Concept 1"] || '',
          concept_2: variable["Concept 2"] || '',
          concept_3: variable["Concept 3"] || '',
          value: 1,

        });

        if (graph.concepts.indexOf(variable["Concept 1"]) === -1) {
          graph.concepts.push(variable["Concept 1"]);
        }
        if (graph.concepts.indexOf(variable["Concept 2"]) === -1) {
          graph.concepts.push(variable["Concept 2"]);
        }
        if (graph.concepts.indexOf(variable["Concept 3"]) === -1) {
          graph.concepts.push(variable["Concept 3"]);
        }
      }
    }
    
    //build links
    importLinks((links) => {
      graph.links = links;
      return callback(graph) || null;
    });

    // graph.links.push({
    //   source: 'VID00001',
    //   target: 'VID00002',
    //   linkType: 'Causal',
    //   linkOrigin: 'via reference',
    //   value: 10,
    // })

    // console.log(graph);

    // return callback(graph) || null;
  });
}

function importLinks(callback) {
  const links = [];
  csv(linkFile).then(function(data) {
    for (const datapoint in data) {
      const link = data[datapoint];
      if (link['Var 1']) {
        links.push({
          source: link['Var 2'],
          target: link['Var 1'],
          linkType: link['Link Type'],
          linkOrigin: link['Link Origin - Ref'] ? 'via reference' : 'via model',
          reference: link['Link Origin - Ref'] || '',
          model: link['Link Origin - Model'] || '',
        });
      }
    }
    return callback(links) || null;
  });
}

function ImportReferences(callback) {
  const references = [];
  csv(referenceFile).then(function(data) {
    for (const datapoint in data) {
      const reference = data[datapoint];
      if (reference.ID) {
        references.push({
          id: reference.ID,
          item: reference.Item,
        });
      }
    }
    return callback(references) || null;
  });
}

export { ImportData, ImportReferences };