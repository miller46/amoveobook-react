import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import styles from './App.css'
import NavBar from '../components/navigation/NavBar'
import Drawer from '../components/navigation/Drawer'
import USWarning from '../components/navigation/USWarning'
import TestnetWarning from "../components/navigation/TestnetWarning";
import Footer from "../components/footer/Footer";
import {getAccount, getIp, getChannelPending} from "../actions";
import {connect} from "react-redux";
import ChannelPending from "../components/transaction/ChannelPending";


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
			showDrawer: false,
		}

		this.accountListener = 0;

		this.showDrawer = this.showDrawer.bind(this)
	}

	componentWillMount() {
		const instance = this;

		const {ip, account} = this.state;

		const hasChecked = localStorage.getItem("hasCheckedIp");
		if (hasChecked !== "true" && !ip) {
			this.props.getIp()
		}

		if (this.accountListener === 0) {
			this.accountListener = setInterval(function () {
				const amoveo3 = window.amoveo3;
				if (amoveo3) {
					const address = amoveo3.coinbase;
					if (address && !account) {

						instance.props.getAccount(address);
						clearInterval(instance.accountListener)
					}
				}
			}, 500)
		}
	}

	showDrawer() {
		const {showDrawer} = this.state;
		if (showDrawer) {
			document.body.style.overflow = "auto";
		} else {
			document.body.style.overflow = "hidden";
		}
		this.setState({showDrawer: !showDrawer});
	}

	render() {
		const {showDrawer} = this.state;
		const path = this.props.location.pathname;

		const contentClass = showDrawer ? "Disabled" : ""
		const bodyClass = showDrawer ? "NoScroll" : ""

		return (
			<div styleName={bodyClass}>
				<ReactCSSTransitionGroup
					transitionName="slide"
					transitionEnter={true}
					transitionAppear={true}
					transitionLeave={true}
					transitionAppearTimeout={0}
					transitionEnterTimeout={0}
					transitionLeaveTimeout={100}>
					{
						showDrawer &&
						<Drawer
							onDrawerClick={this.showDrawer}
						/>
					}
				</ReactCSSTransitionGroup>

				<div>
					<div styleName={contentClass}>
					</div>

					<div>
						<NavBar
							showingDrawer={showDrawer}
							onDrawerClick={this.showDrawer}
						/>
					</div>

					<USWarning />

					<TestnetWarning />

					<div styleName="AppContainer">
						{this.props.children}
					</div>

					{
						path.indexOf("/advanced") < 0
							? <Footer />
							: <div></div>
					}
				</div>
				
			</div>
		)
	}
}
