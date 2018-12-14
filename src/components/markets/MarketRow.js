import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './MarketRow.css'
import {connect} from "react-redux";
import {getHeight, getMarket} from "../../actions";
import {tokenDecimals, tokenUnit} from "../../config";

const mapStateToProps = (state, ownProps) => {
	return {
		heightError: state.default.error.height,
		marketDetails: state.default.marketDetails[ownProps.market.oid],
		loading: state.default.loading.height,
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
@CSSModules(styles)
export default class MarketRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			market: props.market,
		}

		this.goToDetails = this.goToDetails.bind(this)
	}

	componentDidMount() {
		this.props.getHeight()
		this.props.getMarket(this.state.market.oid)
	}

	goToDetails() {

	}

	static getVolume(orders) {
		let volume = 0;
		if (orders.length > 0) {
			for (let i = 0; i < orders.length; i++) {
				volume += orders[i].buy_amount;
			}
		}
		if (!volume) {
			volume = 0;
		}

		return volume;
	}

	static sumAmounts(orders) {
		let totalVolume = 0;
		for (let i = 0; i < orders.length; i++) {
			totalVolume = totalVolume + orders[i][1];
		}
		return totalVolume;
	}

	static priceAmount(orders) {
		let x = [];
		for (let i = 1; i < orders.length; i++) {
			x.push([orders[i][2], orders[i][4]]);
		}
		return x.reverse();
	}

	static getDisplayOdds(prices) {
		let odds = 0;
		if (prices.length > 0) {
			odds = (prices[0].price * 100).toFixed(0);
		}

		return odds;
	}

	render() {
		const {height, marketDetails}= this.props;
		const {market} = this.state;

		let expires = new Date();
		const diff = market.end_block - height;
		const minutes = diff * 10;
		expires.setMinutes(expires.getMinutes() + minutes);
		const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
		const expiresText = expires.toLocaleDateString('en-US', options) + " (Block " + market.end_block + ")";


		let volume = "--"
		let openInterest = "--"
		let odds = "--"
		if (marketDetails) {
			const buys = marketDetails ? MarketRow.priceAmount(marketDetails.buys) : [];
			const sells = marketDetails ? MarketRow.priceAmount(marketDetails.sells) : [];

			volume = MarketRow.getVolume(marketDetails.matchedOrders);
			openInterest = (MarketRow.sumAmounts(buys) + MarketRow.sumAmounts(sells)) / tokenDecimals;
			odds = MarketRow.getDisplayOdds(marketDetails.matchedOrders);
			if (odds === 0) {
				if (sells.length > 0) {
					let lowestSell = sells[0];
					const lowestBuyPrice = 1 - lowestSell[0] / 100000;
					odds = lowestBuyPrice * 100;
				}

				if (odds === 0) {
					odds = "--"
				}
			}
		}

		return (
			<div styleName="Card" onClick={() => this.goToDetails()}>
				<div styleName="Market">
					<div styleName="LeftPanel">
						<div styleName="Question">
							<h1>{market.question}</h1>
						</div>
						<div>
							<label>Expires</label>
							<p>{expiresText}</p>
						</div>
					</div>
					<div styleName="Separator">
					</div>
					<div styleName="RightPanel">
						<div>
							<label>Volume</label>
							<p>{volume} <small>{tokenUnit}</small></p>
						</div>
						<div>
							<label>Current Odds</label>
							<p>{odds}%</p>
						</div>
						<div>
							<label>Open Bets</label>
							<p>{openInterest} <small>{tokenUnit}</small>
							</p>
						</div>
					</div>
					<div className="clear"></div>
				</div>

			</div>
		)
	}
}
