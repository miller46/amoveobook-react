import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './MarketDetailCard.css'


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

		let question = "--"
		if (market) {
			question = market.question;
		}

		return (
			<div styleName="DetailInfo">
				<div styleName="Question">
					<p>{question}</p>
				</div>
			</div>
		)
	}
}
