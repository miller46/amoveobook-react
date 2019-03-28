import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Orders.css'
import PropTypes from 'prop-types';

import YourOrders from '../components/marketDetail/YourOrders'

@CSSModules(styles)
export default class Orders extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);

		this.refresh = this.refresh.bind(this)
	}

	refresh() {
		this.context.router.push("/orders")
	}

	render() {
		return (
			<div styleName="Container">
				<YourOrders
					onCancel={this.refresh}
				/>
			</div>
		)
	}
}
