import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Drawer.css'

import Logo from './Logo'
import AmoveoExchangeLink from './AmoveoExchangeLink'
import VeoPrice from './VeoPrice'
import LanguagePicker from './LanguagePicker'
import Help from './Help'
import Account from './Account'

@CSSModules(styles)
export default class NavBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			account: this.props.account,
			loading: this.props.loading,
		}

		if (this.props.onDrawerClick) {
			this.onDrawerClick = this.props.onDrawerClick.bind(this)
		}

		this.burgerToggle = this.burgerToggle.bind(this);
	}

	burgerToggle() {
		if (this.props.onDrawerClick) {
			this.props.onDrawerClick();
		}
	}

	render() {
		return (
			<div styleName="NavDrawerContainer">
				<div styleName="NavDrawer">
					<div styleName="TopRow">
						<i id="icon-x" className="fas fa-times fa-2x" onClick={this.burgerToggle}></i>
					</div>

					<div>
						<div styleName="Row">
							<VeoPrice />
						</div>

						<div styleName="Row">
							<AmoveoExchangeLink />
						</div>

						<div styleName="Row">
							<LanguagePicker />
						</div>

						<div styleName="Row">
							<Help />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
