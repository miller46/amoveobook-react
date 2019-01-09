import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './PlaceOrder.css'
import Details from "../marketDetail/Details";

@CSSModules(style)
export default class PlaceOrder extends Component {

	DEFAULT_PRICE = 0.5;

	constructor(props) {
		super(props);
		this.state = {
			bestPrice: this.props.bestPrice,
			selectedOrderType: "market",
			selectedBuySell: "buy",
			selectedSide: "long",
			amountError: "",
			priceError: "",
			price: 0,
			amount: -1,
			userShares: 0,
			maxOrderSize: 100,
		}

		this.onAmountUpdate = this.props.onAmountUpdate.bind(this)
		this.onPriceUpdate = this.props.onPriceUpdate.bind(this)
	}

	componentDidMount() {
		const {bestPrice} = this.state;

		let price;
		if (bestPrice === 0) {
			price = this.DEFAULT_PRICE;

			this.setState({
				selectedOrderType: "limit",
				price: price,
			})
		} else {
			price = bestPrice;
			this.setState({
				price: price
			})
		}
		this.props.onPriceUpdate(price);
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

		const isMarketOrder = Details.isMarket(selectedOrderType);
		let orderPrice;
		if (isMarketOrder) {
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

		this.props.onPriceUpdate(price);
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

		this.props.onAmountUpdate(amount);
	}

	render() {
		const {selectedOrderType, selectedBuySell, price, amount, bestPrice,
			selectedSide, userShares, amountError, priceError} = this.state;

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
								disabled={!price || !amount || amount < 0 || amountError || priceError}
								onClick={this.submitOrder.bind(this)}>Buy</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
