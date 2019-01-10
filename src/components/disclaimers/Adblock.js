import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './Disclaimer.css'

import PropTypes from 'prop-types';

@CSSModules(style)
export default class Adblock extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {
			notUsSelected: false,
		}
	}

	goToSplash() {
		const {notUsSelected} = this.state;
		localStorage.setItem("isNotUS", notUsSelected);
		this.context.router.push("/")
	}

	handleChange(e) {
		this.setState({
			notUsSelected: e.target.checked
		})
	}

	render() {
		const {notUsSelected} = this.state;
		return (
			<div styleName="Disclaimer">
				<div className="clearfix">
					<div className="left">
						<i className="fas fa-exclamation-circle fa-2x"></i>
					</div>
					<div className="left">
						<h1>Disclaimer</h1>
					</div>
				</div>

				<div styleName="Message">
					<div>
						<p>US Law prohibits us from providing service to US residents unless you are an <a href="https://www.investopedia.com/terms/e/eligible_contract_participant.asp" target="_blank">Eligible Contract Participant</a>.   </p>
					</div>

					<div>
						<p>US persons may view the site but you will not be able to place bets. If you are seeing this notice in error, please contact us.</p>
					</div>

					<div className="clearfix">
						<input className="left"
						       type="checkbox"
						       checked={notUsSelected}
						       onChange={this.handleChange.bind(this)}
						/>
						<p className="left">I am NOT a US citizen or US resident</p>
					</div>

					<div>
						<button className="btn btn-success" onClick={() => this.goToSplash()}>Continue</button>
					</div>
				</div>
			</div>
		)
	}
}
