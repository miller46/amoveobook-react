import React, { Component } from "react";
import NewTodo from "../components/VeoPrice";

export default class Splash extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<NewTodo />
			</div>
		)
	}
}
