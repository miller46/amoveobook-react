import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './LanguagePicker.css'
const ClickOutHandler = require('react-onclickout');

import {languages} from "../../config";

@CSSModules(styles)
export default class LanguagePicker extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showing: false,
			selectedId: "en",
		}

		this.closePicker = this.closePicker.bind(this);
		this.toggle = this.toggle.bind(this);
		this.selectLanguageAndClose = this.selectLanguageAndClose.bind(this);
	}

	closePicker() {
		this.setState({showing: false})
	}

	selectLanguageAndClose(id) {
		this.setState({selectedId: id, showing: false})
	}

	toggle() {
		this.setState({showing: !this.state.showing})
	}

	render() {
		const {showing, selectedId} = this.state;
		const selectedLanguage = languages[selectedId]

		let unselected = <div styleName="Hidden"></div>
		if (showing) {
			unselected = <ClickOutHandler onClickOut={this.closePicker}>
				{
					Object.keys(languages).map((key, index) => {
						const language = languages[key];
						if (key !== selectedId) {
							return (
								<div
									styleName="UnselectedRow"
									key={index}
									onClick={() => this.selectLanguageAndClose(key)}>
									<img src={language.flagUrl}/>
									<p>
										{language.displayName}
									</p>
								</div>
							)
						}
					})
				}
				<div className="clear"></div>
			</ClickOutHandler>
		}

		return (
			<div styleName="LanguagePicker">
				<div styleName="Selected" onClick={() => this.toggle()}>
					<div styleName="SelectedRow">
						<img src={selectedLanguage.flagUrl}/>
						<p>{selectedLanguage.displayName}
							<small> ▼</small>
						</p>
					</div>
				</div>
				<div styleName="Unselected">
					{unselected}
				</div>
			</div>
		)
	}
}
