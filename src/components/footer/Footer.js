import React, { Component } from "react";
import CSSModules from "react-css-modules/dist/index";
import styles from './Footer.css'
import Logo from "../navigation/Logo";

@CSSModules(styles)
export default class Footer extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="Footer">
				<div styleName="Brand">
					<Logo/>
					<small>© 2018 AmoveoBook</small>
				</div>

				<div styleName="Links">
					<div styleName="Heading">
						<p>Resources</p>
					</div>
					<div>
						<ul>
							<li>
								<a
									target="_blank"
									href="https://chrome.google.com/webstore/detail/amoveo-wallet/hfojlfflnlmfjhddgodpmophmhpimahi?hl=en">
								Chrome Browser Extension Wallet
								</a>
							</li>
							<li>
								<a
									target="_blank"
									href="https://veoscan.io/">
								Veoscan
								</a>
							</li>
							<li>
								<a
									target="_blank"
									href="https://amoveo.exchange/?ref=amoveobook">
								Amoveo.exchange
								</a>
							</li>
						</ul>
					</div>
					<div styleName="Heading">
						<p>Amoveo</p>
					</div>
					<div>
						<ul>
							<li>
								<a
									target="_blank"
									href="https://github.com/zack-bitcoin/amoveo">
								Amoveo Github
								</a>
							</li>
							<li>
								<a
									target="_blank"
									href="https://t.me/amoveo">
								Amoveo Telegram
								</a>
							</li>
							<li>
								<a
									target="_blank"
									href="https://discord.gg/a52szJw">
								Amoveo Discord Русский чат. 中文聊天
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div styleName="Info">
					<div styleName="Heading">
						<p>Help</p>
					</div>
					<div>
						<ul>
							<li>
								<a
									target="_blank"
									href="http://amoveobook.com/help.html">
									FAQ
								</a>
							</li>
							<li>
								<a
									target="_blank"
									href="https://discord.gg/EHCjdAp">
									Discord
								</a>
							</li>
							<li>
								<a
									target="_blank"
									href="https://amoveo.exchange/?ref=amoveobook">
									Amoveo.exchange
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		)
	}
}
