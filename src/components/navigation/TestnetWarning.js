import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './TestnetWarning.css'

@CSSModules(styles)
export default class TestnetWarning extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const amoveo3 = window.amoveo3;
		const isTestnet = amoveo3 && amoveo3.network === "testnet";
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
