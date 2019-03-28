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
			const url = api.pricesUrl + "&filter_by_value=" + oid
			fetch(url)
			.then(function(response) {
				return response.json();
			})
			.then(function(json) {
				let buys = []
				let sells = []
				let expires = 0
				let question = ""

				if (details.length > 1 && details[1].length > 1) {
					expires = details[1][6];
					buys = details[1][3];
					sells = details[1][4];
					question = atob(details[2]);
				}

				const marketData = {
					matchedOrders: json,
					oid: oid,
					expires: expires,
					buys: buys,
					sells: sells,
					question: question,
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
