import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Channels.css'

import YourChannels from '../components/channel/YourChannels'

@CSSModules(styles)
export default class Orders extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div styleName="Container">
				<YourChannels />
			</div>
		)
	}
}
