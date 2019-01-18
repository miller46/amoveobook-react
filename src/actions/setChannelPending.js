import {
	SET_CHANNEL_PENDING_SUCCESS,
	SET_CHANNEL_PENDING_FAILURE,
} from '../actions/types';

import {CHANNEL_PENDING} from '../constants'

export const setChannelPending = (value) => {
	return (dispatch, getState) => {
		const localStorage = window.localStorage;
		if (!localStorage) {
			dispatch(setCurrencyFailure("LocalStorage not found"));
		} else {
			localStorage.setItem(CHANNEL_PENDING, value);
			dispatch(setChannelPendingSuccess(value));
		}
	};
};

const setChannelPendingSuccess = (value) => ({
	type: SET_CHANNEL_PENDING_SUCCESS,
	payload: {
		channelPending: value,
	}
});

const setCurrencyFailure = error => ({
	type: SET_CHANNEL_PENDING_FAILURE,
	payload: {
		error
	}
});
