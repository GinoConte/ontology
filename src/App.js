import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Categories from './containers/Categories';
import Home from './containers/Home'
import HousingPrices from './containers/HousingPrices'
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
        path: "/",
        exact: true,
        component: Home,
      }
    ];

    const routeWithSubRoutes = route => (
      <Route
        path={route.path}
        render={props => (
          // pass the sub-routes down to keep nesting
          <route.component {...props} routes={route.routes} />
        )}
      />
    );

    const muiTheme = darkBaseTheme;
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
