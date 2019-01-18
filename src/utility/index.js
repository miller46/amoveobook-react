import {api} from "../config"
import {MAINNET, TESTNET} from '../constants'

export function getDisplayExpires(endBlock, height) {
	let expires = new Date();
	const diff = endBlock - height;
	const minutes = diff * 10;
	expires.setMinutes(expires.getMinutes() + minutes);
	const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
	return expires.toLocaleDateString('en-US', options) + " (Block " + endBlock + ")";
}

export {createIcon} from './blockies'

export function filterMarkets(markets) {
	const network = api.isTestnet ? TESTNET:  MAINNET;
	let filteredMarkets = [];
	for (let i = 0; i < markets.length; i++) {
		const market = markets[i];
		if (markets[i].network === network) {
			filteredMarkets.push(market);
		}
	}
	return filteredMarkets;
}