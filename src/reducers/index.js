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
	GET_ACTIVE_MARKETS_SUCCESS,
	GET_ACTIVE_MARKETS_FAILURE,
	GET_ACTIVE_MARKETS_STARTED,
	GET_EXPIRED_MARKETS_SUCCESS,
	GET_EXPIRED_MARKETS_FAILURE,
	GET_EXPIRED_MARKETS_STARTED,
	GET_HEIGHT_STARTED,
	GET_HEIGHT_SUCCESS,
	GET_HEIGHT_FAILURE,
	GET_MARKET_STARTED,
	GET_MARKET_SUCCESS,
	GET_MARKET_FAILURE,
	SEND_REQUEST_STARTED,
	SEND_REQUEST_SUCCESS,
	SEND_REQUEST_FAILURE,
	GET_IP_STARTED,
	GET_IP_SUCCESS,
	GET_IP_FAILURE,
	GET_ACCOUNT_STARTED,
	GET_ACCOUNT_SUCCESS,
	GET_ACCOUNT_FAILURE,
	SET_ACCOUNT_SUCCESS,
	SET_CHANNEL_PENDING_SUCCESS,
	SET_CHANNEL_PENDING_FAILURE,
	GET_CHANNEL_DATA_SUCCESS,
	GET_CHANNEL_DATA_FAILURE,
	GET_CHANNEL_DATA_STARTED
} from '../actions/types';
import {getNetwork} from "../amoveo3utility";
import {getChannelData} from "../actions";

const initialState = {
	loading: {
		veoPrices: true,
		activeMarkets: true,
		expiredMarkets: true,
		language: false,
		currency: false,
		marketDetails: {},
		requestMarket: false,
		ip: false,
		account: false,
		channelData: false,
	},
	veoPrices: {"USD": 3495.38, "EUR": 3053.4, "CNY": 23900, "RUB": 246738.38, "last": 0.05},
	activeMarkets: [],
	expiredMarkets: [],
	marketDetails: {},
	height: 45315,
	ip: null,
	account: null,
	channelData: null,
	requestMarket: false,
	channelPending: false,
	marketBlacklist: [
		"FlfYHw9CP6hNweYDr7tQ01EhVUADZkOsDA/OQ2Givxg=",
		"gj1S1jRvGn5HkscyHAQIcoGdIv0t5BdK94jYSDj7e5U=",
		"ZYwRWHW74Xf9ZOH5TSKLeIyrSGjQJWd7ep9dCEWMj3I=",
	],
	error: {
		veoPrices: null,
		activeMarkets: null,
		expiredMarkets: null,
		language: null,
		currency: null,
		marketDetails: {},
		requestMarket: null,
		channelPending: null,
		ip: null,
		account: null,
		channelData: null,
	}
};

