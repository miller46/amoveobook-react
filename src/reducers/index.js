import {
	GET_VEO_PRICE_SUCCESS,
	GET_VEO_PRICE_FAILURE,
	GET_VEO_PRICE_STARTED,
	GET_LANGUAGE_SUCCESS,
	GET_LANGUAGE_FAILURE,
	GET_LANGUAGE_STARTED,
	SET_LANGUAGE_SUCCESS,
	SET_LANGUAGE_FAILURE,
	SET_LANGUAGE_STARTED,
	GET_CURRENCY_SUCCESS,
	GET_CURRENCY_FAILURE,
	GET_CURRENCY_STARTED,
	SET_CURRENCY_SUCCESS,
	SET_CURRENCY_FAILURE,
	SET_CURRENCY_STARTED,
} from '../actions/types';

const initialState = {
	loading: true,
	veoPrices: {"USD": 3495.38, "EUR": 3053.4, "CNY": 23900, "RUB": 246738.38, "last": 0.05},
	error: null
};

export default function getVeoPriceReducer(state = initialState, action) {
	switch (action.type) {
		case GET_VEO_PRICE_STARTED:
			return {
				...state,
				error: null,
				loading: true
			};
		case GET_VEO_PRICE_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				veoPrices: action.payload.veoPrices
			};
		case GET_VEO_PRICE_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error
			};
		case GET_LANGUAGE_STARTED:
			return {
				...state,
				error: null,
				loading: true
			};
		case GET_LANGUAGE_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				languageId: action.payload.languageId
			};
		case GET_LANGUAGE_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error
			};
		case SET_LANGUAGE_STARTED:
			return {
				...state,
				error: null,
				loading: true
			};
		case SET_LANGUAGE_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				languageId: action.payload.languageId
			};
		case SET_LANGUAGE_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error
			};
		case GET_CURRENCY_STARTED:
			return {
				...state,
				error: null,
				loading: true
			};
		case GET_CURRENCY_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				currencyId: action.payload.currencyId
			};
		case GET_CURRENCY_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error
			};
		case SET_CURRENCY_STARTED:
			return {
				...state,
				error: null,
				loading: true
			};
		case SET_CURRENCY_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				currencyId: action.payload.currencyId
			};
		case SET_CURRENCY_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error
			};
		default:
			return state;
	}
}
