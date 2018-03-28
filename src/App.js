import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

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

    return (
      <BrowserRouter>
        <Switch>{routes.map(route => routeWithSubRoutes(route))}</Switch>
      </BrowserRouter>
    );
  }
}

export default App;
