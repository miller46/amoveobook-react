import React, { Component } from "react";
import {connect} from "react-redux";
import {getExpiredMarkets} from "../../actions";
import Loading from "../loading/Loading";
import SectionLabel from "./SectionLabel";
import styles from './ExpiredMarkets.css'
import CSSModules from "react-css-modules/dist/index";
import ExpiredMarketsRow from "./ExpiredMarketRow";
import PropTypes from 'prop-types';

const mapStateToProps = (state) => {
	return {
		error: state.default.error.expiredMarkets,
		loading: state.default.loading.expiredMarkets,
		expiredMarkets: state.default.expiredMarkets,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getExpiredMarkets: (options) => {
			dispatch(getExpiredMarkets(options));
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
			seeMore: this.props.seeMore
		}
	}

	goToSeeAll() {
		this.context.router.push("/expiredMarkets")
	}

	componentDidMount() {
		const {limit} = this.state;
		this.props.getExpiredMarkets({limit: limit});
	}

	render() {
		const {seeMore} = this.state;
		const {expiredMarkets, loading} = this.props;

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
					<SectionLabel titleText={"Expired Markets"} />

					<div>
						<div styleName="TableHeader">
							<div>
								<p>Market</p>
							</div>
							<div>
								<p>Expired</p>
							</div>
							<div>
								<p>Outcome</p>
							</div>
						</div>
						{
							expiredMarkets.map(function(market, index) {
								return (
									<ExpiredMarketsRow
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
