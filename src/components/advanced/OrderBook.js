import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './OrderBook.css'

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

		buys = buys.reverse();

		for (let k = buys.length - 1; k >= 0; k--) {
			const buy = buys[k];
			if (buy[1] > 0) {
				const row = initOrderBookRow(buy, true);
				row.className = "order-row buy clearfix";
				buysBook.appendChild(row);
			}
		}

		for (let p = 0; p < sells.length; p++) {
			const sell = sells[p];
			if (sell[1] > 0) {
				const row = initOrderBookRow(sell, false);
				row.className = "order-row sell clearfix";
				sellsBook.appendChild(row);
			}
		}

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

				<div styleName="Sells">
					{
						sells.map(function(sell, index) {
							return (
								<div styleName="SellRow" key={index}>
									<div>
										sell[1]
									</div>
									<div>
										sell[0]
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
								<div styleName="SellRow" key={index}>
									<div>
										buy[1]
									</div>
									<div>
										buy[0]
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
