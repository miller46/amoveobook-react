import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules'
import styles from './LanguagePicker.css'
const ClickOutHandler = require('react-onclickout');

import { setCurrency, getCurrency } from '../../actions/index';

import {currencies} from '../../config'

const mapStateToProps = (state) => {
	return {
		currencyId: state.default.currencyId,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getCurrency: () => {
			dispatch(getCurrency());
		},
		setCurrency: (currencyId) => {
			dispatch(setCurrency(currencyId));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
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
		const currencyId = this.props.currencyId || "usd"
		const selectedCurrency = currencies[currencyId]

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

		const display = <div>
			<div styleName="Selected" onClick={() => this.toggle()}>
				<div styleName="SelectedRow">
					<p>{selectedCurrency.symbol} {selectedCurrency.displayName} <small> ▼</small></p>
				</div>
			</div>
			<div styleName="Unselected">
				{unselected}
			</div>
		</div>

		return (
			<div styleName="LanguagePicker">
				{display}
			</div>
		)
	}
}
