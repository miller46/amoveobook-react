import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './PlaceOrder.css'
import {connect} from "react-redux";
import {getAccount, getChannelData} from "../../actions";
import PropTypes from 'prop-types';
import Loading from '../loading/Loading'
import {api} from "../../config";

const mapStateToProps = (state, ownProps) => {
	return {
		account: state.default.account,
		loading: state.default.loading.account,
		channelData: state.default.channelData,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getAccount: (address) => {
			dispatch(getAccount(address));
		},
		getChannelData: (network, address, topHeader) => {
			dispatch(getChannelData(network, address, topHeader));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class PlaceOrder extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	MAX_ORDER_SIZE = 100;

	DEFAULT_PRICE = 0.5;

	constructor(props) {
		super(props);

		const bestPrice = this.props.bestPrice
		let selectedOrderType = "market"
		let selectedBuySell = "buy"
		let selectedSide = "long"
		let amount = 1
		let price = 0

		if (bestPrice === 0) {
			price = this.DEFAULT_PRICE;
			selectedOrderType = "limit";
		} else {
			price = bestPrice;
		}

		this.state = {
			bestPrice: this.props.bestPrice,
			buy: this.props.buy,
			sell: this.props.sell,
			account: this.props.account,
			marketType: this.props.marketType,
			loading: this.props.loading,
			upperBound: this.props.upperBound || 0,
			lowerBound: this.props.lowerBound || 0,
			oid: this.props.oid,
			selectedOrderType: selectedOrderType,
			selectedBuySell: selectedBuySell,
			selectedSide: selectedSide,
			amountError: "",
			priceError: "",
			confirmError: "",
			price: price,
			amount: amount,
			userShares: 0,
			maxOrderSize: this.MAX_ORDER_SIZE,
			sliderValue: this.DEFAULT_PRICE * 100,
		}

		if (this.props.onAmountUpdate) {
			this.onAmountUpdate = this.props.onAmountUpdate.bind(this)
		}

		if (this.props.onPriceUpdate) {
			this.onPriceUpdate = this.props.onPriceUpdate.bind(this)
		}

		if (this.props.onOrderSubmit) {
			this.onOrderSubmit = this.props.onOrderSubmit.bind(this)
		}

		this.handleSliderChange = this.handleSliderChange.bind(this)

		if (this.props.onPriceUpdate) {
			this.props.onPriceUpdate(price);
		}

		if (this.props.onAmountUpdate) {
			this.props.onAmountUpdate(amount);
		}
	}

	componentWillReceiveProps(props) {
		const price = props.price || this.state.price;
		this.setState({
			bestPrice: props.bestPrice,
			marketType: props.marketType,
			account: props.account,
			upperBound: props.upperBound,
			lowerBound: props.lowerBound,
			amount: props.amount || this.state.amount,
			price: price,
			selectedSide: props.selectedSide || this.state.selectedSide,
			sliderValue: price * 100,
		})
	}

	toggleOrderType() {
		const {selectedOrderType} = this.state;
		let newSelected = PlaceOrder.isMarket(selectedOrderType) ? "limit" : "market";
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
		const instance = this;
		const {oid, amount, price, marketType, upperBound, lowerBound, bestPrice, selectedOrderType, selectedSide} = this.state;

		const isMarketOrder = PlaceOrder.isMarket(selectedOrderType);
		let orderPrice;
		if (isMarketOrder) {
			orderPrice = bestPrice;
		} else {
			orderPrice = parseFloat(price);
		}

		orderPrice = parseFloat(orderPrice.toFixed(6));

		const isLong = selectedSide === "long";
		if (!isLong) {
			orderPrice = 1 - orderPrice
		}

		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			amoveo3.currentProvider.send(
				{
					type: "market", marketType: marketType, upperBound: upperBound, lowerBound: lowerBound, price: orderPrice, amount: amount, side: selectedSide, oid: oid
				}, function(error, result) {
					if (error) {
						instance.setState({
							confirmError: "The request was cancelled"
						})
					} else {
						if (instance.props.onOrderSubmit) {
							instance.props.onOrderSubmit();
						} else {
							instance.setState({
								confirmError: ""
							})
						}
					}
				}
			);
		}
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
			amount = maxOrderSize
		}

		this.setState(
			{
				amount: amount,
				amountError: amountError,
			}
		);

		if (this.props.onAmountUpdate) {
			this.props.onAmountUpdate(amount);
		}
	}

	handlePriceChange(e) {
		const {price:oldPrice, marketType, upperBound, lowerBound} = this.state;
		let price = e.target.value;

		if (marketType === "scalar") {
			let priceError = "";
			if (price >= upperBound || price < lowerBound) {
				price = oldPrice;
				priceError = "Price must be in between " + lowerBound + " and " + upperBound;
			} else {
				priceError = ""
			}

			this.setState(
				{
					priceError: priceError,
					price: price,
					sliderValue: price * (upperBound - lowerBound),
				}
			);
		} else {
			let priceError = "";
			if (price >= 1 || price < 0) {
				price = oldPrice;
				priceError = "Price must be in between 0.01 and 0.99";
			} else {
				priceError = ""
			}

			this.setState(
				{
					priceError: priceError,
					price: price,
					sliderValue: price * 100,
				}
			);
		}

		if (this.props.onPriceUpdate) {
			this.props.onPriceUpdate(price);
		}
	}

	handleSliderChange(e) {
		const newValue = e.target.value;
		const newPrice = newValue / 100;
		this.setState({sliderValue: newPrice * 100, price: newPrice});

		if (this.props.onPriceUpdate) {
			this.props.onPriceUpdate(newPrice);
		}
	}

	goToLogin() {
		localStorage.setItem("onboarding", true);
		this.context.router.push("/")
	}

	render() {
		const {account, channelData, loading} = this.props;

		const {sliderValue, marketType, upperBound, lowerBound, selectedOrderType, selectedBuySell, price, amount, bestPrice,
			selectedSide, userShares, amountError, priceError, confirmError} = this.state;

		const isMarketOrder = selectedOrderType === "market";
		const marketStyleName = isMarketOrder ? "OrderTypeSelectedToggle" : "OrderTypeToggle"
		const limitStyleName = isMarketOrder ? "OrderTypeToggle" : "OrderTypeSelectedToggle"

		const isLong = selectedSide === "long";
		const longStyleName = isLong ? "LongSelectedToggle" : "LongToggle"
		const shortStyleName = isLong ? "ShortToggle" : "ShortSelectedToggle"

		const isBuy = selectedBuySell === "buy";
		const buyStyleName = isBuy ? "BuySellSelectedToggle" : ""
		const sellStyleName = isBuy ? "" : "BuySellSelectedToggle"

		const buySellStyleName = userShares > 0 ? "BuySellToggle" : "Hidden";

		const isScalarMarket = marketType === "scalar";

		let formPrice;
		if (isScalarMarket) {
			formPrice = ((upperBound - lowerBound) * price).toFixed(2);
		} else {
			formPrice = isMarketOrder ? bestPrice : price;
		}

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

		const total = price * amount > 0 ? price * amount : 0;

		let priceLabelText;
		if (isScalarMarket) {
			priceLabelText = (isLong ? "Greater" : "Lower") + " than this value"
		} else {
			priceLabelText = "VEO/Share"
		}

		let button = <div></div>
		if (!account) {
			button = <div styleName="OrderFormLocked">
				<button>You must <span styleName="Underlined" onClick={() => this.goToLogin()}>log in</span> to place a bet.</button>
			</div>
		} else if (!channelData) {
			button = <div styleName="OrderFormLocked">
				<button>You must <span styleName="Underlined" onClick={() => this.goToLogin()}>open a channel</span> to place a bet.</button>
			</div>
		} else {
			button = <div styleName="OrderFormButton">
				<button
					disabled={!price || !amount || amount < 0 || amountError || priceError}
					onClick={this.submitOrder.bind(this)}>{selectedSide === "long" ? "Buy Long Shares" : "Buy Short Shares"}</button>
			</div>
		}

		let form = <div></div>
		if (loading) {
			form = <div styleName="OrderForm">
				<Loading lightMode={true} />
			</div>
		} else {
			form = <div styleName="OrderForm">
				<div styleName="FormRow">
					<div className="left">
						<p>Amount</p>
					</div>
					<div styleName="OrderFormInput">
						<input
							type="number"
							value={amount >= 0 ? amount : ''}
							onChange={this.handleAmountChange.bind(this)}
						/>
					</div>
					<div styleName="FormRowLabel">
						<p>Shares</p>
					</div>
				</div>

				<div styleName="Error">
					<small>
						{amountError}
					</small>
				</div>

				<div styleName="FormRow">
					<div className="left">
						<p>{isScalarMarket ? "Target Price" : "Price"}</p>
					</div>
					<div styleName="OrderFormInput">
						<input
							disabled={isMarketOrder && bestPrice > 0}
							type="number"
							value={formPrice}
							max="0.99"
							min="0.01"
							onChange={this.handlePriceChange.bind(this)}
						/>

						{priceToggle}
					</div>
					<div styleName="FormRowLabel">
						<p>{priceLabelText}</p>
					</div>
				</div>

				<div styleName="PriceSlider">
					<input
						value={sliderValue}
						onChange={this.handleSliderChange}
						type="range"
						min="1"
						max="99"
						step="1"
					/>
				</div>

				<div styleName="Error">
					<small>
						{priceError}
					</small>
				</div>

				<div styleName="Error">
					<small>
						{confirmError}
					</small>
				</div>

				<div styleName="ConfirmContainer">
					<div styleName="ConfirmLeft">
						<p>Share Value</p>
					</div>
					<div styleName="ConfirmRight">
						<p>{(price * 100).toFixed(2)} VEO</p>
					</div>
					<div styleName="ConfirmLeft">
						<p>Total</p>
					</div>
					<div styleName="ConfirmRight">
						<p>{total.toFixed(4)} VEO</p>
					</div>
				</div>

				{button}
			</div>
		}

		return (
			<div>
				<div styleName="OrderContainer">
					<div styleName="Title">
						<p>Place Order</p>
					</div>

					<div styleName={buySellStyleName}>
						<div className="left" styleName={buyStyleName} onClick={() => {if (selectedBuySell === "sell") this.toggleBuySell()}}>
							<p>Buy Shares</p>
						</div>
						<div className="right" styleName={sellStyleName} onClick={() => {if (selectedBuySell === "buy") this.toggleBuySell()}}>
							<p>Sell Shares</p>
						</div>
					</div>

					<div>
						<div styleName="LongShortToggle">
							<div className="left" styleName={longStyleName} onClick={() => {if (selectedSide === "short") this.toggleLongShort()}}>
								<p>Long</p>
							</div>
							<div className="right" styleName={shortStyleName} onClick={() => {if (selectedSide === "long") this.toggleLongShort()}}>
								<p>Short</p>
							</div>
						</div>

						{form}
					</div>
				</div>
			</div>
		)
	}
}
