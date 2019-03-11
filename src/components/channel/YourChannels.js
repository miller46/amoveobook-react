import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './YourChannels.css'

import SectionLabel from '../common/SectionLabel'
import {api} from "../../config";
import {getNetwork} from "../../amoveo3utility";
import Loading from "../loading/Loading";
import {download, ssToInternal} from "../../utility"

@CSSModules(styles)
export default class YourChannels extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			channel: {

			},
		}
	}

	componentDidMount() {
		const amoveo3 = window.amoveo3;
		if (amoveo3) {
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
				instance.setState({loading: false, channel: channel})
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
		const channelData = {"me": me, "them": themSpk, "ssme": ss, "ssthem": ss, "cid": cid, "expiration": expiration, "serverPubkey": me[2]};

		download(JSON.stringify(channelData), "channel_" + new Date() + ".txt", "text/plain");
	}

	render() {
		const {loading, error, channel} = this.state;

		let body
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
						<p>ID: {channel[1][1][6]}</p>
					</div>
					<div>
						<button
							styleName="Export"
							onClick={() => this.exportChannel(channel)}

						>Export</button>
					</div>
					<div styleName="ChannelHeader">
						<p>Expires:</p>
					</div>
					<div styleName="ChannelHeader">
						<p>Balance</p>
					</div>
					<div styleName="ChannelHeader">
						<p>Spendable</p>
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
