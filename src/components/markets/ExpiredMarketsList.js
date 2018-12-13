import React, { Component } from "react";
import {connect} from "react-redux";
import {getExpiredMarkets} from "../../actions";
import Loading from "../Loading";


const mapStateToProps = (state) => {
	return {
		loading: state.default.loading,
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
		this.props.getExpiredMarkets();
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
					<div>
						<p>Expired Markets List</p>
					</div>

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
