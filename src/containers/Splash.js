import React, { Component } from "react";

import styles from './App.css'
import WelcomeContainer from "../components/markets/WelcomeContainer";
import MarketsList from "../components/markets/MarketsList";
import ExpiredMarketsList from "../components/markets/ExpiredMarketsList";
import CSSModules from "react-css-modules/dist/index";
import RequestMarketPrompt from "../components/requestMarket/RequestMarketPrompt";


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
				<div styleName="TopContainer">
					<WelcomeContainer />

					<RequestMarketPrompt />
				</div>

				<MarketsList />

				<ExpiredMarketsList
					limit={3}
					seeMore={true}
				/>

			</div>
		)
	}
}
