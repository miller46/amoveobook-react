import React, { Component } from "react";

import styles from './App.css'
import WelcomeContainer from "../components/markets/WelcomeContainer";
import MarketsList from "../components/markets/MarketsList";
import ExpiredMarketsList from "../components/markets/ExpiredMarketsList";
import CSSModules from "react-css-modules/dist/index";
import RequestMarketPrompt from "../components/requestMarket/RequestMarketPrompt";
import Onboarding from "./Onboarding";
import ChannelPending from "../components/transaction/ChannelPending";


@CSSModules(styles)
export default class Splash extends Component {

	constructor(props) {
		super(props);
		this.state = {
			ipDisabled: false,
			showMarketRequest: false,
		}

		this.hideRequestMarket = this.hideRequestMarket.bind(this)
		this.showRequestMarket = this.showRequestMarket.bind(this)
	}

	showRequestMarket() {
		this.setState({showMarketRequest: true})
	}

	hideRequestMarket() {
		this.setState({showMarketRequest: false})
	}

	render() {
		const {showMarketRequest} = this.state;
		const onboarding = localStorage.getItem("onboarding") === "true";

		return (
			<div styleName="SplashContainer">

				{
					(onboarding || showMarketRequest) &&
					<Onboarding
						showMarketRequest={showMarketRequest}
						onClose={this.hideRequestMarket}
					/>
				}

				<div styleName="LeftPanel">

					<div styleName="TopContainer">
						<ChannelPending />

						<WelcomeContainer />

						<RequestMarketPrompt
							onRequestClick={this.showRequestMarket}
						/>
					</div>

					<MarketsList />

				</div>

				<div styleName="RightPanel">
					<ExpiredMarketsList
						limit={10}
						seeMore={true}
					/>
				</div>
			</div>
		)
	}
}
