import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules'
const ClickOutHandler = require('react-onclickout');

import styles from './VeoPrice.css'
import styles2 from './LanguagePicker.css'
import { getVeoPrice, setCurrency, getCurrency } from '../../actions/index';


const mergedStyles = {...styles, ...styles2 }

import {currencies, languages} from '../../config'

const mapStateToProps = (state) => {
	return {
		loading: state.default.loading,
		currencyId: state.default.currencyId,
		veoPrice: state.default.veoPrice,
		error: state.default.error,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getVeoPrice: () => {
			dispatch(getVeoPrice());
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
export default class VeoPrice extends Component {

	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			showingPicker: false,
		}

		this.closePicker = this.closePicker.bind(this);
		this.toggle = this.toggle.bind(this);
		this.selectCurrencyAndClose = this.selectCurrencyAndClose.bind(this);
	}

	componentDidMount() {
		this.props.getVeoPrice();
		this.props.getCurrency();
	}

	closePicker() {
		this.setState({showing: false})
	}

	selectCurrencyAndClose(id) {
		this.props.setCurrency(id);
		this.setState({showing: false})
	}

	toggle() {
		this.setState({showing: !this.state.showing})
	}

	render() {
		const {showing} = this.state;
		const {loading, veoPrice, error} = this.props;
		const currencyId = this.props.currencyId || "usd"
		const selectedCurrency = currencies[currencyId]

		let display;
		if (loading) {
			display = <p>Loading...</p>
		} else if (error) {
			display = <p>--</p>
		} else {
			let unselected = <div styleName="Hidden"></div>
			if (showing) {
				unselected = <ClickOutHandler onClickOut={this.closePicker}>
					{
						Object.keys(currencies).map((key, index) => {
							const currency = currencies[key];
							if (key !== currencyId) {
								return (
									<div
										styleName="UnselectedRow"
										key={index}
										onClick={() => this.selectCurrencyAndClose(key)}>
										<p>
											{currency.symbol} {currency.displayName}
										</p>
									</div>
								)
							}
						})
					}
					<div className="clear"></div>
				</ClickOutHandler>
			}

			display = <div styleName="LanguagePicker">
				<div styleName="Selected" onClick={() => this.toggle()}>
					<div styleName="SelectedRow">
						<p>1 VEO ≈ {selectedCurrency.symbol}{veoPrice.toFixed(2)} <small> ▼</small></p>
					</div>
				</div>
				<div styleName="Unselected">
					{unselected}
				</div>
			</div>
		}

		return (
			<div>
				{display}
			</div>
		)
	}
}
