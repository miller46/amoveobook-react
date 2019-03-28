import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './MarketDetailCard.css'
import {priceDecimals, tokenDecimals} from "../../config";
import {getAccount, getActiveMarkets, getChannelData, getHeight, getMarket} from "../../actions";
import {connect} from "react-redux";

const mapStateToProps = (state, ownProps) => {
	const oid = ownProps.oid;
	return {
		activeMarkets: state.default.activeMarkets,
		marketDetail: state.default.marketDetails[oid],
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getMarket: (network, oid) => {
			dispatch(getMarket(network, oid));
		},
		getActiveMarkets: (options) => {
			dispatch(getActiveMarkets(options));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class MarketDetailCard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			oid: this.props.oid,
			height: this.props.height,
			prices: this.props.prices,
			currencyPrefix: this.props.currencyPrefix || "",
			currencySuffix: this.props.currencySuffix || "",
		}
	}

	componentWillReceiveProps(props) {
		this.setState({oid: props.oid, height: props.height, currencyPrefix: props.currencyPrefix, currencySuffix: props.currencySuffix})
	}

	render() {
		const {oid, height, currencyPrefix, currencySuffix} = this.state;

		const {activeMarkets, marketDetail} = this.props;

		let market;
		for (let i = 0; i < activeMarkets.length; i++) {
			let activeMarket = activeMarkets[i];
			if (activeMarket.oid === oid) {
				market = activeMarket;
				break;
			}
		}

		let question = "--"
		if (market) {
			question = market.question;
		}

		let prices = [];
		if (marketDetail) {
			prices = marketDetail.matchedOrders;
		}

		let low = 999999999999;
		let high = 0;
		let totalVolume = 0;
		let volumeLast24 = 0;

		const utcOffset = 5 * 60 * 60 * 1000;
		const hours24 = 24 * 60 * 60 * 1000;
		const now = Date.parse(new Date());

		for (let i = 0; i < prices.length; i++) {
			const order = prices[i];

			const price = 100 * order.price / priceDecimals;

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

		low = low.toFixed(2);
		high = high.toFixed(2);
		totalVolume = totalVolume.toFixed(2);
		volumeLast24 = volumeLast24.toFixed(2);

		return (
			<div styleName="DetailInfo">
				<div styleName="Question">
					<p>{question}</p>
				</div>

				<div styleName="Trading">
					<div styleName="Left">
						<p>High: <span styleName="TradingFigure">{currencyPrefix}{high}{currencySuffix}</span></p>
						<p>Low: <span styleName="TradingFigure">{currencyPrefix}{low}{currencySuffix}</span></p>
					</div>
					<div styleName="Right">
						<p>Volume: <span styleName="TradingFigure">{totalVolume} VEO</span></p>
						<p>Vol. last 24hrs: <span styleName="TradingFigure">{volumeLast24} VEO</span></p>
					</div>
				</div>
			</div>
		)
	}
}
