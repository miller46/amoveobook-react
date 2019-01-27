import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import PropTypes from 'prop-types';
import styles from './MarketRow.css'
import {connect} from "react-redux";
import {Redirect} from 'react-router'
import {getHeight, getMarket} from "../../actions";
import {tokenDecimals, priceDecimals, tokenUnit} from "../../config";
import {getDisplayExpires, getDisplayOdds, sumAmounts, getVolume, priceAmount} from "../../utility";
import {getNetwork} from "../../amoveo3utility";

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
		getHeight: (network) => {
			dispatch(getHeight(network));
		},
		getMarket: (network, oid) => {
			dispatch(getMarket(network, oid));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class MarketRow extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {
			market: props.market,
			goToDetails: false,
		}

		this.goToDetails = this.goToDetails.bind(this)
	}

	componentDidMount() {
		const network = getNetwork(window.amoveo3);
		this.props.getHeight(network);
		this.props.getMarket(network, this.state.market.oid);
	}

	goToDetails() {
		this.context.router.push("/" + encodeURIComponent(this.state.market.oid))
	}

	render() {
		const {height, marketDetails} = this.props;
		const {market} = this.state;

		const expiresText = getDisplayExpires(market.end_block, height);

		const isScalar = market.market_type === "scalar";
		let volume = "--"
		let openInterest = "--"
		let odds = "--"

		if (marketDetails) {
			const buys = marketDetails ? priceAmount(marketDetails.buys) : [];
			const sells = marketDetails ? priceAmount(marketDetails.sells) : [];

			volume = getVolume(marketDetails.matchedOrders).toFixed(2);
			openInterest = ((sumAmounts(buys) + sumAmounts(sells)) / tokenDecimals).toFixed(2);

			odds = getDisplayOdds(marketDetails.matchedOrders);
			if (odds === 0) {
				if (sells.length > 0) {
					let lowestSell = sells[0];
					const lowestBuyPrice = 1 - lowestSell[0] / priceDecimals;
					odds = (lowestBuyPrice * 100);

					if (isScalar) {
						const upperBound = market.upper_bound;
						const lowerBound = market.lower_bound;
						odds = (upperBound * lowerBound) * odds;
					}

					odds = odds.toFixed(2);
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
						<div  styleName="Expires">
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
							<label>{isScalar ? "Current Value" : "Odds"}</label>
							<p>{odds}{isScalar ? "" : "%"}</p>
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
