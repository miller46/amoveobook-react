import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Account.css'
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {getAccount} from "../../actions";
import {createIcon} from "../../utility";
import Loading from '../loading/Loading'

const ClickOutHandler = require('react-onclickout');

const mapStateToProps = (state, ownProps) => {
	return {
		account: state.default.account,
		loading: state.default.loading.account,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getAccount: (address) => {
			dispatch(getAccount(address));
		},
	};
};

@connect(mapStateToProps, mapDispatchToProps)
@CSSModules(styles)
export default class Account extends Component {

	static contextTypes = {
		router: PropTypes.object
	}

	constructor(props) {
		super(props);
		this.state = {
			account: this.props.account,
			loading: this.props.loading,
			showing: false,
		}

		this.closeDropdown = this.closeDropdown.bind(this);
	}

	showOnboarding() {
		localStorage.setItem("onboarding", true);
		this.context.router.push("/")
	}

	openDropdown() {
		this.setState({showing: true})
	}

	closeDropdown() {
		this.setState({showing: false})
	}

	goToOrders() {
		this.context.router.push("/orders")
		this.closeDropdown();
	}

	goToChannels() {
		this.context.router.push("/channels")
		this.closeDropdown();
	}

	render() {
		const {showing} = this.state;
		const {account, loading} = this.props;

		if (loading) {
			return (
				<div styleName="Loading">
					<Loading />
				</div>
			)
		} else if (account) {
			let dropdown = <div styleName="Hidden"></div>
			if (showing) {
				dropdown = <ClickOutHandler onClickOut={this.closeDropdown}>
					<div>
						<div styleName="DropdownRow">
							<p onClick={() => this.goToOrders()}>My Orders</p>
						</div>
						<div styleName="DropdownRow">
							<p><a href={"https://veoscan.io/account/" + account.address} target="_blank"> {account.address.substring(0, 8) + "..."}</a></p>
						</div>
					</div>
					<div className="clear"></div>
				</ClickOutHandler>
			}

			const blockie = createIcon({
				seed: account.address,
				size: 8,
				scale: 4,
			});
			const icon = <div ref={(nodeElement) => {if (nodeElement && nodeElement.children.length === 1) nodeElement.appendChild(blockie)}} > <small> ▼</small></div>

			return (
				<div>
					<div styleName="Account" onClick={() => this.openDropdown()}>
						{icon}
					</div>

					<div styleName="Dropdown">
						{dropdown}
					</div>
				</div>
			)
		} else {
			return (
				<div styleName="Login" onClick={() => this.showOnboarding()}>
					<p>Log In</p>
				</div>
			)
		}
	}
}
