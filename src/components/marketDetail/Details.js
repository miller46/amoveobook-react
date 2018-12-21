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

	render() {
		const {oid} = this.state;
		const {marketDetail, height} = this.props;

		let expires = "--"
		let question = "--"
		if (marketDetail) {
			expires = "Expires: " + getDisplayExpires(marketDetail.expires, height)
			question = marketDetail.question;
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
							<div>
								<p>Market</p>
							</div>
							<div>
								<p>Limit</p>
							</div>
						</div>
						<div styleName="BuySellToggle">
							<div>
								<p>Buy</p>
							</div>
							<div>
								<p>Sell</p>
							</div>
						</div>
						<div styleName="OrderForm">
							<div>
								<p>Amount</p>
							</div>
							<div>
								<p>Price</p>
							</div>
							<div>
								<button>Buy</button>
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
