import React, { Component } from "react";
import styles from './ExpiredMarkets.css'
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

		const isFalse = market.resolution === "false"
		const expiredClass = isFalse ?  "ExpiredFalseCol" : "ExpiredCol";
		const resolutionClass = isFalse ? "ResolutionFalseCol" : "ResolutionCol";

		return (
			<div styleName="Row">
				<div styleName="LeftPanel">
					<div styleName={expiredClass}>
						<p>{market.end_block}</p>
					</div>
					<div styleName={resolutionClass}>
						<p>{market.resolution}</p>
					</div>
				</div>

				<div styleName="RightPanel">
					<div styleName="QuestionCol">
						<p>{market.question}</p>
					</div>
				</div>
			</div>
		)
	}
}
