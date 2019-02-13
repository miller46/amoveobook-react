import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Logo.css'

import {LOGO_URL, LOGO_URL_LIGHT} from './../../assets/';

@CSSModules(styles)
export default class Logo extends Component {

	constructor(props) {
		super(props);
		this.state = {
			lightMode: props.lightMode || false,
		}
	}

	render() {
		const {lightMode} = this.state;

		const logoTitleClass = lightMode ? "Light" : "";
		return (
			<div styleName="Logo">
				<a href="/">
					<img alt="" src={lightMode ? LOGO_URL_LIGHT: LOGO_URL} />
					<p styleName={logoTitleClass} >AmoveoBook</p>
				</a>
			</div>
		)
	}
}
