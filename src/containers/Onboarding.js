import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Onboarding.css'
import PropTypes from 'prop-types';

import Email from '../components/onboarding/Email'
import Channel from '../components/onboarding/Channel'
import Wallet from '../components/onboarding/Wallet'
import Locked from '../components/onboarding/Locked'
import {getAccount, getIp} from "../actions";
import {connect} from "react-redux";

const mapStateToProps = (state, ownProps) => {
	return {
		account: state.default.account,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getAccount: (address) => {
			dispatch(getAccount(address));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class Onboarding extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {
			finishedEmail: false,
			channel: false,
			account: this.props.account,
		}

		this.advanceToChannels = this.advanceToChannels.bind(this);
		this.advanceToSplash = this.advanceToSplash.bind(this);
	}

	advanceToChannels() {
		this.setState({
			finishedEmail: true,
		})
	}

	advanceToSplash() {
		this.setState({
			channel: true,
		})
		localStorage.setItem("onboarding", false);
		this.context.router.push("/")
	}

	render() {
		const {finishedEmail, channel} = this.state;
		const {account} = this.props;

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
		} else if (!finishedEmail && !account) {
			body =
				<Email
					onAdvance={this.advanceToChannels}
				/>
		} else {
			body =
				<Channel
					onAdvance={this.advanceToSplash}
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
