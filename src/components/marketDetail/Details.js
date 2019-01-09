import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {getHeight, getMarket, getActiveMarkets} from "../../actions";
import {connect} from "react-redux";
import styles from './Details.css'
import styles2 from '../markets/MarketRow.css'

import {getDisplayExpires} from '../../utility'
import SectionLabel from "../markets/SectionLabel";
import Calculator from "../payoutCalculator/Calculator";
import GoToAdvancedView from "./GoToAdvancedView";

const mapStateToProps = (state, ownProps) => {
	const {oid} = ownProps.params;
	return {
		activeMarkets: state.default.activeMarkets,
		marketDetail: state.default.marketDetails[oid],
		loading: state.default.loading.marketDetails[oid],
		height: state.default.height,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getHeight: () => {
			dispatch(getHeight());
		},
		getMarket: (oid) => {
			dispatch(getMarket(oid));
		},
		getActiveMarkets: () => {
			dispatch(getActiveMarkets());
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(Object.assign({}, styles, styles2))
export default class Details extends Component {

	constructor(props) {
		super(props);

		this.state = {
			oid: this.props.params.oid,
			marketDetail: this.props.marketDetail,
			height: this.props.height,
			activeMarkets: this.props.activeMarkets,
			selectedOrderType: "market",
			selectedBuySell: "buy",
			selectedSide: "long",
			amountError: "",
			priceError: "",
			bestPrice: 0,
			price: 0.5,
			amount: -1,
			userShares: 0,
			maxOrderSize: 100,
		}
	}

	componentDidMount() {
		const {oid, marketDetail, height, activeMarkets, bestPrice} = this.state;

		if (!height) {
			this.props.getHeight();
		}

		if (!marketDetail) {
			this.props.getMarket(oid);
		}

		if (!activeMarkets) {
			this.props.getActiveMarkets();
		} else {
			const i = 0;
		}

		if (bestPrice === 0) {
			this.setState({
				selectedOrderType: "limit"
			})
		} else {
			this.setState({
				price: bestPrice
			})
		}
	}

	handlePriceChange(e) {
		let price = e.target.value;
		if (isNaN(price) && price < 0) {
			price = 0;
		}

		let priceError = "";
		if (price > 1) {
			priceError = "Price must be in between 0 and 1";
		}

		this.setState(
			{
				priceError: priceError,
				price: price,
			}
		);
	}

	handleAmountChange(e) {
		let {maxOrderSize} = this.state;

		let amount = parseFloat(e.target.value);
		if (isNaN(amount) && amount < 0) {
			amount = 0;
		}

		let amountError = ""
		if (amount > maxOrderSize) {
			amountError = "Max order size is " + maxOrderSize
		}

		this.setState(
			{
				amount: amount,
				amountError: amountError,
			}
		);
	}

	toggleOrderType() {
		const {selectedOrderType} = this.state;
		let newSelected = Details.isMarket(selectedOrderType) ? "limit" : "market";
		this.setState({selectedOrderType: newSelected})
	}

	static isMarket(type) {
		return type === "market";
	}

	toggleBuySell() {
		const {selectedBuySell} = this.state;
		let newSelected = selectedBuySell === "buy" ? "sell" : "buy";
		this.setState({selectedBuySell: newSelected})
	}

	toggleLongShort() {
		const {selectedSide} = this.state;
		let newSelected = selectedSide === "long" ? "short" : "long";
		this.setState({selectedSide: newSelected})
	}

	submitOrder() {
		const {oid, amount, price, bestPrice, selectedOrderType, selectedBuySell} = this.state;

		let orderPrice;
		if (Details.isMarket(selectedOrderType)) {
			orderPrice = bestPrice;
		} else {
			orderPrice = price;
		}

		let side;
		if (selectedBuySell === "buy") {
			side = "true";
		} else {
			side = "false";
		}

		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			amoveo3.currentProvider.send(
				{
					opts: {
						type: "market", price: orderPrice, amount: amount, side: side, oid: oid
					}
				}
			);
		}
	}

	render() {
		const {oid, selectedOrderType, selectedBuySell, price, amount, bestPrice,
			selectedSide, userShares, amountError, priceError} = this.state;
		const {marketDetail, height} = this.props;

		let expires = "--"
		let question = "--"
		if (marketDetail) {
			expires = "Expires: " + getDisplayExpires(marketDetail.expires, height)
			question = marketDetail.question;
		}

		const isMarketOrder = selectedOrderType === "market";
		const marketStyleName = isMarketOrder ? "OrderTypeSelectedToggle" : "OrderTypeToggle"
		const limitStyleName = isMarketOrder ? "OrderTypeToggle" : "OrderTypeSelectedToggle"

		const isLong = selectedSide === "long";
		const longStyleName = isLong ? "LongSelectedToggle" : ""
		const shortStyleName = isLong ? "" : "ShortSelectedToggle"

		const isBuy = selectedBuySell === "buy";
		const buyStyleName = isBuy ? "BuySellSelectedToggle" : ""
		const sellStyleName = isBuy ? "" : "BuySellSelectedToggle"

		const buySellStyleName = userShares > 0 ? "BuySellToggle" : "Hidden";

		let priceToggle = <div></div>
		if (bestPrice > 0) {
			priceToggle = <div styleName="OrderType">
				<div className="left" styleName={marketStyleName} onClick={() => {if (selectedOrderType === "limit") this.toggleOrderType()}}>
					<p>Best Price</p>
				</div>
				<div className="right" styleName={limitStyleName} onClick={() => {if (selectedOrderType === "market") this.toggleOrderType()}}>
					<p>Set Price</p>
				</div>
			</div>
		}

		return (
			<div styleName="DetailsContainer">
				<div styleName="PanelLeft">
					<div styleName="DetailInfo">
						<div styleName="Card">
							<div>
								<p>{expires}</p>
							</div>
							<div>
								<h1>{question}</h1>
							</div>
						</div>
					</div>
					<div styleName="Orders">
						<SectionLabel
							titleText="Your Orders"
						/>
						<div styleName="OrderRow">
							<p>No orders</p>
						</div>
					</div>

					<GoToAdvancedView
					/>
				</div>

				<div styleName="PanelRight">
					<div>
						<div styleName={buySellStyleName}>
							<div className="left" styleName={buyStyleName} onClick={() => {if (selectedBuySell === "sell") this.toggleBuySell()}}>
								<p>Buy Shares</p>
							</div>
							<div className="right" styleName={sellStyleName} onClick={() => {if (selectedBuySell === "buy") this.toggleBuySell()}}>
								<p>Sell Shares</p>
							</div>
						</div>

						<div styleName="OrderContainer">
							<div styleName="LongShortToggle">
								<div className="left" styleName={longStyleName} onClick={() => {if (selectedSide === "short") this.toggleLongShort()}}>
									<p>Long</p>
								</div>
								<div className="right" styleName={shortStyleName} onClick={() => {if (selectedSide === "long") this.toggleLongShort()}}>
									<p>Short</p>
								</div>
							</div>
							<div styleName="OrderForm">
								<div styleName="FormRow">
									<div className="left">
										<p>Amount</p>
									</div>
									<div className="right">
										<input
											type="number"
											value={amount >= 0 ? amount : ''}
											onChange={this.handleAmountChange.bind(this)}
										/>
									</div>
								</div>

								<div styleName="Error">
									<small>
										{amountError}
									</small>
								</div>

								<div styleName="FormRow">
									<div className="left">
										<p>Price</p>
									</div>
									<div className="right">
										<input
											disabled={isMarketOrder && bestPrice > 0}
											type="number"
											max="0"
											min="0"
											step="0.01"
											value={isMarketOrder ? bestPrice : price}
											onChange={this.handlePriceChange.bind(this)}
										/>

										{priceToggle}
									</div>
								</div>

								<div styleName="Error">
									<small>
										{priceError}
									</small>
								</div>

								<div styleName="OrderFormButton">
									<button
										disabled={!price || !amount || amountError || priceError}
										onClick={this.submitOrder.bind(this)}>Buy</button>
								</div>
							</div>
						</div>

						<div styleName="PayoutCalculator">
							<div>
								<Calculator
									amount={amount}
									price={isMarketOrder ? bestPrice : price}
								/>
							</div>
						</div>

					</div>
				</div>
			</div>
		)
	}
}
