import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Orders.css'

import YourOrders from '../components/marketDetail/YourOrders'

@CSSModules(styles)
export default class Orders extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="Container">
				<YourOrders />
			</div>
		)
	}
}
