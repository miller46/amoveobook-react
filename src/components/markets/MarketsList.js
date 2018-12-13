import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {connect} from "react-redux";
import {getActiveMarkets} from "../../actions";
import Loading from "../Loading";
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
		this.props.getActiveMarkets();
	}

	render() {
		const {activeMarkets, loading} = this.props;

		if (loading) {
			return (
				<div>
					<Loading />
				</div>
			)
		} else {
			return (
				<div styleName="List">
					<SectionLabel titleText={"Active Markets"} />

					<div>
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
				</div>
			)
		}
	}
}
