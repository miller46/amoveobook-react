import {api, priceDecimals, tokenDecimals} from "../config";


export function getDisplayExpires(endBlock, height) {
	let expires = new Date();
	const diff = endBlock - height;
	const minutes = diff * 10;
	expires.setMinutes(expires.getMinutes() + minutes);
	const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
	return expires.toLocaleDateString('en-US', options) + " (Block " + endBlock + ")";
}

export {createIcon} from './blockies'

export function filterMarkets(network, markets) {
	let filteredMarkets = [];
	for (let i = 0; i < markets.length; i++) {
		const market = markets[i];
		if (markets[i].network === network) {
			filteredMarkets.push(market);
		}
	}
	return filteredMarkets;
}

export function roundOff(value, round) {
	return (parseInt(value * (10 ** (round + 1))) - parseInt(value * (10 ** round)) * 10) > 4 ? (((parseFloat(parseInt((value + parseFloat(1 / (10 ** round))) * (10 ** round))))) / (10 ** round)) : (parseFloat(parseInt(value * (10 ** round))) / ( 10 ** round));
}

export function getVolume(orders) {
	let volume = 0;
	if (orders.length > 0) {
		for (let i = 0; i < orders.length; i++) {
			volume += orders[i].buy_amount;
		}
	}
	if (!volume) {
		volume = 0;
	}

	return volume / tokenDecimals;
}

export function sumAmounts(orders) {
	let totalVolume = 0;
	for (let i = 0; i < orders.length; i++) {
		totalVolume = totalVolume + orders[i][1];
	}
	return totalVolume;
}

export function priceAmount(orders) {
	let x = [];
	for (let i = 1; i < orders.length; i++) {
		x.push([orders[i][2], orders[i][4]]);
	}
	return x.reverse();
}

export function getDisplayOdds(prices) {
	let odds = 0;
	if (prices.length > 0) {
		odds = (prices[0].price * 100 / priceDecimals).toFixed(0);
	}

	return odds;
}