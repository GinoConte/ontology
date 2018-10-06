import { csv } from 'd3-fetch';
import variableFile from './example2.csv';
import linkFile from './links.csv';
import referenceFile from './references.csv';
import peopleFile from './people.csv';
import measureFile from './measures.csv';

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

      //spelling corrections
      if (variable["Concept 2"] === 'Macroeconomiucs') {
        variable["Concept 2"] = 'Macroeconomics';
      }

      //scale value based on amount of references
      let references = variable['Origin-Reference'] ? variable['Origin-Reference'].split(',').length : 0;
      if (references === 0)
        references = 1;

      if (references > 1) {
        console.log('large variables: ' + references, variable.name );
      }

      if (variable.name) {
        graph.nodes.push({
          id: variable["variable ID"],
          name: variable.name,
          reference: variable['Origin-Reference'] || '',
          concept_1: variable["Concept 1"] || '',
          concept_2: variable["Concept 2"] || '',
          concept_3: variable["Concept 3"] || '',
          value: references,
          color: "rgba(11, 179, 214, 1)",
        });

        if (graph.concepts.indexOf(variable["Concept 1"]) === -1 && variable["Concept 1"] !== '') {
          graph.concepts.push(variable["Concept 1"]);
          // graph.concepts.push({value: variable["Concept 1"].toLowerCase(), label: variable["Concept 1"]});
        }
        if (graph.concepts.indexOf(variable["Concept 2"]) === -1 && variable["Concept 2"] !== '') {
          graph.concepts.push(variable["Concept 2"]);
          // graph.concepts.push({value: variable["Concept 2"].toLowerCase(), label: variable["Concept 2"]});
        }
        if (graph.concepts.indexOf(variable["Concept 3"]) === -1 && variable["Concept 3"] !== '') {
          graph.concepts.push(variable["Concept 3"]);
          // graph.concepts.push({value: variable["Concept 3"].toLowerCase(), label: variable["Concept 3"]});
        }
      }
    }
    
    //build links
    importLinks((links) => {
      graph.links = links;
      return callback(graph) || null;
    });
  });
}

function importLinks(callback) {
  const links = [];
  csv(linkFile).then(function(data) {
    for (const datapoint in data) {
      const link = data[datapoint];
      if (link['Var 1']) {
        links.push({
          id: link['Var Link ID'],
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
          authors: reference['Authors ID'],
        });
      }
    }
    return callback(references) || null;
  });
}

function ImportPeople(callback) {
  const people = [];
  csv(peopleFile).then(function(data) {
    for (const datapoint in data) {
      const person = data[datapoint];
      if (person['People ID']) {
        people.push({
          id: person['People ID'],
          fullName: person['Full name'],
          fname: person['First Name'],
          lname: person['Last Name'],
          affiliation: person.Affiliation,
        });
      }
    }
    return callback(people) || null;
  });
}

function ImportMeasures(callback) {
  const graph = {
    nodes: [],
    links: [],
    concepts: [],
  };
  csv(measureFile).then(function(data) {
    for (const datapoint in data) {
      const measure = data[datapoint];
      if (measure['Measure ID']) {
        graph.nodes.push({
          id: measure['Measure ID'],
          name: measure['Measure Name'],
          reference: measure['Datasource-Reference'] || '',
          value: 2,
          color: "#ffa100",
        });
      }
    }
    return callback(graph) || null;
  });
}

export { ImportData, ImportReferences, ImportPeople, ImportMeasures };