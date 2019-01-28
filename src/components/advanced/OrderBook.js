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
		}

		if (this.props.onSelectRow) {
			this.onSelectRow = this.props.onSelectRow.bind(this)
		}
	}

	componentDidMount() {
		const container = document.getElementById("order-container")
		const max = container.offsetHeight
		container.scrollTop = (container.scrollHeight - max) / 2;
	}

	onRowClick(side, price, amount) {
		const orderSide = side === "long" ? "sell" : "long";
		this.props.onSelectRow(orderSide, price, amount);
	}

	render() {
		const instance = this;

		let {buys, sells} = this.state;

		let sortedBuys = [];
		let sortedSells = [];

		let lastBuyPrice = -1;
		for (let t = 0; t < buys.length; t++) {
			const buy = buys[t];
			const price = buy[0];
			const amount = buy[1];
			if (buy[0] === lastBuyPrice) {
				const index = sortedBuys.length - 1;
				sortedBuys[index][1] = sortedBuys[index][1] + amount;
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
				const index = sortedSells.length - 1;
				sortedSells[index][1] = sortedBuys[index][1] + amount;
			} else {
				sortedSells.push([price, amount])
			}
			lastSellPrice = price;
		}

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
									const price = sell[0] / priceDecimals;
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
												{price}
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
									const price = buy[0] / priceDecimals;
									return (
										<div
											styleName="BuyRow"
											key={index}
											onClick={() => instance.onRowClick("long", amount, price)}
										>
											<div styleName="Amount">
												{buy[1] / tokenDecimals}
											</div>
											<div>
												{buy[0] / priceDecimals}
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
