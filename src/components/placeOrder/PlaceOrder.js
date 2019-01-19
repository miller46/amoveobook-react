import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './PlaceOrder.css'
import {connect} from "react-redux";
import {getAccount} from "../../actions";
import PropTypes from 'prop-types';
import Loading from '../loading/Loading'

const mapStateToProps = (state, ownProps) => {
	return {
		account: state.default.account,
		loading: state.default.loading.account,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getAccount: (address) => {
			dispatch(getAccount(address));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class PlaceOrder extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	DEFAULT_PRICE = 0.5;

	constructor(props) {
		super(props);
		this.state = {
			bestPrice: this.props.bestPrice,
			account: this.props.account,
			loading: this.props.loading,
			oid: this.props.oid,
			selectedOrderType: "market",
			selectedBuySell: "buy",
			selectedSide: "long",
			amountError: "",
			priceError: "",
			confirmError: "",
			price: 0,
			amount: -1,
			userShares: 0,
			maxOrderSize: 100,
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

		if (this.props.onPriceUpdate) {
			this.props.onPriceUpdate(price);
		}
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
		const {oid, amount, price, bestPrice, selectedOrderType, selectedSide} = this.state;

		const isMarketOrder = PlaceOrder.isMarket(selectedOrderType);
		let orderPrice;
		if (isMarketOrder) {
			orderPrice = bestPrice;
		} else {
			orderPrice = price;
		}

		let side;
		if (selectedSide === "long") {
			side = "true";
		} else {
			side = "false";
		}

		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			amoveo3.currentProvider.send(
				{
					type: "market", price: orderPrice, amount: amount, side: side, oid: oid
				}, function(error, result) {
					if (error) {
						instance.setState({
							confirmError: "The request to cancel was rejected"
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
		}

		this.setState(
			{
				amount: amount,
				amountError: amountError,
			}
		);

		this.props.onAmountUpdate(amount);
	}

	handlePriceChange(e) {
		const oldPrice = this.state.price;
		let price = e.target.value;

		let priceError = "";
		if (price >= 1 || price < 0) {
			price = oldPrice;
			priceError = "Price must be in between 0.01 and 0.99";
		}

		this.setState(
			{
				priceError: priceError,
				price: price,
				sliderValue: price * 100,
			}
		);

		this.props.onPriceUpdate(price);
	}

	handleSliderChange(e) {
		const newValue = e.target.value;
		const newPrice = newValue / 100;
		this.setState({sliderValue: newValue, price: newValue / 100});

		this.props.onPriceUpdate(newPrice);
	}

	goToLogin() {
		localStorage.setItem("onboarding", true);
		this.context.router.push("/")
	}

	render() {
		const {account, loading} = this.props;

		const {sliderValue, selectedOrderType, selectedBuySell, price, amount, bestPrice,
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

		let hasChannel = false;
		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			if (amoveo3.channels && amoveo3.channels.length > 0) {
				hasChannel = true;
			}
		}

		const total = price * amount > 0 ? price * amount : 0;

		let form = <div></div>
		if (loading) {
			form = <div styleName="OrderForm">
				<Loading lightMode={true} />
			</div>
		} else if (!account) {
			form = <div styleName="OrderFormLocked">
				<p>You must <span styleName="Underlined" onClick={() => this.goToLogin()}>log in</span> to place a bet.</p>
			</div>
		} else if (!hasChannel) {
			form = <div styleName="OrderFormLocked">
				<p>You must <span styleName="Underlined" onClick={() => this.goToLogin()}>open a channel</span> to place a bet.</p>
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
						<p>Price</p>
					</div>
					<div styleName="OrderFormInput">
						<input
							disabled={isMarketOrder && bestPrice > 0}
							type="number"
							value={isMarketOrder ? bestPrice : price}
							max="0.99"
							min="0.01"
							onChange={this.handlePriceChange.bind(this)}
						/>

						{priceToggle}
					</div>
					<div styleName="FormRowLabel">
						<p>VEO/Share</p>
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
						<p>{(price * 100).toFixed(2)} %</p>
					</div>
					{/*<div styleName="ConfirmLeft">*/}
						{/*<p>Fee</p>*/}
					{/*</div>*/}
					{/*<div styleName="ConfirmRight">*/}
						{/*<p>0.000001 VEO</p>*/}
					{/*</div>*/}
					<div styleName="ConfirmLeft">
						<p>Total</p>
					</div>
					<div styleName="ConfirmRight">
						<p>{total.toFixed(4)} VEO</p>
					</div>
				</div>

				<div styleName="OrderFormButton">
					<button
						disabled={!price || !amount || amount < 0 || amountError || priceError}
						onClick={this.submitOrder.bind(this)}>{selectedSide === "long" ? "Buy Long Shares" : "Buy Short Shares"}</button>
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

					{form}
				</div>
			</div>
		)
	}
}
