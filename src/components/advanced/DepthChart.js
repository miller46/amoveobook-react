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
				lineWidth: 0,
				gridLineWidth: 0,
				minorGridLineWidth: 0,
				lineColor: 'transparent',
				labels: {
					enabled: false
				},
				minorTickLength: 0,
				tickLength: 0
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
		let {prices, buys, sells} = this.state;

		if (buys.length === 1) {
			const first = [buys[0][0], 0];
			buys.unshift(first);
		}

		if (sells.length === 1) {
			const first = [sells[0][0], 0];
			sells.unshift(first);
		}

		const series = buys.concat(sells);

		let min = 99999999999;
		let max = 0;

		for (let i = 0; i < series.length; i++) {
			let item = series[i];
			item[0] = item[0] / priceDecimals;
			item[1] = item[1] / tokenDecimals;

			if (item[1] < min) {
				min = item[1];
			}

			if (item[1] > max) {
				max = item[1];
			}
		}

		if (min === 99999999999) {
			min = 0;
		}

		sells = sells.reverse();

		const options = this.getOptions(max, min, buys, sells);

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
