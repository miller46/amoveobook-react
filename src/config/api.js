import {MAINNET, TESTNET} from "../constants";

const isTestnet = false;
const isDev = false;

const apiBase = isDev ? "http://127.0.0.1:5001/api/v1/": "https://amoveobook-api.herokuapp.com/api/v1/"
const accountApiBase = "http://127.0.0.1:3000/"

const networkName = isTestnet ? TESTNET:  MAINNET;

export const api = {
	isTestnet: isTestnet,
	accountUrl: apiBase + "account",
	activeMarketUrl: apiBase + "market?filter_by=is_active&filter_by_value=true",
	expiredMarketsUrl: apiBase + "market?filter_by=is_active&filter_by_value=false",
	pricesUrl: apiBase + "price?filter_by=market_oid&order_by=timestamp",
	requestMarketUrl: apiBase + "marketRequest",
	saveEmailUrl: apiBase + "account",
	openChannelUrl: apiBase + "channel/open",
	getIpUrl: "https://api.ipify.org/?format=json",
	getIpDetailsUrl: "http://api.ipstack.com/$$$?access_key=4db6b276661ad034f44477078402a553&format=1",
	replacementCharacter: "$$$",
	defaultNodeUrl: apiBase + "node",
	serverPublicKey: isTestnet ? "BKw7qHfymuCuUnakeUJW/qhrz4MBzwBrIxJq8hihW5Do6zVQtA8C9t5DBHTrWZ5GT5SKnRztKz+JvpC2BYpsn2Y=" : "BKSYQw/88NOUfwBhyXwVuKymkQxZNxJ0NjqAqJQgXKvflmRJ1K1Q70WAIsUtmxa6C30FdcQKPzeEarNIT4mCUKU=",
}
