

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