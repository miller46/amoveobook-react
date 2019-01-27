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
	}

	render() {
		let {buys, sells} = this.state;

		let sortedBuys = [];
		let sortedSells = [];

		if (buys.length > 1) {
			let lastPrice = -1;
			for (let t = 0; t < buys.length; t++) {
				const buy = buys[t];
				const price = buy[0];
				const amount = buy[1];
				if (buy[0] === lastPrice) {
					const index = sortedBuys.length - 1;
					sortedBuys[index][1] = sortedBuys[index][1] + amount;
				} else {
					sortedBuys.push([price, amount])
				}
				lastPrice = price;
			}
		}

		if (sells.length > 1) {
			let lastPrice = -1;
			for (let m = 0; m < sells.length; m++) {
				const sell = sells[m];
				const price = sell[0];
				const amount = sell[1];
				if (sell[0] === lastPrice) {
					const index = sortedSells.length - 1;
					sortedSells[index][1] = sortedBuys[index][1] + amount;
				} else {
					sortedSells.push([price, amount])
				}
				lastPrice = price;
			}
		}

		sortedBuys = sortedBuys.reverse();
		sortedSells = sortedSells.reverse();

		return (
			<div styleName="OrderBookContainer">
				<div styleName="OrderBookHeader">
					<div>
						<p>Amount</p>
					</div>
					<div>
						<p>Price</p>
					</div>
				</div>

				<div id="SellContainer" styleName="Sells">
					{
						sortedSells.map(function(sell, index) {
							return (
								<div styleName="SellRow" key={index}>
									<div styleName="Amount">
										{sell[1] / tokenDecimals}
									</div>
									<div>
										{sell[0] / priceDecimals}
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
						sortedBuys.map(function(buy, index) {
							return (
								<div styleName="BuyRow" key={index}>
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
		)
	}
}
