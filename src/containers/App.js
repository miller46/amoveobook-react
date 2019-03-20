import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import styles from './App.css'
import NavBar from '../components/navigation/NavBar'
import Drawer from '../components/navigation/Drawer'
import USWarning from '../components/navigation/USWarning'
import TestnetWarning from "../components/navigation/TestnetWarning";
import Footer from "../components/footer/Footer";
import {getAccount, getIp, getChannelPending, getChannelData, getHeight, getActiveMarkets} from "../actions";
import {connect} from "react-redux";
import ChannelPending from "../components/transaction/ChannelPending";
import {getNetwork} from "../amoveo3utility";


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
		getHeight: (network) => {
			dispatch(getHeight(network));
		},
		getActiveMarkets: (options) => {
			dispatch(getActiveMarkets(options));
		},
		getAccount: (address) => {
			dispatch(getAccount(address));
		},
		getChannelPending: () => {
			dispatch(getChannelPending());
		},
		getChannelData: (network, address, topHeader) => {
			dispatch(getChannelData(network, address, topHeader));
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

		this.showDrawer = this.showDrawer.bind(this)
	}

	componentWillMount() {
		const {ip} = this.state;
		const hasChecked = localStorage.getItem("hasCheckedIp");
		if (hasChecked !== "true" && !ip) {
			this.props.getIp()
		}
	}

	componentDidMount() {
		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			const address = amoveo3.coinbase;
			const network = getNetwork(amoveo3);
			const topHeader = amoveo3.topHeader;

			this.props.getHeight(network);
			this.props.getActiveMarkets({network: network});
			this.props.getAccount(address);
			this.props.getChannelData(network, address, topHeader)
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
					<div styleName={contentClass}
						onClick={() => this.showDrawer()}
					>
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
