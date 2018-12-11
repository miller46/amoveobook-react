import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './AmoveoExchangeLink.css'

@CSSModules(styles)
export default class AmoveoExchangeLink extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="AmoveoExchangeLink">
				<a id="amoveo-exchange-button" href="https://amoveo.exchange/?ref=amoveobook" target="_blank">
					<p id="amoveo-exchange-button" styleName="AmoveoExchangeCTA">Get VEO</p>
					<p styleName="AmoveoExchangeLogo">Amoveo.exchange</p>
				</a>
			</div>
		)
	}
}
