import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Categories from './containers/Categories';
import Home from './containers/Home'
import HousingPrices from './containers/HousingPrices'
import ModelBuilder from './containers/ModelBuilder'

import './App.css';

class App extends Component {

  render() {
    const routes = [
      {
        path: "/categories",
        component: Categories,
      },
      {
        path: "/housing-prices",
        component: HousingPrices,
      },
      {
        path: "/model-builder/3d",
        component: ModelBuilder,
        exact: true,
      },
      {
        path: "/model-builder",
        component: ModelBuilder,
      },
      {
        path: "/",
        exact: true,
        component: Home,
      }
    ];

    const routeWithSubRoutes = route => {
      let is3D = false;
      if (route.path.indexOf('3d') > -1) {
        is3D = true;
      }
      return (
        <Route
          path={route.path}
          render={props => (
            // pass the sub-routes down to keep nesting

            <route.component {...props} is3D={is3D} routes={route.routes} />
          )}
        />
      );
    };

    const muiTheme = lightBaseTheme;
    muiTheme.palette.accent1Color = "rgb(11, 179, 214)";

    // console.log('dark base theme', darkBaseTheme);

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(muiTheme)}>
        <BrowserRouter>
          <Switch>{routes.map(route => routeWithSubRoutes(route))}</Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
