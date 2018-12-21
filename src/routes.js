import React from 'react'
import { IndexRoute, Route, Link, IndexRedirect, Redirect } from 'react-router'

import AppContainer from './containers/App'
import Splash from './containers/Splash'
import Details from "./components/marketDetail/Details";
import Advanced from "./containers/Advanced";


const routes = (
  <Route component={AppContainer}>
      <Route path='/' component={Splash} />
	  <Route path='/advanced' component={Advanced} />
      <Route path='/:oid' component={Details} />
  </Route>
)

export default routes
