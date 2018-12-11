import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './App.css'
import NavBar from '../components/navigation/NavBar'

@CSSModules(styles)
export default class App extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div>
					<NavBar />
				</div>

				<div>
					{this.props.children}
				</div>
			</div>
		)
	}
}
