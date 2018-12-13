import {
	GET_EXPIRED_MARKETS_SUCCESS,
	GET_EXPIRED_MARKETS_FAILURE,
	GET_EXPIRED_MARKETS_STARTED
} from '../actions/types';

import {api} from "../config"

export const getExpiredMarkets = (options) => {
	return (dispatch, getState) => {
		const a = getState();
		dispatch(getExpiredMarketsStarted());

		const url = api.expiredMarketsUrl;
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
