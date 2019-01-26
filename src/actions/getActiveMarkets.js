import {
	GET_ACTIVE_MARKETS_SUCCESS,
	GET_ACTIVE_MARKETS_FAILURE,
	GET_ACTIVE_MARKETS_STARTED
} from '../actions/types';

import {api} from "../config"

export const getActiveMarkets = (options) => {
	return (dispatch, getState) => {
		dispatch(getActiveMarketsStarted());

		let url = getUrlFromOptions(options || {});

		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			dispatch(getActiveMarketsSuccess(json));
		})
		.catch(err => {
			dispatch(getActiveMarketsFailure(err.message));
		});
	};
};

function getUrlFromOptions(options) {
	let url = api.activeMarketUrl;
	if ("limit" in options) {
		url += "&limit=" + options["limit"]
	}
	if ("network" in options) {
		url += "&filter_by_2=network&filter_by_value_2=" + options["network"]
	}
	return url;
}

const getActiveMarketsSuccess = activeMarkets => {
	return ({
		type: GET_ACTIVE_MARKETS_SUCCESS,
		payload: {
			activeMarkets
		}
	});
};

const getActiveMarketsStarted = () => ({
	type: GET_ACTIVE_MARKETS_STARTED
});

const getActiveMarketsFailure = error => ({
	type: GET_ACTIVE_MARKETS_FAILURE,
	payload: {
		error
	}
});
