import React, { Component } from "react";

export default class App extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<h1>App</h1>
				<div>{this.props.children}</div>
			</div>
		)
	}
}
