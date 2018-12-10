import {
	GET_VEO_PRICE_SUCCESS,
	GET_VEO_PRICE_FAILURE,
	GET_VEO_PRICE_STARTED
} from '../actions/types';

export const getVeoPrice = () => {
	return (dispatch, getState) => {
		dispatch(getVeoStarted());

		fetch("https://amoveobook-api.herokuapp.com/api/v1/price/VEO_BTC")
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			const btcUsdPrice = json["USD"]
			const veoBtcPrice = json["last"]
			const veoUsdPrice = btcUsdPrice * veoBtcPrice;
			dispatch(getVeoSuccess(veoUsdPrice));
		})
		.catch(err => {
			dispatch(getVeoFailure(err.message));
		});
	};
};

const getVeoSuccess = veoPrice => ({
	type: GET_VEO_PRICE_SUCCESS,
	payload: {
		veoPrice
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
