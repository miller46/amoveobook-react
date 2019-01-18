import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './App.css'
import NavBar from '../components/navigation/NavBar'
import USWarning from '../components/navigation/USWarning'
import TestnetWarning from "../components/navigation/TestnetWarning";
import Footer from "../components/footer/Footer";
import {getAccount, getIp, getChannelPending} from "../actions";
import {connect} from "react-redux";


const mapStateToProps = (state, ownProps) => {
	return {
		ip: state.default.ip,
		account: state.default.account,
		channelPending: state.default.channelPending,
		ipLoading: state.default.loading.ip,
		ipError: state.default.error.ip,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getIp: () => {
			dispatch(getIp());
		},
		getAccount: (address) => {
			dispatch(getAccount(address));
		},
		getChannelPending: () => {
			dispatch(getChannelPending());
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			ip: this.props.ip,
			account: this.props.account,
			channelPending: this.props.channelPending,
		}
	}

	componentWillMount() {
		const {ip, account} = this.state;

		const hasChecked = localStorage.getItem("hasCheckedIp");
		if (hasChecked !== "true" && !ip) {
			this.props.getIp()
		}

		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			const address = amoveo3.coinbase;
			if (address && !account) {
				this.props.getAccount(address);
			}
		}
	}

	render() {
		const {channelPending} = this.props;

		const showWarning =
			localStorage.getItem("agreedUS") === "true"
			|| localStorage.getItem("isNotUS") !== "true" ;

		const amoveo3 = window.amoveo3;

		const isTestnet = amoveo3 && amoveo3.api.network === "testnet";

		const path = this.props.location.pathname;

		return (
			<div>
				<div>
					<NavBar />
				</div>

				{
					showWarning
						? <USWarning />
						: null
				}

				{
					isTestnet
						? <TestnetWarning />
						: null
				}

				{
					channelPending
						? <div>Channel Pending...</div>
						: null
				}

				<div styleName="AppContainer">
					{this.props.children}
				</div>

				{
					path.indexOf("/advanced") < 0
						? <Footer />
						: <div></div>
				}
				
			</div>
		)
	}
}
