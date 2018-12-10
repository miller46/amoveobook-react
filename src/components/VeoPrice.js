import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getVeoPrice } from '../actions';

const mapStateToProps = (state) => {
	return {
		loading: state.default.loading,
		veoPrice: state.default.veoPrice,
		error: state.default.error,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getVeoPrice: () => {
			dispatch(getVeoPrice());
		}
	};
};

@connect(mapStateToProps, mapDispatchToProps)
export default class VeoPrice extends Component {

	constructor(props) {
		super(props);

		this.state = {
			price: 0,
			loading: true,
		}
	}

	componentDidMount() {
		this.props.getVeoPrice();
	}

	render() {
		const {loading, veoPrice, error} = this.props;

		let display;
		if (loading) {
			display = <p>Loading...</p>
		} else if (error) {
			display = <p>Error</p>
		} else {
			display = <p>${veoPrice.toFixed(2)}</p>
		}
		return (
			<div>
				<h1>Get Price</h1>
				{display}
			</div>
		)
	}
}
