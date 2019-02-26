import React, { Component } from "react";
import {connect} from "react-redux";
import {getActiveMarkets} from "../../actions";
import Loading from "../loading/Loading";
import styles from './ActiveMarketsList.css'
import CSSModules from "react-css-modules/dist/index";
import ActiveMarketRow from "./ActiveMarketRow";
import PropTypes from 'prop-types';
import {getNetwork} from "../../amoveo3utility";

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
export default class ExpiredMarketsList extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {
			limit: this.props.limit || 20,
			seeMore: this.props.seeMore || false,
		}
	}

	goToSeeAll() {
		this.context.router.push("/expiredMarkets")
	}

	componentDidMount() {
		const {limit} = this.state;
		const network = getNetwork(window.amoveo3);
		this.props.getActiveMarkets({network: network});
	}

	render() {
		const {seeMore} = this.state;
		const {activeMarkets, loading} = this.props;

		let seeMoreLink = <div></div>
		if (seeMore) {
			seeMoreLink = <div styleName="SeeMore" onClick={() => this.goToSeeAll()}>
				<p>See All</p>
			</div>
		}

		if (loading) {
			return (
				<div styleName="LoadingPlaceholder">
					<Loading lightMode={true} />
				</div>
			)
		} else {
			return (
				<div styleName="List">
					<p styleName="Title">Active Markets</p>

					<div>
						{
							activeMarkets.map(function(market, index) {
								return (
									<ActiveMarketRow
										key={index}
										market={market}
									/>
								)
							})
						}
					</div>

					{seeMoreLink}
				</div>
			)
		}
	}
}
