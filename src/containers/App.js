import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './App.css'
import NavBar from '../components/navigation/NavBar'
import USWarning from '../components/navigation/USWarning'
import TestnetWarning from "../components/navigation/TestnetWarning";

import {isTestnet} from "../config"

@CSSModules(styles)
export default class App extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		const showWarning =
			localStorage.getItem("agreedUS") === "true"
			|| localStorage.getItem("isNotUS") === "true" ;

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
			</div>
		)
	}
}
