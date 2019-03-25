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
import {hasChannel} from "../amoveo3utility";
import RequestMarket from "../components/requestMarket/RequestMarket";

const mapStateToProps = (state, ownProps) => {
	return {
		account: state.default.account,
		channelData: state.default.channelData,
		channelLoading: state.default.loading.channelData,
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
			showMarketRequest: this.props.showMarketRequest,
			noWallet: noWallet,
			unlocked: unlocked,
			location: this.props.location,
		}

		this.listener = 0;

		this.advanceToChannels = this.advanceToChannels.bind(this);
		this.advanceToSplash = this.advanceToSplash.bind(this);
		this.close = this.close.bind(this);

		if (this.props.onClose) {
			this.onClose = this.props.onClose.bind(this)
		}
	}

	componentWillMount() {
		const {channelData} = this.props;

		const instance = this;
		let lastWallet, lastUnlocked;

		const amoveo3 = window.amoveo3;
		if (channelData) {
			instance.advanceToSplash();
		} else {
			this.listener = setInterval(function() {
				const noWallet = !amoveo3;
				const unlocked = amoveo3 && !amoveo3.isLocked;

				if (instance.props.channelData) {
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

	hasChannel() {
		const {channelData, channelLoading} = this.props;
		return channelData !== undefined;
	}

	advanceToChannels() {
		this.setState({
			finishedEmail: true,
		})

		const channelExists = this.hasChannel()
		if (channelExists) {
			this.advanceToSplash();
		}
	}

	advanceToSplash() {
		this.setState({
			channel: true,
		})

		localStorage.setItem("onboarding", false);

		const {pathname} = this.props.location;
		this.context.router.push(pathname)

		clearInterval(this.listener);

		if (this.props.onClose) {
			this.props.onClose();
		}

		document.body.style.overflow = "auto";

		// window.location.reload();
	}

	close() {
		this.setState({
			channel: true,
		})

		localStorage.setItem("onboarding", false);
		
		const {pathname} = this.props.location;
		this.context.router.push(pathname)

		clearInterval(this.listener);

		if (this.props.onClose) {
			this.props.onClose();
		}

		document.body.style.overflow = "auto";
	}

	render() {
		const {finishedEmail, channel, noWallet, unlocked, showMarketRequest} = this.state;
		const {account} = this.props;

		document.body.style.overflow = "hidden";

		let body;
		if (showMarketRequest) {
			body =
				<RequestMarket

				/>
		} else if (noWallet) {
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
				<div styleName="Popup">
					<div styleName="Close" onClick={() => this.close()}>
						<p>x</p>
					</div>
					<div>
						{body}
					</div>
				</div>
			</div>
		)
	}
}
