import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './PriceChart.css'
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import {priceDecimals, tokenDecimals} from "../../config";

@CSSModules(style)
export default class PriceChart extends Component {

	constructor(props) {
		super(props);
		this.state = {
			prices: this.props.prices,
			selectedLength: 1,
			selectedInterval: 60,
		}
	}

	getOptions(ohlc, volume) {
		return {
			chart: {
				backgroundColor: '#0E0E0E'
			},
			exporting: {
				enabled: false
			},
			title: {
				text: ''
			},
			rangeSelector: {
				enabled: false
			},
			xAxis: {
				type: 'datetime',
				title: {
					text: '',
					color: '#FFFFFF'
				},
			},
			yAxis: [{
				labels: {
					align: 'right',
					x: -3
				},
				title: {
					text: 'Price per Share (VEO)',
				},
				min: 0,
				max: 100,
				height: '60%',
				lineWidth: 2,
				gridLineColor: 'rgb(255, 255, 255, 0.2)',
				resize: {
					enabled: true
				}
			}, {
				labels: {
					align: 'right',
					x: -3
				},
				title: {
					text: 'Volume (VEO)'
				},
				top: '65%',
				height: '35%',
				offset: 0,
				lineWidth: 2
			}],
			tooltip: {
				split: true
			},
			series: [{
				type: 'candlestick',
				name: 'Price',
				data: ohlc,
				showInLegend: false,
			}, {
				type: 'column',
				name: 'Volume: ',
				data: volume,
				yAxis: 1,
				showInLegend: false,
			}],
			navigator: {
				enabled: false
			},
			plotOptions: {
				candlestick: {
					color: '#5cb85c',
					upColor: '#dc3545'
				},
				column: {
					color: 'rgb(92, 92, 97, 0.5)'
				}
			},
		}
	}

	render() {
		let {prices, selectedLength, selectedInterval} = this.state;

		let ohlc = [];
		let volume = [];

		const utcOffset = 6 * 60 * 60 * 1000;
		const end = Date.parse(new Date());
		const begin = end - selectedLength * 24 * 60 * 60 * 1000
		const interval = selectedInterval * 60 * 1000;

		for (let i = begin; i < end; i = i + interval) {
			const date = i;

			let lastOpen = -1;
			let lastHigh = 0;
			let lastLow = 9999999999;
			let lastClose = 0;
			let totalAmount = 0;

			for (let lastIndex = 0; lastIndex < prices.length; lastIndex++) {
				const order = prices[lastIndex];
				const orderDate = Date.parse(order.timestamp) - utcOffset

				if (orderDate >= date && date + interval > orderDate) {

					const price = 100 * order.price / priceDecimals;
					if (price > lastHigh) {
						lastHigh = price;
					}

					if (price < lastLow) {
						lastLow = price;
					}

					if (lastOpen === -1) {
						lastOpen = price
					}

					lastClose = price;

					const amount = order.buy_amount / tokenDecimals;
					totalAmount = totalAmount + amount;
				}
			}

			if (lastLow === 9999999999) {
				lastLow = 0;
			}

			if (lastOpen < 0) {
				lastOpen = 0;
			}

			ohlc.push([
				date, // the date
				lastOpen, // open
				lastHigh, // high
				lastLow, // low
				lastClose // close
			]);

			volume.push([
				date, // the date
				totalAmount // the volume
			]);
		}

		const options = this.getOptions(ohlc, volume);

		return (
			<div styleName="ChartContainer">
				<HighchartsReact
					highcharts={Highcharts}
					constructorType={'stockChart'}
					options={options}
				/>
			</div>
		)
	}
}
