import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {getHeight, getMarket, getActiveMarkets} from "../../actions";
import {connect} from "react-redux";
import styles from './Details.css'
import styles2 from '../markets/MarketRow.css'

import {getDisplayExpires} from '../../utility'
import Calculator from "../payoutCalculator/Calculator";
import GoToAdvancedView from "./GoToAdvancedView";
import PlaceOrder from "../placeOrder/PlaceOrder";
import YourOrders from "./YourOrders";

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
@CSSModules(Object.assign({}, styles, styles2))
export default class Details extends Component {

	constructor(props) {
		super(props);

		this.state = {
			oid: this.props.params.oid,
			account: this.account,
			marketDetail: this.props.marketDetail,
			height: this.props.height,
			activeMarkets: this.props.activeMarkets,
			bestPrice: 0,
			amount: 0,
			price: 0,
			selectedOrderType: "limit",
			hideAdvanced: true,
		}

		this.updateAmount = this.updateAmount.bind(this)
		this.updatePrice = this.updatePrice.bind(this)
	}

	componentDidMount() {
		const {oid, marketDetail, height, activeMarkets, bestPrice} = this.state;

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

	updatePrice(price) {
		this.setState({price: price})
	}

	updateAmount(amount) {
		this.setState({amount: amount})
	}

	render() {
		const {hideAdvanced, oid, price, amount, bestPrice} = this.state;
		const {account, activeMarkets, marketDetail, height} = this.props;

		let expires = "--"
		if (marketDetail) {
			expires = "Expires: " + getDisplayExpires(marketDetail.expires, height)
		}

		let market;
		for (let i = 0; i < activeMarkets.length; i++) {
			let activeMarket = activeMarkets[i];
			if (activeMarket.oid === oid) {
				market = activeMarket;
				break;
			}
		}

		let question = "--"
		if (market) {
			question = market.question;
		}

		let hasChannel = false;
		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			if (amoveo3.channels && amoveo3.channels.length > 0) {
				hasChannel = true;
			}
		}

		let calculator = <div></div>
		if (account && hasChannel) {
			calculator = <Calculator
				amount={amount}
				price={price}
			/>
		}

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

					<YourOrders/>

					{
						hideAdvanced ? <div></div> : <GoToAdvancedView />
					}
				</div>

				<div styleName="PanelRight">
					<div>
						<PlaceOrder
							onAmountUpdate={this.updateAmount}
							onPriceUpdate={this.updatePrice}
							bestPrice={bestPrice}
						/>

						{calculator}
					</div>
				</div>
			</div>
		)
	}
}
