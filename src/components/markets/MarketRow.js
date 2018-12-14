import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './MarketRow.css'
import {connect} from "react-redux";
import {getHeight} from "../../actions";

const mapStateToProps = (state) => {
	return {
		error: state.default.error.height,
		loading: state.default.loading.height,
		height: state.default.height,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getHeight: () => {
			dispatch(getHeight());
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class MarketRow extends Component {

	constructor(props) {
		super(props);
		this.state = {
			market: props.market,
		}

		this.goToDetails = this.goToDetails.bind(this)
	}

	componentDidMount() {
		this.props.getHeight()
	}

	goToDetails() {

	}

	render() {
		const {height}= this.props;
		const {market} = this.state;

		var expires = new Date();
		var diff = market.end_block - height;
		var minutes = diff * 10;
		expires.setMinutes(expires.getMinutes() + minutes);
		var options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
		const expiresText = expires.toLocaleDateString('en-US', options) + " (Block " + market.end_block + ")";

		return (
			<div styleName="Card" onClick={() => this.goToDetails()}>
				<div styleName="Market">
					<div styleName="LeftPanel">
						<div styleName="Question">
							<h1>{market.question}</h1>
						</div>
						<div>
							<label>Expires</label>
							<p>{expiresText}</p>
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
