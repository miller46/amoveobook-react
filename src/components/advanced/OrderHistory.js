import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './OrderHistory.css'

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
			display = <div styleName="OrderContainer">
				<div styleName="OrderRow">
					<p>No orders in this market yet</p>
				</div>
			</div>
		} else {
			display = <div styleName="OrderContainer">
				<div styleName="OrderHeader">
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

				<div styleName="OrderRows">
					{
						prices.map(function(price, index) {
							return (
								<div styleName="OrderRow" key={index}>
									<div>
										{price.buy_amount}
									</div>
									<div>
										{price.price}
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
