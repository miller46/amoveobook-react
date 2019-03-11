import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './SectionLabel.css'

@CSSModules(styles)
export default class SectionLabel extends Component {

	constructor(props) {
		super(props);
		this.state = {
			titleText: props.titleText
		}
	}

	render() {
		const {titleText} = this.state;
		return (
			<div styleName="Title">
				<p>{titleText}</p>
			</div>
		)
	}
}
