import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './YourChannels.css'

import SectionLabel from '../common/SectionLabel'
import {api, tokenDecimals, priceDecimals} from "../../config";
import {getNetwork} from "../../amoveo3utility";
import Loading from "../loading/Loading";
import {download, ssToInternal, sumAmounts, sumBets} from "../../utility"
import {requestProof} from '../../utility/merkle'

@CSSModules(styles)
export default class YourChannels extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			channel: null,
			channelDetail: null,
		}
	}

	componentDidMount() {
		const amoveo3 = window.amoveo3;
		if (!amoveo3) {
			this.setState({loading: false, error: "Amoveo3 not found"})
		} else if (!amoveo3.coinbase) {
			this.setState({loading: false, error: "Amoveo3 is locked"})
		} else {
			const instance = this;
			const address = amoveo3.coinbase;
			const network = getNetwork(amoveo3);

			fetch(api[network].nodeUrl,
				{
					method: 'POST',
					body: JSON.stringify(["spk", address])
				}
			)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				const channel = json[1];

				const trieKey = channel[1][1][6];
				const topHeader = amoveo3.topHeader;
				requestProof(network, topHeader, "channels", trieKey, function(error, result) {
					if (error) {
						console.error(error);
					} else {
						const i = 0;
						instance.setState({loading: false, channel: channel, channelDetail: result})
					}
				})
			}).catch(err => {
				instance.setState({loading: false, error: err.message})
			});
		}
	}

	exportChannel(channel) {
		const cd = channel[1];
		const themSpk = channel[2];

		const spk = themSpk[1];
		const ss = ssToInternal(cd[4]);
		const me = themSpk[1];
		const cid = spk[6];
		const expiration = cd[7];
		const channelData = {"me": me, "them": themSpk, "ssme": ss, "ssthem": ss, "cid": cid, "expiration": expiration, "serverPubKey": me[2]};

		download(JSON.stringify(channelData), "channel_" + new Date() + ".txt", "text/plain");
	}

	render() {
		const {loading, error, channel, channelDetail} = this.state;

		let expires = "";
		let id = "";
		let amount = 0;
		let betAmount = 0;
		let myBalance = 0;
		let serverBalance = 0;
		let betsContainer = <div></div>
		let sortedBets = []

		if (channel && channelDetail) {
			const spk = channel[2][1];
			const bets = spk[3];
			id = channel[1][1][6]
			expires = channel[1][7]
			amount = spk[7];
			betAmount = sumBets(bets);

			myBalance = (channelDetail[4] - amount - betAmount) / tokenDecimals;
			serverBalance = (channelDetail[5] + amount) / tokenDecimals;

			for (let i = 1; i < bets.length; i++) {
				const bet = bets[i];
				const market = bet[3][2];
				const amount = bet[2];
				const price = bet[4][2];

				sortedBets.push([market, amount, price])
			}
		}

		let body;

		if (loading) {
			body = <div>
					<Loading
						lightMode={true}
					/>
				</div>
		} else if (error) {
			body = <div>
				<p>An error occurred.  Please try again later.</p>
			</div>
		} else {
			body = <div>
				<div
					styleName="ChannelRow"
				>
					<div>
						<p>ID: {id}</p>
					</div>
					<div>
						<button
							styleName="Export"
							onClick={() => this.exportChannel(channel)}

						>Export</button>
					</div>
					<div styleName="ChannelHeader">
						<p>Expires: {expires}</p>
					</div>
					<div styleName="ChannelHeader">
						<p>Balance: {myBalance}</p>
					</div>
					<div styleName="ChannelHeader">
						<p>Server Balance: {serverBalance}</p>
					</div>
				</div>

				<div styleName="BetsContainer">
					<div styleName="BetsTitle">
						<p>Bets</p>
					</div>

					<div styleName="ChannelRow">
						<div styleName="ChannelHeader">OID</div>
						<div styleName="ChannelHeader">Amount</div>
						<div styleName="ChannelHeader">Price</div>
					</div>

					<div>
						{
							sortedBets.map(function(bet, index) {
								return (
									<div key={index}>
										<div styleName="ChannelHeader">{bet[0]}</div>
										<div styleName="ChannelHeader">{bet[1] / tokenDecimals} VEO</div>
										<div styleName="ChannelHeader">{bet[2] / priceDecimals} VEO</div>
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		}
		return (
			<div styleName="Container">
				<SectionLabel
					titleText="Your Channels"
				/>

				{body}
			</div>
		)
	}
}
