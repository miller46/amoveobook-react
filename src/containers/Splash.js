import React, { Component } from "react";

import MarketsList from "../components/markets/MarketsList";
import ExpiredMarketsList from "../components/markets/ExpiredMarketsList";

export default class Splash extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<MarketsList />

				<ExpiredMarketsList />
			</div>
		)
	}
}
