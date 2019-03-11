import React from 'react'
import { IndexRoute, Route, Link, IndexRedirect, Redirect } from 'react-router'

import AppContainer from './containers/App'
import Details from "./components/marketDetail/Details";
import Advanced from "./containers/Advanced";
import AppRouter from "./containers/AppRouter";
import FAQ from "./containers/FAQ";
import Orders from "./containers/Orders";
import Channels from "./containers/Channels";
import ExpiredMarketsContainer from "./containers/ExpiredMarketsContainer";


const routes = (
  <Route component={AppContainer}>
      <Route path='/' component={AppRouter} />
      <Route path='/orders' component={Orders} />
      <Route path='/channels' component={Channels} />
      <Route path='/FAQ' component={FAQ} />
	  <Route path='/expiredMarkets' component={ExpiredMarketsContainer} />
	  <Route path='/advanced/:oid' component={Advanced} />
      <Route path='/:oid' component={Details} />
  </Route>
)

export default routes
