import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {getHeight, getMarket, getActiveMarkets, getAccount, getChannelData} from "../../actions";
import {connect} from "react-redux";
import styles from './Details.css'
import styles2 from '../markets/MarketRow.css'
import PropTypes from 'prop-types';

import {getNetwork} from '../../amoveo3utility'
import Calculator from "../payoutCalculator/Calculator";
import GoToAdvancedView from "./GoToAdvancedView";
import PlaceOrder from "../placeOrder/PlaceOrder";
import PriceChart from "../advanced/PriceChart";
import YourOrders from "./YourOrders";
import MarketDetailCard from "./MarketDetailCard";
import ActiveMarketsList from "./ActiveMarketsList";
import ChannelPending from "../transaction/ChannelPending";
import {getDisplayOdds, sumAmounts, getVolume, priceAmount} from "../../utility";
import {priceDecimals, tokenDecimals} from "../../config";

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
		getActiveMarkets: (options) => {
			dispatch(getActiveMarkets(options));
		},
		getAccount: (address) => {
			dispatch(getAccount(address));
		},
		getChannelData: (network, address, topHeader) => {
			dispatch(getChannelData(network, address, topHeader));
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

		const oid = this.props.params.oid;

		this.state = {
			oid: oid,
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
			location: oid,
		}

		this.updateAmount = this.updateAmount.bind(this)
		this.updatePrice = this.updatePrice.bind(this)
		this.onOrderSubmit = this.onOrderSubmit.bind(this)
		this.onCancel = this.onCancel.bind(this)
	}

	componentWillReceiveProps(props) {
		const {oid} = this.state;
		const location = props.location.pathname.replace("/", "");
		if (encodeURIComponent(oid) !== location) {
			window.location.reload();
		}
	}

	componentDidMount() {
		const {oid, marketDetail} = this.state;

		const network = getNetwork(window.amoveo3);
		if (!marketDetail) {
			this.props.getMarket(network, oid);
		}
	}

	onOrderSubmit() {
		//TODO
		// clear form
		// save wallet state in API - WBN
		//
		this.updateOrders();
	}

	onCancel() {
		this.updateOrders();
	}

	updateOrders() {
		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			const address = amoveo3.coinbase;
			const network = getNetwork(amoveo3);
			const topHeader = amoveo3.topHeader;

			this.props.getChannelData(network, address, topHeader)
		}
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
		let currencyPrefix = ""
		let currencySuffix = ""
		if (market) {
			marketType = market.market_type
			upperBound = market.upper_bound
			lowerBound = market.lower_bound
			currencySuffix = market.currency_suffix

			if (market.currency_prefix) {
				currencyPrefix = market.currency_prefix.replace("EUR", "€")
			}
		}

		let buys = [];
		let sells = [];
		let prices = [];

		if (marketDetail && market) {
			prices = marketDetail.matchedOrders;
			buys = marketDetail ? priceAmount(marketDetail.buys) : [];
			sells = marketDetail ? priceAmount(marketDetail.sells) : [];
		}

		return (
			<div styleName="DetailsContainer">
				<div styleName="TopPanel">
					<ChannelPending />

					<MarketDetailCard
						market={market}
						height={height}
						prices={prices}
						currencyPrefix={currencyPrefix}
						currencySuffix={currencySuffix}
					/>
				</div>

				<div styleName="PanelLeft">
					<div>
						<PlaceOrder
							onAmountUpdate={this.updateAmount}
							onPriceUpdate={this.updatePrice}
							onOrderSubmit={this.onOrderSubmit}
							bestPrice={bestPrice}
							price={price}
							amount={amount}
							buys={buys}
							sells={sells}
							marketType={marketType}
							upperBound={upperBound}
							lowerBound={lowerBound}
							currencyPrefix={currencyPrefix}
							currencySuffix={currencySuffix}
							oid={oid}
						/>
					</div>

					<div>
						<Calculator
							amount={amount}
							price={price}
							marketType={marketType}
							upperBound={upperBound}
							lowerBound={lowerBound}
							currencyPrefix={currencyPrefix}
							currencySuffix={currencySuffix}
						/>
					</div>

					{
						hideAdvanced
							? <div></div>
							: <GoToAdvancedView
									oid={oid}
								/>
					}
				</div>

				<div styleName="PanelRight">
					<div styleName="DetailCard">
						<PriceChart
							prices={prices}
							oid={oid}
							marketType={marketType}
							upperBound={upperBound}
							lowerBound={lowerBound}
						/>
					</div>

					<div styleName="DetailCard">
						<p styleName="CardTitle">Your Orders</p>

						<YourOrders
							oid={oid}
							hideTitle={true}s
							onCancel={this.onCancel}
						/>
					</div>
				</div>

			</div>
		)
	}
}
