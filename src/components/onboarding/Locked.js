import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Locked.css'

import {LOCK_URL} from "../../assets";

@CSSModules(styles)
export default class Locked extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="Locked">
				<div styleName="LockContainer">
					<img src={LOCK_URL} />
				</div>

				<p styleName="Title">Your Wallet is Locked</p>

				<p styleName="Body">Please unlock your Amoveo3 wallet to begin.</p>

				<a
					href="https://amoveobook.com/FAQ#how-to-unlock-wallet"
					target="_blank">
					How to Unlock Your Wallet
				</a>
			</div>
		)
	}
}
