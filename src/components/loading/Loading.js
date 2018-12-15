import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './Loading.css'

@CSSModules(style)
export default class Loading extends Component {

	constructor(props) {
		super(props);
		this.state = {
			lightMode: this.props.lightMode
		}
	}

	render() {
		const {lightMode} = this.state;
		const className = lightMode ? "LightMode" : "DarkMode"
		return (
			<div styleName="Loading">
				<div styleName={className}></div>
				<div styleName={className}></div>
				<div styleName={className}></div>
			</div>
		)
	}
}
