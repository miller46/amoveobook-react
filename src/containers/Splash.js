import React, { Component } from "react";

import MarketsList from "../components/markets/MarketsList";
import ExpiredMarketsList from "../components/markets/ExpiredMarketsList";
import RequestMarket from "../components/requestMarket/RequestMarket";
import Footer from "../components/footer/Footer";

export default class Splash extends Component {

	constructor(props) {
		super(props);
		this.state = {
			ipDisabled: false,
		}
	}

	render() {
		return (
			<div>
				<MarketsList />

				<ExpiredMarketsList />

				<RequestMarket />

				<Footer />
			</div>
		)
	}
}
