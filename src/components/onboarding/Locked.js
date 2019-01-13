import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Locked.css'

import SectionLabel from "../markets/SectionLabel";

@CSSModules(styles)
export default class Locked extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="Locked">
				<SectionLabel titleText="Your Wallet is Locked" />

				<div className="clearfix">
					<div>
						<p>Please unlock your Amoveo3 wallet to begin.</p>
					</div>
				</div>
			</div>
		)
	}
}
