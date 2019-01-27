import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './DepthChart.css'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

import {tokenDecimals, priceDecimals} from "../../config";

@CSSModules(style)
export default class DepthChart extends Component {

	constructor(props) {
		super(props);
		this.state = {
			prices: this.props.prices,
			buys: this.props.buys,
			sells: this.props.sells,
		}
	}

	getOptions(max, min, buys, sells) {
		return {
			chart: {
				backgroundColor: '#0E0E0E',
				type: 'area'
			},
			exporting: {
				enabled: false
			},
			title: {
				text: ''
			},
			navigator: {
				enabled: false
			},
			rangeSelector : {
				inputEnabled:false
			},
			xAxis: {
				title: {
					text: '',
					color: '#000000'
				},
				min: 0,
				max: 1,
			},
			yAxis: {
				title: {
					text: '',
					color: '#000000'
				},
				min: min,
				max: max,
				lineColor: 'rgb(0, 0, 0, 0.4)',
			},
			series: [{
				showInLegend: false,
				data: buys,
				step: true,
				type: 'area',
				color: '#5cb85c',
				fillColor: {
					linearGradient: {x1: 1, y1: 0, x2: 0, y2: 0},
					stops: [
						[0, 'rgb(92, 184, 92, 0.2)'],
						[1, 'rgba(255, 255, 255, 0)']
					]
				}
			}, {
				showInLegend: false,
				data: sells,
				step: true,
				type: 'area',
				color: '#d9534f',
				fillColor: {
					linearGradient: {x1: 1, y1: 0, x2: 0, y2: 0},
					stops: [
						[0, 'rgb(217, 83, 79, 0.2)'],
						[1, 'rgba(255, 255, 255, 0)']
					]
				}
			}],
			plotOptions: {
				area: {
					marker: {
						enabled: false,
					}
				}
			},
		}
	}

	render() {
		const {prices, buys, sells} = this.state;

		let sortedBuys = [];
		let sortedSells = [];

		if (buys.length === 1) {
			const first = [buys[0][0], 0];
			sortedBuys.append(first);
		}

		if (sells.length === 1) {
			const first = [sells[0][0], 0];
			sortedSells.append(first);
		}

		let min = 99999999999;
		let max = 0;


		for (let i = 0; i < buys.length; i++) {
			let item = buys[i];
			const amount = item[1] / tokenDecimals;
			const price = item[0] / priceDecimals;

			sortedBuys.push([price, amount]);

			if (amount < min) {
				min = amount;
			}

			if (amount > max) {
				max = amount;
			}
		}

		for (let i = 0; i < sells.length; i++) {
			let item = sells[i];
			const amount = item[1] / tokenDecimals;
			const price = item[0] / priceDecimals;

			sortedSells.push([price, amount]);

			if (amount < min) {
				min = amount;
			}

			if (amount > max) {
				max = amount;
			}
		}

		if (min === 99999999999) {
			min = 0;
		}

		// sortedSells = sortedSells.reverse();

		const options = this.getOptions(max, min, sortedBuys, sortedSells);

		return (
			<div styleName="DepthChartContainer">
				<HighchartsReact
					highcharts={Highcharts}
					options={options}
				/>
			</div>
		)
	}
}
