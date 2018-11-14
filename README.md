## Overview

This project is a visualisation tool for an ontology as defined by the FinanceIT group at UNSW.

It is built with:
  React.js(Create-React-App),
  Node.js
  React-Force-Graph
Data is currently in the form of .csv files located in /src/utils

## Instructions to run

Install ```node.js ``` https://nodejs.org/en/download/
Install the dependency manager ```yarn``` https://yarnpkg.com/en/docs/install
Clone into the repository
Install all dependencies with ```yarn install```
Start the server with ```yarn start```
Visit the page on ```localhost:3000/model-builder```

## Relevant Documentation

React-Force-Graph on how to manipulate the graph https://github.com/vasturiano/react-force-graph 

## Structure

Once on the model builder page, a call is made to the utility functions in ```src/utils/ImportData.js``` which imports and transforms the data from .csv files.

The data format for the graphing library is very specific so the transformation is necessary.

When the importing is done, a callback is made to ModelBuilder and the data is saved to the state. Any manipulations on the data (e.g filtering the nodes) are handled by updating the state.

## Future work

Most of the business logic can be found in the model builder file, ```/src/containers/ModelBuilder/index.js```, to make things easier to work on, it would be best to separate out the different interface elements into their own components.