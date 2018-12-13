import React from 'react'
import { IndexRoute, Route, Link, IndexRedirect, Redirect } from 'react-router'

import AppContainer from './containers/App'
import Splash from './containers/Splash'
import Details from "./containers/Details";
import MarketsList from "./components/markets/MarketsList";


const routes = (
  <Route component={AppContainer}>
    <Route path='/' component={Splash} />
    <Route path='/details' component={Details} />
  </Route>
)

export default routes
