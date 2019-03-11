import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Channel.css'
import PropTypes from 'prop-types';

import {api} from '../../config'
import {connect} from "react-redux";
import {setChannelPending} from "../../actions";
import {CHANNEL_PENDING, CHANNEL_PROGRESS} from '../../constants'

const mapStateToProps = (state, ownProps) => {
	return {
		channelPending: state.default.channelPending,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setChannelPending: (value) => {
			dispatch(setChannelPending(value));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class Channel extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {
			amount: 0,
			duration: 0,
			error: "",

		}

		this.onAdvance = this.props.onAdvance.bind(this)
	}

	handleAmountChange(e) {
		this.setState({
			amount: e.target.value
		})
	}

	handleDurationChange(e) {
		this.setState({
			duration: e.target.value
		})
	}

	skip() {
		localStorage.setItem("onboarding", false);
		this.context.router.push("/")
	}

	openPrompt() {
		const instance = this;
		const amoveo3 = window.amoveo3;
		amoveo3.currentProvider.send(
			{
				type: "channel", ip: api[amoveo3.network].nodeUrl, duration: 4000, locked: 1, delay: 100
			} , function(error, channel) {
				if (error) {
					instance.setState({
						error: "An error occurred"
					})
				} else {
					// const data = {amount: 0, duration: 0};
					// createChannel(data, function (error, result) {
					// 	if (error) {
					// 		console.error("Error saving channel")
					// 	} else {
							localStorage.setItem(CHANNEL_PROGRESS, 1);
							localStorage.setItem(CHANNEL_PENDING, true);
							instance.props.setChannelPending(true);
						// }

						instance.onAdvance()
					// })
				}
			})
	}

	render() {
		const {error} = this.state;

		return (
			<div>
				<div>
					<p styleName="Title">New Channel</p>

					<div styleName="TopContainer">
						<div styleName="Explainer">
							<p>You will need to open a payment channel to place bets.</p>

							<div styleName="ButtonContainer">
								<button
									styleName="Button"
									onClick={() => this.openPrompt()}
								>
									Make Channel
								</button>
							</div>
						</div>

						<div styleName="Error">
							{error}
						</div>

						<div
							styleName="Skip"
							onClick={() => this.skip()}>
							<p>Skip For Now</p>
						</div>
					</div>

					<div styleName="BottomContainer">
						<hr />

						<div styleName="Explainer">
							<h5>What is a channel?</h5>

							<p>A channel is similar to opening up a tab. You lock up some VEO for some time period and you can spend or bet that VEO inside the channel and sync up with the blockchain later.</p>
							<p>Channels let you do secure, off-chain transactions that are much faster and cheaper than doing every transaction directly on-chain.</p>
							<p>You can read more about channels <a href="/FAQ#channel" target="_blank">here</a>.</p>

						</div>
					</div>
				</div>

			</div>
		)
	}
}
