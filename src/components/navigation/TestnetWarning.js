import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './TestnetWarning.css'
import {getNetwork} from '../../amoveo3utility'

@CSSModules(styles)
export default class TestnetWarning extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const amoveo3 = window.amoveo3;
		const network = getNetwork(amoveo3);
		const isTestnet = network === "testnet";
		if (isTestnet) {
			return (
				<div styleName="Warning">
					<p>You are the testnet.</p>
				</div>
			)
		} else {
			return null;
		}
	}
}
