import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './USWarning.css'
import {getNetwork} from '../../amoveo3utility'

@CSSModules(styles)
export default class Warning extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const showWarning =
			localStorage.getItem("agreedUS") === "true"
			|| localStorage.getItem("isNotUS") === "false" ;

		const isTestnet = getNetwork(window.amoveo3) === "testnet";

		if (showWarning && !isTestnet) {
			return (
				<div styleName="Warning">
					<p>We cannot provide service to US customers at this time. You may view the markets but cannot place any bets.</p>
				</div>
			)
		} else {
			return null;
		}
	}
}
