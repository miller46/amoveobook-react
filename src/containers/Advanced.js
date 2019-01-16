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
		getHeight: () => {
			dispatch(getHeight());
		},
		getMarket: (oid) => {
			dispatch(getMarket(oid));
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
		}
	}

	componentWillMount() {
		const {oid, marketDetail, height, activeMarkets} = this.state;

		if (!height) {
			this.props.getHeight();
		}

		if (!marketDetail) {
			this.props.getMarket(oid);
		}

		if (activeMarkets.length === 0) {
			this.props.getActiveMarkets();
		} else {
			const i = 0;
		}
	}

	render() {
		const {oid, bestPrice} = this.state;
		const {activeMarkets, height} = this.props;

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
							/>
						</div>
					</div>

					<div  styleName="MiddlePanel">
						<div styleName="PanelTitle">
							<p>Price Chart</p>
						</div>

						<PriceChart
							prices={[]}
							buys={[]}
							sells={[]}
						/>

						<div styleName="PanelTitle">
							<p>Market Depth</p>
						</div>

						<DepthChart
							prices={[]}
							buys={[]}
							sells={[]}
						/>

					</div>
					<div  styleName="RightPanel">
						<div>
							<div styleName="PanelTitle">
								<p>Order Book</p>
							</div>

							<OrderBook
								buys={[]}
								sells={[]}
							/>
						</div>

						<div>
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
