import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Wallet.css'
import {AMOVEO3_LOGO_URL} from "../../assets";


@CSSModules(styles)
export default class Wallet extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const isFirefox = typeof InstallTrigger !== 'undefined';
		const url = isFirefox ? "https://addons.mozilla.org/en-US/firefox/addon/amoveo-wallet/" : "https://github.com/johnnycash77/amoveo3-wallet"

		return (
			<div styleName="Wallet">
				<div>
					<img src={AMOVEO3_LOGO_URL} />
				</div>

				<p styleName="Title">Amoveo Wallet Required</p>

				<p styleName="Body">You need an Amoveo wallet to log in and place bets. Amoveo3 Wallet lets you safely store you Veo.</p>

				<a
					href={url}
					target="_blank">
					Install Here
				</a>
			</div>
		)
	}
}
