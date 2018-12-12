import {
	GET_LANGUAGE_SUCCESS,
	GET_LANGUAGE_FAILURE,
	GET_LANGUAGE_STARTED
} from '../actions/types';

export const getLanguage = () => {
	return (dispatch, getState) => {
		dispatch(getLanguageStarted());

		const localStorage = window.localStorage;
		if (!localStorage) {
			dispatch(getLanguageFailure("LocalStorage not found"));
		} else {
			const languageId = localStorage.getItem('selectedLanguageId') || 'en';
			dispatch(getLanguageSuccess(languageId));
		}
	};
};

const getLanguageSuccess = languageId => ({
	type: GET_LANGUAGE_SUCCESS,
	payload: {
		languageId
	}
});

const getLanguageStarted = (languageId) => ({
	type: GET_LANGUAGE_STARTED,
	payload: {
		languageId
	}
});

const getLanguageFailure = error => ({
	type: GET_LANGUAGE_FAILURE,
	payload: {
		error
	}
});
