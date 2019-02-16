import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './FAQ.css'


@CSSModules(styles)
export default class FAQ extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="Container">
				<div styleName="FAQTitle">
					<p>FAQ</p>
				</div>

				<div styleName="Question" name="how-to-unlock-wallet">
					<p styleName="Title">How To Unlock Your Wallet</p>

					<p styleName="Body">Find the Amoveo3 wallet icon in your browser and click on it.
						Enter in your password to unlock your wallet.
						If you do not remember your password, you will have to re-import your private key, since we do not store your private keys for security reasons.
						Make sure you have a copy of your private key in a safe place so you don't get locked out of your wallet!</p>
				</div>

				<div styleName="Question" name="channel">
					<p styleName="Title">What Is A Channel?</p>

					<p styleName="Body">
						Payment channels work like opening up a bar tab.
						You lock some money up as collateral and you use that money to make as many bets as you'd like.
						You can close the channel at any time, at which point the tab gets settled and any remaining money gets returned to you.
					</p>
				</div>
			</div>
		)
	}
}
