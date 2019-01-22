import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './YourOrders.css'
import SectionLabel from "../markets/SectionLabel";

import {tokenDecimals, priceDecimals, api} from '../../config'
import {connect} from "react-redux";

const mapStateToProps = (state, ownProps) => {
	return {
		account: state.default.account,
	};
};

@connect(mapStateToProps, null)
@CSSModules(styles)
export default class YourOrders extends Component {

	constructor(props) {
		super(props);
		this.state = {
			error: "",
			oid: this.props.oid,
			update: this.props.update,
			acount: this.props.update,
			marketType: this.props.marketType,
			upperBound: this.props.upperBound,
			lowerBound: this.props.lowerBound,
			orders: [],
		}

		this.listener = 0;
	}

	componentWillMount() {
		const instance = this;
		let lastOrderLength = 0;
		this.listener = setInterval(function() {
			const orders = instance.getOrders();
			if (lastOrderLength !== orders.length) {
				lastOrderLength = orders.length;
				instance.setState({orders: orders})
			}
		}, 500)
	}

	getOrders() {
		const {oid} = this.state;
		const orders = []
		const amoveo3 = window.amoveo3;
		if (amoveo3 && amoveo3.channels && amoveo3.channels.length > 0) {
			const channels = amoveo3.channels;
			for (let i = 0; i < channels.length; i++) {
				let channel = channels[i];
				if (channel.me[1] === amoveo3.coinbase) {
					const bets = channel.me[3];
					for (let j = 1; j < bets.length; j++) {
						const bet = bets[j];

						if (bet[3][2] === oid) {
							const amount = bet[2] / tokenDecimals;
							const price = bet[4][2] / priceDecimals;
							const side = bet[4][1] === 1 ? "true" : "false";

							const cancelable = true;
							// if (JSON.stringify(channel.ssme[j - 1].code) === JSON.stringify([0,0,0,0,4])) {
							//     cancelable = false;
							// }

							const order = {amount: amount, price: price, side: side, index: j - 1, cancelable: cancelable};
							orders.push(order);
						}
					}
				}
			}
		}

		return orders;
	}

	componentWillReceiveProps(props) {
		this.setState({update: props.update, marketType: props.marketType, upperBound: props.upperBound, lowerBound: props.lowerBound})
	}

	cancel(order) {
		const instance = this;
		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			amoveo3.currentProvider.send(
				{
						type: "cancel",
						index: order.index,
						ip: api.defaultNodeUrl,
						price: order.price,
						amount: order.amount,
						side: order.side
				}, function (error, result) {
					if (error) {
						instance.setState({
							error: "The request to cancel was rejected"
						})
					} else {
						instance.setState({
							error: ""
						})
					}
				}
			);
		}
	}

	render() {
		const instance = this;
		const {orders, error, marketType, upperBound, lowerBound} = this.state;
		const {account} = this.props;

		const isScalar = marketType === "scalar";

		const orderType = "Buy";
		const headerSpacer = orders.length > 5 ? "OrderHeaderSpacer": "OrderHeader";
		let display;
		if (!account) {
			display = <div styleName="OrderContainer">
				<div styleName="OrderRowBlank">
					<p>Log in to view orders</p>
				</div>
			</div>
		} else if (orders.length === 0) {
			display = <div styleName="OrderContainer">
				<div styleName="OrderRowBlank">
					<p>No orders</p>
				</div>
			</div>
		} else {
			display = <div styleName="OrderContainer">
				<div styleName={headerSpacer}>
					<div>
						<p>Side</p>
					</div>
					<div>
						<p>Price</p>
					</div>
					<div>
						<p>Amount</p>
					</div>
					<div>
						<p>&nbsp;</p>
					</div>
				</div>

				<div styleName="OrderRows">
					{
						orders.map(function(row, index) {
							return (
								<div styleName="OrderRow" key={index}>
									<div styleName={row.side === "true" ? "Long" : "Short"}>
										{row.side === "true" ? orderType + " " + "Long" : orderType + " " + "Short"}
									</div>
									<div>
										{isScalar ? (upperBound - lowerBound) * row.price : row.price}
									</div>
									<div>
										{row.amount}
									</div>
									<div>
										{
											row.cancelable
												? <button
													className="btn btn-danger btn-cancel"
													onClick={() => instance.cancel(row)}
													>Cancel</button>
												: <div>Filled</div>
										}
									</div>
								</div>
							)
						})
					}
				</div>
			</div>
		}

		return (
			<div styleName="Orders">
				<SectionLabel
					titleText="Your Orders"
				/>

				<div styleName="Error">
					{error}
				</div>

				{display}
			</div>
		)
	}
}
