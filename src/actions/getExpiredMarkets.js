import {
	GET_EXPIRED_MARKETS_SUCCESS,
	GET_EXPIRED_MARKETS_FAILURE,
	GET_EXPIRED_MARKETS_STARTED
} from '../actions/types';

import {api} from "../config"

export const getExpiredMarkets = (options) => {
	return (dispatch, getState) => {
		dispatch(getExpiredMarketsStarted());

		const url = getUrlFromOptions(options);
		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			const blacklist = getState().default.marketBlacklist;
			let marketsToDisplay = [];
			json.forEach(function (market) {
				if (!blacklist.includes(market.oid)) {
					marketsToDisplay.push(market);
				}
			});
			dispatch(getExpiredMarketsSuccess(marketsToDisplay));
		})
		.catch(err => {
			dispatch(getExpiredMarketsFailure(err.message));
		});
	};
};

function getUrlFromOptions(options) {
	let url = api.expiredMarketsUrl;
	if ("limit" in options) {
		url += "&limit=" + options["limit"]
	}
	if ("network" in options) {
		url += "&filter_by_2=network&filter_by_value_2=" + options["network"]
	}
	return url;
}

const getExpiredMarketsSuccess = expiredMarkets => ({
	type: GET_EXPIRED_MARKETS_SUCCESS,
	payload: {
		expiredMarkets
	}
});

const getExpiredMarketsStarted = () => ({
	type: GET_EXPIRED_MARKETS_STARTED
});

const getExpiredMarketsFailure = error => ({
	type: GET_EXPIRED_MARKETS_FAILURE,
	payload: {
		error
	}
});
