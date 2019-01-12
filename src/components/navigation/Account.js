import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Account.css'
import PropTypes from 'prop-types';

@CSSModules(styles)
export default class Account extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
	}

	showOnboarding() {
		localStorage.setItem("onboarding", true);
		this.context.router.push("/")
	}

	render() {
		return (
			<div styleName="Account" onClick={() => this.showOnboarding()}>
				<p>Login</p>
			</div>
		)
	}
}
