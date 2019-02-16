import React, { Component } from "react";

import Splash from "./Splash";
import Loading from "../components/loading/Loading";
import UsCustomers from "../components/disclaimers/UsCustomers";
import Adblock from "../components/disclaimers/Adblock";
import Onboarding from "./Onboarding";

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
