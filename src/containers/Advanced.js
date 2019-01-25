import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {getHeight, getMarket, getActiveMarkets} from "../actions";
import {connect} from "react-redux";
import styles from './Advanced.css'

import MarketDetail from '../components/advanced/MarketInfo'
import PlaceOrder from "../components/placeOrder/PlaceOrder";
import PriceChart from "../components/advanced/PriceChart";
import OrderHistory from "../components/advanced/OrderHistory";
import DepthChart from "../components/advanced/DepthChart";
import OrderBook from "../components/advanced/OrderBook";
import Calculator from "../components/payoutCalculator/Calculator";


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
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class Advanced extends Component {

	constructor(props) {
		super(props);
		this.state = {
			oid: this.props.params.oid,
			account: this.props.account,
			activeMarkets: this.props.activeMarkets,
			marketDetail: this.props.marketDetail,
			loading: this.props.loading,
			height: this.props.height,
			bestPrice: 0,
			amount: 0,
			price: 0,
		}

		this.updateAmount = this.updateAmount.bind(this)
		this.updatePrice = this.updatePrice.bind(this)
	}

	componentWillMount() {
		const {oid, marketDetail, height, activeMarkets, account} = this.state;

		if (window.amoveo3) {
			const network = window.amoveo3.network;
			if (!height) {
				this.props.getHeight(network);
			}
			if (!marketDetail) {
				this.props.getMarket(network, oid);
			}
		}

		if (activeMarkets.length === 0) {
			this.props.getActiveMarkets();
		} else {
			const i = 0;
		}
	}

	updatePrice(price) {
		this.setState({price: price})
	}

	updateAmount(amount) {
		this.setState({amount: amount})
	}

	render() {
		const {oid, price, amount, bestPrice} = this.state;
		const {account, activeMarkets, height} = this.props;

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

		if (!market) {
			return (<div><p>No markets, please try again later</p></div>)
		} else {
			const marketType = market.market_type;
			const upperBound = market.upper_bound;
			const lowerBound = market.lower_bound;

			let hasChannel = false;
			const amoveo3 = window.amoveo3;
			if (amoveo3) {
				if (amoveo3.channels && amoveo3.channels.length > 0) {
					hasChannel = true;
				}
			}

			return (
				<div styleName="AdvancedContainer">
					<div styleName="LeftPanel">
						<div>
							<MarketDetail
								market={market}
								height={height}
							/>
						</div>

						<div styleName="OrderConfirm">
							<PlaceOrder
								bestPrice={bestPrice}
								marketType={marketType}
								upperBound={upperBound}
								lowerBound={lowerBound}
								onAmountUpdate={this.updateAmount}
								onPriceUpdate={this.updatePrice}
							/>
						</div>

						<Calculator
							amount={amount}
							price={price}
							marketType={marketType}
							upperBound={upperBound}
							lowerBound={lowerBound}
						/>
					</div>

					<div styleName="MiddlePanel">
						<div styleName="PriceChartContainer">
							<div styleName="PanelTitle">
								<p>Price Chart</p>
							</div>

							<PriceChart
								prices={[]}
								buys={[]}
								sells={[]}
							/>
						</div>

						<div styleName="DepthChartContainer">
							<div styleName="PanelTitle">
								<p>Market Depth</p>
							</div>

							<DepthChart
								prices={[]}
								buys={[]}
								sells={[]}
							/>
						</div>

					</div>
					<div  styleName="RightPanel">
						<div styleName="OrderBookContainer">
							<div styleName="PanelTitle">
								<p>Order Book</p>
							</div>

							<OrderBook
								buys={[]}
								sells={[]}
							/>
						</div>

						<div styleName="OrderHistoryContainer">
							<div styleName="PanelTitle">
								<p>Order History</p>
							</div>

							<OrderHistory
								prices={[]}
							/>
						</div>
					</div>
				</div>
			)
		}
	}
}
