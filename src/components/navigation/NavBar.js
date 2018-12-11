import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './NavBar.css'

import Logo from './Logo'
import AmoveoExchangeLink from './AmoveoExchangeLink'
import VeoPrice from './VeoPrice'
import LanguagePicker from './LanguagePicker'
import Help from './Help'

@CSSModules(styles)
export default class NavBar extends Component {

	constructor(props) {
		super(props);
	}

	burgerToggle() {
		let linksEl = document.getElementById('narrow-links');
		if (linksEl.style.display === 'block') {
			linksEl.style.display = 'none';
		} else {
			linksEl.style.display = 'block';
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
							<Help />

							<LanguagePicker />

							<VeoPrice />

							<AmoveoExchangeLink />
						</div>

						<div className="clear"></div>
					</div>
				</div>
				<div styleName="NavNarrow">
					<i className="fa fa-bars fa-2x" onClick={this.burgerToggle}></i>
					<div className="right">
						<Logo />
					</div>
					<div id="narrow-links" styleName="NarrowLinks">
						<div>
							<VeoPrice />
						</div>

						<div>
							<AmoveoExchangeLink />
						</div>

						<div>
							<Help />
						</div>

						<div>
							<LanguagePicker />
						</div>
					</div>
				</div>
			</nav>
		)
	}
}
