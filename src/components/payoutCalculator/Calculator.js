import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './Calculator.css'
import {connect} from "react-redux";

import { getVeoPrices, getCurrency } from '../../actions/index';
import SectionLabel from "../markets/SectionLabel";
import {currencies} from '../../config'

const mapStateToProps = (state) => {
	return {
		loading: state.default.loading.veoPrices,
		currencyId: state.default.currencyId,
		veoPrices: state.default.veoPrices,
		error: state.default.error.veoPrices,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getVeoPrices: () => {
			dispatch(getVeoPrices());
		},
		getCurrency: () => {
			dispatch(getCurrency());
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(style)
export default class Calculator extends Component {

	constructor(props) {
		super(props);
		this.state = {
			amount: parseFloat(this.props.amount),
			price: parseFloat(this.props.price),
			marketType: this.props.marketType,
			upperBound: parseFloat(this.props.upperBound),
			lowerBound: parseFloat(this.props.lowerBound),
			sliderValue: 50,
		}

		this.handleSliderChange = this.handleSliderChange.bind(this)
	}

	componentWillReceiveProps(props) {
		this.setProps(props.amount, props.price, props.marketType, props.upperBound, props.lowerBound)
	}

	setProps(amount, price, marketType, upperBound, lowerBound) {
		this.setState({
			amount: parseFloat(amount),
			price: parseFloat(price),
			marketType: marketType,
			upperBound: parseFloat(upperBound),
			lowerBound: parseFloat(lowerBound),
		})
	}

	static roundOff(value, round) {
		return (parseInt(value * (10 ** (round + 1))) - parseInt(value * (10 ** round)) * 10) > 4 ? (((parseFloat(parseInt((value + parseFloat(1 / (10 ** round))) * (10 ** round))))) / (10 ** round)) : (parseFloat(parseInt(value * (10 ** round))) / ( 10 ** round));
	}

	handleSliderChange(e) {
		const {upperBound, lowerBound} = this.state;
		const newValue = e.target.value;
		// const newPrice = (upperBound - lowerBound) * newValue;
		const newPrice = newValue;
		this.setState({sliderValue: newPrice});
	}

	render() {
		const {amount, price, sliderValue, marketType, upperBound, lowerBound} = this.state;

		const {veoPrices} = this.props;
		const currencyId = this.props.currencyId || "usd"
		const currency = currencies[currencyId]

		const veoPrice = veoPrices[currencyId] * veoPrices.last;

		let displayAmount = amount > 0 ? amount : "--";
		let displayPrice = price > 0 ? price : "--";
		let veoWinnings = "--";
		let currencyWinnings = "--";
		if (amount > 0 && price > 0) {
			if (price <= 0.5) {
				veoWinnings = Calculator.roundOff((amount / price - amount), 2)
			} else {
				veoWinnings = Calculator.roundOff((amount * (1 - price)), 2)
			}
			currencyWinnings = (veoWinnings * veoPrice).toFixed(2)
		}

		const isScalar = marketType === "scalar";
		const targetPrice = ((upperBound - lowerBound) * (sliderValue / 100)).toFixed(2);

		let tableBody;
		if (isScalar) {
			const actualValue = amount * (sliderValue / 100);
			let paidValue;
			if (price <= 0.5) {
				paidValue = Calculator.roundOff(amount * price, 2)
			} else {
				paidValue = Calculator.roundOff(amount * (1 - price), 2)
			}

			veoWinnings = actualValue - paidValue;
			currencyWinnings = (veoWinnings * veoPrice).toFixed(2)

			const profitLoss = veoWinnings >= 0 ? "Profit" : "Loss"
			const percentageGain = (100 * ((veoWinnings) / paidValue)).toFixed(2);

			veoWinnings = veoWinnings.toFixed(2)

			tableBody =
				<div styleName="ScalarContainer">
					<div styleName="LeftColumn">
						<div styleName="Header">
							<p>Final Price</p>
							<p>Actual price when market closes</p>
						</div>

						<div styleName="TargetPrice">
							<p>{targetPrice}</p>
						</div>

						<div>
							<input
								value={sliderValue}
								onChange={this.handleSliderChange}
								type="range"
								min="1"
								max="99"
								step="1"
							/>
						</div>

						<div>
							<span className="left">{lowerBound}</span><span className="right">{upperBound}</span>
						</div>
					</div>

					<div styleName="RightColumn">
						<div styleName="Header">
							<p>Your payouts</p>
						</div>
						<div>
							<p>{veoWinnings} VEO <span styleName={profitLoss}>{percentageGain}%</span></p>
							<p>({currency.symbol}{currencyWinnings})</p>
						</div>
					</div>
				</div>
		} else {
			tableBody =
				<div styleName="BinaryContainer">
					<div>
						<div styleName="LeftColumn">
							<p>Buy:</p>
						</div>
						<div styleName="RightColumn">
							<p>{displayAmount} VEO @ {displayPrice} <small>per share</small></p>
						</div>
					</div>
					<div>
						<div styleName="LeftColumn">
							<p>Pays out:</p>
						</div>
						<div styleName="RightColumn">
							<p>{veoWinnings} VEO ({currency.symbol}{currencyWinnings})</p>
						</div>
					</div>
				</div>
		}

		return (
			<div styleName="Calculator">
				<div>
					<SectionLabel titleText="Payout Calculator"/>
				</div>

				{tableBody}
			</div>
		)
	}
}
