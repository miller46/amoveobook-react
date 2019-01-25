import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './USWarning.css'

@CSSModules(styles)
export default class Warning extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const showWarning =
			localStorage.getItem("agreedUS") === "true"
			|| localStorage.getItem("isNotUS") !== "true" ;


		if (showWarning) {
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
