import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {getHeight, getMarket, getActiveMarkets, getChannelData} from "../actions";
import {connect} from "react-redux";
import styles from './Advanced.css'

import MarketDetail from '../components/advanced/MarketInfo'
import PlaceOrder from "../components/placeOrder/PlaceOrder";
import PriceChart from "../components/advanced/PriceChart";
import OrderHistory from "../components/advanced/OrderHistory";
import DepthChart from "../components/advanced/DepthChart";
import OrderBook from "../components/advanced/OrderBook";
import Calculator from "../components/payoutCalculator/Calculator";
import Loading from "../components/loading/Loading";
import {priceDecimals, tokenDecimals} from "../config";
import {getDisplayOdds, sumAmounts, getVolume, priceAmount} from "../utility";
import {getNetwork} from "../amoveo3utility";
import YourOrders from "../components/marketDetail/YourOrders";

const mapStateToProps = (state, ownProps) => {
	const {oid} = ownProps.params;
	return {
		account: state.default.account,
		activeMarkets: state.default.activeMarkets,
		marketDetails: state.default.marketDetails[oid],
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
		getChannelData: (network, address, topHeader) => {
			dispatch(getChannelData(network, address, topHeader));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class Advanced extends Component {

	constructor(props) {
		super(props);

		const oid = this.props.params.oid;
		const marketDetail = this.props.params.marketDetail;
		const height = this.props.height;
		const activeMarkets = this.props.activeMarkets;

		this.state = {
			oid: oid,
			account: this.props.account,
			activeMarkets: activeMarkets,
			marketDetail: marketDetail,
			loading: this.props.loading,
			height: height,
			bestPrice: 0,
			amount: undefined,
			price: undefined,
			selectedSide: undefined,
		}

		const network = getNetwork(window.amoveo3);
		if (!marketDetail) {
			this.props.getMarket(network, oid);
		}

		this.updateAmount = this.updateAmount.bind(this)
		this.updatePrice = this.updatePrice.bind(this)
		this.onRowSelect = this.onRowSelect.bind(this)
		this.onOrderSubmit = this.onOrderSubmit.bind(this)
		this.onCancel = this.onCancel.bind(this)
	}

	componentWillMount() {

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

	onRowSelect(side, amount, price) {
		this.setState({
			selectedSide: side,
			amount: amount,
			price: price,
		})
	}

	render() {
		const {oid, price, amount, bestPrice, selectedSide} = this.state;
		const {activeMarkets, marketDetails, height, loading} = this.props;

		let market;
		if (oid) {
			for (let i = 0; i < activeMarkets.length; i++) {
				let activeMarket = activeMarkets[i];
				if (activeMarket.oid === oid) {
					market = activeMarket;
					break;
				}
			}
		} else if (activeMarkets.length > 0) {
			market = activeMarkets[0];
		}

		let volume = "--"
		let openInterest = "--"
		let odds = "--"
		let buys = [];
		let sells = [];
		let prices = [];
		let marketType = ""
		let upperBound = 0
		let lowerBound = 0
		let currencyPrefix = ""
		let currencySuffix = ""

		if (marketDetails && market) {
			prices = marketDetails.matchedOrders;
			buys = marketDetails ? priceAmount(marketDetails.buys) : [];
			sells = marketDetails ? priceAmount(marketDetails.sells) : [];

			volume = getVolume(marketDetails.matchedOrders).toFixed(2);
			openInterest = ((sumAmounts(buys) + sumAmounts(sells)) / tokenDecimals).toFixed(2);

			marketType = market.market_type
			upperBound = market.upper_bound
			lowerBound = market.lower_bound
			currencySuffix = market.currency_suffix

			if (market.currency_prefix) {
				currencyPrefix = market.currency_prefix.replace("EUR", "€")
			}

			odds = getDisplayOdds(marketDetails.matchedOrders);
			if (odds === 0) {
				if (sells.length > 0) {
					let lowestSell = sells[0];
					const lowestBuyPrice = 1 - lowestSell[0] / priceDecimals;
					odds = (lowestBuyPrice * 100);

					const isScalar = market.market_type === "scalar";
					if (isScalar) {
						const upperBound = market.upper_bound;
						const lowerBound = market.lower_bound;
						odds = (upperBound * lowerBound) * odds;
					}

					odds = odds.toFixed(2);
				}
			}
		}

		if (loading) {
			return (
				<div styleName="AdvancedLoading">
					<Loading
						lightMode={true}
					/>
				</div>
			)
		} else if (!market) {
			return (
				<div>
					<p>No markets, please try again later</p>
				</div>
			)
		} else {
			return (
				<div styleName="AdvancedContainer">
					<div styleName="LeftPanel">
						<div styleName="MarketInfoContainer">
							<MarketDetail
								market={market}
								marketDetail={marketDetails}
								height={height}
								prices={prices}
								currencyPrefix={currencyPrefix}
								currencySuffix={currencySuffix}
							/>
						</div>

						<div styleName="OrderConfirm">
							<PlaceOrder
								bestPrice={bestPrice}
								marketType={marketType}
								upperBound={upperBound}
								lowerBound={lowerBound}
								buys={buys}
								sells={sells}
								currencyPrefix={currencyPrefix}
								currencySuffix={currencySuffix}
								onAmountUpdate={this.updateAmount}
								onPriceUpdate={this.updatePrice}
								onOrderSubmit={this.onOrderSubmit}
								price={price}
								amount={amount}
								selectedSide={selectedSide}
								oid={oid}
							/>
						</div>

						<Calculator
							amount={amount}
							price={price}
							titleOverride={true}
							marketType={marketType}
							upperBound={upperBound}
							lowerBound={lowerBound}
							currencyPrefix={currencyPrefix}
							currencySuffix={currencySuffix}
						/>
					</div>

					<div styleName="MiddlePanel">
						<div styleName="PriceChartContainer">
							<PriceChart
								prices={prices}
								oid={oid}
								marketType={marketType}
								upperBound={upperBound}
								lowerBound={lowerBound}
							/>
						</div>

						<div styleName="DepthChartContainer">
							<div styleName="PanelTitle">
								<p>Market Depth</p>
							</div>

							<DepthChart
								buys={buys}
								sells={sells}
								marketType={marketType}
								upperBound={upperBound}
								lowerBound={lowerBound}
							/>
						</div>
					</div>

					<div styleName="RightPanel">
						<div styleName="OrderBookContainer">
							<div styleName="PanelTitle">
								<p>Order Book</p>
							</div>

							<OrderBook
								onSelectRow={this.onRowSelect}
								buys={buys}
								sells={sells}
								marketType={marketType}
								upperBound={upperBound}
								lowerBound={lowerBound}
							/>
						</div>

						<div styleName="OrderHistoryContainer">
							<div styleName="PanelTitle">
								<p>Order History</p>
							</div>

							<OrderHistory
								prices={prices}
								oid={oid}
								marketType={marketType}
								upperBound={upperBound}
								lowerBound={lowerBound}
							/>
						</div>

						<div styleName="YourOrdersContainer">
							<div styleName="PanelTitle">
								<p>Your Orders</p>
							</div>

							<YourOrders
								oid={oid}
								hideTitle={true}
								onCancel={this.onCancel}
							/>
						</div>
					</div>
				</div>
			)
		}
	}
}
