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
import {api} from "../config";

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

		const amoveo3 = window.amoveo3;
		const noWallet = !amoveo3;
		const unlocked = amoveo3 && !amoveo3.isLocked;

		this.state = {
			finishedEmail: false,
			channel: false,
			account: this.props.account,
			noWallet: noWallet,
			unlocked: unlocked,
		}

		this.listener = 0;

		this.advanceToChannels = this.advanceToChannels.bind(this);
		this.advanceToSplash = this.advanceToSplash.bind(this);
	}

	hasChannel() {
		const amoveo3 = window.amoveo3;
		let hasChannel = false;
		if (amoveo3 && amoveo3.channels) {
			const coinbase = amoveo3.coinbase;
			const serverPubkey = api[amoveo3.network].serverPublicKey;
			for (let i = 0; i < amoveo3.channels.length; i++) {
				const channel = amoveo3.channels[i];
				const channelServerPubkey = channel.serverPubKey;
				const channelAddress = channel.me[1];
				if (channelAddress === coinbase && serverPubkey === channelServerPubkey) {
					hasChannel = true;
					break;
				}
			}
		}

		return hasChannel;
	}

	componentWillMount() {
		const instance = this;
		let lastWallet, lastUnlocked;

		if (this.hasChannel()) {
			instance.advanceToSplash();
		} else {
			this.listener = setInterval(function() {
				const amoveo3 = window.amoveo3;
				const noWallet = !amoveo3;
				const unlocked = amoveo3 && !amoveo3.isLocked;
				const hasChannel = instance.hasChannel();

				if (hasChannel) {
					instance.advanceToSplash();
				} else if (lastWallet !== noWallet || lastUnlocked !== unlocked) {
					lastWallet = noWallet;
					lastUnlocked = unlocked;

					instance.setState({
						noWallet,
						unlocked,
					})
				}
			}, 500)
		}
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

		clearInterval(this.listener);
	}

	render() {
		const {finishedEmail, channel, noWallet, unlocked} = this.state;
		const {account} = this.props;

		let body;
		if (noWallet) {
			body =
				<Wallet
					onAdvance={this.advanceToChannels}
				/>
		} else if (!unlocked) {
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
