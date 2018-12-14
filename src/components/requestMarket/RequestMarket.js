import React, { Component } from "react";
import SectionLabel from "../markets/SectionLabel";
import CSSModules from "react-css-modules/dist/index";
import styles from './RequestMarket.css'


@CSSModules(styles)
export default class RequestMarket extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="Container">
				<SectionLabel titleText="Request Market" />

				<div>
					<div styleName="Cta">
						<p>Have an idea for a market you would like to see? Let us know.</p>
					</div>

					<div styleName="Form">
						<div styleName="InputText">
							<input type="text" />
						</div>

						<div styleName="Button">
							<button>Send</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
