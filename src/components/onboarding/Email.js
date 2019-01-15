import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Email.css'
import SectionLabel from "../markets/SectionLabel";

import Loading from "../loading/Loading";
import {saveEmail} from '../../network'
import {getIp, setAccount} from "../../actions";
import {connect} from "react-redux";

const mapStateToProps = (state, ownProps) => {
	return {
		ip: state.default.ip,
		loadingAccount: state.default.loading.account,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getIp: () => {
			dispatch(getIp());
		},
		setAccount: (account) => {
			dispatch(setAccount(account));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class Email extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: "",
			error: "",
			ip: this.props.ip,
			loadingAccount: this.props.loadingAccount,
		}

		this.onAdvance = this.props.onAdvance.bind(this)
	}

	handleChange(e) {
		this.setState({
			email: e.target.value
		})
	}

	signAndSaveEmail() {
		const instance = this;
		const {email} = this.state;
		const {ip} = this.props;

		if (!Email.validateEmail(email)) {
			this.setState({
				error: "Please enter a valid email"
			})
		} else {
			const amoveo3 = window.amoveo3;
			const address = amoveo3.coinbase;
			const message = "My address is " + address + " and my email is " + email;

			this.sign(amoveo3, message, (error, signed) => {
				if (error) {
					instance.setState({
						error: "There was a problem, please try again later"
					})
				} else {
					const ip = ip ? ip.ip : "";
					const country = ip ? ip.country_code : "";

					const data = {
						email: email,
						address: address,
						signed: signed,
						ip: ip,
						country: country
					};

					saveEmail(data, (error, result) => {
						if (error) {
							if (error.code === 401) {
								instance.setState({
									error: "Invalid signature"
								})
							} else {
								instance.setState({
									error: "An error occurred, please try again later"
								})
							}
						} else {
							instance.props.setAccount(data);
							instance.onAdvance();
						}
					})
				}
			})
		}
	}

	sign(amoveo3, message, callback) {
		amoveo3.currentProvider.sign({
			type: "sign",
			message: message,
		}, callback);
	}

	static validateEmail(email) {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	render() {
		const {email, error} = this.state;
		const {loadingAccount} = this.props;

		if (loadingAccount) {
			return (
				<div styleName="Container">
					<Loading />
				</div>
			)
		} else {
			return (
				<div styleName="Container">
					<SectionLabel titleText="Please Enter Your Email"/>

					<div styleName="Form">
						<div styleName="InputText">
							<input
								type="text"
								value={email}
								onChange={this.handleChange.bind(this)}/>
						</div>

						<div>
							<p>You will be prompted to sign a message using your wallet</p>
						</div>

						<div styleName="Button">
							<button
								onClick={() => this.signAndSaveEmail()}
							>
								Sign
							</button>
						</div>

						<div styleName="Error">
							{error}
						</div>
					</div>
				</div>
			)
		}
	}
}
