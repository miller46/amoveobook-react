import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Help.css'

@CSSModules(styles)
export default class Help extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="Help" >
				<a href="/help.html" target="_blank">Help</a>
			</div>
		)
	}
}
