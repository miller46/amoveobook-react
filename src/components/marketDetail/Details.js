import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {getHeight, getMarket} from "../../actions";
import {connect} from "react-redux";
import styles from './Details.css'
import styles2 from '../markets/MarketRow.css'

import {getDisplayExpires} from '../../utility'
import SectionLabel from "../markets/SectionLabel";
import GoToAdvancedView from "./GoToAdvancedView";

const mapStateToProps = (state, ownProps) => {
	const {oid} = ownProps.params;
	return {
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
			selectedOrderType: "market",
			selectedBuySell: "buy",
		}
	}

	componentDidMount() {
		const {oid, marketDetail, height} = this.state;

		if (!height) {
			this.props.getHeight();
		}

		if (!marketDetail) {
			this.props.getMarket(oid);
		}
	}

	toggleOrderType() {
		const {selectedOrderType} = this.state;
		let newSelected = selectedOrderType === "market" ? "limit" : "market";
		this.setState({selectedOrderType: newSelected})
	}

	toggleBuySell() {
		const {selectedBuySell} = this.state;
		let newSelected = selectedBuySell === "buy" ? "sell" : "buy";
		this.setState({selectedBuySell: newSelected})
	}

	render() {
		const {oid, selectedOrderType, selectedBuySell} = this.state;
		const {marketDetail, height} = this.props;

		let expires = "--"
		let question = "--"
		if (marketDetail) {
			expires = "Expires: " + getDisplayExpires(marketDetail.expires, height)
			question = marketDetail.question;
		}

		const isMarketOrder = selectedOrderType === "market";
		const marketStyleName = isMarketOrder ? "OrderTypeSelectedToggle" : ""
		const limitStyleName = isMarketOrder ? "" : "OrderTypeSelectedToggle"

		const isBuy = selectedBuySell === "buy";
		const buyStyleName = isBuy ? "BuySellSelectedToggle" : ""
		const sellStyleName = isBuy ? "" : "BuySellSelectedToggle"
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
						<div styleName="OrderType">
							<div className="left" styleName={marketStyleName} onClick={() => this.toggleOrderType()}>
								<p>Market</p>
							</div>
							<div className="right" styleName={limitStyleName} onClick={() => this.toggleOrderType()}>
								<p>Limit</p>
							</div>
						</div>
						<div styleName="OrderContainer">
							<div styleName="BuySellToggle">
								<div className="left" styleName={buyStyleName} onClick={() => this.toggleBuySell()}>
									<p>Buy</p>
								</div>
								<div className="right" styleName={sellStyleName} onClick={() => this.toggleBuySell()}>
									<p>Sell</p>
								</div>
							</div>
							<div styleName="OrderForm">
								<div>
									<div className="left">
										<p>Amount</p>
									</div>
									<div className="right">
										<input type="text" />
									</div>
								</div>
								<div>
									<div className="left">
										<p>Price</p>
									</div>
									<div className="right">
										<input type="text" />
									</div>
								</div>
								<div styleName="OrderFormButton">
									<button>Buy</button>
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
