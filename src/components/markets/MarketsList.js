import React, { Component } from "react";
import {connect} from "react-redux";
import {getActiveMarkets} from "../../actions";
import Loading from "../Loading";


const mapStateToProps = (state) => {
	return {
		loading: state.default.loading,
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
				<div>
					<div>
						<p>Markets List</p>
					</div>

					<div>
						{
							activeMarkets.map(function(market, index) {
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