export default function getVeoPriceReducer(state = initialState, action) {
	switch (action.type) {
		case GET_VEO_PRICE_STARTED:
			return {
				...state,
				error: {
					...state.error,
					veoPrices: null
				},
				loading: {
					...state.loading,
					veoPrices: true,
				}
			};
		case GET_VEO_PRICE_SUCCESS:
			return {
				...state,
				loading: {
					...state.loading,
					veoPrices: false,
				},
				error: {
					...state.error,
					veoPrices: null
				},
				veoPrices: action.payload.veoPrices
			};
		case GET_VEO_PRICE_FAILURE:
			return {
				...state,
				loading: {
					...state.loading,
					veoPrices: false,
				},
				error: {
					...state.error,
					veoPrices: action.payload.error
				}
			};
		case GET_LANGUAGE_STARTED:
			return {
				...state,
				error: {
					...state.error,
					language: null
				},
			};
		case GET_LANGUAGE_SUCCESS:
			return {
				...state,
				error: {
					...state.error,
					language: null
				},
				languageId: action.payload.languageId
			};
		case GET_LANGUAGE_FAILURE:
			return {
				...state,
				error: {
					...state.error,
					language: action.payload.error
				}
			};
		case SET_LANGUAGE_STARTED:
			return {
				...state,
				error: {
					...state.error,
					language: null
				},
			};
		case SET_LANGUAGE_SUCCESS:
			return {
				...state,
				error: {
					...state.error,
					language: null
				},
				languageId: action.payload.languageId
			};
		case SET_LANGUAGE_FAILURE:
			return {
				...state,
				error: {
					...state.error,
					language: action.payload.error
				}
			};
		case GET_CURRENCY_STARTED:
			return {
				...state,
				loading: {
					...state.loading,
					currency: false,
				},
				error: {
					...state.error,
					currency: null
				},
			};
		case GET_CURRENCY_SUCCESS:
			return {
				...state,
				error: {
					...state.error,
					currency: null
				},
				loading: {
					...state.loading,
					currency: true,
				},
				currencyId: action.payload.currencyId
			};
		case GET_CURRENCY_FAILURE:
			return {
				...state,
				loading: {
					...state.loading,
					currency: false,
				},
				error: {
					...state.error,
					currency: action.payload.error
				}
			};
		case SET_CURRENCY_STARTED:
			return {
				...state,
				loading: {
					...state.loading,
					currency: true,
				},
				error: {
					...state.error,
					currency: null
				}
			};
		case SET_CURRENCY_SUCCESS:
			return {
				...state,
				error: {
					...state.error,
					currency: null
				},
				loading: {
					...state.loading,
					currency: false,
				},
				currencyId: action.payload.currencyId
			};
		case SET_CURRENCY_FAILURE:
			return {
				...state,
				error: {
					...state.error,
					currency: action.payload.error
				}
			};
		case GET_ACTIVE_MARKETS_STARTED:
			return {
				...state,
				error: {
					...state.error,
					activeMarkets: null
				},
				loading: {
					...state.loading,
					activeMarkets: true,
				}
			};
		case GET_ACTIVE_MARKETS_SUCCESS:
			return {
				...state,
				loading: {
					...state.loading,
					activeMarkets: false,
				},
				error: {
					...state.error,
					activeMarkets: null
				},
				activeMarkets: action.payload.activeMarkets
			};
		case GET_ACTIVE_MARKETS_FAILURE:
			return {
				...state,
				loading: {
					...state.loading,
					activeMarkets: false,
				},
				error: {
					...state.error,
					activeMarkets: action.payload.error
				}
			};
		case GET_EXPIRED_MARKETS_STARTED:
			return {
				...state,
				error: {
					...state.error,
					expiredMarkets: null
				},
				loading: {
					...state.loading,
					expiredMarkets: true,
				}
			};
		case GET_EXPIRED_MARKETS_SUCCESS:
			return {
				...state,
				loading: {
					...state.loading,
					expiredMarkets: false,
				},
				error: {
					...state.error,
					expiredMarkets: null
				},
				expiredMarkets: action.payload.expiredMarkets
			};
		case GET_EXPIRED_MARKETS_FAILURE:
			return {
				...state,
				loading: {
					...state.loading,
					expiredMarkets: false,
				},
				error: {
					...state.error,
					expiredMarkets: action.payload.error
				}
			};
		case GET_HEIGHT_STARTED:
			return {
				...state,
				error: {
					...state.error,
					height: null
				},
			};
		case GET_HEIGHT_SUCCESS:
			return {
				...state,
				error: {
					...state.error,
					height: null
				},
				height: action.payload.height
			};
		case GET_HEIGHT_FAILURE:
			return {
				...state,
				error: {
					...state.error,
					height: action.payload.error
				}
			};
		case GET_MARKET_STARTED:
			const oid = action.payload.oid;
			const marketErrors = state.error.marketDetails;
			marketErrors[oid] = null;

			const marketLoading = state.loading;
			marketLoading[oid] = true;
			return {
				...state,
				loading: {
					...state.loading,
					marketDetails: marketLoading
				},
				error: {
					...state.error,
					marketDetails: marketErrors
				},
			};
		case GET_MARKET_SUCCESS:
			const oid2 = action.payload.oid;
			const market = action.payload.market;
			const marketDetails = state.marketDetails;
			marketDetails[oid2] = market;

			const marketErrors2 = state.error.marketDetails;
			marketErrors2[oid2] = null;

			const marketLoading2 = state.loading;
			marketLoading2[oid2] = false;
			return {
				...state,
				loading: {
					...state.loading,
					marketDetails: marketLoading2,
				},
				error: {
					...state.error,
					marketDetails: marketErrors2
				},
				marketDetails: marketDetails
			};
		case GET_MARKET_FAILURE:
			const oid3 = action.payload.oid;

			const error = action.payload.error;
			const marketErrors3 = state.error.marketDetails;
			marketErrors3[oid3] = error;

			const marketLoading3 = state.loading.marketDetails;
			marketLoading3[oid3] = false;
			return {
				...state,
				loading: {
					...state.loading,
					marketDetails: marketLoading3
				},
				error: {
					...state.error,
					marketDetails: marketErrors3
				}
			};
		case SEND_REQUEST_STARTED:
			return {
				...state,
				requestMarket: false,
				loading: {
					...state.loading,
					requestMarket: true
				},
				error: {
					...state.error,
					requestMarket: null
				},
			};
		case SEND_REQUEST_SUCCESS:
			return {
				...state,
				requestMarket: true,
				loading: {
					...state.loading,
					requestMarket: false
				},
				error: {
					...state.error,
					requestMarket: null
				},
			};
		case SEND_REQUEST_FAILURE:
			return {
				...state,
				requestMarket: true,
				loading: {
					...state.loading,
					requestMarket: false
				},
				error: {
					...state.error,
					requestMarket: action.payload.error
				}
			};
		case GET_IP_STARTED:
			return {
				...state,
				loading: {
					...state.loading,
					ip: true
				},
				error: {
					...state.error,
					ip: null
				},
			};
		case GET_IP_SUCCESS:
			return {
				...state,
				ip: action.payload.ip,
				loading: {
					...state.loading,
					ip: false
				},
				error: {
					...state.error,
					ip: null
				},
			};
		case GET_IP_FAILURE:
			return {
				...state,
				loading: {
					...state.loading,
					ip: false
				},
				error: {
					...state.error,
					ip: action.payload.error
				}
			};
		case GET_ACCOUNT_STARTED:
			return {
				...state,
				loading: {
					...state.loading,
					account: true
				},
				error: {
					...state.error,
					account: null
				},
			};
		case GET_ACCOUNT_SUCCESS:
			return {
				...state,
				account: action.payload.account,
				loading: {
					...state.loading,
					account: false
				},
				error: {
					...state.error,
					account: null
				},
			};
		case GET_ACCOUNT_FAILURE:
			return {
				...state,
				loading: {
					...state.loading,
					account: false
				},
				error: {
					...state.error,
					account: action.payload.error
				}
			};
		case SET_ACCOUNT_SUCCESS:
			return {
				...state,
				account: action.payload.account,
			};
		case SET_CHANNEL_PENDING_SUCCESS:
			return {
				...state,
				channelPending: action.payload.channelPending,
			};
		case SET_CHANNEL_PENDING_FAILURE:
			return {
				...state,
				error: {
					...state.error,
					channelPending: action.payload.error
				}
			};
		case GET_CHANNEL_DATA_STARTED:
			return {
				...state,
				loading: {
					...state.loading,
					channelData: true
				},
				error: {
					...state.error,
					channelData: null
				},
			};
		case GET_CHANNEL_DATA_SUCCESS:
			return {
				...state,
				channelData: action.payload.channelData,
				loading: {
					...state.loading,
					channelData: false
				},
				error: {
					...state.error,
					channelData: null
				},
			};
		case GET_CHANNEL_DATA_FAILURE:
			return {
				...state,
				loading: {
					...state.loading,
					channelData: false
				},
				error: {
					...state.error,
					channelData: action.payload.error
				}
			};
		default:
			return state;
	}
}
