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

		if (buys.length > 1) {
			for (let t = 0; t <= buys.length - 2; t++) {
				const buy = buys[t];
				const nextBuy = buys[t + 1]
				if (buy[0] === nextBuy[0]) {
					buy[1] = buy[1] + nextBuy[1]
					buys.splice(t + 1)
				}
			}
		}

		if (sells.length > 1) {
			for (let m = 0; m <= sells.length - 2; m++) {
				const sell = sells[m];
				const nextSell = sells[m + 1]
				if (sell[0] === nextSell[0]) {
					sell[1] = sell[1] + nextSell[1]
					sells.splice(m + 1)
				}
			}
		}

		sells = sells.reverse();
		buys = buys.reverse();

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
						sells.map(function(sell, index) {
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
						buys.map(function(buy, index) {
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
