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

		let sortedBuys = buys.slice();
		let sortedSells = sells.slice();

		if (sortedBuys.length > 1) {
			for (let t = 0; t <= sortedBuys.length - 2; t++) {
				const buy = sortedBuys[t];
				const nextBuy = sortedBuys[t + 1]
				if (buy[0] === nextBuy[0]) {
					buy[1] = buy[1] + nextBuy[1]
					sortedBuys.splice(t + 1)
				}
			}
		}

		if (sortedSells.length > 1) {
			for (let m = 0; m <= sortedSells.length - 2; m++) {
				const sell = sortedSells[m];
				const nextSell = sortedSells[m + 1]
				if (sell[0] === nextSell[0]) {
					sell[1] = sell[1] + nextSell[1]
					sortedSells.splice(m + 1)
				}
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
