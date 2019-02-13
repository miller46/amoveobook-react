import React, { Component } from "react";

import styles from './App.css'
import WelcomeContainer from "../components/markets/WelcomeContainer";
import MarketsList from "../components/markets/MarketsList";
import ExpiredMarketsList from "../components/markets/ExpiredMarketsList";
import RequestMarket from "../components/requestMarket/RequestMarket";
import CSSModules from "react-css-modules/dist/index";


@CSSModules(styles)
export default class Splash extends Component {

	constructor(props) {
		super(props);
		this.state = {
			ipDisabled: false,
		}
	}

	render() {
		return (
			<div styleName="SplashContainer">
				<WelcomeContainer />

				<MarketsList />

				<hr />

				<ExpiredMarketsList
					limit={3}
					seeMore={true}
				/>

				<hr />

				<RequestMarket />
			</div>
		)
	}
}
