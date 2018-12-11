import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Logo.css'

import {LOGO_URL} from './../../assets/';

@CSSModules(styles)
export default class Logo extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="Logo">
				<img alt="" src={LOGO_URL} />
				<p>AmoveoBook</p>
			</div>
		)
	}
}
