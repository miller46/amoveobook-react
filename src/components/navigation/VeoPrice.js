import React, { Component } from 'react';
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules'
import styles from './VeoPrice.css'
import { getVeoPrice } from '../../actions/index';

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
@CSSModules(styles)
export default class VeoPrice extends Component {

	constructor(props) {
		super(props);

		this.state = {
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
			display = <p>--</p>
		} else {
			display = <p>1 VEO ≈ ${veoPrice.toFixed(2)}</p>
		}
		return (
			<div styleName="VeoPrice">
				{display}
			</div>
		)
	}
}
