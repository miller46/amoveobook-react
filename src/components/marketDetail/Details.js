import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import {getMarket} from "../../actions";
import {connect} from "react-redux";
import styles from './Details.css'

const mapStateToProps = (state, ownProps) => {
	const {oid} = ownProps.params;
	return {
		marketDetail: state.default.marketDetails[oid],
		loading: state.default.loading.marketDetails[oid],
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getMarket: (oid) => {
			dispatch(getMarket(oid));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class Details extends Component {

	constructor(props) {
		super(props);

		this.state = {
			oid: this.props.params.oid,
		}
	}

	componentDidMount() {
		const {oid} = this.state;
		this.props.getMarket(oid)
	}

	render() {
		const {oid} = this.state;
		const {marketDetail} = this.props;

		let expires = "--"
		if (marketDetail) {
			expires = marketDetail.expires
		}
		return (
			<div>
				<div>
					<p>{oid}</p>
				</div>
				<div>
					<p>{expires}</p>
				</div>
			</div>
		)
	}
}
