import React from 'react'
import { IndexRoute, Route, Link, IndexRedirect, Redirect } from 'react-router'

import AppContainer from './containers/App'
import Details from "./components/marketDetail/Details";
import Advanced from "./containers/Advanced";
import AppRouter from "./containers/AppRouter";
import FAQ from "./containers/FAQ";
import ExpiredMarketsContainer from "./containers/ExpiredMarketsContainer";


const routes = (
  <Route component={AppContainer}>
      <Route path='/' component={AppRouter} />
      <Route path='/FAQ' component={FAQ} />
	  <Route path='/expiredMarkets' component={ExpiredMarketsContainer} />
	  <Route path='/advanced/:oid' component={Advanced} />
      <Route path='/:oid' component={Details} />
  </Route>
)

export default routes
