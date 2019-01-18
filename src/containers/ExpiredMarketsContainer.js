import React, { Component } from "react";

import ExpiredMarketsList from "../components/markets/ExpiredMarketsList";

export default class ExpiredMarkets extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<ExpiredMarketsList
					limit={0}
				/>
			</div>
		)
	}
}
