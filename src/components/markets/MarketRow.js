import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './MarketRow.css'

@CSSModules(styles)
export default class MarketRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			market: props.market,
		}

		this.goToDetails = this.goToDetails.bind(this)
	}

	goToDetails() {

	}

	render() {
		const {market} = this.state;

		return (
			<div styleName="Card" onClick={() => this.goToDetails()}>
				<div styleName="Market">
					<div styleName="LeftPanel">
						<div styleName="Question">
							<h1>{market.question}</h1>
						</div>
						<div>
							<label>Expires</label>
							<p>{market.end_block}</p>
						</div>
					</div>
					<div styleName="Separator">
					</div>
					<div styleName="RightPanel">
						<div>
							<label>Volume</label>
							<p>{market.end_block}</p>
						</div>
						<div>
							<label>Current Odds</label>
							<p>{market.id}</p>
						</div>
						<div>
							<label>Open Bets</label>
							<p>{market.end_block}</p>
						</div>
					</div>
					<div className="clear"></div>
				</div>

			</div>
		)
	}
}
