import React, { Component } from "react";

export default class Details extends Component {

	constructor(props) {
		super(props);

		this.state = {
			oid: this.props.params.oid
		}
	}

	render() {
		const {oid} = this.state;

		return (
			<div>
				<h1>Details - {oid}</h1>
			</div>
		)
	}
}
