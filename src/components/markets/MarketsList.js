import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {connect} from "react-redux";
import {getActiveMarkets} from "../../actions";
import {getNetwork} from "../../amoveo3utility";
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
		const network = getNetwork(window.amoveo3);
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
