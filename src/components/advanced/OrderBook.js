import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './OrderBook.css'
import {priceDecimals, tokenDecimals} from "../../config";

@CSSModules(style)
export default class OrderBook extends Component {

	constructor(props) {
		super(props);
		this.state = {
			buys: this.props.buys,
			sells: this.props.sells,
			marketType: this.props.marketType,
			upperBound: parseFloat(this.props.upperBound),
			lowerBound: parseFloat(this.props.lowerBound),
		}

		if (this.props.onSelectRow) {
			this.onSelectRow = this.props.onSelectRow.bind(this)
		}
	}

	componentDidMount() {
		const container = document.getElementById("order-container")
		if (container) {
			const max = container.offsetHeight
			container.scrollTop = (container.scrollHeight - max) / 2;
		}
	}

	onRowClick(side, amount, price) {
		const orderSide = side === "long" ? "sell" : "long";
		this.props.onSelectRow(orderSide, amount, price);
	}

	render() {
		const instance = this;

		let {buys, sells, marketType, upperBound, lowerBound} = this.state;

		let sortedBuys = [];
		let sortedSells = [];

		let lastBuyPrice = -1;
		for (let t = 0; t < buys.length; t++) {
			const buy = buys[t];
			const price = buy[0];
			const amount = buy[1];
			if (buy[0] === lastBuyPrice) {
				const buyLength = sortedBuys.length - 1;
				sortedBuys[buyLength][1] = sortedBuys[buyLength][1] + amount;
			} else {
				sortedBuys.push([price, amount])
			}
			lastBuyPrice = price;
		}

		let lastSellPrice = -1;
		for (let m = 0; m < sells.length; m++) {
			const sell = sells[m];
			const price = sell[0];
			const amount = sell[1];
			if (sell[0] === lastSellPrice) {
				const sellLength = sortedSells.length - 1;
				sortedSells[sellLength][1] = sortedSells[sellLength][1] + amount;
			} else {
				sortedSells.push([price, amount])
			}
			lastSellPrice = price;
		}

		sortedBuys = sortedBuys.reverse();
		sortedSells = sortedSells.reverse();

		if (sortedBuys.length === 0 && sortedSells.length === 0) {
			return <div styleName="OrderBookContainer">
				<div styleName="NoOrders">
					<p>No orders in this market yet</p>
				</div>
			</div>
		} else {
			return (
				<div id="order-container" styleName="OrderBookContainer">
					<div styleName="OrderBookHeader">
						<div>
							<p>Amount</p>
						</div>
						<div>
							<p>Price</p>
						</div>
					</div>

					<div styleName="OrdersContainer">
						<div id="SellContainer" styleName="Sells">
							{
								sortedSells.map(function (sell, index) {
									const amount = sell[1] / tokenDecimals;
									let price = sell[0] / priceDecimals;

									let displayPrice = price;
									if (marketType === "scalar") {
										displayPrice = price * (upperBound - lowerBound);
										displayPrice = parseFloat(displayPrice.toFixed(4))
									}

									return (
										<div
											styleName="SellRow"
											key={index}
											onClick={() => instance.onRowClick("short", amount, price)}
										>
											<div styleName="Amount">
												{amount}
											</div>
											<div>
												{displayPrice}
											</div>
										</div>
									)
								})
							}
						</div>

						<div styleName="Spread">

						</div>

						<div styleName="Buys">
							{
								sortedBuys.map(function (buy, index) {
									const amount = buy[1] / tokenDecimals;
									let price = buy[0] / priceDecimals;

									let displayPrice = price;
									if (marketType === "scalar") {
										displayPrice = price * (upperBound - lowerBound);
										displayPrice = parseFloat(displayPrice.toFixed(4))
									}

									return (
										<div
											styleName="BuyRow"
											key={index}
											onClick={() => instance.onRowClick("long", amount, price)}
										>
											<div styleName="Amount">
												{amount}
											</div>
											<div>
												{displayPrice}
											</div>
										</div>
									)
								})
							}
						</div>
					</div>
				</div>
			)
		}
	}
}
