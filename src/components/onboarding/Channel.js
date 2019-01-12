import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Email.css'

import {createChannel} from '../../network'

@CSSModules(styles)
export default class Channel extends Component {

	constructor(props) {
		super(props);
		this.state = {
			amount: 0,
			duration: 0,
			error: "",
		}
	}

	openChannel() {
		const {amount, duration} = this.state;
		if (duration < 100) {
			this.setState({
				error: "Channels must be open for at least 100 blocks"
			})
		} else if (amount > 0) {
			this.setState({
				error: "Amount must be greater than 0"
			})
		} else {
			createChannel(amount, duration, function(error, result) {
				if (error) {

				} else {

				}
			});
		}
	}

	render() {
		const {error} = this.state;

		return (
			<div>
				<div>
					<label>New Channel</label>
				</div>
				<div>
					<p>{error}</p>
				</div>
			</div>
		)
	}
}
