import React, { Component } from "react";
import CSSModules from "react-css-modules/dist/index";
import styles from './RequestMarketPrompt.css'

@CSSModules(styles)
export default class RequestMarketPrompt extends Component {

	constructor(props) {
		super(props);
	}

	showRequestMarketDialog() {

	}

	render() {
		const instance = this;
		return (
			<div styleName="Container">
				<button
					onClick={() => instance.showRequestMarketDialog()}
					styleName="Button">+ Request Market</button>

				<p>Have an idea for a market you would like to see? Let us know.</p>
			</div>
		)
	}
}
