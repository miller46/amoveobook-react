import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './MarketInfo.css'
import {getDisplayExpires} from "../../utility";


@CSSModules(styles)
export default class MarketInfo extends Component {

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
					<div styleName="Expires">
						<p>{expires}</p>
					</div>

					<div styleName="Separator"></div>

					<div styleName="Question">
						<p>{question}</p>
					</div>

					<div styleName="Separator"></div>

					<div styleName="Trading">
						<div styleName="Left">
							<p>High: <span styleName="TradingFigure">0</span></p>
							<p>Low: <span styleName="TradingFigure">0</span></p>
						</div>
						<div styleName="Right">
							<p styleName="TradingFigure">+0.00%</p>
							<p>Volume: <span styleName="TradingFigure">0</span></p>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
