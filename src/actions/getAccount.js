import {
	GET_ACCOUNT_SUCCESS,
	GET_ACCOUNT_FAILURE,
	GET_ACCOUNT_STARTED
} from '../actions/types';

import {api} from "../config"

export const getAccount = (addresss) => {
	return (dispatch, getState) => {
		dispatch(getAccountStarted());

		const url = api.accountUrl + "?filter_by=address&filter_by_value=" + addresss;
		fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			dispatch(getAccountSuccess(json[0]));
		})
		.catch(err => {
			dispatch(getAccountFailure(err.message));
		});
	};
};

const getAccountSuccess = account => ({
	type: GET_ACCOUNT_SUCCESS,
	payload: {
		account
	}
});

const getAccountStarted = () => ({
	type: GET_ACCOUNT_STARTED
});

const getAccountFailure = error => ({
	type: GET_ACCOUNT_FAILURE,
	payload: {
		error
	}
});
