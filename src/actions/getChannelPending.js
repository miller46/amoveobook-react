import {
	GET_CHANNEL_PENDING_SUCCESS,
	GET_CHANNEL_PENDING_FAILURE,
} from '../actions/types';

import {CHANNEL_PENDING} from '../constants'

export const getChannelPending = () => {
	return (dispatch, getState) => {
		const localStorage = window.localStorage;
		if (!localStorage) {
			dispatch(getChannelPendingFailure("LocalStorage not found"));
		} else {
			const channelPending = localStorage.getItem(CHANNEL_PENDING) || false;
			dispatch(getChannelPendingSuccess(channelPending));
		}
	};
};

const getChannelPendingSuccess = channelPending => ({
	type: GET_CHANNEL_PENDING_SUCCESS,
	payload: {
		channelPending
	}
});

const getChannelPendingFailure = error => ({
	type: GET_CHANNEL_PENDING_FAILURE,
	payload: {
		error
	}
});
