import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {connect} from "react-redux";
import {getActiveMarkets} from "../../actions";
import Loading from "../loading/Loading";
import styles from './MarketsList.css'
import MarketRow from './MarketRow'
import SectionLabel from "./SectionLabel";

const mapStateToProps = (state) => {
	return {
		error: state.default.error.activeMarkets,
		loading: state.default.loading.activeMarkets,
		activeMarkets: state.default.activeMarkets,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getActiveMarkets: (options) => {
			dispatch(getActiveMarkets(options));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class MarketsList extends Component {

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		let network = localStorage.getItem("lastNetwork") || "mainnet"
		if (window.amoveo3) {
			network = window.amoveo3.network || localStorage.getItem("lastNetwork") || "mainnet";
		}
		this.props.getActiveMarkets({network: network });
	}

	render() {
		const {activeMarkets, loading} = this.props;

		let display;
		if (loading) {
			display = <div styleName="LoadingPlaceholder">
					<Loading lightMode={true} />
				</div>
		} else if (!activeMarkets || activeMarkets.length === 0) {
			display = <div>
				<p>No active markets at this time. Please check back later.</p>
			</div>
		} else {
			display = <div>
				{
					activeMarkets.map(function(market, index) {
						return (
							<MarketRow
								key={index}
								market={market}
							/>
						)
					})
				}
			</div>

		}

		return (
			<div styleName="List">
				<SectionLabel titleText={"Active Markets"} />

				{display}
			</div>
		)
	}
}
