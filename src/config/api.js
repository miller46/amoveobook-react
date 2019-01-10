export const api = {
	activeMarketUrl: "https://amoveobook-api.herokuapp.com/api/v1/market?filter_by=is_active&filter_by_value=true",
	expiredMarketsUrl: "https://amoveobook-api.herokuapp.com/api/v1/market?filter_by=is_active&filter_by_value=false",
	pricesUrl: "https://amoveobook-api.herokuapp.com/api/v1/price?filter_by=market_oid&order_by=timestamp",
	requestMarketUrl: "https://amoveobook-api.herokuapp.com/api/v1/marketRequest",
	getIpUrl: "https://api.ipify.org/?format=json",
	getIpDetailsUrl: "http://api.ipstack.com/$$$?access_key=4db6b276661ad034f44477078402a553&format=1",
	replacementCharacter: "$$$",
	defaultNodeUrl: "http://13.72.69.243:8080/",
}
