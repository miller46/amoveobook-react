import {
	GET_MARKET_SUCCESS,
	GET_MARKET_FAILURE,
	GET_MARKET_STARTED
} from '../actions/types';

import {api} from '../config'

export const getMarket = (network, oid) => {
	return (dispatch, getState) => {
		dispatch(getMarketStarted(oid));

		fetch(api[network].nodeUrl,
			{
				method: 'POST',
				body: JSON.stringify(["oracle", oid])
			}
		)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			const details = json[1];
			fetch(api.pricesUrl + "&filter_by_value=" + oid)
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				const marketData = {
					matchedOrders: json,
					expires: details[1][6],
					buys: details[1][3],
					sells: details[1][4],
					oid: oid,
					question: atob(details[2]),
				}

				dispatch(getMarketSuccess(oid, marketData));
			})
			.catch(err => {
				dispatch(getMarketFailure(oid, err.message));
			});
		})
		.catch(err => {
			dispatch(getMarketFailure(oid, err.message));
		});
	};
};

const getMarketSuccess = (oid, market) => ({
	type: GET_MARKET_SUCCESS,
	payload: {
		oid,
		market
	}
});

const getMarketStarted = (oid) => ({
	type: GET_MARKET_STARTED,
	payload: {
		oid
	}
});

const getMarketFailure = (oid, error) => ({
	type: GET_MARKET_FAILURE,
	payload: {
		error,
		oid
	}
});
