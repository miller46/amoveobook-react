import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Onboarding.css'
import PropTypes from 'prop-types';

import Email from '../components/onboarding/Email'
import Channel from '../components/onboarding/Channel'

@CSSModules(styles)
export default class Onboarding extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {
			email: false,
			channel: false,
		}
	}

	advanceToChannels() {
		this.state = {
			email: true,
		}
	}

	advanceToSplash() {
		this.state = {
			channel: true,
		}
		localStorage.setItem("onboarding", false);
		this.context.router.push("/")
	}

	render() {
		const {email, channel} = this.state;

		if (!email) {
			return (
				<div>
					<Email
						onAdvance={this.advanceToChannels}
					/>
				</div>
			)
		} else {
			return (
				<div>
					<Channel
						onAdvance={this.advanceToChannels}
					/>
				</div>
			)
		}
	}
}
