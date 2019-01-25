import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {getHeight, getMarket, getActiveMarkets, getAccount} from "../../actions";
import {connect} from "react-redux";
import styles from './Details.css'
import styles2 from '../markets/MarketRow.css'
import PropTypes from 'prop-types';

import {getDisplayExpires} from '../../utility'
import Calculator from "../payoutCalculator/Calculator";
import GoToAdvancedView from "./GoToAdvancedView";
import PlaceOrder from "../placeOrder/PlaceOrder";
import YourOrders from "./YourOrders";
import MarketDetailCard from "./MarketDetailCard";

const mapStateToProps = (state, ownProps) => {
	const {oid} = ownProps.params;
	return {
		account: state.default.account,
		activeMarkets: state.default.activeMarkets,
		marketDetail: state.default.marketDetails[oid],
		loading: state.default.loading.marketDetails[oid],
		height: state.default.height,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getHeight: (network) => {
			dispatch(getHeight(network));
		},
		getMarket: (network, oid) => {
			dispatch(getMarket(network, oid));
		},
		getActiveMarkets: () => {
			dispatch(getActiveMarkets());
		},
		getAccount: (address) => {
			dispatch(getAccount(address));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(Object.assign({}, styles, styles2))
export default class Details extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);

		this.state = {
			oid: this.props.params.oid,
			account: this.props.account,
			marketDetail: this.props.marketDetail,
			height: this.props.height,
			activeMarkets: this.props.activeMarkets,
			bestPrice: 0,
			amount: 0,
			price: 0,
			selectedOrderType: "limit",
			hideAdvanced: false,
			updateOrders: false,
		}

		this.updateAmount = this.updateAmount.bind(this)
		this.updatePrice = this.updatePrice.bind(this)
		this.onOrderSubmit = this.onOrderSubmit.bind(this)
	}

	componentDidMount() {
		const {oid, marketDetail, height, activeMarkets, bestPrice} = this.state;

		if (!height) {
			if (window.amoveo3) {
				this.props.getHeight(window.amoveo3.network);
			}
		}

		if (!marketDetail) {
			if (window.amoveo3) {
				this.props.getMarket(window.amoveo3.network, oid);
			}
		}

		if (activeMarkets.length === 0) {
			this.props.getActiveMarkets();
		} else {
			const i = 0;
		}
	}

	onOrderSubmit() {
		//TODO
		// clear form
		// refresh YourOrders component (it just reads from channels inside wallet)
		// save wallet state in API - WBN
		//

		this.setState({updateOrders: true});
	}

	updatePrice(price) {
		this.setState({price: price})
	}

	updateAmount(amount) {
		this.setState({amount: amount})
	}

	render() {
		const {hideAdvanced, oid, price, amount, bestPrice, updateOrders} = this.state;
		const {account, activeMarkets, marketDetail, height} = this.props;

		let market;
		for (let i = 0; i < activeMarkets.length; i++) {
			let activeMarket = activeMarkets[i];
			if (activeMarket.oid === oid) {
				market = activeMarket;
				break;
			}
		}

		let marketType = ""
		let upperBound = 0
		let lowerBound = 0
		if (market) {
			marketType = market.market_type
			upperBound = market.upper_bound
			lowerBound = market.lower_bound
		}

		let hasChannel = false;
		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			if (amoveo3.channels && amoveo3.channels.length > 0) {
				hasChannel = true;
			}
		}

		return (
			<div styleName="DetailsContainer">
				<div styleName="PanelLeft">
					<MarketDetailCard
						market={market}
						height={height}
					/>

					<YourOrders
						oid={oid}
						update={updateOrders}
						marketType={marketType}
						upperBound={upperBound}
						lowerBound={lowerBound}
					/>

					{
						hideAdvanced
							? <div></div>
							: <GoToAdvancedView
									oid={oid}
								/>
					}
				</div>

				<div styleName="PanelRight">
					<div>
						<PlaceOrder
							onAmountUpdate={this.updateAmount}
							onPriceUpdate={this.updatePrice}
							onOrderSubmit={this.onOrderSubmit}
							bestPrice={bestPrice}
							marketType={marketType}
							upperBound={upperBound}
							lowerBound={lowerBound}
							oid={oid}
						/>

						<Calculator
							amount={amount}
							price={price}
							marketType={marketType}
							upperBound={upperBound}
							lowerBound={lowerBound}
						/>
					</div>
				</div>
			</div>
		)
	}
}
