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

	getOptions(minX, maxX, minY, maxY, buys, sells) {
		return {
			chart: {
				backgroundColor: '#0E0E0E',
				type: 'area',
				height: '384px',
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
				min: minX,
				max: maxX,
				lineWidth: 0,
				lineColor: 'transparent',
				tickColor: 'transparent',
			},
			yAxis: {
				title: {
					text: '',
					color: '#000000'
				},
				opposite: true,
				min: minY,
				max: maxY,
				gridLineColor: 'rgb(255, 255, 255, 0.2)',
				labels: {
					useHTML: true,
					formatter: function () {
						if (this.value > 0) {
							return '<span class="AxisLabels">' + this.value + '</span>';
						}
					},
				},
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
				},
				tooltip: {
					pointFormatter: function() {
						var point = this;
						return '<span style="color:' + point.color + '">\u25CF</span> ' + 'Volume:' + ': <b>' + point.y + '</b> <small>VEO</small>';
					}
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
				},
				tooltip: {
					pointFormatter: function() {
						var point = this;
						return '<span style="color:' + point.color + '">\u25CF</span> ' + 'Volume:' + ': <b>' + point.y + '</b> <small>VEO</small>';
					}
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

		let minY = 99999999999;
		let maxY = 0;

		let minX = 99999999999;
		let maxX = 0;


		let lastBuyPrice = -1;
		for (let i = 0; i < buys.length; i++) {
			let item = buys[i];
			const amount = item[1] / tokenDecimals;
			const price = item[0] / priceDecimals;

			if (price === lastBuyPrice) {
				const index = sortedBuys.length - 1;
				sortedBuys[index][1] = sortedBuys[index][1] + amount;
			} else {
				sortedBuys.push([price, amount])
			}

			if (amount < minY) {
				minY = amount;
			}

			if (amount > maxY) {
				maxY = amount;
			}

			if (price < minX) {
				minX = price;
			}

			if (price > maxX) {
				maxX = price;
			}

			lastBuyPrice = price;
		}

		let lastSellPrice = -1;
		for (let i = 0; i < sells.length; i++) {
			let item = sells[i];
			const amount = item[1] / tokenDecimals;
			const price = item[0] / priceDecimals;

			if (price === lastSellPrice) {
				const index = sortedSells.length - 1;
				sortedSells[index][1] = sortedSells[index][1] + amount;
			} else {
				sortedSells.push([price, amount])
			}

			if (amount < minY) {
				minY = amount;
			}

			if (amount > maxY) {
				maxY = amount;
			}

			if (price < minX) {
				minX = price;
			}

			if (price > maxX) {
				maxX = price;
			}

			lastSellPrice = price;
		}

		if (minY === 99999999999) {
			minY = 0;
		}

		// if (sortedBuys.length > 0) {
		// 	sortedBuys.push([sortedBuys[sortedBuys.length - 1][0], 0]);
		// }

		sortedBuys = sortedBuys.reverse();
		sortedSells = sortedSells.reverse();
		//
		// if (sortedSells.length > 0) {
		// 	sortedSells.push([sortedSells[sortedSells.length - 1][0], 0]);
		// }

		const options = this.getOptions(0, 1, minY, maxY * 1.1, sortedBuys, sortedSells);

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
