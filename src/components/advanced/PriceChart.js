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
			selectedLength: "all",
			selectedInterval: "1h",
			marketType: this.props.marketType,
			upperBound: parseFloat(this.props.upperBound),
			lowerBound: parseFloat(this.props.lowerBound),
		}
	}

	getOptions(ohlc, volume) {
		const {marketType, upperBound, lowerBound} = this.state;

		return {
			chart: {
				backgroundColor: '#FFFFFF'
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
				lineColor: 'transparent',
				tickColor: 'transparent',
			},
			yAxis: [{
				labels: {
					align: 'right',
					x: -3
				},
				title: {
					text: marketType === "scalar" ? "Price" : 'Price per Share (VEO)',
				},
				min: 0,
				max: 100,
				height: '60%',
				lineWidth: 1,
				gridLineColor: 'rgb(0, 0, 0, 0.2)',
				resize: {
					enabled: true
				},
				lineColor: 'transparent',
				tickColor: 'transparent',
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
				lineWidth: 1,
				gridLineColor: 'rgb(0, 0, 0, 0.2)',
				lineColor: 'transparent',
				tickColor: 'transparent',
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
					color: '#FFFFFF',
					upColor: '#FFFFFF',
					upLineColor: '#5cb85c',
					lineColor: '#dc3545'
				},
				column: {
					color: 'rgb(92, 92, 97, 0.5)'
				}
			},
		}
	}

	setInterval(interval) {
		const {selectedInterval, selectedLength} = this.state;
		if (interval !== selectedInterval) {
			// this is nutty but basically if the interval is less than the total chart length
			// then respect the user's new interval choice and set chart length to all
			if (interval === "1d" && (selectedLength === "1h" || selectedLength === "1d")
				|| (interval === "6h" && selectedLength === "1h")
				|| (interval === "1h" && selectedLength === "1h") ) {
				this.setState({selectedInterval: interval, selectedLength: "all"})
			} else {
				this.setState({selectedInterval: interval})
			}
		}
	}

	setLength(len) {
		const {selectedInterval, selectedLength} = this.state;
		if (len !== selectedLength) {
			if (len === "1h" && (selectedInterval === "1h" || selectedInterval === "1d")) {
				this.setState({selectedLength: len, selectedInterval: "5m"})
			} else if (len === "1d" && selectedInterval === "1d") {
				this.setState({selectedLength: len, selectedInterval: "1h"})
			} else {
				this.setState({selectedLength: len})
			}
		}
	}

	render() {
		const {prices, selectedLength, selectedInterval} = this.state;

		let ohlc = [];
		let volume = [];

		if (prices.length > 0) {
			const utcOffset = 6 * 60 * 60 * 1000;
			const end = Date.parse(new Date());

			let begin;
			if (selectedLength === "1h") {
				begin = end - (1 * 60 * 60 * 1000)
			} else if (selectedLength === "1d") {
				begin = end - (24 * 60 * 60 * 1000)
			} else if (selectedLength === "1m") {
				begin = end - (30 * 24 * 60 * 60 * 1000)
			} else {
				// fallback beginning of bets
				const firstPrice = prices[0];
				begin = Date.parse(firstPrice.timestamp) - utcOffset - 1
			}

			// back stop for first order anyway
			const firstPrice = prices[0];
			const firstOrderDate = Date.parse(firstPrice.timestamp) - utcOffset - 1
			if (begin < firstOrderDate) {
				begin = firstOrderDate
			}

			let interval;
			if (selectedInterval === "1m") {
				interval = 1 * 60 * 1000;
			} else if (selectedInterval === "5m") {
				interval = 5 * 60 * 1000;
			} else if (selectedInterval === "15m") {
				interval = 15 * 60 * 1000;
			} else if (selectedInterval === "1h") {
				interval = 60 * 60 * 1000;
			} else if (selectedInterval === "6h") {
				interval = 6 * 60 * 60 * 1000;
			} else if (selectedInterval === "1d") {
				interval = 24 * 60 * 60 * 1000;
			} else {
				// fallback 1 hour
				interval = 60 * 60 * 1000;
			}

			let lastOpen = -1;
			let lastHigh = 0;
			let lastLow = 9999999999;
			let lastClose = 0;

			for (let i = begin; i < end; i = i + interval) {
				const date = i;

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

				lastOpen = lastClose;
				lastHigh = lastClose;
				lastLow = lastClose;
			}
		}

		const options = this.getOptions(ohlc, volume);

		return (
			<div>
				<table styleName="Buttons">
					<tbody>
					<tr>
						<td>
							<div styleName="ChartLength">
								<p
									styleName={selectedLength === "1h" ? "ButtonSelected" : ""}
									onClick={() => this.setLength("1h")}>
									1h
								</p>

								<p
									styleName={selectedLength === "1d" ? "ButtonSelected" : ""}
									onClick={() => this.setLength("1d")}>
									1d
								</p>
								<p
									styleName={selectedLength === "1w" ? "ButtonSelected" : ""}
									onClick={() => this.setLength("1w")}>
									1w
								</p>
								<p
									styleName={selectedLength === "1m" ? "ButtonSelected" : ""}
									onClick={() => this.setLength("1m")}>
									1m
								</p>
								<p
									styleName={selectedLength === "all" ? "ButtonSelected" : ""}
									onClick={() => this.setLength("all")}>
									all
								</p>
							</div>
						</td>

						<td>
							<div styleName="PanelTitle">
								<p>Price Chart</p>
							</div>
						</td>

						<td>
							<div styleName="ChartInterval">
								<p
									styleName={selectedInterval === "1m" ? "ButtonSelected" : ""}
									onClick={() => this.setInterval("1m")}>
									1m
								</p>
								<p
									styleName={selectedInterval === "5m" ? "ButtonSelected" : ""}
									onClick={() => this.setInterval("5m")}>
									5m
								</p>
								<p
									styleName={selectedInterval === "15m" ? "ButtonSelected" : ""}
									onClick={() => this.setInterval("15m")}>
									15m
								</p>
								<p
									styleName={selectedInterval === "1h" ? "ButtonSelected" : ""}
									onClick={() => this.setInterval("1h")}>
									1h
								</p>
								<p
									styleName={selectedInterval === "6h" ? "ButtonSelected" : ""}
									onClick={() => this.setInterval("6h")}>
									6h
								</p>
								<p
									styleName={selectedInterval === "1d" ? "ButtonSelected" : ""}
									onClick={() => this.setInterval("1d")}>
									1d
								</p>
							</div>
						</td>
					</tr>
					</tbody>
				</table>

				<div styleName="ChartContainer">
					<HighchartsReact
						highcharts={Highcharts}
						constructorType={'stockChart'}
						options={options}
					/>
				</div>
			</div>
		)
	}
}
