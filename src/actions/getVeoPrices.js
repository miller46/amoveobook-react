import {
	GET_VEO_PRICE_SUCCESS,
	GET_VEO_PRICE_FAILURE,
	GET_VEO_PRICE_STARTED
} from '../actions/types';

export const getVeoPrices = () => {
	return (dispatch, getState) => {
		dispatch(getVeoStarted());

		fetch("https://amoveobook-api.herokuapp.com/api/v1/price/VEO_BTC")
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			const btcUsdPrice = json["USD"]
			const btcEuroPrice = json["EUR"]
			const btcCnyPrice = json["CNY"]
			const btcRubPrice = json["RUB"]
			const lastVeoBtcPrice = json["last"]
			dispatch(getVeoSuccess({
				usd: btcUsdPrice,
				eur: btcEuroPrice,
				cny: btcCnyPrice,
				rub: btcRubPrice,
				last: lastVeoBtcPrice,
			}));
		})
		.catch(err => {
			dispatch(getVeoFailure(err.message));
		});
	};
};

const getVeoSuccess = veoPrices => ({
	type: GET_VEO_PRICE_SUCCESS,
	payload: {
		veoPrices
	}
});

const getVeoStarted = () => ({
	type: GET_VEO_PRICE_STARTED
});

const getVeoFailure = error => ({
	type: GET_VEO_PRICE_FAILURE,
	payload: {
		error
	}
});
