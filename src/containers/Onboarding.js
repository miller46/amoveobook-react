import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Onboarding.css'
import PropTypes from 'prop-types';

import Email from '../components/onboarding/Email'
import Channel from '../components/onboarding/Channel'
import Wallet from '../components/onboarding/Wallet'
import Locked from '../components/onboarding/Locked'

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
		const amoveo3 = window.amoveo3;

		let body;
		if (!amoveo3) {
			body =
				<Wallet
					onAdvance={this.advanceToChannels}
				/>
		} else if (amoveo3.isLocked) {
			body =
				<Locked
				/>
		} else if (!email) {
			body =
				<Email
					onAdvance={this.advanceToChannels}
				/>
		} else {
			body =
				<Channel
					onAdvance={this.advanceToChannels}
				/>
		}

		return (
			<div styleName="Onboarding">
				<div styleName="Close" onClick={() => this.advanceToSplash()}>
					<p>Close</p>
				</div>
				<div>
					{body}
				</div>
			</div>
		)
	}
}
