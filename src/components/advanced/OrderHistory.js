import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './OrderHistory.css'
import {priceDecimals, tokenDecimals} from "../../config";

@CSSModules(style)
export default class OrderHistory extends Component {

	constructor(props) {
		super(props);
		this.state = {
			prices: this.props.prices,
		}
	}

	render() {
		const {prices} = this.state;

		let display;
		if (prices.length === 0) {
			display =
				<div styleName="HistoryRow">
					<p>No orders in this market yet</p>
				</div>
		} else {
			display = <div>
				<div styleName="HistoryHeader">
					<div>
						<p>Amount</p>
					</div>
					<div>
						<p>Price</p>
					</div>
					<div>
						<p>Time</p>
					</div>
				</div>

				<div styleName="HistoryRows">
					{
						prices.map(function(price, index) {
							return (
								<div styleName="HistoryRow" key={index}>
									<div>
										{price.buy_amount / tokenDecimals}
									</div>
									<div>
										{price.price / priceDecimals}
									</div>
									<div>
										{price.timestamp}
									</div>
								</div>
							)
						})
					}
				</div>
			</div>
		}

		return (
			<div styleName="HistoryContainer">
				{display}
			</div>
		)
	}
}
