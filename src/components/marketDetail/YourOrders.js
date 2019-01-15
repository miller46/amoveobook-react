import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './YourOrders.css'
import SectionLabel from "../markets/SectionLabel";

import {tokenDecimals, priceDecimals, api} from '../../config'

@CSSModules(styles)
export default class YourOrders extends Component {

	constructor(props) {
		super(props);
	}

	cancel(order) {
		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			amoveo3.currentProvider.send(
				{
						type: "cancel",
						index: order.index,
						ip: api.defaultNodeUrl,
						price: order.price,
						amount: order.amount,
						side: order.side
				}
			);
		}
	}

	render() {
		let rows = [];

		const amoveo3 = window.amoveo3;
		if (amoveo3 && amoveo3.channels && amoveo3.channels.length > 0) {
			const channels = amoveo3.channels;
			for (let i = 0; i < channels.length; i++) {
				let channel = channels[i];
				if (channel.me[1] === amoveo3.coinbase) {
					const bets = channel.me[3];
					for (let j = 1; j < bets.length; j++) {
						const bet = bets[j];

						if (bet[3][2] === oid) {
							const amount = bet[2] / tokenDecimals;
							const price = bet[4][2] / priceDecimals;
							const side = bet[4][1] === 1 ? "true" : "false";

							const cancelable = true;
							// if (JSON.stringify(channel.ssme[j - 1].code) === JSON.stringify([0,0,0,0,4])) {
							//     cancelable = false;
							// }

							const row = {amount: amount, price: price, side: side, index: j - 1, cancelable: cancelable};
							rows.push(row);
						}
					}
				}
			}
		}

		let display;
		if (rows.length === 0) {
			display = <div styleName="OrderContainer">
				<div styleName="OrderRow">
					<p>No orders</p>
				</div>
			</div>
		} else {
			display = <div styleName="OrderContainer">
				<div class="OrderHeader">
					<div>
						<p>Side</p>
					</div>
					<div>
						<p>Price</p>
					</div>
					<di>
						<p>Amount</p>
					</di>
					<div>
						<p>&nbsp;</p>
					</div>
				</div>

				{
					rows.map(function(row, index) {
						return (
							<div styleName="OrderRow">
								<div>
									{row.side}
								</div>
								<div>
									{row.price}
								</div>

								<div>
									{row.amount}
								</div>

								<div>
									{
										row.cancelable
											? <button
												className="btn btn-danger btn-cancel"
												onClick={() => this.cancel(row)}
												>Cancel</button>
											: <div>&nbsp;</div>
									}
								</div>
							</div>
						)
					})
				}
			</div>
		}

		return (
			<div styleName="Orders">
				<SectionLabel
					titleText="Your Orders"
				/>

				{display}
			</div>
		)
	}
}
