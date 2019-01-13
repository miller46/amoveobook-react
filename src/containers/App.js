import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './App.css'
import NavBar from '../components/navigation/NavBar'
import USWarning from '../components/navigation/USWarning'
import TestnetWarning from "../components/navigation/TestnetWarning";
import Footer from "../components/footer/Footer";

@CSSModules(styles)
export default class App extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const showWarning =
			localStorage.getItem("agreedUS") === "true"
			|| localStorage.getItem("isNotUS") === "true" ;

		const amoveo3 = window.amoveo3;

		const isTestnet = amoveo3 && amoveo3.api.network === "testnet";
		
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

				<div>
					{this.props.children}
				</div>

				<Footer />
			</div>
		)
	}
}
