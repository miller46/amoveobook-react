import React, { Component } from "react";

import MarketsList from "../components/markets/MarketsList";
import ExpiredMarketsList from "../components/markets/ExpiredMarketsList";
import RequestMarket from "../components/requestMarket/RequestMarket";

export default class Splash extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<MarketsList />

				<ExpiredMarketsList />

				<RequestMarket />
			</div>
		)
	}
}
