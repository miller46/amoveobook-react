import React, { Component } from "react";

import Splash from "./Splash";
import Loading from "../components/loading/Loading";
import UsCustomers from "../components/disclaimers/UsCustomers";
import Adblock from "../components/disclaimers/Adblock";

import {getIp} from "../actions";
import {connect} from "react-redux";
import Onboarding from "./Onboarding";

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
export default class AppRouter extends Component {

	constructor(props) {
		super(props);
		this.state = {
			ip: this.props.ip,
			loading: this.props.loading,
			error: this.props.error,
			ipDisabled: false,
		}
	}

	componentWillMount() {
		const {ip} = this.state;

		const hasChecked = localStorage.getItem("hasCheckedIp");
		if (hasChecked !== "true" && !ip) {
			this.props.getIp()
		}
	}

	render() {
		const {ip, ipLoading, ipError} = this.props;

		const hasChecked = localStorage.getItem("hasCheckedIp") === "true";
		const agreedUs = localStorage.getItem("agreedUS") === "true";
		const isNotUs = localStorage.getItem("isNotUS") === "true";

		const onboarding = localStorage.getItem("onboarding") === "true";

		if (onboarding) {
			return (
				<Onboarding />
			)
		} else if (agreedUs || isNotUs) {
			return (
				<Splash />
			)
		} else if (ipLoading) {
			return (
				<Loading lightMode={true} />
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
