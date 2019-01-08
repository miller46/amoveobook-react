import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {getHeight, getMarket, getActiveMarkets} from "../../actions";
import {connect} from "react-redux";
import styles from './Details.css'
import styles2 from '../markets/MarketRow.css'

import {getDisplayExpires} from '../../utility'
import SectionLabel from "../markets/SectionLabel";
import GoToAdvancedView from "./GoToAdvancedView";

const mapStateToProps = (state, ownProps) => {
	const {oid} = ownProps.params;
	return {
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
@CSSModules(Object.assign({}, styles, styles2))
export default class Details extends Component {

	constructor(props) {
		super(props);

		this.state = {
			oid: this.props.params.oid,
			marketDetail: this.props.marketDetail,
			height: this.props.height,
			activeMarkets: this.props.activeMarkets,
			selectedOrderType: "market",
			selectedBuySell: "buy",
			selectedSide: "long",
			bestPrice: 0,
			price: 0,
			amount: 0,
			userShares: 1,
		}
	}

	componentDidMount() {
		const {oid, marketDetail, height, activeMarkets} = this.state;

		if (!height) {
			this.props.getHeight();
		}

		if (!marketDetail) {
			this.props.getMarket(oid);
		}

		if (!activeMarkets) {
			this.props.getActiveMarkets();
		} else {
			const i = 0;
		}
	}

	handlePriceChange(e) {
		this.setState({ price: e.target.value });
	}

	handleAmountChange(e) {
		this.setState({ amount: e.target.value });
	}

	toggleOrderType() {
		const {selectedOrderType} = this.state;
		let newSelected = Details.isMarket(selectedOrderType) ? "limit" : "market";
		this.setState({selectedOrderType: newSelected})
	}

	static isMarket(type) {
		return type === "market";
	}

	toggleBuySell() {
		const {selectedBuySell} = this.state;
		let newSelected = selectedBuySell === "buy" ? "sell" : "buy";
		this.setState({selectedBuySell: newSelected})
	}

	toggleLongShort() {
		const {selectedSide} = this.state;
		let newSelected = selectedSide === "long" ? "short" : "long";
		this.setState({selectedSide: newSelected})
	}

	submitOrder() {
		const {oid, amount, price, bestPrice, selectedOrderType, selectedBuySell} = this.state;

		let orderPrice;
		if (Details.isMarket(selectedOrderType)) {
			orderPrice = bestPrice;
		} else {
			orderPrice = price;
		}

		let side;
		if (selectedBuySell === "buy") {
			side = "true";
		} else {
			side = "false";
		}

		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			amoveo3.currentProvider.send(
				{
					opts: {
						type: "market", price: price, amount: amount, side: side, oid: oid
					}
				}
			);
		}
	}

	render() {
		const {oid, selectedOrderType, selectedBuySell, price, amount, bestPrice, selectedSide, userShares} = this.state;
		const {marketDetail, height} = this.props;

		let expires = "--"
		let question = "--"
		if (marketDetail) {
			expires = "Expires: " + getDisplayExpires(marketDetail.expires, height)
			question = marketDetail.question;
		}

		const isMarketOrder = selectedOrderType === "market";
		const marketStyleName = isMarketOrder ? "OrderTypeSelectedToggle" : "OrderTypeToggle"
		const limitStyleName = isMarketOrder ? "OrderTypeToggle" : "OrderTypeSelectedToggle"

		const isLong = selectedSide === "long";
		const longStyleName = isLong ? "LongSelectedToggle" : ""
		const shortStyleName = isLong ? "" : "ShortSelectedToggle"

		const isBuy = selectedBuySell === "buy";
		const buyStyleName = isBuy ? "BuySellSelectedToggle" : ""
		const sellStyleName = isBuy ? "" : "BuySellSelectedToggle"

		const buySellStyleName = userShares > 0 ? "BuySellToggle" : "Hidden";

		return (
			<div styleName="DetailsContainer">
				<div styleName="PanelLeft">
					<div styleName="DetailInfo">
						<div styleName="Card">
							<div>
								<p>{expires}</p>
							</div>
							<div>
								<h1>{question}</h1>
							</div>
						</div>
					</div>
					<div styleName="Orders">
						<SectionLabel
							titleText="Your Orders"
						/>
						<div styleName="OrderRow">
							<p>No orders</p>
						</div>
					</div>

					<GoToAdvancedView
					/>
				</div>

				<div styleName="PanelRight">
					<div>
						<div styleName={buySellStyleName}>
							<div className="left" styleName={buyStyleName} onClick={() => {if (selectedBuySell === "sell") this.toggleBuySell()}}>
								<p>Buy Shares</p>
							</div>
							<div className="right" styleName={sellStyleName} onClick={() => {if (selectedBuySell === "buy") this.toggleBuySell()}}>
								<p>Sell Shares</p>
							</div>
						</div>

						<div styleName="OrderContainer">
							<div styleName="LongShortToggle">
								<div className="left" styleName={longStyleName} onClick={() => {if (selectedSide === "short") this.toggleLongShort()}}>
									<p>Long</p>
								</div>
								<div className="right" styleName={shortStyleName} onClick={() => {if (selectedSide === "long") this.toggleLongShort()}}>
									<p>Short</p>
								</div>
							</div>
							<div styleName="OrderForm">
								<div styleName="FormRow">
									<div className="left">
										<p>Amount</p>
									</div>
									<div className="right">
										<input
											type="text"
											value={amount}
											onChange={this.handleAmountChange.bind(this)}
										/>
									</div>
								</div>
								<div styleName="FormRow">
									<div className="left">
										<p>Price</p>
									</div>
									<div className="right">
										<input
											disabled={isMarketOrder}
											type="text"
											value={isMarketOrder ? bestPrice : price}
											onChange={this.handlePriceChange.bind(this)}
										/>

										<div styleName="OrderType">
											<div className="left" styleName={marketStyleName} onClick={() => this.toggleOrderType()}>
												<p>Best Price</p>
											</div>
											<div className="right" styleName={limitStyleName} onClick={() => this.toggleOrderType()}>
												<p>Set Price</p>
											</div>
										</div>
									</div>
								</div>
								<div styleName="OrderFormButton">
									<button onClick={this.submitOrder.bind(this)}>Buy</button>
								</div>
							</div>
						</div>
						<div styleName="PayoutCalculator">
							<div>
								<SectionLabel
									titleText="Payout Calculator"
								/>
							</div>
							<div>
								<p>Payout Calculator</p>
							</div>
						</div>

					</div>
				</div>
			</div>
		)
	}
}
