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
			location: this.props.location,
			showingDrawer: this.props.showingDrawer || false,
		}

		if (this.props.onDrawerClick) {
			this.onDrawerClick = this.props.onDrawerClick.bind(this)
		}

		this.burgerToggle = this.burgerToggle.bind(this);
	}


	componentWillReceiveProps(props) {
		this.setState({showingDrawer: props.showingDrawer})
	}

	burgerToggle() {
		let burger = document.getElementById('icon-burger');
		if (burger.style.display === 'none') {
			burger.style.display = 'block';
		} else {
			burger.style.display = 'none';
		}

		if (this.props.onDrawerClick) {
			this.props.onDrawerClick();
		}
	}

	render() {
		const {showingDrawer} = this.state;

		const burgerDisplay = showingDrawer ? 'none' : '';
		const navbarOverflow = showingDrawer ? 'auto' : '';

		return (
			<nav styleName="NavBar" style={{overflow: navbarOverflow}}>
				<div styleName="NavNarrow">
					<i style={{color: 'black', display: burgerDisplay}} id="icon-burger" className="fa fa-bars fa-2x" onClick={this.burgerToggle}></i>

					<div styleName="NavBarRight">
						<Account
							location={location}
						/>
					</div>

					<div style={{display: burgerDisplay}} styleName="NavBarCenter">
						<Logo />
					</div>
				</div>
			</nav>
		)
	}
}
