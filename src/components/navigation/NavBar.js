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

	render() {
		return (
			<div styleName="NavBar">
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
		)
	}
}
