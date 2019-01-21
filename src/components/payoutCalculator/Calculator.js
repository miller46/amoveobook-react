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
		this.setAmountAndPrice(this.props.amount, this.props.price)
	}

	componentWillReceiveProps(props) {
		this.setAmountAndPrice(props.amount, props.price)
	}

	setAmountAndPrice(amount, price) {
		this.state = {
			amount: parseFloat(amount),
			price: parseFloat(price)
		}
	}

	static roundOff(value, round) {
		return (parseInt(value * (10 ** (round + 1))) - parseInt(value * (10 ** round)) * 10) > 4 ? (((parseFloat(parseInt((value + parseFloat(1 / (10 ** round))) * (10 ** round))))) / (10 ** round)) : (parseFloat(parseInt(value * (10 ** round))) / ( 10 ** round));
	}

	render() {
		const {amount, price} = this.state;

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

		return (
			<div styleName="Calculator">
				<div>
					<SectionLabel titleText="Payout Calculator"/>
				</div>

				<div>
					<table>
						<tbody>
						<tr><td styleName="LeftColumn"><p>Buy:</p></td><td><p>{displayAmount} VEO @ {displayPrice} <small>per share</small></p></td></tr>
						<tr><td styleName="LeftColumn"><p>Pays out:</p></td><td><p>{veoWinnings} VEO ({currency.symbol}{currencyWinnings})</p></td></tr>
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}
