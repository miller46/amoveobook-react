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
			marketType: this.props.marketType,
			upperBound: parseFloat(this.props.upperBound),
			lowerBound: parseFloat(this.props.lowerBound),
		}
	}

	render() {
		const {prices, marketType, upperBound, lowerBound} = this.state;

		let display;
		if (prices.length === 0) {
			display =
				<div styleName="NoOrders">
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
						prices.map(function(order, index) {
							let price = order.price / priceDecimals
							if (marketType === "scalar") {
								price = price * (upperBound - lowerBound);
								price = parseFloat(price.toFixed(4))
							}

							return (
								<div styleName="HistoryRow" key={index}>
									<div>
										{order.buy_amount / tokenDecimals}
									</div>
									<div>
										{price}
									</div>
									<div>
										{order.timestamp}
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
