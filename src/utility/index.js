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
	return parseFloat(value.toFixed(round));
	// return (parseInt(value * (10 ** (round + 1))) - parseInt(value * (10 ** round)) * 10) > 4 ? (((parseFloat(parseInt((value + parseFloat(1 / (10 ** round))) * (10 ** round))))) / (10 ** round)) : (parseFloat(parseInt(value * (10 ** round))) / ( 10 ** round));
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

export function sumBets(bets) {
	let totalVolume = 0;
	for (let i = 1; i < bets.length; i++) {
		totalVolume += bets[i][2];
	}
	return totalVolume;
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



export function download(data, filename, type) {
	var file = new Blob([data], {type: type});
	if (window.navigator.msSaveOrOpenBlob) // IE10+
	{
		window.navigator.msSaveOrOpenBlob(file, filename);
	} else { // Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

export function ssToInternal(ess) {
	let ss = [];
	for (let i = 1; i < ess.length; i++) {
		if (JSON.stringify(ess[i][2]) === JSON.stringify([-6, -6])) {
			ess[i][2] = [-6];
			ess[i][3] = [-6];
		}
		ss = ss.concat([newSS(stringToArray(atob(ess[i][1])), ess[i][2], ess[i][3])]);
	}
	return ss;
}

function newSS(code, prove, meta) {
	if (meta === undefined) {
		meta = 0;
	}
	return {"code": code, "prove": prove, "meta": meta};
}


export function stringToArray(x) {
	let a = new Uint8Array(x.length);
	for (let i = 0; i < x.length; i++) {
		a[i] = x.charCodeAt(i);
	}
	return Array.from(a);
}

export function intToArray(i, size) {
	let a = [];
	for (let b = 0; b < size; b++) {
		a.push(((i % 256) + 256) % 256);
		i = Math.floor(i / 256);
	}
	return a.reverse();
}

export function arrayToString(x) {
	let a = "";
	for (let i = 0; i < x.length; i++) {
		a += String.fromCharCode(x[i]);
	}
	return a;
}

