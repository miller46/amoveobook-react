import {
	GET_ACTIVE_MARKETS_SUCCESS,
	GET_ACTIVE_MARKETS_FAILURE,
	GET_ACTIVE_MARKETS_STARTED
} from '../actions/types';

import {api} from "../config"

export const getActiveMarkets = (options) => {
	return (dispatch, getState) => {
		dispatch(getActiveMarketsStarted());

		const url = api.activeMarketUrl;
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

const getActiveMarketsSuccess = activeMarkets => ({
	type: GET_ACTIVE_MARKETS_SUCCESS,
	payload: {
		activeMarkets
	}
});

const getActiveMarketsStarted = () => ({
	type: GET_ACTIVE_MARKETS_STARTED
});

const getActiveMarketsFailure = error => ({
	type: GET_ACTIVE_MARKETS_FAILURE,
	payload: {
		error
	}
});
