import {
	GET_CURRENCY_SUCCESS,
	GET_CURRENCY_FAILURE,
	GET_CURRENCY_STARTED
} from '../actions/types';

export const getCurrency = () => {
	return (dispatch, getState) => {
		dispatch(getCurrencyStarted());

		const localStorage = window.localStorage;
		if (!localStorage) {
			dispatch(getCurrencyFailure("LocalStorage not found"));
		} else {
			const currencyId = localStorage.getItem('selectedCurrencyId') || 'usd';
			dispatch(getCurrencySuccess(currencyId));
		}
	};
};

const getCurrencySuccess = currencyId => ({
	type: GET_CURRENCY_SUCCESS,
	payload: {
		currencyId
	}
});

const getCurrencyStarted = (currencyId) => ({
	type: GET_CURRENCY_STARTED,
	payload: {
		currencyId
	}
});

const getCurrencyFailure = error => ({
	type: GET_CURRENCY_FAILURE,
	payload: {
		error
	}
});
