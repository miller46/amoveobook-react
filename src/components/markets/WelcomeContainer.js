import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules'

import styles2 from './WelcomeContainer.css'
import { getVeoPrices, setCurrency, getCurrency } from '../../actions/index';

import {currencies} from '../../config'
import {LOGO_URL} from "../../assets";

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
		setCurrency: (currencyId) => {
			dispatch(setCurrency(currencyId));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles2)
export default class WelcomeContainer extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
		}
	}

	componentDidMount() {
		this.props.getVeoPrices();
		this.props.getCurrency();
	}

	render() {
		const {loading, veoPrices, error} = this.props;
		const currencyId = this.props.currencyId || "usd"
		const selectedCurrency = currencies[currencyId]

		const veoPrice = veoPrices[currencyId] * veoPrices.last;
		const veoPriceDisplay = veoPrice ? veoPrice.toFixed(2) : "--";
		let display;
		if (loading) {
			display = <p>Loading...</p>
		} else if (error) {
			display = <p>--</p>
		} else {
			display = <p>1 VEO ≈ {selectedCurrency.symbol}{veoPriceDisplay}</p>
		}

		return (
			<div styleName="WelcomeContainer">
				<p styleName="Welcome">WELCOME</p>

				<div styleName="VeoPrice">
					<div>
						<img alt="" src={LOGO_URL} />
					</div>
					<div>
						{display}
					</div>
				</div>

			</div>
		)
	}
}
