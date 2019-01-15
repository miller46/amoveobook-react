import {
	SET_ACCOUNT_SUCCESS,
} from '../actions/types';

export const setAccount = (account) => {
	return (dispatch, getState) => {
		dispatch(setCurrencySuccess(account));
	};
};

const setCurrencySuccess = account => ({
	type: SET_ACCOUNT_SUCCESS,
	payload: {
		account
	}
});
