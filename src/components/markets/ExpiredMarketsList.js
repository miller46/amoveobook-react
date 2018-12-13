import React, { Component } from "react";
import {connect} from "react-redux";
import {getExpiredMarkets} from "../../actions";
import Loading from "../Loading";
import SectionLabel from "./SectionLabel";


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
				<div>
					<Loading />
				</div>
			)
		} else {
			return (
				<div>
					<SectionLabel titleText={"Expired Markets List"} />

					<div>
						{
							expiredMarkets.map(function(market, index) {
								return (
									<div key={index}>
										{market.question}
									</div>
								)
							})
						}
					</div>
				</div>
			)
		}
	}
}
