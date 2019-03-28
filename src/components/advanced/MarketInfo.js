import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './MarketInfo.css'
import {getDisplayExpires} from "../../utility";
import {priceDecimals, tokenDecimals} from "../../config";


@CSSModules(styles)
export default class MarketInfo extends Component {

	constructor(props) {
		super(props);
		this.state = {
			market: this.props.market,
			height: this.props.height,
			prices: this.props.prices,
			currencyPrefix: this.props.currencyPrefix || "",
			currencySuffix: this.props.currencySuffix || "",
		}
	}

	componentWillReceiveProps(props) {
		this.setState({market: props.market, height: props.height, currencyPrefix: props.currencyPrefix, currencySuffix: props.currencySuffix})
	}

	render() {
		const {market, height, prices, currencyPrefix, currencySuffix} = this.state;

		let expires = "--"
		let question = "--"
		if (market) {
			question = market.question;
			expires = "Expires: " + getDisplayExpires(market.end_block, height);
		}

		let low = 999999999999;
		let high = 0;
		let totalVolume = 0;
		let volumeLast24 = 0;

		const utcOffset = 6 * 60 * 60 * 1000;
		const hours24 = 24 * 60 * 60 * 1000;
		const now = Date.parse(new Date());

		for (let i = 0; i < prices.length; i++) {
			const order = prices[i];

			const price = order.price / priceDecimals;

			if (price > high) {
				high = price;
			}

			if (price < low) {
				low = price;
			}

			const amount = order.buy_amount / tokenDecimals;
			totalVolume = totalVolume + amount;

			const orderDate = Date.parse(order.create_date) - utcOffset
			if (orderDate >= now - hours24) {
				volumeLast24 = volumeLast24 + amount;
			}
		}

		if (low === 999999999999) {
			low = 0;
		}

		const oldVolume = totalVolume - volumeLast24;
		const change = (100 * (volumeLast24 - oldVolume) / oldVolume).toFixed(2);
		const sign = change > 0 ? "+" : "-";
		const changeClass = change > 0 ? "Profit" : "Loss";

		totalVolume = totalVolume.toFixed(2);
		volumeLast24 = volumeLast24.toFixed(2);

		return (
			<div styleName="DetailInfo">
				<div styleName="Card">
					<div styleName="Expires">
						<p>{expires}</p>
					</div>

					<div styleName="Question">
						<p>{question}</p>
					</div>

					<div styleName="Trading">
						<div styleName="Left">
							<p>High: <span styleName="TradingFigure">{currencyPrefix}{high}{currencySuffix}</span></p>
							<p>Low: <span styleName="TradingFigure">{currencyPrefix}{low}{currencySuffix}</span></p>
						</div>
						<div styleName="Right">
							<p>Volume: <span styleName="TradingFigure">{totalVolume} <small>VEO</small></span></p>
							<p>Vol. last 24hrs: <span styleName="TradingFigure">{volumeLast24} <small>VEO</small></span></p>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
