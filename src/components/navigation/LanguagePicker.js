import React, { Component } from "react";
import { connect } from 'react-redux';
import CSSModules from 'react-css-modules'
import styles from './LanguagePicker.css'
const ClickOutHandler = require('react-onclickout');

import {languages} from "../../config";

import { getLanguage, setLanguage } from '../../actions/index';

const mapStateToProps = (state) => {
	return {
		languageId: state.default.languageId,
		error: state.default.error,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getLanguage: () => {
			dispatch(getLanguage());
		},
		setCurrency: (languageId) => {
			dispatch(setLanguage(languageId));
		}
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class LanguagePicker extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showing: false,
			languageId: "en",
		}

		this.closePicker = this.closePicker.bind(this);
		this.toggle = this.toggle.bind(this);
		this.selectLanguageAndClose = this.selectLanguageAndClose.bind(this);
	}

	componentDidMount() {
		this.props.getLanguage();
	}

	closePicker() {
		this.setState({showing: false})
	}

	selectLanguageAndClose(id) {
		this.props.setCurrency(id);
		this.setState({showing: false})
	}

	toggle() {
		this.setState({showing: !this.state.showing})
	}

	render() {
		const {showing} = this.state;
		const languageId = this.props.languageId || "en";
		const selectedLanguage = languages[languageId]

		let unselected = <div styleName="Hidden"></div>
		if (showing) {
			unselected = <ClickOutHandler onClickOut={this.closePicker}>
				{
					Object.keys(languages).map((key, index) => {
						const language = languages[key];
						if (key !== languageId) {
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
