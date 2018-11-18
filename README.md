## Overview

This project is a visualisation tool for an ontology as defined by the FinanceIT group at UNSW.  
  
It is built with:  
  - React.js(Create-React-App),  
  - Node.js  
  - React-Force-Graph  
  - React-Router  
Data is currently in the form of .csv files located in /src/utils

## Instructions to run

1. Install ```node.js ``` https://nodejs.org/en/download/  
2. Install the dependency manager ```yarn``` https://yarnpkg.com/en/docs/install  
3. Clone into the repository  
4. Install all dependencies with ```yarn install```  
5. Start the server with ```yarn start```  
6. Visit the page on ```localhost:3000/model-builder```  

## Relevant Documentation

- React.js tutorial https://reactjs.org/tutorial/tutorial.html  
- React-Force-Graph on how to manipulate the graph https://github.com/vasturiano/react-force-graph  
- An excellent React.js debugging tool is the chrome extension React Developer Tools https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en which allows you to see the state and props of each component during run time.

## Structure

Once on the model builder page, a call is made to the utility functions in ```src/utils/ImportData.js``` which imports and transforms the data from .csv files. If the structure of the .csv files changes, you must edit the import functions in ImportData.js.  
  
The data format for the graphing library is very specific so the transformation is necessary.  
  
When the importing is done, a callback is made to ModelBuilder and the data is saved to the state. Any manipulations on the data (e.g filtering the nodes) are handled by updating the state.  
  
In the state, there is an object of the form:  
```this.state.data = { nodes: [], links: [], concepts: []}```  
- To add a new node("Variable") without updating all the positions of the other nodes, you can just push to that array. ```nodes.push(newNode)```  
- To add a new node and update the entire graph, you can create a new array by destructuring the old one. ```let newNodes = [...nodes, newNode]```, the library will treat this as a new array.  

Routing is handled in App.js, to add new routes e.g ```/measure-view``` you can simply add it to the ```routes``` array.

## Future work

Most of the business logic can be found in the model builder file, ```/src/containers/ModelBuilder/index.js```, to make things easier to work on, it would be best to separate out the different interface elements into their own components.

If the ontology is to be shown in 3 dimensions, experiment with React-Force-Graph's 3D implementation, a very simple demonstraction is available at ```localhost:3000/model-builder/3d```