import React, { Component } from "react";
import styles from './App.css'

import Splash from "./Splash";
import Loading from "../components/loading/Loading";
import UsCustomers from "../components/disclaimers/UsCustomers";
import Adblock from "../components/disclaimers/Adblock";
import Onboarding from "./Onboarding";
import {getAccount, getActiveMarkets, getChannelData, getChannelPending, getHeight, getIp} from "../actions";
import {connect} from "react-redux";
import CSSModules from "react-css-modules/dist/index";

const mapStateToProps = (state, ownProps) => {
	return {
		ip: state.default.ip,
		ipLoading: state.default.loading.ip,
		ipError: state.default.error.ip,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getIp: () => {
			dispatch(getIp());
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class AppRouter extends Component {

	constructor(props) {
		super(props);
		this.state = {
			ip: this.props.ip,
			loading: this.props.loading,
			error: this.props.error,
			account: this.props.account,
			ipDisabled: false,
		}
	}

	render() {
		const {ip, ipLoading, ipError} = this.props;

		const hasChecked = localStorage.getItem("hasCheckedIp") === "true";
		const agreedUs = localStorage.getItem("agreedUS") === "true";
		const isNotUs = localStorage.getItem("isNotUS") === "true";

		if (agreedUs || isNotUs) {
			return (
				<Splash />
			)
		} else if (ipLoading) {
			return (
				<div styleName="LoadingContainer">
					<Loading lightMode={true} />
				</div>
			)
		} else if (ipError) {
			return (
				<Adblock />
			)
		} else if (hasChecked && !ip) {
			return (
				<Adblock />
			)
		} else if (ip && ip.country_code === "US") {
			return (
				<UsCustomers />
			)
		} else {
			return (
				<Splash />
			)
		}
	}
}
