import {
	SEND_REQUEST_SUCCESS,
	SEND_REQUEST_FAILURE,
	SEND_REQUEST_STARTED
} from '../actions/types';

import {api} from '../config'

export const requestMarket = (requestText) => {
	return (dispatch, getState) => {
		dispatch(sendRequestStarted());

		const formData = new FormData();
		formData.append('text', requestText);

		fetch(api.requestMarketUrl,
			{
				method: 'POST',
				body: formData
			}
		)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			dispatch(sendRequestSuccess());
		})
		.catch(error => {
			dispatch(sendRequestFailure(error));
		});
	};
};

const sendRequestSuccess = () => ({
	type: SEND_REQUEST_SUCCESS,
	payload: {
	}
});

const sendRequestStarted = () => ({
	type: SEND_REQUEST_STARTED,
});

const sendRequestFailure = error => ({
	type: SEND_REQUEST_FAILURE,
	payload: {
		error
	}
});
