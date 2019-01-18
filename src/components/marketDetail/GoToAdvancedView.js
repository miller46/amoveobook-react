import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './GoToAdvancedView.css'
import PropTypes from 'prop-types';

import {images} from '../../config'

@CSSModules(styles)
export default class GoToAdvancedView extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {
			oid: this.props.oid
		}

		this.goToAdvanced = this.goToAdvanced.bind(this)
	}

	goToAdvanced() {
		const {oid} = this.state;
		this.context.router.push("/advanced/" + encodeURIComponent(oid))
	}

	render() {
		return (
			<div styleName="Button" onClick={() => this.goToAdvanced()}>
				<img
					src={images.orderBookSrc}
				/>

				<p><span styleName="NoBold">Looking for this? Go to the</span> Advanced View</p>
			</div>
		)
	}
}
