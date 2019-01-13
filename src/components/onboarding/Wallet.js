import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Wallet.css'
import {EXTENSION_GUIDE_URL} from "../../assets";

import SectionLabel from "../markets/SectionLabel";

@CSSModules(styles)
export default class Wallet extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="Wallet">
				<SectionLabel titleText="Amoveo Wallet Required" />

				<div className="clearfix">
					<div styleName="LeftPanel">
						<img alt="" src={EXTENSION_GUIDE_URL} />
					</div>
					<div styleName="RightPanel">
						<p>You need an Amoveo wallet to log in and place bets.</p>
						<p>Amoveo3 Wallet lets you safely store your veo.</p>
						<a
							href="https://chrome.google.com/webstore/detail/amoveo-wallet/hfojlfflnlmfjhddgodpmophmhpimahi?hl=en"
							target="_blank">
							Install for Chrome here.
						</a>
					</div>
				</div>
			</div>
		)
	}
}
