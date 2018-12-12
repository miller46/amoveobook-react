import {
	SET_CURRENCY_SUCCESS,
	SET_CURRENCY_FAILURE,
	SET_CURRENCY_STARTED
} from '../actions/types';

export const setCurrency = (currencyId) => {
	return (dispatch, getState) => {
		dispatch(setCurrencyStarted(currencyId));

		const localStorage = window.localStorage;
		if (!localStorage) {
			dispatch(setCurrencyFailure("LocalStorage not found"));
		} else {
			localStorage.setItem('selectedCurrencyId', currencyId);
			dispatch(setCurrencySuccess(currencyId));
		}
	};
};

const setCurrencySuccess = currencyId => ({
	type: SET_CURRENCY_SUCCESS,
	payload: {
		currencyId
	}
});

const setCurrencyStarted = (currencyId) => ({
	type: SET_CURRENCY_STARTED,
	payload: {
		currencyId
	}
});

const setCurrencyFailure = error => ({
	type: SET_CURRENCY_FAILURE,
	payload: {
		error
	}
});
