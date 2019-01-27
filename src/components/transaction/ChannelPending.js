import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './ChannelPending.css'
import {api} from "../../config";

@CSSModules(style)
export default class ChannelPending extends Component {

	constructor(props) {
		super(props);

		this.channelCheck = 0;
		this.countDown = 0;

		const channelPending = localStorage.getItem("channelPending") === "true";
		if (channelPending) {
			this.beginCountdown();
			this.beginTxChecker();
		}

		this.state = {
			progress: parseInt(localStorage.getItem("channelProgress")) || 1,
			duration: 420,
			showPending: channelPending,
			showConfirmation: false,
		}
	}

	// TODO this should just be a channel sync instead, and alert the user if they have an old state
	checkForTxs(instance) {
		if (window.amoveo3) {
			const address = amoveo3.coinbase;
			const network = amoveo3.network;
			fetch(api[network].nodeUrl,
				{
					method: 'POST',
					body: JSON.stringify(["txs"])
				}
			)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				const txs = json[1];
				let txPending = false;
				for (let i = 1; i < txs.length; i++) {
					const tx = txs[i][1];
					if (tx && tx.length > 1 && tx[0] === "nc" && tx[1] === address) {
						txPending = true;
						break;
					}
				}

				if (!txPending) {
					localStorage.setItem("channelProgress", 0);
					localStorage.setItem("channelPending", false);
					instance.setState({showPending: false, showConfirmation: true});
					clearInterval(instance.channelCheck);
					clearInterval(instance.countDown);
				}
			})
			.catch(err => {
				console.log(err);
			});
		}
	}

	beginCountdown() {
		const instance = this;
		instance.countdown = setInterval(function() {
			const {progress} = instance.state;
			if (progress < 410) {
				localStorage.setItem("channelProgress", progress + 1);
				instance.setState({progress: progress + 1})
			}
		}, 1000)
	}

	beginTxChecker() {
		const instance = this;
		instance.checkForTxs(instance);
		instance.channelCheck = setInterval(function () {
			instance.checkForTxs(instance)
		}, 60000)
	}

	render() {
		const {showPending, showConfirmation, progress, duration} = this.state;

		if (showPending) {
			return (
				<div styleName="ChannelPending">
					<p>Channel Pending... (this may take a few minutes)</p>
					<div className="progress">
						<div
							style={{width: (100 * progress / duration) + "%"}}
							className="progress-bar progress-bar-striped progress-bar-animated bg-warning"
							role="progressbar"
							aria-valuenow={progress}
							aria-valuemin="0"
							aria-valuemax={duration}>
						</div>
					</div>
				</div>
			)
		} else if (showConfirmation) {
			return <div styleName="ChannelSuccess">
				<div className="alert alert-success alert-dismissible fade show" role="alert">
					<strong>Channel created!</strong> You can now make bets.
					<button type="button" className="close" data-dismiss="alert" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
			</div>
		} else {
			return null;
		}
	}
}
