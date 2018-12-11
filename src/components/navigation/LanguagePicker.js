import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './LanguagePicker.css'

@CSSModules(styles)
export default class LanguagePicker extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="LanguagePicker">
				<p>English</p>
			</div>
		)
	}
}
