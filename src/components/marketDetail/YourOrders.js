import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './YourOrders.css'
import SectionLabel from "../common/SectionLabel";

import {tokenDecimals, priceDecimals, api} from '../../config'
import {connect} from "react-redux";
import {roundOff} from "../../utility";
import {getChannelData, getMarket} from "../../actions";
import {getNetwork} from "../../amoveo3utility";
import Loading from "../loading/Loading";

const mapStateToProps = (state, ownProps) => {
	return {
		account: state.default.account,
		channelData: state.default.channelData,
		channelError: state.default.error.channelData,
		channelLoading: state.default.loading.channelData,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getChannelData: (network, address, topHeader) => {
			dispatch(getChannelData(network, address, topHeader));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
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
			hideTitle: this.props.hideTitle === true,
			orders: [],
		}

		this.listener = 0;
	}

	componentDidMount() {
		const {channelLoading, channelData} = this.props;
		const amoveo3 = window.amoveo3;
		if (!channelLoading && !channelData && amoveo3) {
			const address = amoveo3.coinbase;
			const network = getNetwork(amoveo3);
			const topHeader = amoveo3.topHeader;

			this.props.getChannelData(network, address, topHeader)
		}
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
						ip: api[amoveo3.network].nodeUrl,
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
		const {oid, error, marketType, upperBound, lowerBound, hideTitle} = this.state;
		const {account, channelData, channelLoading, channelError} = this.props;

		const isScalar = marketType === "scalar";

		let orders = [];
		if (channelData) {
			if (!oid) {
				orders = channelData.sortedBets;
			} else if (oid in channelData.betsByMarket) {
				orders = channelData.betsByMarket[oid];
			}
		}

		const orderType = "Buy";
		let headerSpacer;
		let ordersClass;
		if (!oid) {
			headerSpacer = orders.length > 5 ? "OrderHeaderSpacer5": "OrderHeader5";
			ordersClass = orders.length > 5 ? "OrderRows5": "OrderRows";
		} else {
			headerSpacer = orders.length > 5 ? "OrderHeaderSpacer": "OrderHeader";
			ordersClass = orders.length > 5 ? "OrderRows5": "OrderRows";
		}

		let display;
		if (!account) {
			display = <div styleName="OrderContainer">
				<div styleName="OrderRowBlank">
					<p>Log in to view orders</p>
				</div>
			</div>
		} else if (channelLoading) {
			display = <div styleName="OrderContainer">
				<Loading
					lightMode={true}
				/>
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
					{
						!oid ? <div>Market</div> : <blank></blank>
					}
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

				<div styleName={ordersClass}>
					{
						orders.map(function(row, index) {
							let price;
							if (isScalar) {
								if (row.side === "true") {
									price = (upperBound - lowerBound) * row.price
								} else {
									price = (upperBound - lowerBound) * (1 - row.price)
								}
							} else {
								price = row.price;
							}

							price = parseFloat(price.toFixed(2))

							const orderRowClass = !oid ? "OrderRow5" : "OrderRow"
							return (
								<div styleName={orderRowClass} key={index}>
									{
										!oid ? <div styleName="MarketColumn">{row.market}</div> : <blank></blank>
									}
									<div styleName={row.side === "true" ? "Long" : "Short"}>
										{row.side === "true" ? orderType + " " + "Long" : orderType + " " + "Short"}
									</div>
									<div>
										{price / priceDecimals}
									</div>
									<div>
										{roundOff(row.amount / tokenDecimals, 6)}
									</div>
									<div>
										{
											row.cancelable
												? <button
													className="btn btn-danger btn-cancel"
													onClick={() => instance.cancel(row)}
													>Cancel</button>
												: <div styleName="Filled">Filled</div>
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
				{
					hideTitle
						? <div></div>
						: <SectionLabel
							titleText="Your Orders"
						/>
				}

				{
					error
						? <div styleName="Error">
						{error}
					</div>
						: <div></div>
				}

				{display}
			</div>
		)
	}
}
