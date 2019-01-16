import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './MarketDetailCard.css'
import {getDisplayExpires} from "../../utility";


@CSSModules(styles)
export default class MarketDetailCard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			market: this.props.market,
			height: this.props.height,
		}
	}

	componentWillReceiveProps(props) {
		this.setState({market: props.market, height: props.height})
	}

	render() {
		const {market, height} = this.state;

		let expires = "--"
		let question = "--"
		if (market) {
			question = market.question;
			expires = "Expires: " + getDisplayExpires(market.end_block, height);
		}

		return (
			<div styleName="DetailInfo">
				<div styleName="Card">
					<div>
						<p>{expires}</p>
					</div>
					<div>
						<h1>{question}</h1>
					</div>
				</div>
			</div>
		)
	}
}
