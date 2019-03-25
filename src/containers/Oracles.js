import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import styles from './Orders.css'

import {api} from "../config";
import {getNetwork} from "../amoveo3utility";

@CSSModules(styles)
export default class Orders extends Component {

	constructor(props) {
		super(props);
		this.state = {
			oracles: {

			}
		}
	}

	componentWillMount() {
		const instance = this;
		const amoveo3 = window.amoveo3;
		if (amoveo3) {
			const address = amoveo3.coinbase;
			const network = getNetwork(amoveo3);
			const topHeader = amoveo3.topHeader;

			fetch(api[network].nodeUrl,
				{
					method: 'POST',
					body: JSON.stringify(["list_oracles"])
				}
			)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				const oracles = json[1];
				for (let i = 1; i < oracles.length; i++) {
					const oid = oracles[i];
					fetch(api[network].nodeUrl,
						{
							method: 'POST',
							body: JSON.stringify(["oracle", oid])
						}
					)
					.then(function (response) {
						return response.json();
					})
					.then(function (data) {
						const {oracles} = instance.state;
						const oracleData = data[1];
						oracles[oid] = oracleData
						instance.setState({
							oracles: oracles
						})
					});
				}
			});
		}
	}

	render() {
		const {oracles} = this.state;
		const keys = Object.keys(oracles)
		return (
			<div styleName="Container">
				<p>Oracles</p>
				{
					keys.map(function (key, index) {
						const oracle = oracles[key][1];
						if (oracle) {
							return (
								<div
									key={index}
								>
									<div>
										<div>
											<p>{key}</p>
										</div>
										<div>
											<p>{oracle[9][0]}</p>
										</div>
										<div>
											<p>{oracle[9][1]}</p>
										</div>
										<div>
											<p>{oracle[9][2]}</p>
										</div>
									</div>
								</div>
							)
						}
					})
				}
			</div>
		)
	}
}
