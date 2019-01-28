import React, { Component } from "react";
import CSSModules from 'react-css-modules'
import style from './PriceChart.css'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import {priceDecimals} from "../../config";

@CSSModules(style)
export default class PriceChart extends Component {

	constructor(props) {
		super(props);
		this.state = {
			prices: this.props.prices,
			buys: this.props.buys,
			sells: this.props.sells,
		}
	}

	getOptions(series) {
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
			xAxis: {
				type: 'datetime',
				title: {
					text: 'Time',
					color: '#FFFFFF'
				},
				showLastLabel: true,
				endOnTick: true
			},
			yAxis: {
				title: {
					text: 'Probability (%)',
					color: '#FFFFFF'
				},
				min: 0,
				max: 100
			},
			series: [{
				name: "Probability",
				tooltip: {
					valueSuffix: "%"
				},
				showInLegend: false,
				data: series,
				color: '#5cb85c'
			}],
		}
	}

	render() {
		let {prices, buys, sells} = this.state;

		let series = [];
		for (let i = 0; i < prices.length; i++) {
			let price = prices[i];
			let item = [Date.parse(price.timestamp), price.price * 100 / priceDecimals];
			series.push(item);
		}

		const options = this.getOptions(series);

		return (
			<div styleName="ChartContainer">
				<HighchartsReact
					highcharts={Highcharts}
					options={options}
				/>
			</div>
		)
	}
}
