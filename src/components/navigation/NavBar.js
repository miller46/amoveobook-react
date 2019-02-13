import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './NavBar.css'

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
	}

	burgerToggle() {
		let linksEl = document.getElementById('narrow-links');
		let burger = document.getElementById('icon-burger');
		let x = document.getElementById('icon-x');
		if (linksEl.style.display === 'block') {
			linksEl.style.display = 'none';
			burger.style.display = 'block';
			x.style.display = 'none';
		} else {
			linksEl.style.display = 'block';
			burger.style.display = 'none';
			x.style.display = 'block';
		}
	}

	render() {
		return (
			<nav styleName="NavBar">
				<div styleName="NavWide">
					<div styleName="WideDiv">
						<div styleName="NavBarLeft">
							<Logo />
						</div>

						<div styleName="NavBarRight">
							<Account />

							<Help />

							<LanguagePicker />

							<VeoPrice />

							<AmoveoExchangeLink />
						</div>

						<div className="clear"></div>
					</div>
				</div>
				<div styleName="NavNarrow">
					<i style={{color: 'black'}} id="icon-burger" className="fa fa-bars fa-2x" onClick={this.burgerToggle}></i>
					<i style={{color: 'black', display: 'none'}} id="icon-x" className="fas fa-times fa-2x" onClick={this.burgerToggle}></i>
					<div styleName="NavBarRight">
						<Account />
					</div>

					<div styleName="NavBarCenter">
						<Logo />
					</div>

					<div id="narrow-links" styleName="NarrowLinks">
						<div styleName="LinkRowPad">
							<VeoPrice />
						</div>

						<div styleName="LinkRow">
							<AmoveoExchangeLink />
						</div>

						<div styleName="LinkRowPad">
							<LanguagePicker />
						</div>

						<div styleName="LinkRow">
							<Help />
						</div>
					</div>
				</div>
			</nav>
		)
	}
}
