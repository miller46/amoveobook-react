const isDev = false;

const apiBase = isDev ? "http://127.0.0.1:5001/api/v1/": "https://amoveobook-api.herokuapp.com/api/v1/";

export const api = {
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
	mainnet: {
		nodeUrl: apiBase + "node",
		serverPublicKey: "BKSYQw/88NOUfwBhyXwVuKymkQxZNxJ0NjqAqJQgXKvflmRJ1K1Q70WAIsUtmxa6C30FdcQKPzeEarNIT4mCUKU=",

	},
	testnet: {
		nodeUrl: apiBase + "testnet/node",
		serverPublicKey: "BLm3916d/2FlCFfg38nnyzaQQ7dggzw3C3xZCopeAAMVK2PiszM6ag3yD2Q3YrQpPsh+utAdX6tpPqVhviGtmXE=",
	}
}
