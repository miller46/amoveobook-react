import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './TestnetWarning.css'

@CSSModules(styles)
export default class TestnetWarning extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="Warning">
				<p>You are the testnet.</p>
			</div>
		)
	}
}
