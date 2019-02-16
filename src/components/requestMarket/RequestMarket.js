import React, { Component } from "react";
import SectionLabel from "../markets/SectionLabel";
import CSSModules from "react-css-modules/dist/index";
import styles from './RequestMarket.css'
import {connect} from "react-redux";
import {requestMarket} from "../../actions";
import Loading from "../loading/Loading";

const mapStateToProps = (state) => {
	return {
		error: state.default.error.requestMarket,
		loading: state.default.loading.requestMarket,
		completed: state.default.requestMarket,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		requestMarket: (text) => {
			dispatch(requestMarket(text));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class RequestMarket extends Component {

	constructor(props) {
		super(props);

		this.state = {
			requestText: "",
		}

		this.sendRequest = this.sendRequest.bind(this);
	}

	sendRequest() {
		const {loading, requestText} = this.state;
		if (!loading && requestText) {
			this.props.requestMarket(requestText)
		}
	}

	handleChange(e) {
		this.setState({
			requestText: e.target.value
		});
	}

	render() {
		const {loading, completed} = this.props;

		let body;
		if (loading) {
			body = <div>
				<Loading />
			</div>
		} else if (completed) {
			body = <div>
				<p>
					Thank you.  Your request has been submitted.  Please check the #markets channel on Discord for further information.
				</p>
			</div>
		} else {
			body = <div>
				<div styleName="Cta">
					<p>Have an idea for a market you would like to see? Let us know.</p>
				</div>

				<div styleName="Form">
					<div styleName="InputText">
						<input type="text"
						       value={this.state.requestText}
						       onChange={this.handleChange.bind(this)}
						/>
					</div>

					<button
						styleName="Button"
						onClick={() => this.sendRequest()}>Send</button>
				</div>
			</div>
		}

		return (
			<div styleName="Container">
				<p styleName="Title">Request Market</p>

				<div>
					{body}
				</div>
			</div>
		)
	}
}
