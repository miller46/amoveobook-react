import React, { Component } from "react";
import {connect} from "react-redux";
import {getExpiredMarkets} from "../../actions";
import Loading from "../loading/Loading";
import SectionLabel from "./SectionLabel";
import styles from './ExpiredMarkets.css'
import CSSModules from "react-css-modules/dist/index";
import ExpiredMarketsRow from "./ExpiredMarketRow";

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

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.getExpiredMarkets({limit: 3});
	}

	render() {
		const {expiredMarkets, loading} = this.props;

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
							<div styleName="QuestionCol">
								<p>Market</p>
							</div>
							<div styleName="ExpiredCol">
								<p>Expired</p>
							</div>
							<div styleName="ResolutionCol">
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
				</div>
			)
		}
	}
}
