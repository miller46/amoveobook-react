import React, { Component } from "react";
import styles from './ExpiredMarketRow.css'
import CSSModules from "react-css-modules/dist/index";

@CSSModules(styles)
export default class ExpiredMarketsRow extends Component {

	constructor(props) {
		super(props);

		this.state = {
			market: props.market,
		}
	}

	render() {
		const {market} = this.state;

		return (
			<div styleName="Row">
				<div styleName="QuestionCol">
					<p>{market.question}</p>
				</div>
				<div styleName="ExpiredCol">
					<p>{market.end_block}</p>
				</div>
				<div styleName="ResolutionCol">
					<p>{market.resolution}</p>
				</div>
			</div>
		)
	}
}
